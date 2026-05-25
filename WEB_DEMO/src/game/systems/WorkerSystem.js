import { findPath, getWalkableNeighbors } from '../../engine/math/pathfinding.js';
import { TILE_TYPES } from '../world/TileMap.js';

const JOBS = {
  chop: {
    duration: 2.8,
    message: '工人开始砍树。'
  },
  repair: {
    duration: 3.2,
    message: '工人开始修桥。'
  },
  lightCamp: {
    duration: 3.0,
    message: '工人开始点亮营地。'
  }
};

export class WorkerSystem {
  constructor(campSystem, resourceSystem) {
    this.campSystem = campSystem;
    this.resourceSystem = resourceSystem;
  }

  requestJob(state, target) {
    if (state.player.stones < target.cost) {
      state.addMessage(`需要 ${target.cost} 个辉石。`, 2);
      return false;
    }

    const worker = state.workers.find(candidate => candidate.state === 'idle');
    if (!worker) {
      state.addMessage('没有空闲工人。', 2);
      return false;
    }

    const workSpot = this.findWorkSpot(state, target);
    if (!workSpot) {
      state.addMessage('工人找不到可到达的位置。', 3);
      return false;
    }

    const path = findPath(state.map, worker, workSpot);
    if (!path) {
      state.addMessage('通往目标的道路还没有打开。', 3);
      return false;
    }

    const tile = state.map.get(target.x, target.y);
    if (tile) tile.reserved = true;

    state.player.stones -= target.cost;
    worker.state = 'moving';
    worker.path = path;
    worker.pathIndex = 1;
    worker.progress = 0;
    worker.job = {
      type: target.type,
      x: target.x,
      y: target.y,
      workSpot
    };

    state.addMessage('已派遣工人。', 2);
    return true;
  }

  update(state, dt) {
    for (const worker of state.workers) {
      if (worker.state === 'moving' || worker.state === 'returning') {
        this.walk(worker, dt);
        if (this.reachedPathEnd(worker)) {
          if (worker.state === 'moving') {
            this.startWorking(state, worker);
          } else {
            worker.state = 'idle';
            worker.path = [];
            worker.pathIndex = 0;
          }
        }
      } else if (worker.state === 'working') {
        this.updateWork(state, worker, dt);
      }
    }
  }

  findWorkSpot(state, target) {
    const candidates = [
      ...(state.map.isWalkable(target.x, target.y) ? [{ x: target.x, y: target.y }] : []),
      ...getWalkableNeighbors(state.map, target.x, target.y)
    ];

    let best = null;
    for (const candidate of candidates) {
      const hasPath = state.workers.some(worker => (
        worker.state === 'idle' && findPath(state.map, worker, candidate)
      ));
      if (hasPath) {
        best = candidate;
        break;
      }
    }

    return best;
  }

  walk(worker, dt) {
    const target = worker.path[worker.pathIndex];
    if (!target) return;

    const dx = target.x - worker.x;
    const dy = target.y - worker.y;
    const distance = Math.hypot(dx, dy);
    const speed = worker.state === 'returning' ? 2.25 : 2.0;
    const step = speed * dt;

    if (distance <= step) {
      worker.x = target.x;
      worker.y = target.y;
      worker.pathIndex += 1;
      return;
    }

    worker.x += (dx / distance) * step;
    worker.y += (dy / distance) * step;
  }

  reachedPathEnd(worker) {
    return worker.pathIndex >= worker.path.length;
  }

  startWorking(state, worker) {
    worker.state = 'working';
    worker.progress = 0;
    state.addMessage(JOBS[worker.job.type].message, 2);
  }

  updateWork(state, worker, dt) {
    const jobInfo = JOBS[worker.job.type];
    worker.progress += dt / jobInfo.duration;

    if (worker.progress < 1) return;

    this.finishJob(state, worker);
    this.sendWorkerHome(state, worker);
  }

  finishJob(state, worker) {
    const { x, y, type } = worker.job;
    const tile = state.map.get(x, y);
    if (!tile) return;

    if (type === 'chop') {
      state.map.setType(x, y, TILE_TYPES.GRASS);
      this.resourceSystem.dropStone(state, x, y, 1, null, 'reward');
      state.addMessage('树障已清理，掉落 1 个辉石。', 3);
    }

    if (type === 'repair') {
      state.map.setType(x, y, TILE_TYPES.BRIDGE);
      state.addMessage('断桥已修复。', 3);
    }

    if (type === 'lightCamp') {
      state.map.setType(x, y, TILE_TYPES.CAMP);
      state.camps.push({ x, y, type: 'camp', active: true });
      state.addMessage('新营地已点亮。', 3);
    }
  }

  sendWorkerHome(state, worker) {
    const returnPath = this.campSystem.getReturnPath(state, worker);
    worker.job = null;
    worker.progress = 0;
    worker.path = returnPath || [];
    worker.pathIndex = returnPath && returnPath.length > 1 ? 1 : 0;
    worker.state = returnPath && returnPath.length > 1 ? 'returning' : 'idle';
  }
}
