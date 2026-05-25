import { findPathToAny } from '../../engine/math/pathfinding.js';

export class CampSystem {
  getActiveHomes(state) {
    return state.camps.filter(camp => camp.active);
  }

  getReturnPath(state, worker) {
    const homes = this.getActiveHomes(state);
    return findPathToAny(state.map, worker, homes);
  }
}
