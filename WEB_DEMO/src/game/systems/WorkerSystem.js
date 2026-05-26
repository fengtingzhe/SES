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
      if (worker.lost) continue;

      if (worker.state === 'waitingResume') {
        this.resumeInterruptedJob(state, worker);
        continue;
      }

      this.checkThreat(state, worker);

      if (worker.state === 'mining') {
        worker.progress += dt;
        if (worker.progress >= GameConfig.mine.productionSeconds) {
          worker.progress = 0;
          this.resourceSystem.dropStoneNear(state, worker.x, worker.y, 1);
          this.showMessage('矿山产出 1 个辉石。');
        }
        continue;
      }

      if (!worker.job) continue;

      if (worker.state === 'moving' || worker.state === 'return' || worker.state === 'flee') {
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

    if (target.action === JobType.MINE) {
      if (!tile.mine) tile.mine = { workerId: null };
      this.clearStaleMineOccupation(state, tile);

      if (tile.reserved || tile.mine.workerId) {
        this.showMessage('矿山已有工人。');
        return false;
      }
    } else if (tile.reserved) {
      this.showMessage('已有工人正在处理。');
      return false;
    }

    const cost = JobCosts[target.action] ?? 0;
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

    this.showMessage(target.action === JobType.MINE ? '工人前往矿山。' : `工人出发：${target.label}`);
    return true;
  }

  getWorkerLocationsForTarget(state, target) {
    if (target.action === JobType.CAMP || target.action === JobType.MINE) {
      return [{ x: target.x, y: target.y }];
    }
    return state.world.map.neighbors(target.x, target.y);
  }

  findBestWorker(state, locations) {
    let best = null;

    for (const worker of state.workers.filter(item =>
      !item.lost && !item.flee && (item.state === 'idle' || item.state === 'return')
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

  checkThreat(state, worker) {
    if (state.time.phase !== 'night') return;
    if (worker.state === 'return' && !worker.flee) return;
    if (worker.flee) return;

    const miningJob = worker.state === 'mining' ? this.getMiningJob(state, worker) : null;
    const currentJob = worker.job?.type === 'return' ? null : (worker.job ?? miningJob);
    if (!currentJob) return;

    const range = GameConfig.worker.threatRange;
    const nearMonster = state.monsters.find(monster =>
      !monster.dead &&
      Math.abs(monster.x - worker.x) <= range &&
      Math.abs(monster.y - worker.y) <= range
    );

    if (!nearMonster) return;

    const interruptedJob = { ...currentJob };
    this.releaseWorkerTask(state, worker);

    const path = this.campSystem.pathToHome(state, worker, worker.homeId);
    if (!path) {
      this.home(worker);
      this.showMessage('工人发现黑影，但找不到回家道路。');
      return;
    }

    Object.assign(worker, {
      job: { type: 'return' },
      path,
      pathIndex: 1,
      state: 'flee',
      progress: 0,
      carry: 0,
      flee: true,
      interruptedJob
    });

    this.showMessage('工人发现黑影，暂时撤退。');
  }

  walk(state, worker, dt) {
    if (!worker.path || worker.pathIndex >= worker.path.length) {
      if (worker.state === 'return' || worker.state === 'flee') this.home(worker);
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
        if (worker.state === 'return' || worker.state === 'flee') this.home(worker);
        else worker.state = 'work';
      }
    }
  }

  resumeInterruptedJob(state, worker) {
    const job = worker.interruptedJob;
    if (job?.type !== JobType.MINE) return false;
    if (worker.lost || worker.flee) return false;
    if (worker.state !== 'waitingResume' && worker.state !== 'idle') return false;

    const tile = state.world.map.cell(job.tx, job.ty);
    if (tile?.type !== TileType.MINE) {
      worker.interruptedJob = null;
      if (worker.state === 'waitingResume') worker.state = 'idle';
      return false;
    }

    if (!tile.mine) tile.mine = { workerId: null };
    this.clearStaleMineOccupation(state, tile);

    if (tile.mine.workerId && tile.mine.workerId !== worker.id) return false;
    if (tile.reserved && tile.reserved.workerId !== worker.id) return false;
    if (this.hasMonsterNear(state, job, GameConfig.worker.resumeThreatRange)) return false;

    const path = findPath(state.world.map, worker, { x: job.tx, y: job.ty });
    if (!path) return false;

    tile.reserved = {
      workerId: worker.id,
      action: JobType.MINE
    };

    Object.assign(worker, {
      job: {
        type: JobType.MINE,
        tx: job.tx,
        ty: job.ty,
        label: job.label ?? '派工采矿'
      },
      path,
      pathIndex: 1,
      state: 'moving',
      progress: 0,
      carry: 0,
      flee: false,
      interruptedJob: null
    });

    this.showMessage('矿山附近安全，工人返回继续采矿。');
    return true;
  }

  hasMonsterNear(state, point, range) {
    const x = point.tx ?? point.x;
    const y = point.ty ?? point.y;

    return state.monsters.some(monster =>
      !monster.dead &&
      Math.abs(monster.x - x) <= range &&
      Math.abs(monster.y - y) <= range
    );
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
      this.createCareerSitesNear(state, tx, ty);
      this.createWallBasesNear(state, tx, ty);
      Object.assign(worker, {
        x: tx,
        y: ty,
        homeId: camp.id,
        job: null,
        state: 'idle',
        path: [],
        pathIndex: 0,
        progress: 0,
        carry: 0,
        flee: false,
        interruptedJob: null
      });
      this.showMessage('新营地建成，工人留在当前营地。');
      return;
    }

    if (type === JobType.WALL) {
      if (tile?.type === TileType.WALL_BASE) {
        map.setTile(tx, ty, TileType.WALL, { hp: GameConfig.wall.maxHp });
        this.showMessage('围墙建造完成。');
      }
      this.returnHome(state, worker);
      return;
    }

    if (type === JobType.MINE) {
      if (tile?.type !== TileType.MINE) {
        this.returnHome(state, worker);
        return;
      }

      if (!tile.mine) tile.mine = { workerId: null };
      tile.reserved = null;
      tile.mine.workerId = worker.id;
      Object.assign(worker, {
        x: tx,
        y: ty,
        job: null,
        state: 'mining',
        path: [],
        pathIndex: 0,
        progress: 0,
        carry: 0,
        flee: false,
        interruptedJob: null
      });
      this.showMessage('工人开始采矿。');
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
      progress: 0,
      flee: false
    });
  }

  home(worker) {
    const shouldWaitResume = worker.flee && worker.interruptedJob?.type === JobType.MINE;

    Object.assign(worker, {
      job: null,
      state: shouldWaitResume ? 'waitingResume' : 'idle',
      path: [],
      pathIndex: 0,
      progress: 0,
      carry: 0,
      flee: false,
      interruptedJob: shouldWaitResume ? worker.interruptedJob : null
    });
  }

  releaseWorkerTask(state, worker) {
    this.releaseReservedTarget(state, worker.job, worker.id);
    this.releaseMineOccupation(state, worker.id);
    Object.assign(worker, {
      job: null,
      path: [],
      pathIndex: 0,
      progress: 0,
      carry: 0
    });
  }

  releaseReservedTarget(state, job, workerId = null) {
    if (job && job.type !== 'return') {
      const tile = state.world.map.cell(job.tx, job.ty);
      if (tile?.reserved && (!workerId || tile.reserved.workerId === workerId)) {
        tile.reserved = null;
      }
    }

    if (!workerId) return;

    state.world.map.forEach(tile => {
      if (tile.reserved?.workerId === workerId) {
        tile.reserved = null;
      }
    });
  }

  releaseMineOccupation(state, workerId) {
    state.world.map.forEach(tile => {
      if (tile.type === TileType.MINE && tile.mine?.workerId === workerId) {
        tile.mine.workerId = null;
        tile.reserved = null;
      }
    });
  }

  clearStaleMineOccupation(state, tile) {
    const workerId = tile.mine?.workerId;
    if (!workerId) return;

    const owner = state.workers.find(worker => worker.id === workerId);
    if (!owner || owner.lost || owner.state !== 'mining') {
      tile.mine.workerId = null;
      tile.reserved = null;
    }
  }

  getMiningJob(state, worker) {
    let job = null;
    state.world.map.forEach((tile, x, y) => {
      if (!job && tile.type === TileType.MINE && tile.mine?.workerId === worker.id) {
        job = { type: JobType.MINE, tx: x, ty: y, label: '派工采矿' };
      }
    });
    return job;
  }

  createCareerSitesNear(state, x, y) {
    const map = state.world.map;
    const sites = [
      { x: x + 1, y: y + 2, type: TileType.WORKER_HUT },
      { x: x + 3, y: y + 2, type: TileType.ARCHER_CAMP }
    ];

    for (const site of sites) {
      if (map.cell(site.x, site.y)?.type === TileType.GROUND) {
        map.setTile(site.x, site.y, site.type);
      }
    }
  }

  createWallBasesNear(state, x, y) {
    const map = state.world.map;
    const bases = [
      { x: x + 4, y: y + 1 },
      { x: x - 2, y: y + 1 }
    ];

    for (const base of bases) {
      if (map.cell(base.x, base.y)?.type === TileType.GROUND) {
        map.setTile(base.x, base.y, TileType.WALL_BASE);
      }
    }
  }
}
