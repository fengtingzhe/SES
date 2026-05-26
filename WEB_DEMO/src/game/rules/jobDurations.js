import { GameConfig } from '../config/GameConfig.js';
import { JobType } from './jobCosts.js';

export const JobDurations = {
  [JobType.CHOP]: GameConfig.worker.workDuration,
  [JobType.REPAIR]: GameConfig.worker.workDuration,
  [JobType.CAMP]: GameConfig.worker.workDuration
};
