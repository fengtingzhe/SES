import { GameConfig } from '../config/GameConfig.js';
import { JobType } from './jobCosts.js';

export const JobDurations = {
  [JobType.CHOP]: GameConfig.job.durations.chop,
  [JobType.REPAIR]: GameConfig.job.durations.repair,
  [JobType.CAMP]: GameConfig.job.durations.camp,
  [JobType.MINE]: GameConfig.job.durations.mine,
  [JobType.WALL]: GameConfig.job.durations.wall
};
