import { GameConfig } from '../config/GameConfig.js';
import { clamp } from '../utils/grid.js';
import { createRandom, randomInt } from '../utils/random.js';
import { TileMap, TileType } from './TileMap.js';

export class MapGenerator {
  constructor(config = GameConfig.map) {
    this.config = config;
    this.random = createRandom(config.seed);
  }

  generate() {
    const map = new TileMap(this.config.width, this.config.height);
    const path = this.createMainPath(map);

    this.createBranches(map, path);
    this.createRiverSkeleton(map, path, 22);
    this.createRiverSkeleton(map, path, 45);
    this.createStartArea(map);
    this.placeStarterStones(map, path);
    map.setTile(this.config.goal.x, this.config.goal.y, TileType.GOAL);

    return { map, path };
  }

  createMainPath(map) {
    const { start, goal, height } = this.config;
    const path = [];
    let y = start.y;

    for (let x = start.x; x <= goal.x; x += 1) {
      if (x > 8 && x < goal.x - 2 && x % 3 === 0) {
        y = clamp(y + randomInt(this.random, 3) - 1, 8, height - 9);
      }

      path.push({ x, y });
      for (let dy = -1; dy <= 1; dy += 1) {
        map.blank(x, y + dy);
      }

      if (x % 6 === 0) {
        map.blank(x, y + (this.random() < 0.5 ? 2 : -2));
      }
    }

    return path;
  }

  createBranches(map, path) {
    for (let i = 0; i < 8; i += 1) {
      const anchor = path[8 + randomInt(this.random, path.length - 16)];
      let x = anchor.x;
      let y = anchor.y;
      const dir = this.random() < 0.5 ? -1 : 1;
      const length = 4 + randomInt(this.random, 8);

      for (let n = 0; n < length; n += 1) {
        x = clamp(x + randomInt(this.random, 3) - 1, 4, this.config.width - 5);
        y = clamp(y + dir * (this.random() < 0.75 ? 1 : 0), 5, this.config.height - 6);
        map.blank(x, y);
        map.blank(x + 1, y);
        if (n % 3 === 0) map.blank(x, y + dir);
      }
    }
  }

  createRiverSkeleton(map, path, baseX) {
    const rx = baseX + randomInt(this.random, 3);
    const crossing = path.find(point => point.x === rx) ?? path[Math.floor(path.length / 2)];

    for (let y = 3; y < this.config.height - 3; y += 1) {
      map.setTile(rx, y, TileType.WATER);
    }

    for (let dy = -1; dy <= 1; dy += 1) {
      map.blank(rx, crossing.y + dy);
    }
  }

  createStartArea(map) {
    const { start } = this.config;
    for (let y = start.y - 4; y <= start.y + 4; y += 1) {
      for (let x = start.x - 3; x <= start.x + 5; x += 1) {
        map.blank(x, y);
      }
    }
    map.setTile(start.x, start.y, TileType.VILLAGE);
  }

  placeStarterStones(map, path) {
    const { start } = this.config;
    map.setStone(start.x + 1, start.y, 1);

    const fixed = [10, 15, 24, 34, 43, 52];
    fixed.forEach((index, offsetIndex) => {
      const p = path[Math.min(index, path.length - 1)];
      const y = clamp(p.y + (offsetIndex % 2 === 0 ? -2 : 2), 4, this.config.height - 5);
      if (map.cell(p.x, y)?.type === TileType.GROUND) {
        map.setStone(p.x, y, offsetIndex === 0 ? 2 : 1);
      }
    });

    for (let i = 0; i < 16; i += 1) {
      const x = 6 + randomInt(this.random, this.config.width - 12);
      const y = 5 + randomInt(this.random, this.config.height - 10);
      if (map.cell(x, y)?.type === TileType.GROUND) {
        map.setStone(x, y, 1);
      }
    }
  }
}
