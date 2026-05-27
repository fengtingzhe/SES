import { GameConfig } from '../config/GameConfig.js';
import { clamp } from '../utils/grid.js';
import { createRandom, randomInt } from '../utils/random.js';
import { TileMap, TileType } from './TileMap.js';
import { findPath } from './pathfinding.js';

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
    this.placeSpecialSites(map, path);
    this.createStartArea(map);
    this.placeWorkSites(map, path);
    this.placeRefugeeFires(map, path);
    this.placeFogGates(map, path);
    this.placeStarterStones(map, path);
    map.setTile(this.config.goal.x, this.config.goal.y, TileType.GOAL, { regionTag: 'goal' });

    return { map, path };
  }

  placeSpecialSites(map, path) {
    this.paintInvertedForest(map, path, 10, -5);
    this.placeNearPath(map, path, 27, -5, TileType.FOX_WEDDING, {
      event: { type: 'foxWedding', completed: false }
    });
    this.paintInvertedForest(map, path, 50, -4);
  }

  paintInvertedForest(map, path, index, offsetY) {
    const anchor = path[Math.min(index, path.length - 1)];
    const center = {
      x: anchor.x,
      y: clamp(anchor.y + offsetY, 4, this.config.height - 5)
    };
    const radius = GameConfig.events.invertedForest.radius;

    for (let y = center.y - radius; y <= center.y + radius; y += 1) {
      for (let x = center.x - radius; x <= center.x + radius; x += 1) {
        if (!map.cell(x, y)) continue;
        const d = Math.hypot(x - center.x, y - center.y);
        if (d <= radius + 0.3) {
          map.setTile(x, y, TileType.INVERTED_FOREST, { invertLabel: false, regionTag: 'invertedForest' });
        }
      }
    }

    const labelTile = map.cell(center.x, center.y);
    if (labelTile?.type === TileType.INVERTED_FOREST) {
      labelTile.invertLabel = true;
    }
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
        this.setRegionTag(map, x, y + dy, 'forest');
      }

      if (x % 6 === 0) {
        const sideY = y + (this.random() < 0.5 ? 2 : -2);
        map.blank(x, sideY);
        this.setRegionTag(map, x, sideY, 'forest');
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
        this.setRegionTag(map, x, y, 'forest');
        map.blank(x + 1, y);
        this.setRegionTag(map, x + 1, y, 'forest');
        if (n % 3 === 0) {
          map.blank(x, y + dir);
          this.setRegionTag(map, x, y + dir, 'forest');
        }
      }
    }
  }

  createRiverSkeleton(map, path, baseX) {
    const rx = baseX + randomInt(this.random, 3);
    const crossing = path.find(point => point.x === rx) ?? path[Math.floor(path.length / 2)];

    for (let y = 3; y < this.config.height - 3; y += 1) {
      map.setTile(rx, y, TileType.WATER, { regionTag: 'river' });
    }

    map.setTile(rx, crossing.y, TileType.BROKEN_BRIDGE, { job: 'repair', regionTag: 'river' });
  }

  createStartArea(map) {
    const { start } = this.config;
    for (let y = start.y - 4; y <= start.y + 4; y += 1) {
      for (let x = start.x - 3; x <= start.x + 5; x += 1) {
        map.blank(x, y);
        this.setRegionTag(map, x, y, 'camp');
      }
    }
    map.setTile(start.x, start.y, TileType.VILLAGE, { regionTag: 'camp' });
    map.setTile(start.x + 2, start.y, TileType.MINE, { mine: { workerId: null }, regionTag: 'camp' });
    this.placeCareerSites(map, start.x, start.y);
    this.placeWallBases(map, start.x, start.y);
  }

  placeCareerSites(map, x, y) {
    if (map.cell(x + 1, y + 2)?.type === TileType.GROUND) {
      map.setTile(x + 1, y + 2, TileType.WORKER_HUT, { regionTag: 'camp' });
    }
    if (map.cell(x + 3, y + 2)?.type === TileType.GROUND) {
      map.setTile(x + 3, y + 2, TileType.ARCHER_CAMP, { regionTag: 'camp' });
    }
  }

  placeWallBases(map, x, y) {
    const bases = [
      { x: x + 4, y: y + 1 },
      { x: x - 2, y: y + 1 }
    ];

    for (const base of bases) {
      if (map.cell(base.x, base.y)?.type === TileType.GROUND) {
        map.setTile(base.x, base.y, TileType.WALL_BASE, { regionTag: 'camp' });
      }
    }
  }

  placeWorkSites(map, path) {
    const { start } = this.config;
    const treeSpots = [
      { x: start.x + 3, y: start.y - 2 },
      { x: start.x + 4, y: start.y - 2 },
      { x: start.x + 4, y: start.y + 2 }
    ];

    for (const spot of treeSpots) {
      if (map.cell(spot.x, spot.y)) {
        map.setTile(spot.x, spot.y, TileType.FOREST, { job: 'chop', regionTag: 'forest' });
      }
    }

    const campAnchor = path[Math.min(31, path.length - 1)];
    const campY = clamp(campAnchor.y + 2, 4, this.config.height - 5);
    const campSpot = this.findNearestGround(map, campAnchor.x, campY);
    if (campSpot) {
      map.setTile(campSpot.x, campSpot.y, TileType.OLD_FIREPIT, { job: 'camp', regionTag: 'forest' });
    }
  }

  placeFogGates(map, path) {
    this.placeNearPath(map, path, 36, -4, TileType.FOG);
    this.placeNearPath(map, path, 48, 5, TileType.FOG);
  }

  placeRefugeeFires(map, path) {
    this.placeNearPath(map, path, 16, 4, TileType.REFUGEE_FIRE, {
      refugee: { available: true, cooldown: 0 },
      regionTag: 'forest'
    }, true);
    this.placeNearPath(map, path, 30, 4, TileType.REFUGEE_FIRE, {
      refugee: { available: true, cooldown: 0 },
      regionTag: 'forest'
    }, true);
  }

  placeNearPath(map, path, index, offsetY, type, extra = {}, requireStartPath = false) {
    const anchor = path[Math.min(index, path.length - 1)];
    const y = clamp(anchor.y + offsetY, 4, this.config.height - 5);
    const spot = this.findNearestGround(
      map,
      anchor.x,
      y,
      requireStartPath ? this.config.start : null
    );
    if (spot) map.setTile(spot.x, spot.y, type, extra);
  }

  findNearestGround(map, x, y, reachableFrom = null) {
    const maxRadius = reachableFrom ? 12 : 6;
    for (let radius = 0; radius <= maxRadius; radius += 1) {
      for (let yy = y - radius; yy <= y + radius; yy += 1) {
        for (let xx = x - radius; xx <= x + radius; xx += 1) {
          if (map.cell(xx, yy)?.type === TileType.GROUND) {
            if (reachableFrom && !findPath(map, { x: xx, y: yy }, reachableFrom)) continue;
            return { x: xx, y: yy };
          }
        }
      }
    }
    return null;
  }

  setRegionTag(map, x, y, regionTag) {
    const tile = map.cell(x, y);
    if (tile) tile.regionTag = regionTag;
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
