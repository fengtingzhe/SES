import { TileMap, TILE_TYPES } from './TileMap.js';
import { GameConfig } from '../config/GameConfig.js';

export class MapGenerator {
  static generate() {
    const config = GameConfig.map;
    const width = config.width;
    const height = config.height;
    const start = { x: config.startX, y: randomInt(config.startYMin, config.startYMax) };
    const map = new TileMap(width, height);
    const pathSeed = {
      phaseA: randomFloat(0, Math.PI * 2),
      phaseB: randomFloat(0, Math.PI * 2),
      amplitudeA: randomFloat(config.pathWave.amplitudeAMin, config.pathWave.amplitudeAMax),
      amplitudeB: randomFloat(config.pathWave.amplitudeBMin, config.pathWave.amplitudeBMax)
    };
    const path = [];

    for (let x = config.path.minX; x < width - config.path.endPadding; x += 1) {
      const wave = Math.sin(x * config.pathWave.frequencyA + pathSeed.phaseA) * pathSeed.amplitudeA
        + Math.sin(x * config.pathWave.frequencyB + pathSeed.phaseB) * pathSeed.amplitudeB;
      const y = clamp(Math.round(start.y + wave), config.path.yMin, height - config.path.yMaxPadding);
      path[x] = { x, y };
      carve(map, x, y, config.path.carveRadius);
    }

    carve(map, start.x, start.y, config.path.startCarveRadius);
    map.setType(start.x, start.y, TILE_TYPES.VILLAGE);

    const treeIndex = randomInt(config.treeIndexMin, config.treeIndexMax);
    const riverIndex = randomInt(config.riverIndexMin, config.riverIndexMax);
    const campIndex = randomInt(config.campIndexMin, config.campIndexMax);
    const goalIndex = randomInt(config.goalIndexMin, config.goalIndexMax);

    const treeGate = path[treeIndex];
    for (let y = treeGate.y - config.treeGateHalfHeight; y <= treeGate.y + config.treeGateHalfHeight; y += 1) {
      if (map.inBounds(treeGate.x, y)) map.setType(treeGate.x, y, TILE_TYPES.FOREST);
    }
    map.setType(treeGate.x, treeGate.y, TILE_TYPES.TREE_BLOCK);

    const riverPoint = path[riverIndex];
    const riverSpan = randomInt(config.riverSpanMin, config.riverSpanMax);
    for (let y = riverPoint.y - riverSpan; y <= riverPoint.y + riverSpan; y += 1) {
      if (map.inBounds(riverPoint.x, y)) map.setType(riverPoint.x, y, TILE_TYPES.RIVER);
    }
    map.setType(riverPoint.x, riverPoint.y, TILE_TYPES.BROKEN_BRIDGE);

    const oldCamp = path[campIndex];
    map.setType(oldCamp.x, oldCamp.y, TILE_TYPES.OLD_CAMP);

    const goal = path[goalIndex];
    carve(map, goal.x, goal.y, config.path.goalCarveRadius);
    map.setType(goal.x, goal.y, TILE_TYPES.GOAL);

    addForestClusters(map, path, [treeIndex, riverIndex, campIndex, goalIndex]);

    return {
      map,
      start,
      goal,
      camps: [{ x: start.x, y: start.y, type: 'village', active: true }],
      workers: createWorkers(start),
      looseStones: createStones(map, path, [treeIndex, riverIndex, campIndex, goalIndex])
    };
  }
}

function carve(map, cx, cy, radius) {
  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      if (!map.inBounds(x, y)) continue;
      if (Math.abs(cx - x) + Math.abs(cy - y) <= radius + 1) {
        map.setType(x, y, TILE_TYPES.GRASS);
      }
    }
  }
}

function addForestClusters(map, path, reservedIndexes) {
  const config = GameConfig.map;
  const clusterCount = randomInt(config.forestClusterMin, config.forestClusterMax);
  const positions = selectPathIndexes({
    min: config.stoneIndexMin,
    max: path.length - config.stoneEndPadding,
    count: clusterCount,
    reservedIndexes,
    reservedGap: config.forestClusterReservedGap,
    spacing: config.forestClusterSpacing
  });

  for (const x of positions) {
    const center = path[x];
    if (!center) continue;
    const y = center.y + randomChoice(config.forestClusterYOffsetCandidates);
    const length = randomInt(config.forestClusterLengthMin, config.forestClusterLengthMax);
    for (let i = 0; i < length; i += 1) {
      const offset = i - Math.floor(length / 2);
      const tile = map.get(x + offset, y);
      if (tile?.type === TILE_TYPES.GRASS && !isNearPathCorridor(path, x + offset, y)) {
        map.setType(x + offset, y, TILE_TYPES.FOREST);
      }
    }
  }
}

function isNearPathCorridor(path, x, y) {
  const center = path[x];
  if (!center) return false;
  return Math.abs(center.x - x) + Math.abs(center.y - y) <= 2;
}

function createWorkers(start) {
  return GameConfig.worker.spawnOffsets
    .slice(0, GameConfig.worker.initialCount)
    .map((offset, index) => createWorker(index + 1, start.x + offset.x, start.y + offset.y));
}

function createWorker(id, x, y) {
  return {
    id,
    x,
    y,
    state: GameConfig.worker.states.idle,
    path: [],
    pathIndex: 0,
    job: null,
    progress: 0
  };
}

function createStones(map, path, reservedIndexes) {
  const config = GameConfig.map;
  const count = randomInt(config.stoneCountMin, config.stoneCountMax);
  const indexes = selectPathIndexes({
    min: config.stoneIndexMin,
    max: path.length - config.stoneEndPadding,
    count,
    reservedIndexes,
    reservedGap: config.stoneReservedGap,
    spacing: config.stoneSpacing
  });

  const stonePoints = indexes.map((x, index) => {
    const p = path[x];
    const point = findWalkableNear(map, p.x, p.y + randomChoice(config.stoneYOffsetCandidates));
    return {
      id: `stone-${index}`,
      x: point.x,
      y: point.y,
      value: GameConfig.stone.naturalValue,
      ttl: null,
      source: 'natural'
    };
  });

  return stonePoints;
}

function findWalkableNear(map, x, y) {
  const candidates = [
    { x, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 2 },
    { x, y: y + 2 }
  ];

  return candidates.find(point => map.isWalkable(point.x, point.y)) || { x, y };
}

function randomChoice(values) {
  return values[randomInt(0, values.length - 1)];
}

function selectPathIndexes({ min, max, count, reservedIndexes, reservedGap, spacing }) {
  const candidates = shuffle(range(min, max).filter(x => (
    !reservedIndexes.some(index => Math.abs(index - x) < reservedGap)
  )));
  const selected = [];

  for (const x of candidates) {
    if (selected.length >= count) break;
    if (selected.every(existing => Math.abs(existing - x) >= spacing)) selected.push(x);
  }

  for (const x of candidates) {
    if (selected.length >= count) break;
    if (!selected.includes(x)) selected.push(x);
  }

  return selected;
}

function range(min, max) {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomFloat(min, max + 1));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
