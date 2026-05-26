export const JobType = {
  CHOP: 'chop',
  REPAIR: 'repair',
  CAMP: 'camp',
  MINE: 'mine',
  WALL: 'wall'
};

export const JobCosts = {
  [JobType.CHOP]: 1,
  [JobType.REPAIR]: 2,
  [JobType.CAMP]: 2,
  [JobType.MINE]: 0,
  [JobType.WALL]: 2
};
