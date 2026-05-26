export const MonsterTargetKind = {
  STONE: 'stone',
  WALL: 'wall',
  WORKER: 'worker',
  ARCHER: 'archer',
  PLAYER: 'player',
  CAMP: 'camp'
};

export function monsterTargetKey(target) {
  if (!target) return '';
  const object = target.object;

  if (
    target.kind === MonsterTargetKind.STONE ||
    target.kind === MonsterTargetKind.WALL ||
    target.kind === MonsterTargetKind.CAMP
  ) {
    return `${target.kind}:${Math.round(object.x)},${Math.round(object.y)}`;
  }

  if (target.kind === MonsterTargetKind.PLAYER) return 'player';
  if (target.kind === MonsterTargetKind.WORKER) return `worker:${object.id}`;
  if (target.kind === MonsterTargetKind.ARCHER) return `archer:${object.id}`;
  return target.kind;
}
