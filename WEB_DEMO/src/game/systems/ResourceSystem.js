import { GameConfig } from '../config/GameConfig.js';
import { TileType } from '../world/TileMap.js';

export class ResourceSystem {
  constructor(showMessage) {
    this.showMessage = showMessage;
  }

  update(state, dt) {
    state.world.map.forEach((tile, x, y) => {
      if (tile.type !== TileType.STONE || tile.life == null) return;

      tile.life -= dt;
      if (tile.life <= 0) {
        state.world.map.blank(x, y);
      }
    });
  }

  collectStone(state, target) {
    const tile = state.world.map.cell(target.x, target.y);
    if (!tile || tile.type !== TileType.STONE) return false;

    const amount = tile.value || 1;
    state.resources.stone += amount;
    state.world.map.blank(target.x, target.y);
    this.showMessage(`获得辉石 +${amount}`);
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
}
