import { GameConfig } from '../config/GameConfig.js';

export const JobType = {
  CHOP: 'chop',
  REPAIR: 'repair',
  CAMP: 'camp',
  MINE: 'mine',
  WALL: 'wall'
};

export const JobCosts = {
  [JobType.CHOP]: GameConfig.job.costs.chop,
  [JobType.REPAIR]: GameConfig.job.costs.repair,
  [JobType.CAMP]: GameConfig.job.costs.camp,
  [JobType.MINE]: GameConfig.job.costs.mine,
  [JobType.WALL]: GameConfig.job.costs.wall
};
