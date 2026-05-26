import { GameConfig } from '../config/GameConfig.js';
import { distance } from '../utils/grid.js';
import { TileType } from '../world/TileMap.js';

export class ResourceSystem {
  constructor(showMessage) {
    this.showMessage = showMessage;
  }

  update(state, dt) {
    this.autoPickup(state);

    state.world.map.forEach((tile, x, y) => {
      if (tile.type !== TileType.STONE || tile.life == null) return;

      tile.life -= dt;
      if (tile.life <= 0) {
        state.world.map.blank(x, y);
      }
    });
  }

  autoPickup(state) {
    let gained = 0;

    state.world.map.forEach((tile, x, y) => {
      if (tile.type !== TileType.STONE || tile.placed) return;

      if (distance(state.player, { x, y }) < GameConfig.resource.pickupRadius) {
        gained += tile.value || 1;
        state.world.map.blank(x, y);
      }
    });

    if (gained > 0) {
      state.resources.stone += gained;
      this.showMessage(`获得辉石 +${gained}`);
    }
  }

  pickPlacedStone(state, x, y) {
    const tile = state.world.map.cell(x, y);
    if (tile?.type !== TileType.STONE || !tile.placed) return false;

    const value = tile.value || 1;
    state.resources.stone += value;
    state.world.map.blank(x, y);
    this.showMessage(`拾回辉石 +${value}`);
    return true;
  }

  placeStone(state) {
    if (state.resources.stone <= 0) {
      this.showMessage('没有辉石可放置。');
      return false;
    }

    const map = state.world.map;
    const px = Math.round(state.player.x);
    const py = Math.round(state.player.y);
    const spots = [
      { x: px + state.player.facing.x, y: py + state.player.facing.y }
    ];

    for (let radius = 1; radius <= 2; radius += 1) {
      for (let y = py - radius; y <= py + radius; y += 1) {
        for (let x = px - radius; x <= px + radius; x += 1) {
          spots.push({ x, y });
        }
      }
    }

    const seen = new Set();
    const target = spots.find(point => {
      const key = `${point.x},${point.y}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return map.cell(point.x, point.y)?.type === TileType.GROUND;
    });

    if (!target) {
      this.showMessage('附近没有可放置辉石的空地。');
      return false;
    }

    state.resources.stone -= 1;
    map.setStone(target.x, target.y, 1, GameConfig.resource.placedStoneLife, true);
    this.showMessage('放置辉石 -1。');
    return true;
  }

  dropStoneNear(state, x, y, value = 1) {
    const map = state.world.map;
    const points = [];

    for (let yy = Math.round(y) - 2; yy <= Math.round(y) + 2; yy += 1) {
      for (let xx = Math.round(x) - 2; xx <= Math.round(x) + 2; xx += 1) {
        if (map.cell(xx, yy)?.type === TileType.GROUND) {
          points.push({ x: xx, y: yy });
        }
      }
    }

    const target = points[0];
    if (!target) return false;

    map.setStone(target.x, target.y, value, GameConfig.resource.droppedStoneLife, false);
    return true;
  }
}
