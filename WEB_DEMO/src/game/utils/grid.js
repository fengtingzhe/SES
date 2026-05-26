export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function tacticalDistance(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export function normalizeVector(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

export function roundedGridPoint(entity) {
  return { x: Math.round(entity.x), y: Math.round(entity.y) };
}

export function directionLabel(direction) {
  if (direction.x > 0) return '东';
  if (direction.x < 0) return '西';
  if (direction.y > 0) return '南';
  if (direction.y < 0) return '北';
  return '无';
}
