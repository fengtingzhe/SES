import { TileMap, TILE_TYPES } from './TileMap.js';

export class MapGenerator {
  static generate() {
    const width = 46;
    const height = 26;
    const start = { x: 4, y: randomInt(11, 15) };
    const map = new TileMap(width, height);
    const pathSeed = {
      phaseA: randomFloat(0, Math.PI * 2),
      phaseB: randomFloat(0, Math.PI * 2),
      amplitudeA: randomFloat(1.2, 2.7),
      amplitudeB: randomFloat(0.4, 1.1)
    };
    const path = [];

    for (let x = 2; x < width - 2; x += 1) {
      const wave = Math.sin(x * 0.27 + pathSeed.phaseA) * pathSeed.amplitudeA
        + Math.sin(x * 0.61 + pathSeed.phaseB) * pathSeed.amplitudeB;
      const y = clamp(Math.round(start.y + wave), 6, height - 7);
      path[x] = { x, y };
      carve(map, x, y, 2);
    }

    carve(map, start.x, start.y, 4);
    map.setType(start.x, start.y, TILE_TYPES.VILLAGE);

    const treeIndex = randomInt(11, 15);
    const riverIndex = randomInt(22, 27);
    const campIndex = randomInt(31, 36);
    const goalIndex = randomInt(40, 43);

    const treeGate = path[treeIndex];
    for (let y = treeGate.y - 4; y <= treeGate.y + 4; y += 1) {
      if (map.inBounds(treeGate.x, y)) map.setType(treeGate.x, y, TILE_TYPES.FOREST);
    }
    map.setType(treeGate.x, treeGate.y, TILE_TYPES.TREE_BLOCK);

    const riverPoint = path[riverIndex];
    const riverSpan = randomInt(5, 7);
    for (let y = riverPoint.y - riverSpan; y <= riverPoint.y + riverSpan; y += 1) {
      if (map.inBounds(riverPoint.x, y)) map.setType(riverPoint.x, y, TILE_TYPES.RIVER);
    }
    map.setType(riverPoint.x, riverPoint.y, TILE_TYPES.BROKEN_BRIDGE);

    const oldCamp = path[campIndex];
    map.setType(oldCamp.x, oldCamp.y, TILE_TYPES.OLD_CAMP);

    const goal = path[goalIndex];
    carve(map, goal.x, goal.y, 2);
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
  const clusterCount = randomInt(4, 6);
  const positions = selectPathIndexes({
    min: 7,
    max: path.length - 8,
    count: clusterCount,
    reservedIndexes,
    reservedGap: 3,
    spacing: 5
  });

  for (const x of positions) {
    const center = path[x];
    if (!center) continue;
    const y = center.y + randomChoice([-4, -3, 3, 4]);
    const length = randomInt(2, 4);
    for (let i = 0; i < length; i += 1) {
      const offset = i - Math.floor(length / 2);
      const tile = map.get(x + offset, y);
      if (tile?.type === TILE_TYPES.GRASS) map.setType(x + offset, y, TILE_TYPES.FOREST);
    }
  }
}

function createWorkers(start) {
  return [
    createWorker(1, start.x - 0.7, start.y - 0.8),
    createWorker(2, start.x - 0.8, start.y + 0.8),
    createWorker(3, start.x + 0.7, start.y + 0.7)
  ];
}

function createWorker(id, x, y) {
  return {
    id,
    x,
    y,
    state: 'idle',
    path: [],
    pathIndex: 0,
    job: null,
    progress: 0
  };
}

function createStones(map, path, reservedIndexes) {
  const count = randomInt(5, 8);
  const indexes = selectPathIndexes({
    min: 6,
    max: path.length - 7,
    count,
    reservedIndexes,
    reservedGap: 2,
    spacing: 3
  });

  const stonePoints = indexes.map((x, index) => {
    const p = path[x];
    const point = findWalkableNear(map, p.x, p.y + randomChoice([-2, -1, 0, 1, 2]));
    return {
      id: `stone-${index}`,
      x: point.x,
      y: point.y,
      value: 1,
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
