import { GameConfig } from '../config/GameConfig.js';
import { distance } from '../utils/grid.js';
import { findPath } from '../world/pathfinding.js';

export class CampSystem {
  createStartHome() {
    return {
      id: GameConfig.home.startId,
      type: 'village',
      x: GameConfig.map.start.x,
      y: GameConfig.map.start.y
    };
  }

  addCamp(state, x, y) {
    const id = `camp-${state.homes.length}`;
    const camp = { id, type: 'camp', x, y };
    state.homes.push(camp);
    return camp;
  }

  getHome(state, homeId) {
    return state.homes.find(home => home.id === homeId) ?? state.homes[0];
  }

  nearestHome(state, point) {
    let best = state.homes[0];
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const home of state.homes) {
      const d = distance(point, home);
      if (d < bestDistance) {
        best = home;
        bestDistance = d;
      }
    }

    return best;
  }

  pathToHome(state, point, homeId = null) {
    const map = state.world.map;

    if (homeId) {
      const home = this.getHome(state, homeId);
      return findPath(map, point, home);
    }

    let best = null;
    for (const home of state.homes) {
      const path = findPath(map, point, home);
      if (path && (!best || path.length < best.length)) best = path;
    }
    return best;
  }
}
