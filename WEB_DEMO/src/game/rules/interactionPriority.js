export const InteractionAction = {
  GOAL: 'goal',
  RECRUIT_REFUGEE: 'recruitRefugee',
  CONVERT_WORKER: 'convertWorker',
  CONVERT_ARCHER: 'convertArcher',
  REFUGEE_COOLDOWN: 'refugeeCooldown',
  FOX_WEDDING: 'foxWedding',
  PICK_PLACED_STONE: 'pickPlacedStone',
  MINE: 'mine',
  WALL: 'wall',
  RESERVED: 'reserved',
  CHOP: 'chop',
  REPAIR: 'repair',
  CAMP: 'camp'
};

export const InteractionPriority = {
  [InteractionAction.GOAL]: 1,
  [InteractionAction.RECRUIT_REFUGEE]: 2,
  [InteractionAction.CONVERT_WORKER]: 3,
  [InteractionAction.CONVERT_ARCHER]: 4,
  [InteractionAction.MINE]: 5,
  [InteractionAction.FOX_WEDDING]: 6,
  [InteractionAction.PICK_PLACED_STONE]: 7,
  [InteractionAction.WALL]: 8,
  [InteractionAction.RESERVED]: 9,
  [InteractionAction.REFUGEE_COOLDOWN]: 9,
  [InteractionAction.CHOP]: 10,
  [InteractionAction.REPAIR]: 11,
  [InteractionAction.CAMP]: 12
};
