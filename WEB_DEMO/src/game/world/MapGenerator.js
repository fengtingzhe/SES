import { GameConfig } from '../config/GameConfig.js';
import { clamp } from '../utils/grid.js';
import { createRandom, randomInt } from '../utils/random.js';
import { TileMap, TileType } from './TileMap.js';
import { findPath } from './pathfinding.js';

export class MapGenerator {
  constructor(config = GameConfig.map, height = GameConfig.map.height) {
    this.config = typeof config === 'number'
      ? { ...GameConfig.map, width: config, height }
      : config;
    this.random = createRandom(this.config.seed);
  }

  generate() {
    const map = new TileMap(this.config.width, this.config.height);
    const path = this.createMainPath(map);

    this.createBranches(map, path);
    for (const baseX of this.config.generation.rivers.baseXs) {
      this.createRiverSkeleton(map, path, baseX);
    }
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
    const sites = this.config.generation.specialSites;
    for (const site of sites.invertedForests) {
      this.paintInvertedForest(map, path, site.pathIndex, site.offsetY);
    }
    this.placeNearPath(map, path, sites.foxWedding.pathIndex, sites.foxWedding.offsetY, TileType.FOX_WEDDING, {
      event: { type: 'foxWedding', completed: false }
    });
  }

  paintInvertedForest(map, path, index, offsetY) {
    const anchor = path[Math.min(index, path.length - 1)];
    const placement = this.config.generation.placement;
    const center = {
      x: anchor.x,
      y: clamp(anchor.y + offsetY, placement.minY, this.config.height - placement.maxYMargin)
    };
    const radius = GameConfig.events.invertedForest.radius;

    for (let y = center.y - radius; y <= center.y + radius; y += 1) {
      for (let x = center.x - radius; x <= center.x + radius; x += 1) {
        if (!map.cell(x, y)) continue;
        const d = Math.hypot(x - center.x, y - center.y);
        if (d <= radius + GameConfig.events.invertedForest.edgePadding) {
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
    const config = this.config.generation.path;
    const path = [];
    let y = start.y;

    for (let x = start.x; x <= goal.x; x += 1) {
      if (x > config.wanderStartX && x < goal.x - config.goalPadding && x % config.wanderEvery === 0) {
        y = clamp(
          y + randomInt(this.random, config.yRandomChoices) - config.yDeltaOffset,
          config.minY,
          height - config.maxYMargin
        );
      }

      path.push({ x, y });
      for (let dy = -config.laneRadius; dy <= config.laneRadius; dy += 1) {
        map.blank(x, y + dy);
        this.setRegionTag(map, x, y + dy, 'forest');
      }

      if (x % config.sideEvery === 0) {
        const sideY = y + (this.random() < config.sideChance ? config.sideOffset : -config.sideOffset);
        map.blank(x, sideY);
        this.setRegionTag(map, x, sideY, 'forest');
      }
    }

    return path;
  }

  createBranches(map, path) {
    const config = this.config.generation.branches;
    for (let i = 0; i < config.count; i += 1) {
      const anchor = path[config.anchorStart + randomInt(this.random, path.length - config.anchorEndPadding)];
      let x = anchor.x;
      let y = anchor.y;
      const dir = this.random() < config.directionChance ? -1 : 1;
      const length = config.minLength + randomInt(this.random, config.lengthRandomChoices);

      for (let n = 0; n < length; n += 1) {
        x = clamp(
          x + randomInt(this.random, config.xRandomChoices) - config.xDeltaOffset,
          config.minX,
          this.config.width - config.maxXMargin
        );
        y = clamp(
          y + dir * (this.random() < config.yStepChance ? 1 : 0),
          config.minY,
          this.config.height - config.maxYMargin
        );
        map.blank(x, y);
        this.setRegionTag(map, x, y, 'forest');
        map.blank(x + config.widthExtraX, y);
        this.setRegionTag(map, x + config.widthExtraX, y, 'forest');
        if (n % config.extraEvery === 0) {
          map.blank(x, y + dir);
          this.setRegionTag(map, x, y + dir, 'forest');
        }
      }
    }
  }

  createRiverSkeleton(map, path, baseX) {
    const config = this.config.generation.rivers;
    const rx = baseX + randomInt(this.random, config.xRandomChoices);
    const crossing = path.find(point => point.x === rx) ?? path[Math.floor(path.length / 2)];

    for (let y = config.minY; y < this.config.height - config.maxYMargin; y += 1) {
      map.setTile(rx, y, TileType.WATER, { regionTag: 'river' });
    }

    map.setTile(rx, crossing.y, TileType.BROKEN_BRIDGE, { job: 'repair', regionTag: 'river' });
  }

  createStartArea(map) {
    const { start } = this.config;
    const config = this.config.generation.startArea;
    for (let y = start.y + config.offsetMin.y; y <= start.y + config.offsetMax.y; y += 1) {
      for (let x = start.x + config.offsetMin.x; x <= start.x + config.offsetMax.x; x += 1) {
        map.blank(x, y);
        this.setRegionTag(map, x, y, 'camp');
      }
    }
    map.setTile(start.x, start.y, TileType.VILLAGE, { regionTag: 'camp' });
    map.setTile(
      start.x + config.mineOffset.x,
      start.y + config.mineOffset.y,
      TileType.MINE,
      { mine: { workerId: null }, regionTag: 'camp' }
    );
    this.placeCareerSites(map, start.x, start.y);
    this.placeWallBases(map, start.x, start.y);
  }

  placeCareerSites(map, x, y) {
    const config = this.config.generation.startArea;
    const workerHut = { x: x + config.workerHutOffset.x, y: y + config.workerHutOffset.y };
    const archerCamp = { x: x + config.archerCampOffset.x, y: y + config.archerCampOffset.y };
    if (map.cell(workerHut.x, workerHut.y)?.type === TileType.GROUND) {
      map.setTile(workerHut.x, workerHut.y, TileType.WORKER_HUT, { regionTag: 'camp' });
    }
    if (map.cell(archerCamp.x, archerCamp.y)?.type === TileType.GROUND) {
      map.setTile(archerCamp.x, archerCamp.y, TileType.ARCHER_CAMP, { regionTag: 'camp' });
    }
  }

  placeWallBases(map, x, y) {
    const bases = this.config.generation.startArea.wallBaseOffsets
      .map(offset => ({ x: x + offset.x, y: y + offset.y }));

    for (const base of bases) {
      if (map.cell(base.x, base.y)?.type === TileType.GROUND) {
        map.setTile(base.x, base.y, TileType.WALL_BASE, { regionTag: 'camp' });
      }
    }
  }

  placeWorkSites(map, path) {
    const { start } = this.config;
    const config = this.config.generation;
    const treeSpots = config.startArea.treeOffsets
      .map(offset => ({ x: start.x + offset.x, y: start.y + offset.y }));

    for (const spot of treeSpots) {
      if (map.cell(spot.x, spot.y)) {
        map.setTile(spot.x, spot.y, TileType.FOREST, { job: 'chop', regionTag: 'forest' });
      }
    }

    const campAnchor = path[Math.min(config.specialSites.oldFirepit.pathIndex, path.length - 1)];
    const campY = clamp(
      campAnchor.y + config.specialSites.oldFirepit.offsetY,
      config.placement.minY,
      this.config.height - config.placement.maxYMargin
    );
    const campSpot = this.findNearestGround(map, campAnchor.x, campY);
    if (campSpot) {
      map.setTile(campSpot.x, campSpot.y, TileType.OLD_FIREPIT, { job: 'camp', regionTag: 'forest' });
    }
  }

  placeFogGates(map, path) {
    for (const gate of this.config.generation.specialSites.fogGates) {
      this.placeNearPath(map, path, gate.pathIndex, gate.offsetY, TileType.FOG);
    }
  }

  placeRefugeeFires(map, path) {
    for (const fire of this.config.generation.specialSites.refugeeFires) {
      this.placeNearPath(map, path, fire.pathIndex, fire.offsetY, TileType.REFUGEE_FIRE, {
        refugee: { available: true, cooldown: 0 },
        regionTag: 'forest'
      }, fire.requireStartPath);
    }
  }

  placeNearPath(map, path, index, offsetY, type, extra = {}, requireStartPath = false) {
    const placement = this.config.generation.placement;
    const anchor = path[Math.min(index, path.length - 1)];
    const y = clamp(anchor.y + offsetY, placement.minY, this.config.height - placement.maxYMargin);
    const spot = this.findNearestGround(
      map,
      anchor.x,
      y,
      requireStartPath ? this.config.start : null
    );
    if (spot) map.setTile(spot.x, spot.y, type, extra);
  }

  findNearestGround(map, x, y, reachableFrom = null) {
    const placement = this.config.generation.placement;
    const maxRadius = reachableFrom ? placement.reachableSearchRadius : placement.normalSearchRadius;
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
    const config = this.config.generation.starterStones;
    map.setStone(
      start.x + config.firstOffset.x,
      start.y + config.firstOffset.y,
      GameConfig.resource.defaultStoneValue
    );

    config.fixedPathIndexes.forEach((index, offsetIndex) => {
      const p = path[Math.min(index, path.length - 1)];
      const y = clamp(
        p.y + (offsetIndex % 2 === 0 ? -config.fixedSideOffset : config.fixedSideOffset),
        this.config.generation.placement.minY,
        this.config.height - this.config.generation.placement.maxYMargin
      );
      if (map.cell(p.x, y)?.type === TileType.GROUND) {
        map.setStone(p.x, y, offsetIndex === 0 ? config.firstFixedValue : config.fixedValue);
      }
    });

    for (let i = 0; i < config.randomCount; i += 1) {
      const x = config.randomMinX + randomInt(this.random, this.config.width - config.randomMaxXMargin);
      const y = config.randomMinY + randomInt(this.random, this.config.height - config.randomMaxYMargin);
      if (map.cell(x, y)?.type === TileType.GROUND) {
        map.setStone(x, y, config.randomValue);
      }
    }
  }
}
