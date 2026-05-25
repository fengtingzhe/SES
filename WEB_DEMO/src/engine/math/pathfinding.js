const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];

const keyOf = (x, y) => `${x},${y}`;

export function findPath(map, start, goal) {
  const from = { x: Math.round(start.x), y: Math.round(start.y) };
  const to = { x: Math.round(goal.x), y: Math.round(goal.y) };

  if (!map.isWalkable(from.x, from.y) || !map.isWalkable(to.x, to.y)) {
    return null;
  }

  const queue = [from];
  const previous = new Map([[keyOf(from.x, from.y), null]]);

  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    if (current.x === to.x && current.y === to.y) {
      return buildPath(previous, current);
    }

    for (const dir of DIRECTIONS) {
      const next = { x: current.x + dir.x, y: current.y + dir.y };
      const key = keyOf(next.x, next.y);
      if (previous.has(key) || !map.isWalkable(next.x, next.y)) continue;
      previous.set(key, current);
      queue.push(next);
    }
  }

  return null;
}

export function findPathToAny(map, start, goals) {
  let best = null;

  for (const goal of goals) {
    const path = findPath(map, start, goal);
    if (!path) continue;
    if (!best || path.length < best.length) best = path;
  }

  return best;
}

export function getWalkableNeighbors(map, x, y) {
  return DIRECTIONS
    .map(dir => ({ x: x + dir.x, y: y + dir.y }))
    .filter(point => map.isWalkable(point.x, point.y));
}

function buildPath(previous, end) {
  const path = [];
  let current = end;

  while (current) {
    path.push({ x: current.x, y: current.y });
    current = previous.get(keyOf(current.x, current.y));
  }

  return path.reverse();
}
