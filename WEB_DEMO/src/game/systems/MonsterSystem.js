import { GameConfig } from '../config/GameConfig.js';

export class MonsterSystem {
  constructor(workerSystem) {
    this.workerSystem = workerSystem;
  }

  update(state, dt) {
    const isNight = state.phase === 'night';

    if (state.monsterTouchMessageTimer > 0) {
      state.monsterTouchMessageTimer = Math.max(0, state.monsterTouchMessageTimer - dt);
    }

    if (isNight && !state.monsterWasNight) this.beginNight(state);
    if (!isNight && state.monsterWasNight) this.endNight(state);
    state.monsterWasNight = isNight;

    if (!isNight) return;

    this.updateSpawning(state, dt);
    this.updateMonsters(state, dt);
  }

  beginNight(state) {
    state.monsterSpawnedTonight = 0;
    state.monsterSpawnTimer = 0;
    state.addMessage(GameConfig.text.nightStarts, GameConfig.text.messageDuration.normal);
  }

  endNight(state) {
    if (!GameConfig.monster.clearAtDay || state.monsters.length === 0) return;
    state.monsters = [];
    state.addMessage(GameConfig.text.monstersClearedAtDay, GameConfig.text.messageDuration.short);
  }

  updateSpawning(state, dt) {
    if (!state.fogGates.length) return;
    if (state.monsterSpawnedTonight >= GameConfig.monster.perNight) return;

    state.monsterSpawnTimer -= dt;
    if (state.monsterSpawnTimer > 0) return;

    this.spawnMonster(state);
    state.monsterSpawnTimer = GameConfig.monster.spawnInterval;
  }

  spawnMonster(state) {
    const gate = state.fogGates[state.monsterSpawnedTonight % state.fogGates.length];
    const camp = this.findNearestActiveCamp(state, gate) || state.start;
    state.monsters.push({
      id: state.nextMonsterId++,
      x: gate.x,
      y: gate.y,
      originGateId: gate.id,
      state: GameConfig.monster.states.marching,
      targetType: 'camp',
      targetId: null,
      homeTarget: { x: camp.x, y: camp.y, type: camp.type || 'village' }
    });
    state.monsterSpawnedTonight += 1;
  }

  updateMonsters(state, dt) {
    const survivors = [];

    for (const monster of state.monsters) {
      const target = this.selectTarget(state, monster);
      monster.targetType = target.type;
      monster.targetId = target.id || null;
      monster.state = target.type === 'camp'
        ? GameConfig.monster.states.marching
        : GameConfig.monster.states.chasing;

      this.moveToward(monster, target, dt);

      if (!this.resolveContact(state, monster, target)) {
        survivors.push(monster);
      }
    }

    state.monsters = survivors;
  }

  selectTarget(state, monster) {
    const range = GameConfig.monster.tacticalRange;
    const placedStone = this.findNearestEntity(
      monster,
      state.looseStones,
      range,
      stone => stone.source === 'placed'
    );

    if (placedStone) {
      return {
        type: 'stone',
        id: placedStone.id,
        entity: placedStone,
        x: placedStone.x,
        y: placedStone.y
      };
    }

    const states = GameConfig.worker.states;
    const outsideWorker = this.findNearestEntity(
      monster,
      state.workers,
      range,
      worker => (
        worker.state === states.moving
        || worker.state === states.working
        || worker.state === states.returning
      )
    );

    if (outsideWorker) {
      return {
        type: 'worker',
        id: outsideWorker.id,
        entity: outsideWorker,
        x: outsideWorker.x,
        y: outsideWorker.y
      };
    }

    if (distance(monster, state.player) <= range) {
      return {
        type: 'player',
        id: 'player',
        entity: state.player,
        x: state.player.x,
        y: state.player.y
      };
    }

    const camp = this.findNearestActiveCamp(state, monster) || state.start;
    monster.homeTarget = { x: camp.x, y: camp.y, type: camp.type || 'village' };
    return {
      type: 'camp',
      id: monster.homeTarget.type,
      x: monster.homeTarget.x,
      y: monster.homeTarget.y
    };
  }

  resolveContact(state, monster, target) {
    const targetDistance = distance(monster, target);

    if (target.type === 'stone' && targetDistance <= GameConfig.monster.consumeStoneRange) {
      state.looseStones = state.looseStones.filter(stone => stone.id !== target.id);
      state.addMessage(GameConfig.text.monsterConsumedStone, GameConfig.text.messageDuration.normal);
      return true;
    }

    if (target.type === 'worker' && targetDistance <= GameConfig.monster.catchWorkerRange) {
      this.workerSystem.captureWorker(state, target.entity);
      state.addMessage(GameConfig.text.workerCaptured, GameConfig.text.messageDuration.normal);
      return true;
    }

    if (target.type === 'player' && targetDistance <= GameConfig.monster.touchPlayerRange) {
      if (state.monsterTouchMessageTimer <= 0) {
        state.addMessage(GameConfig.text.playerTouchedByMonster, GameConfig.text.messageDuration.short);
        state.monsterTouchMessageTimer = GameConfig.monster.touchPlayerMessageCooldown;
      }
      return false;
    }

    if (target.type === 'camp' && targetDistance <= GameConfig.monster.reachCampRange) {
      return true;
    }

    return false;
  }

  moveToward(monster, target, dt) {
    const dx = target.x - monster.x;
    const dy = target.y - monster.y;
    const targetDistance = Math.hypot(dx, dy);
    if (targetDistance <= 0.001) return;

    const step = GameConfig.monster.moveSpeed * dt;
    if (targetDistance <= step) {
      monster.x = target.x;
      monster.y = target.y;
      return;
    }

    monster.x += (dx / targetDistance) * step;
    monster.y += (dy / targetDistance) * step;
  }

  findNearestActiveCamp(state, origin) {
    return this.findNearestEntity(
      origin,
      state.camps,
      Infinity,
      camp => camp.active
    );
  }

  findNearestEntity(origin, entities, maxDistance, filter) {
    let best = null;
    let bestDistance = maxDistance;

    for (const entity of entities) {
      if (!filter(entity)) continue;
      const entityDistance = distance(origin, entity);
      if (entityDistance <= bestDistance) {
        best = entity;
        bestDistance = entityDistance;
      }
    }

    return best;
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
