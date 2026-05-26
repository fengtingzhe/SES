export const InteractionAction = {
  GOAL: 'goal',
  COLLECT_STONE: 'collectStone'
};

export const InteractionPriority = {
  [InteractionAction.GOAL]: 1,
  [InteractionAction.COLLECT_STONE]: 2
};
