export const MonsterTargetKind = {
  STONE: 'stone',
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
  return target.kind;
}
