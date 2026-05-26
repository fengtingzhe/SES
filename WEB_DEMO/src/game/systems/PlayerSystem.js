import { GameConfig } from '../config/GameConfig.js';
import { normalizeVector } from '../utils/grid.js';

export class PlayerSystem {
  constructor(inputManager) {
    this.inputManager = inputManager;
  }

  update(state, dt) {
    const raw = this.inputManager.getMovementVector();
    if (!raw.x && !raw.y) return false;

    this.updateFacing(state.player, raw);

    const move = normalizeVector(raw.x, raw.y);
    const nextX = state.player.x + move.x * GameConfig.player.speed * dt;
    const nextY = state.player.y + move.y * GameConfig.player.speed * dt;
    const map = state.world.map;
    let moved = false;

    if (map.isPassable(Math.round(nextX), Math.round(state.player.y))) {
      state.player.x = nextX;
      moved = true;
    }

    if (map.isPassable(Math.round(state.player.x), Math.round(nextY))) {
      state.player.y = nextY;
      moved = true;
    }

    return moved;
  }

  updateFacing(player, raw) {
    const ax = Math.abs(raw.x);
    const ay = Math.abs(raw.y);
    player.facing = ax >= ay
      ? { x: raw.x > 0 ? 1 : -1, y: 0 }
      : { x: 0, y: raw.y > 0 ? 1 : -1 };
  }
}
