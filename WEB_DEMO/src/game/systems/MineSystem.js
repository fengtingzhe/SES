import { GameConfig } from '../config/GameConfig.js';

export class MineSystem {
  update(state) {
    for (const mine of state.mines) {
      if (!mine.workerId) continue;
      const worker = state.workers.find(candidate => candidate.id === mine.workerId);
      if (!worker || worker.job?.type !== 'mine') {
        this.releaseMine(state, mine);
      }
    }
  }

  getMine(state, mineId) {
    return state.mines.find(mine => mine.id === mineId) || null;
  }

  getMineAt(state, x, y) {
    return state.mines.find(mine => mine.x === x && mine.y === y) || null;
  }

  isMineOccupied(state, mineId) {
    const mine = this.getMine(state, mineId);
    return Boolean(mine?.workerId);
  }

  assignWorker(state, mineId, workerId) {
    const mine = this.getMine(state, mineId);
    if (!mine || mine.workerId) return false;

    mine.occupied = true;
    mine.workerId = workerId;
    mine.progress = 0;
    this.syncTile(state, mine);
    return true;
  }

  updateMiningWorker(state, worker, dt) {
    const mine = this.getMine(state, worker.job?.mineId);
    if (!mine || mine.workerId !== worker.id) {
      worker.progress = 0;
      return;
    }

    mine.progress += dt;
    worker.progress = Math.min(1, mine.progress / GameConfig.mine.workDuration);

    if (mine.progress >= GameConfig.mine.workDuration) {
      mine.progress -= GameConfig.mine.workDuration;
      worker.progress = Math.min(1, mine.progress / GameConfig.mine.workDuration);
      state.player.stones += GameConfig.mine.yieldStone;
      state.addMessage(
        GameConfig.text.mineProduced(GameConfig.mine.yieldStone),
        GameConfig.text.messageDuration.short
      );
    }

    this.syncTile(state, mine);
  }

  releaseMineByWorker(state, workerId) {
    for (const mine of state.mines) {
      if (mine.workerId === workerId) this.releaseMine(state, mine);
    }
  }

  releaseMine(state, mine) {
    mine.occupied = false;
    mine.workerId = null;
    mine.progress = 0;
    this.syncTile(state, mine);
  }

  syncTile(state, mine) {
    const tile = state.map.get(mine.x, mine.y);
    if (!tile) return;
    tile.reserved = Boolean(mine.workerId);
    tile.reservedBy = mine.workerId;
    tile.mine = {
      mineId: mine.id,
      workerId: mine.workerId,
      progress: mine.progress
    };
  }
}
