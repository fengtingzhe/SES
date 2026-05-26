import { GameConfig } from '../config/GameConfig.js';
import { MonsterTargetKind, monsterTargetKey } from '../rules/monsterTargetPriority.js';
import { distance, tacticalDistance } from '../utils/grid.js';
import { TileType } from '../world/TileMap.js';

export class MonsterSystem {
  constructor(campSystem, dayNightSystem, workerSystem, showMessage) {
    this.campSystem = campSystem;
    this.dayNightSystem = dayNightSystem;
    this.workerSystem = workerSystem;
    this.showMessage = showMessage;
  }

  update(state, dt) {
    if (state.status !== 'playing') return;

    state.monsterSpawn.cooldown = Math.max(0, state.monsterSpawn.cooldown - dt);
    this.spawn(state);
    this.updateMonsters(state, dt);
  }

  spawn(state) {
    if (!this.dayNightSystem.isNight(state)) return;
    if (state.monsterSpawn.spawnedThisNight >= GameConfig.monster.perNight) return;
    if (state.monsters.length >= GameConfig.monster.maxActiveBeforePause) return;
    if (state.monsterSpawn.cooldown > 0) return;

    const fogGates = this.getFogGates(state);
    if (!fogGates.length) return;

    const fog = fogGates[Math.floor(Math.random() * fogGates.length)];
    const raidCamp = this.campSystem.nearestHome(state, fog);

    state.monsters.push({
      id: state.monsterSpawn.nextId,
      x: fog.x,
      y: fog.y,
      hp: GameConfig.monster.hp,
      returning: false,
      raidCamp,
      targetKey: null,
      targetLock: 0,
      dead: false
    });

    state.monsterSpawn.nextId += 1;
    state.monsterSpawn.spawnedThisNight += 1;
    state.monsterSpawn.cooldown = GameConfig.monster.spawnInterval;
  }

  updateMonsters(state, dt) {
    for (const monster of state.monsters) {
      monster.targetLock = Math.max(0, (monster.targetLock || 0) - dt);

      if (monster.returning) {
        this.returnToFog(state, monster, dt);
        continue;
      }

      if (!this.dayNightSystem.isNight(state)) {
        monster.returning = true;
        this.returnToFog(state, monster, dt);
        continue;
      }

      const target = this.findTarget(state, monster);
      if (!target) continue;

      if (target.kind !== MonsterTargetKind.CAMP) {
        const key = monsterTargetKey(target);
        if (key !== monster.targetKey) {
          monster.targetKey = key;
          monster.targetLock = GameConfig.monster.targetLockSeconds;
        }
      }

      this.moveAndResolveTarget(state, monster, target, dt);
    }

    state.monsters = state.monsters.filter(monster => !monster.dead);
  }

  findTarget(state, monster) {
    const stones = this.findStoneTargets(state, monster);
    const workerTargets = this.findWorkerTargets(state, monster);
    const playerTargets = this.findPlayerTarget(state, monster);
    const allTargets = [...stones, ...workerTargets, ...playerTargets];

    if (monster.targetLock > 0 && monster.targetKey) {
      const locked = allTargets.find(target => monsterTargetKey(target) === monster.targetKey);
      if (locked) return locked;
    }

    if (stones.length) return stones[0];
    if (workerTargets.length) return workerTargets[0];
    if (playerTargets.length) return playerTargets[0];

    if (!monster.raidCamp) monster.raidCamp = this.campSystem.nearestHome(state, monster);
    return { kind: MonsterTargetKind.CAMP, object: monster.raidCamp };
  }

  findStoneTargets(state, monster) {
    const targets = [];
    const range = GameConfig.monster.tacticalRange;

    for (let y = Math.floor(monster.y - range); y <= Math.ceil(monster.y + range); y += 1) {
      for (let x = Math.floor(monster.x - range); x <= Math.ceil(monster.x + range); x += 1) {
        const tile = state.world.map.cell(x, y);
        if (tile?.type === TileType.STONE && tacticalDistance(monster, { x, y }) <= range) {
          targets.push({ kind: MonsterTargetKind.STONE, object: { x, y } });
        }
      }
    }

    targets.sort((a, b) => distance(monster, a.object) - distance(monster, b.object));
    return targets;
  }

  findWorkerTargets(state, monster) {
    return state.workers
      .filter(worker =>
        !worker.lost &&
        tacticalDistance(monster, worker) <= GameConfig.monster.tacticalRange
      )
      .sort((a, b) => distance(monster, a) - distance(monster, b))
      .map(worker => ({ kind: MonsterTargetKind.WORKER, object: worker }));
  }

  findPlayerTarget(state, monster) {
    if (state.player.invulnerable > 0) return [];
    if (tacticalDistance(monster, state.player) > GameConfig.monster.tacticalRange) return [];
    return [{ kind: MonsterTargetKind.PLAYER, object: state.player }];
  }

  moveAndResolveTarget(state, monster, target, dt) {
    const object = target.object;
    const d = distance(monster, object);

    if (target.kind === MonsterTargetKind.CAMP) {
      if (d > GameConfig.monster.campStopDistance) {
        this.moveToward(monster, object, dt);
      }
      return;
    }

    if (d > 0.05) {
      this.moveToward(monster, object, dt);
    }

    if (d >= GameConfig.monster.hitDistance) return;

    if (target.kind === MonsterTargetKind.STONE) {
      const x = Math.round(object.x);
      const y = Math.round(object.y);
      if (state.world.map.cell(x, y)?.type === TileType.STONE) {
        state.world.map.blank(x, y);
      }
      this.showMessage('黑林影拾走了一枚辉石。');
      monster.dead = true;
      return;
    }

    if (target.kind === MonsterTargetKind.PLAYER) {
      this.hitPlayer(state);
      monster.dead = true;
      return;
    }

    if (target.kind === MonsterTargetKind.WORKER) {
      this.hitWorker(state, object);
      monster.dead = true;
    }
  }

  hitPlayer(state) {
    state.player.invulnerable = GameConfig.monster.playerInvulnerableSeconds;

    if (state.resources.stone > 0) {
      state.resources.stone -= 1;
      this.showMessage('你被袭击，失去 1 个辉石。');
      return;
    }

    state.status = 'failed';
    this.showMessage('辉石耗尽，旅程中断。');
  }

  hitWorker(state, worker) {
    if (!worker || worker.lost) return;

    this.workerSystem.releaseWorkerTask(state, worker);
    Object.assign(worker, {
      lost: true,
      state: 'lost',
      flee: false,
      interruptedJob: null
    });

    this.showMessage('一名工人被黑林影拖走。');
  }

  returnToFog(state, monster, dt) {
    const fog = this.nearestFog(state, monster);
    if (!fog) {
      monster.dead = true;
      return;
    }

    const d = distance(monster, fog);
    if (d < GameConfig.monster.hitDistance) {
      monster.dead = true;
      return;
    }

    this.moveToward(monster, fog, dt);
  }

  moveToward(monster, target, dt) {
    const d = distance(monster, target);
    if (d <= 0.001) return;

    monster.x += ((target.x - monster.x) / d) * GameConfig.monster.speed * dt;
    monster.y += ((target.y - monster.y) / d) * GameConfig.monster.speed * dt;
  }

  getFogGates(state) {
    const fogGates = [];
    state.world.map.forEach((tile, x, y) => {
      if (tile.type === TileType.FOG) fogGates.push({ x, y });
    });
    return fogGates;
  }

  nearestFog(state, point) {
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const fog of this.getFogGates(state)) {
      const d = distance(point, fog);
      if (d < bestDistance) {
        best = fog;
        bestDistance = d;
      }
    }

    return best;
  }
}
