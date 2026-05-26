import { GameConfig } from '../config/GameConfig.js';
import { JobCosts, JobType } from '../rules/jobCosts.js';
import { JobDurations } from '../rules/jobDurations.js';
import { distance } from '../utils/grid.js';
import { TileType } from '../world/TileMap.js';
import { findPath } from '../world/pathfinding.js';

export class WorkerSystem {
  constructor(campSystem, resourceSystem, showMessage) {
    this.campSystem = campSystem;
    this.resourceSystem = resourceSystem;
    this.showMessage = showMessage;
  }

  update(state, dt) {
    for (const worker of state.workers) {
      if (worker.lost || !worker.job) continue;

      if (worker.state === 'moving' || worker.state === 'return') {
        this.walk(state, worker, dt);
      } else if (worker.state === 'work') {
        worker.progress += dt;
        if (worker.progress >= (JobDurations[worker.job.type] ?? GameConfig.worker.workDuration)) {
          this.finish(state, worker);
        }
      }
    }
  }

  assignJob(state, target) {
    const tile = state.world.map.cell(target.x, target.y);
    if (!tile) return false;

    if (tile.reserved) {
      this.showMessage('已有工人正在处理。');
      return false;
    }

    const cost = JobCosts[target.action];
    if (state.resources.stone < cost) {
      this.showMessage('辉石不足。');
      return false;
    }

    const locations = this.getWorkerLocationsForTarget(state, target);
    const assignment = this.findBestWorker(state, locations);
    if (!assignment) {
      this.showMessage('没有可用工人或道路不通。');
      return false;
    }

    const home = this.campSystem.nearestHome(state, assignment.worker);
    state.resources.stone -= cost;
    tile.reserved = {
      workerId: assignment.worker.id,
      action: target.action
    };

    Object.assign(assignment.worker, {
      job: {
        type: target.action,
        tx: target.x,
        ty: target.y,
        label: target.label
      },
      path: assignment.path,
      pathIndex: 1,
      state: 'moving',
      progress: 0,
      carry: cost,
      homeId: home.id
    });

    this.showMessage(`工人出发：${target.label}`);
    return true;
  }

  getWorkerLocationsForTarget(state, target) {
    if (target.action === JobType.CAMP) {
      return [{ x: target.x, y: target.y }];
    }
    return state.world.map.neighbors(target.x, target.y);
  }

  findBestWorker(state, locations) {
    let best = null;

    for (const worker of state.workers.filter(item =>
      !item.lost && (item.state === 'idle' || item.state === 'return')
    )) {
      for (const location of locations) {
        const path = findPath(state.world.map, worker, location);
        if (path && (!best || path.length < best.path.length)) {
          best = { worker, path };
        }
      }
    }

    return best;
  }

  walk(state, worker, dt) {
    if (!worker.path || worker.pathIndex >= worker.path.length) {
      if (worker.state === 'return') this.home(worker);
      else worker.state = 'work';
      return;
    }

    const target = worker.path[worker.pathIndex];
    const d = distance(worker, target);

    if (d > 0.05) {
      worker.x += ((target.x - worker.x) / d) * GameConfig.worker.speed * dt;
      worker.y += ((target.y - worker.y) / d) * GameConfig.worker.speed * dt;
    } else {
      worker.x = target.x;
      worker.y = target.y;
      worker.pathIndex += 1;

      if (worker.pathIndex >= worker.path.length) {
        if (worker.state === 'return') this.home(worker);
        else worker.state = 'work';
      }
    }
  }

  finish(state, worker) {
    const { tx, ty, type } = worker.job;
    const map = state.world.map;
    const tile = map.cell(tx, ty);

    if (type === JobType.CHOP) {
      map.blank(tx, ty);
      this.resourceSystem.dropStoneNear(state, tx, ty, 1);
      this.showMessage('树障被清开，掉落 1 个辉石。');
      this.returnHome(state, worker);
      return;
    }

    if (type === JobType.REPAIR) {
      map.setTile(tx, ty, TileType.BRIDGE);
      this.showMessage('断桥修复完成。');
      this.returnHome(state, worker);
      return;
    }

    if (type === JobType.CAMP) {
      map.setTile(tx, ty, TileType.CAMP);
      const camp = this.campSystem.addCamp(state, tx, ty);
      Object.assign(worker, {
        x: tx,
        y: ty,
        homeId: camp.id,
        job: null,
        state: 'idle',
        path: [],
        pathIndex: 0,
        progress: 0,
        carry: 0
      });
      this.showMessage('新营地建成，工人留在当前营地。');
      return;
    }

    if (tile?.reserved?.workerId === worker.id) {
      tile.reserved = null;
    }
    this.returnHome(state, worker);
  }

  returnHome(state, worker) {
    worker.carry = 0;
    const path = this.campSystem.pathToHome(state, worker, worker.homeId);
    if (!path) {
      this.home(worker);
      return;
    }

    Object.assign(worker, {
      job: { type: 'return' },
      path,
      pathIndex: 1,
      state: 'return',
      progress: 0
    });
  }

  home(worker) {
    Object.assign(worker, {
      job: null,
      state: 'idle',
      path: [],
      pathIndex: 0,
      progress: 0,
      carry: 0
    });
  }

  releaseReservedTarget(state, job) {
    if (!job || job.type === 'return') return;
    const tile = state.world.map.cell(job.tx, job.ty);
    if (tile?.reserved) tile.reserved = null;
  }
}
