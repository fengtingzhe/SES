import { GameConfig } from '../config/GameConfig.js';
import { distance } from '../utils/grid.js';

export class VisionSystem {
  reveal(state) {
    const { map } = state.world;
    const { start } = GameConfig.map;

    map.forEach(tile => {
      tile.visible = false;
    });

    map.forEach((tile, x, y) => {
      const point = { x, y };
      const visible =
        distance(point, state.player) < GameConfig.vision.playerRadius ||
        distance(point, start) < GameConfig.vision.startRadius;

      if (visible) {
        tile.visible = true;
        tile.discovered = true;
      }
    });
  }
}
