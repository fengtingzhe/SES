import { TileMap, TILE_TYPES } from './TileMap.js';

export class MapGenerator {
  static generate() {
    const width = 46;
    const height = 26;
    const start = { x: 4, y: 13 };
    const map = new TileMap(width, height);
    const path = [];

    for (let x = 2; x < width - 2; x += 1) {
      const y = clamp(Math.round(start.y + Math.sin(x * 0.31) * 2), 6, height - 7);
      path[x] = { x, y };
      carve(map, x, y, 2);
    }

    carve(map, start.x, start.y, 4);
    map.setType(start.x, start.y, TILE_TYPES.VILLAGE);

    const treeGate = path[13];
    for (let y = treeGate.y - 2; y <= treeGate.y + 2; y += 1) {
      map.setType(treeGate.x, y, TILE_TYPES.TREE_BLOCK);
    }

    const riverPoint = path[24];
    for (let y = riverPoint.y - 5; y <= riverPoint.y + 5; y += 1) {
      map.setType(riverPoint.x, y, TILE_TYPES.RIVER);
    }
    map.setType(riverPoint.x, riverPoint.y, TILE_TYPES.BROKEN_BRIDGE);

    const oldCamp = path[32];
    map.setType(oldCamp.x, oldCamp.y, TILE_TYPES.OLD_CAMP);

    const goal = path[42];
    carve(map, goal.x, goal.y, 2);
    map.setType(goal.x, goal.y, TILE_TYPES.GOAL);

    addForestClusters(map, path);

    return {
      map,
      start,
      goal,
      camps: [{ x: start.x, y: start.y, type: 'village', active: true }],
      workers: createWorkers(start),
      looseStones: createStones(path)
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

function addForestClusters(map, path) {
  const positions = [8, 18, 29, 37];
  for (const x of positions) {
    const center = path[x];
    if (!center) continue;
    const y = center.y + (x % 2 === 0 ? -3 : 3);
    for (let i = -1; i <= 1; i += 1) {
      const tile = map.get(x + i, y);
      if (tile?.type === TILE_TYPES.GRASS) map.setType(x + i, y, TILE_TYPES.FOREST);
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

function createStones(path) {
  const stonePoints = [6, 8, 16, 19, 27, 35].map((x, index) => {
    const p = path[x];
    return {
      id: `stone-${index}`,
      x: p.x,
      y: p.y + (index % 2 === 0 ? -1 : 1),
      value: 1,
      ttl: null,
      source: 'natural'
    };
  });

  return stonePoints;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
