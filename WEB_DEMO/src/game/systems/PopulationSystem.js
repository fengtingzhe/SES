import { GameConfig } from '../config/GameConfig.js';

export class PopulationSystem {
  addWorkerFromRefugee(state, home, fallbackPosition) {
    const point = GameConfig.population.spawnAtCamp
      ? this.findSpawnPoint(state, home)
      : fallbackPosition;

    state.workers.push({
      id: state.nextWorkerId++,
      x: point.x,
      y: point.y,
      state: GameConfig.worker.states.idle,
      path: [],
      pathIndex: 0,
      job: null,
      progress: 0
    });

    state.addMessage(GameConfig.text.refugeeJoined, GameConfig.text.messageDuration.normal);
  }

  findSpawnPoint(state, home) {
    const offsets = GameConfig.population.workerSpawnOffsets;
    const startIndex = state.nextWorkerId % offsets.length;

    for (let i = 0; i < offsets.length; i += 1) {
      const offset = offsets[(startIndex + i) % offsets.length];
      const point = { x: home.x + offset.x, y: home.y + offset.y };
      if (state.map.isWalkable(Math.round(point.x), Math.round(point.y))) return point;
    }

    return { x: home.x, y: home.y };
  }
}
