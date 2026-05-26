export function findPath(map, from, to) {
  const start = { x: Math.round(from.x), y: Math.round(from.y) };
  const goal = { x: Math.round(to.x), y: Math.round(to.y) };

  if (!map.isPassable(start.x, start.y) || !map.isPassable(goal.x, goal.y)) {
    return null;
  }

  if (start.x === goal.x && start.y === goal.y) {
    return [start];
  }

  const queue = [start];
  const previous = new Map([[key(start), null]]);

  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];

    for (const next of map.neighbors(current.x, current.y)) {
      const nextKey = key(next);
      if (previous.has(nextKey)) continue;

      previous.set(nextKey, current);

      if (next.x === goal.x && next.y === goal.y) {
        const path = [next];
        let cursor = current;
        while (cursor) {
          path.push(cursor);
          cursor = previous.get(key(cursor));
        }
        return path.reverse();
      }

      queue.push(next);
    }
  }

  return null;
}

function key(point) {
  return `${point.x},${point.y}`;
}
