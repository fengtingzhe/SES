import { GameConfig } from '../config/GameConfig.js';

export class DayNightSystem {
  update(state, dt) {
    state.time.elapsed += dt;
    state.time.day = Math.floor(state.time.elapsed / GameConfig.dayNight.dayLength) + 1;
    state.time.phase = this.getPhase(state.time.elapsed);

    const isNight = this.isNight(state);
    if (isNight && !state.time.wasNight) {
      state.monsterSpawn.spawnedThisNight = 0;
      state.monsterSpawn.cooldown = 0;
    }

    state.time.wasNight = isNight;
  }

  getPhase(elapsed) {
    const p = (elapsed % GameConfig.dayNight.dayLength) / GameConfig.dayNight.dayLength;
    if (p > GameConfig.dayNight.nightStartLate || p < GameConfig.dayNight.nightStartEarly) {
      return 'night';
    }
    if (p > GameConfig.dayNight.duskStart) return 'dusk';
    return 'day';
  }

  isNight(state) {
    return state.time.phase === 'night';
  }

  phaseLabel(state) {
    if (state.time.phase === 'night') return '夜晚';
    if (state.time.phase === 'dusk') return '黄昏';
    return '白天';
  }
}
