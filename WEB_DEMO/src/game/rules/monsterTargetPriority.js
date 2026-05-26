export const MonsterTargetKind = {
  STONE: 'stone',
  WORKER: 'worker',
  PLAYER: 'player',
  CAMP: 'camp'
};

export function monsterTargetKey(target) {
  if (!target) return '';
  const object = target.object;

  if (target.kind === MonsterTargetKind.STONE || target.kind === MonsterTargetKind.CAMP) {
    return `${target.kind}:${Math.round(object.x)},${Math.round(object.y)}`;
  }

  if (target.kind === MonsterTargetKind.PLAYER) return 'player';
  if (target.kind === MonsterTargetKind.WORKER) return `worker:${object.id}`;
  return target.kind;
}
