export const InteractionAction = {
  GOAL: 'goal',
  PICK_PLACED_STONE: 'pickPlacedStone',
  MINE: 'mine',
  RESERVED: 'reserved',
  CHOP: 'chop',
  REPAIR: 'repair',
  CAMP: 'camp'
};

export const InteractionPriority = {
  [InteractionAction.GOAL]: 1,
  [InteractionAction.MINE]: 5,
  [InteractionAction.PICK_PLACED_STONE]: 6,
  [InteractionAction.RESERVED]: 7,
  [InteractionAction.CHOP]: 8,
  [InteractionAction.REPAIR]: 9,
  [InteractionAction.CAMP]: 10
};
