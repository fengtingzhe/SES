import { GameConfig } from '../config/GameConfig.js';
import { normalizeVector } from '../utils/grid.js';
import { TileType } from '../world/TileMap.js';

export class PlayerSystem {
  constructor(inputManager) {
    this.inputManager = inputManager;
  }

  update(state, dt) {
    const raw = this.inputManager.getMovementVector();
    const inverted = this.isInverted(state);
    state.player.controlInverted = inverted;

    if (!raw.x && !raw.y) return false;

    this.updateFacing(state.player, raw);

    const moveInput = inverted ? { x: -raw.x, y: -raw.y } : raw;
    const move = normalizeVector(moveInput.x, moveInput.y);
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

    state.player.controlInverted = this.isInverted(state);
    return moved;
  }

  isInverted(state) {
    const x = Math.round(state.player.x);
    const y = Math.round(state.player.y);
    return state.world.map.cell(x, y)?.type === TileType.INVERTED_FOREST;
  }

  updateFacing(player, raw) {
    const ax = Math.abs(raw.x);
    const ay = Math.abs(raw.y);
    player.facing = ax >= ay
      ? { x: raw.x > 0 ? 1 : -1, y: 0 }
      : { x: 0, y: raw.y > 0 ? 1 : -1 };
  }
}
