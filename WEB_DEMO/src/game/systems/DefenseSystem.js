import { GameConfig } from '../config/GameConfig.js';
import { TILE_TYPES } from '../world/TileMap.js';

export class DefenseSystem {
  finishWall(state, x, y) {
    const tile = state.map.get(x, y);
    if (!tile) return;

    state.map.setType(x, y, TILE_TYPES.WALL);
    tile.hp = GameConfig.wall.maxHp;
    tile.maxHp = GameConfig.wall.maxHp;
    state.addMessage(GameConfig.text.wallBuilt, GameConfig.text.messageDuration.normal);
  }

  findNearestWall(state, origin, maxDistance) {
    let best = null;
    let bestDistance = maxDistance;

    for (let y = 0; y < state.map.height; y += 1) {
      for (let x = 0; x < state.map.width; x += 1) {
        const tile = state.map.get(x, y);
        if (tile?.type !== TILE_TYPES.WALL) continue;
        const wallHp = tile.hp ?? GameConfig.wall.maxHp;
        if (wallHp <= 0) continue;

        const wall = { id: `wall-${x}-${y}`, type: 'wall', x, y, tile };
        const wallDistance = distance(origin, wall);
        if (wallDistance <= bestDistance) {
          best = wall;
          bestDistance = wallDistance;
        }
      }
    }

    return best;
  }

  damageWall(state, wall, amount) {
    const tile = state.map.get(wall.x, wall.y);
    if (tile?.type !== TILE_TYPES.WALL) return false;

    tile.maxHp = tile.maxHp || GameConfig.wall.maxHp;
    tile.hp = Math.max(0, (tile.hp ?? tile.maxHp) - amount);

    if (tile.hp > 0) return false;

    this.destroyWall(state, wall.x, wall.y);
    return true;
  }

  destroyWall(state, x, y) {
    const nextType = GameConfig.wall.restoreFoundationOnDestroy
      ? TILE_TYPES.WALL_FOUNDATION
      : TILE_TYPES.GRASS;
    state.map.setType(x, y, nextType);
    const tile = state.map.get(x, y);
    if (tile) {
      tile.hp = null;
      tile.maxHp = null;
    }
    state.addMessage(GameConfig.text.wallDestroyed, GameConfig.text.messageDuration.normal);
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
