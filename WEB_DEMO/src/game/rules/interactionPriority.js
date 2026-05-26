export const InteractionAction = {
  GOAL: 'goal',
  RESERVED: 'reserved',
  CHOP: 'chop',
  REPAIR: 'repair',
  CAMP: 'camp'
};

export const InteractionPriority = {
  [InteractionAction.GOAL]: 1,
  [InteractionAction.RESERVED]: 7,
  [InteractionAction.CHOP]: 8,
  [InteractionAction.REPAIR]: 9,
  [InteractionAction.CAMP]: 10
};
