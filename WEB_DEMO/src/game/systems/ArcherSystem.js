import { GameConfig } from '../config/GameConfig.js';
import { distance } from '../utils/grid.js';

export class ArcherSystem {
  constructor(showMessage) {
    this.showMessage = showMessage;
  }

  update(state, dt) {
    if (state.status !== 'playing') return;

    for (const archer of state.archers) {
      if (archer.lost) continue;
      this.updateArcher(state, archer, dt);
    }

    state.monsters = state.monsters.filter(monster => !monster.dead);
  }

  updateArcher(state, archer, dt) {
    if (archer.state === 'cooldown') {
      archer.cooldown = Math.max(0, (archer.cooldown || 0) - dt);
      if (archer.cooldown <= 0) archer.state = 'idle';
      return;
    }

    if (state.time.phase !== 'night') {
      if (archer.state === 'aim') this.resetAim(archer);
      return;
    }

    if (archer.state === 'aim') {
      this.updateAim(state, archer, dt);
      return;
    }

    if (archer.state === 'idle') {
      const target = this.findTarget(state, archer);
      if (target) {
        archer.state = 'aim';
        archer.aimingTargetId = target.id;
        archer.aimTimer = 0;
      }
    }
  }

  updateAim(state, archer, dt) {
    const target = state.monsters.find(monster =>
      monster.id === archer.aimingTargetId &&
      !monster.dead &&
      !monster.returning &&
      distance(archer, monster) < GameConfig.archer.range
    );

    if (!target) {
      this.resetAim(archer);
      return;
    }

    archer.aimTimer += dt;
    if (archer.aimTimer < GameConfig.archer.aimSeconds) return;

    target.hp = (target.hp || GameConfig.monster.hp) - GameConfig.archer.damage;
    if (target.hp <= 0) {
      target.dead = true;
      this.showMessage('弓箭手射杀了一只黑林影。');
    } else {
      this.showMessage('弓箭手射中黑林影。');
    }

    archer.state = 'cooldown';
    archer.aimingTargetId = null;
    archer.aimTimer = 0;
    archer.cooldown = GameConfig.archer.cooldownSeconds;
  }

  findTarget(state, archer) {
    return state.monsters
      .filter(monster =>
        !monster.dead &&
        !monster.returning &&
        distance(archer, monster) < GameConfig.archer.range
      )
      .sort((a, b) => distance(archer, a) - distance(archer, b))[0] ?? null;
  }

  resetAim(archer) {
    archer.state = 'idle';
    archer.aimingTargetId = null;
    archer.aimTimer = 0;
  }
}
