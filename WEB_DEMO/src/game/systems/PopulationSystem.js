import { GameConfig } from '../config/GameConfig.js';
import { createArcher, createWorker } from '../state/createInitialState.js';
import { distance } from '../utils/grid.js';
import { TileType } from '../world/TileMap.js';

export class PopulationSystem {
  constructor(campSystem, showMessage) {
    this.campSystem = campSystem;
    this.showMessage = showMessage;
  }

  update(state, dt) {
    this.updateRefugeeFires(state, dt);
    this.updateReturningRefugees(state, dt);
  }

  updateRefugeeFires(state, dt) {
    state.world.map.forEach(tile => {
      if (tile.type !== TileType.REFUGEE_FIRE || !tile.refugee) return;
      if (tile.refugee.available || tile.refugee.cooldown <= 0) return;

      tile.refugee.cooldown = Math.max(0, tile.refugee.cooldown - dt);
      if (tile.refugee.cooldown <= 0) {
        tile.refugee.available = true;
      }
    });
  }

  updateReturningRefugees(state, dt) {
    for (const refugee of state.refugees) {
      if (!refugee.path || refugee.pathIndex >= refugee.path.length) {
        this.arrive(state, refugee);
        continue;
      }

      const target = refugee.path[refugee.pathIndex];
      const d = distance(refugee, target);
      const step = GameConfig.population.refugeeSpeed * dt;

      if (d > step) {
        refugee.x += ((target.x - refugee.x) / d) * step;
        refugee.y += ((target.y - refugee.y) / d) * step;
      } else {
        refugee.x = target.x;
        refugee.y = target.y;
        refugee.pathIndex += 1;
      }
    }

    state.refugees = state.refugees.filter(refugee => !refugee.done);
  }

  recruit(state, target) {
    const tile = state.world.map.cell(target.x, target.y);
    if (tile?.type !== TileType.REFUGEE_FIRE || !tile.refugee?.available) {
      this.showMessage('流民火堆暂时无人可招募。');
      return false;
    }

    if (state.resources.stone < GameConfig.population.recruitCost) {
      this.showMessage('辉石不足。');
      return false;
    }

    const path = this.campSystem.pathToHome(state, { x: target.x, y: target.y });
    if (!path) {
      this.showMessage('流民找不到回营地的路。');
      return false;
    }

    state.resources.stone -= GameConfig.population.recruitCost;
    tile.refugee.available = false;
    tile.refugee.cooldown = GameConfig.population.refugeeFireCooldown;

    state.refugees.push({
      id: state.nextEntityId,
      x: target.x,
      y: target.y,
      originX: target.x,
      originY: target.y,
      path,
      pathIndex: 1,
      done: false
    });
    state.nextEntityId += 1;

    this.showMessage('流民开始返回安全点。');
    return true;
  }

  convert(state, kind, target) {
    if (state.resources.stone < GameConfig.population.conversionCost) {
      this.showMessage('辉石不足。');
      return false;
    }

    if (!state.population.unassigned.length) {
      this.showMessage('没有未转职流民。');
      return false;
    }

    const recruit = state.population.unassigned.shift();
    const home = this.campSystem.nearestHome(state, target);
    state.resources.stone -= GameConfig.population.conversionCost;

    if (kind === 'worker') {
      state.workers.push(createWorker(state.nextEntityId, recruit.x, recruit.y, home.id));
      state.nextEntityId += 1;
      this.showMessage('流民在工人屋转职为工人。');
      return true;
    }

    state.archers.push(createArcher(state.nextEntityId, recruit.x, recruit.y, home.id));
    state.nextEntityId += 1;
    this.showMessage('流民在弓箭手营转职为弓箭手。');
    return true;
  }

  arrive(state, refugee) {
    state.population.unassigned.push({ x: refugee.x, y: refugee.y });
    refugee.done = true;
    this.showMessage('流民抵达安全点，等待转职。');
  }
}
