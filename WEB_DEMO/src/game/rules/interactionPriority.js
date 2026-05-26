export const InteractionAction = {
  GOAL: 'goal',
  RECRUIT_REFUGEE: 'recruitRefugee',
  CONVERT_WORKER: 'convertWorker',
  CONVERT_ARCHER: 'convertArcher',
  REFUGEE_COOLDOWN: 'refugeeCooldown',
  PICK_PLACED_STONE: 'pickPlacedStone',
  MINE: 'mine',
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
  [InteractionAction.PICK_PLACED_STONE]: 6,
  [InteractionAction.RESERVED]: 7,
  [InteractionAction.REFUGEE_COOLDOWN]: 7,
  [InteractionAction.CHOP]: 8,
  [InteractionAction.REPAIR]: 9,
  [InteractionAction.CAMP]: 10
};
