export const JobType = {
  CHOP: 'chop',
  REPAIR: 'repair',
  CAMP: 'camp',
  MINE: 'mine'
};

export const JobCosts = {
  [JobType.CHOP]: 1,
  [JobType.REPAIR]: 2,
  [JobType.CAMP]: 2,
  [JobType.MINE]: 0
};
