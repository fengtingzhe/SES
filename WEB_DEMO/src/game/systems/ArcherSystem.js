import { GameConfig } from '../config/GameConfig.js';

export class ArcherSystem {
  update(state, dt) {
    state.arrowShots = state.arrowShots
      .map(shot => ({ ...shot, ttl: shot.ttl - dt }))
      .filter(shot => shot.ttl > 0);

    for (const archer of state.archers) {
      archer.cooldown = Math.max(0, archer.cooldown - dt);
      const target = this.findTarget(state, archer);
      archer.targetId = target?.id || null;

      if (target && archer.cooldown <= 0) {
        this.shoot(state, archer, target);
      }
    }

    state.monsters = state.monsters.filter(monster => (monster.hp ?? GameConfig.monster.maxHp) > 0);
  }

  recruitArcher(state, post) {
    if (state.player.stones < GameConfig.archer.recruitCost) {
      state.addMessage(
        GameConfig.text.needMoreStoneForArcher(GameConfig.archer.recruitCost),
        GameConfig.text.messageDuration.short
      );
      return false;
    }

    const home = this.findNearestActiveCamp(state, post);
    if (!home) return false;

    const homeArchers = state.archers.filter(archer => archer.homeX === home.x && archer.homeY === home.y);
    const offset = GameConfig.archer.spawnOffsets[homeArchers.length % GameConfig.archer.spawnOffsets.length];
    const spawn = this.findSpawnPoint(state, home, offset);

    state.player.stones -= GameConfig.archer.recruitCost;
    state.archers.push({
      id: state.nextArcherId++,
      x: spawn.x,
      y: spawn.y,
      homeX: home.x,
      homeY: home.y,
      cooldown: 0,
      targetId: null
    });
    state.addMessage(GameConfig.text.archerRecruited, GameConfig.text.messageDuration.normal);
    return true;
  }

  isPostActive(state, x, y) {
    return Boolean(this.findNearestActiveCamp(state, { x, y }));
  }

  findNearestActiveCamp(state, origin) {
    let best = null;
    let bestDistance = GameConfig.archer.postActiveRange;

    for (const camp of state.camps) {
      if (!camp.active) continue;
      const campDistance = distance(origin, camp);
      if (campDistance <= bestDistance) {
        best = camp;
        bestDistance = campDistance;
      }
    }

    return best;
  }

  findSpawnPoint(state, home, offset) {
    const preferred = [
      { x: home.x + offset.x, y: home.y + offset.y },
      { x: home.x + offset.x, y: home.y },
      { x: home.x, y: home.y + offset.y },
      { x: home.x, y: home.y }
    ];

    return preferred.find(point => state.map.isWalkable(Math.round(point.x), Math.round(point.y)))
      || { x: home.x, y: home.y };
  }

  findTarget(state, archer) {
    let best = null;
    let bestDistance = GameConfig.archer.attackRange;

    for (const monster of state.monsters) {
      if ((monster.hp ?? GameConfig.monster.maxHp) <= 0) continue;
      const monsterDistance = distance(archer, monster);
      if (monsterDistance <= bestDistance) {
        best = monster;
        bestDistance = monsterDistance;
      }
    }

    return best;
  }

  shoot(state, archer, monster) {
    monster.hp = (monster.hp ?? GameConfig.monster.maxHp) - GameConfig.archer.damage;
    archer.cooldown = GameConfig.archer.attackCooldown;
    state.arrowShots.push({
      fromX: archer.x,
      fromY: archer.y,
      toX: monster.x,
      toY: monster.y,
      ttl: 0.16
    });
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
