import { findPathToAny } from '../../engine/math/pathfinding.js';
import { GameConfig } from '../config/GameConfig.js';

export class RefugeeSystem {
  constructor(populationSystem) {
    this.populationSystem = populationSystem;
  }

  update(state, dt) {
    const remaining = [];

    for (const refugee of state.refugees) {
      this.walk(refugee, dt);
      if (this.hasArrived(refugee)) {
        this.populationSystem.addWorkerFromRefugee(
          state,
          { x: refugee.homeX, y: refugee.homeY },
          { x: refugee.x, y: refugee.y }
        );
      } else {
        remaining.push(refugee);
      }
    }

    state.refugees = remaining;
  }

  recruitRefugee(state, fireTarget) {
    const fire = this.getFire(state, fireTarget.fireId);
    if (!fire || fire.count <= 0) {
      state.addMessage(GameConfig.text.refugeeFireEmpty, GameConfig.text.messageDuration.short);
      return false;
    }

    if (state.player.stones < GameConfig.refugee.recruitCost) {
      state.addMessage(
        GameConfig.text.needMoreStoneForRefugee(GameConfig.refugee.recruitCost),
        GameConfig.text.messageDuration.short
      );
      return false;
    }

    const homes = state.camps.filter(camp => camp.active);
    const path = findPathToAny(state.map, fire, homes);
    const home = path?.at(-1) || this.findNearestHome(state, fire);
    if (!home) return false;

    state.player.stones -= GameConfig.refugee.recruitCost;
    fire.count -= 1;
    this.syncFireTile(state, fire);

    state.refugees.push({
      id: state.nextRefugeeId++,
      x: fire.x,
      y: fire.y,
      homeX: home.x,
      homeY: home.y,
      path: path || [fire, home],
      pathIndex: path && path.length > 1 ? 1 : 0
    });
    state.addMessage(GameConfig.text.refugeeRecruited, GameConfig.text.messageDuration.normal);
    return true;
  }

  getFire(state, fireId) {
    return state.refugeeFires.find(fire => fire.id === fireId) || null;
  }

  getFireAt(state, x, y) {
    return state.refugeeFires.find(fire => fire.x === x && fire.y === y) || null;
  }

  walk(refugee, dt) {
    const target = refugee.path[refugee.pathIndex] || { x: refugee.homeX, y: refugee.homeY };
    const dx = target.x - refugee.x;
    const dy = target.y - refugee.y;
    const distance = Math.hypot(dx, dy);
    const step = GameConfig.refugee.moveSpeed * dt;

    if (distance <= step || distance <= 0.001) {
      refugee.x = target.x;
      refugee.y = target.y;
      refugee.pathIndex += 1;
      return;
    }

    refugee.x += (dx / distance) * step;
    refugee.y += (dy / distance) * step;
  }

  hasArrived(refugee) {
    return Math.hypot(refugee.x - refugee.homeX, refugee.y - refugee.homeY) <= GameConfig.refugee.arriveRange
      || refugee.pathIndex >= refugee.path.length;
  }

  findNearestHome(state, origin) {
    let best = null;
    let bestDistance = Infinity;

    for (const camp of state.camps) {
      if (!camp.active) continue;
      const campDistance = Math.hypot(origin.x - camp.x, origin.y - camp.y);
      if (campDistance < bestDistance) {
        best = camp;
        bestDistance = campDistance;
      }
    }

    return best;
  }

  syncFireTile(state, fire) {
    const tile = state.map.get(fire.x, fire.y);
    if (!tile) return;
    tile.refugeeFire = {
      fireId: fire.id,
      count: fire.count
    };
  }
}
