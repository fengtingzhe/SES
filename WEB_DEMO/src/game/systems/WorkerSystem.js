import { findPath, getWalkableNeighbors } from '../../engine/math/pathfinding.js';
import { GameConfig } from '../config/GameConfig.js';

export class WorkerSystem {
  constructor(campSystem, resourceSystem, defenseSystem) {
    this.campSystem = campSystem;
    this.resourceSystem = resourceSystem;
    this.defenseSystem = defenseSystem;
  }

  requestJob(state, target) {
    const states = GameConfig.worker.states;

    if (state.player.stones < target.cost) {
      const message = target.needStoneText
        ? target.needStoneText(target.cost)
        : GameConfig.text.needStone(target.cost);
      state.addMessage(message, GameConfig.text.messageDuration.short);
      return false;
    }

    const worker = state.workers.find(candidate => candidate.state === states.idle);
    if (!worker) {
      state.addMessage(GameConfig.text.noIdleWorker, GameConfig.text.messageDuration.short);
      return false;
    }

    const workSpot = this.findWorkSpot(state, target);
    if (!workSpot) {
      state.addMessage(GameConfig.text.noWorkSpot, GameConfig.text.messageDuration.normal);
      return false;
    }

    const path = findPath(state.map, worker, workSpot);
    if (!path) {
      state.addMessage(GameConfig.text.noPath, GameConfig.text.messageDuration.normal);
      return false;
    }

    const tile = state.map.get(target.x, target.y);
    if (tile) {
      tile.reserved = true;
      tile.reservedBy = worker.id;
    }

    state.player.stones -= target.cost;
    worker.state = states.moving;
    worker.path = path;
    worker.pathIndex = 1;
    worker.progress = 0;
    worker.job = {
      type: target.type,
      x: target.x,
      y: target.y,
      workSpot
    };

    state.addMessage(GameConfig.text.workerSent, GameConfig.text.messageDuration.short);
    return true;
  }

  update(state, dt) {
    for (const worker of state.workers) {
      if (worker.state === GameConfig.worker.states.moving || worker.state === GameConfig.worker.states.returning) {
        this.walk(worker, dt);
        if (this.reachedPathEnd(worker)) {
          if (worker.state === GameConfig.worker.states.moving) {
            this.startWorking(state, worker);
          } else {
            worker.state = GameConfig.worker.states.idle;
            worker.path = [];
            worker.pathIndex = 0;
          }
        }
      } else if (worker.state === GameConfig.worker.states.working) {
        this.updateWork(state, worker, dt);
      }
    }
  }

  findWorkSpot(state, target) {
    const candidates = [
      ...(target.type !== 'buildWall' && state.map.isWalkable(target.x, target.y) ? [{ x: target.x, y: target.y }] : []),
      ...getWalkableNeighbors(state.map, target.x, target.y)
    ];

    let best = null;
    for (const candidate of candidates) {
      const hasPath = state.workers.some(worker => (
        worker.state === GameConfig.worker.states.idle && findPath(state.map, worker, candidate)
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
    const speed = worker.state === GameConfig.worker.states.returning
      ? GameConfig.worker.returnSpeed
      : GameConfig.worker.moveSpeed;
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
    worker.state = GameConfig.worker.states.working;
    worker.progress = 0;
    state.addMessage(this.getJobInfo(worker.job.type).startMessage, GameConfig.text.messageDuration.short);
  }

  updateWork(state, worker, dt) {
    const jobInfo = this.getJobInfo(worker.job.type);
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
      state.map.setType(x, y, GameConfig.jobs.chop.resultTile);
      this.resourceSystem.dropStone(state, x, y, GameConfig.jobs.chop.rewardStone || GameConfig.stone.rewardValue, null, 'reward');
      state.addMessage(GameConfig.jobs.chop.finishMessage, GameConfig.text.messageDuration.normal);
    }

    if (type === 'repair') {
      state.map.setType(x, y, GameConfig.jobs.repair.resultTile);
      state.addMessage(GameConfig.jobs.repair.finishMessage, GameConfig.text.messageDuration.normal);
    }

    if (type === 'lightCamp') {
      state.map.setType(x, y, GameConfig.jobs.lightCamp.resultTile);
      state.camps.push({ x, y, type: 'camp', active: true });
      state.addMessage(GameConfig.jobs.lightCamp.finishMessage, GameConfig.text.messageDuration.normal);
    }

    if (type === 'buildWall') {
      this.defenseSystem.finishWall(state, x, y);
    }
  }

  sendWorkerHome(state, worker) {
    const returnPath = this.campSystem.getReturnPath(state, worker);
    worker.job = null;
    worker.progress = 0;
    worker.path = returnPath || [];
    worker.pathIndex = returnPath && returnPath.length > 1 ? 1 : 0;
    worker.state = returnPath && returnPath.length > 1
      ? GameConfig.worker.states.returning
      : GameConfig.worker.states.idle;
  }

  captureWorker(state, worker) {
    this.releaseWorkerReservation(state, worker);
    worker.state = 'captured';
    worker.job = null;
    worker.path = [];
    worker.pathIndex = 0;
    worker.progress = 0;
    state.workers = state.workers.filter(candidate => candidate.id !== worker.id);
  }

  releaseWorkerReservation(state, worker) {
    if (worker.job) {
      const targetTile = state.map.get(worker.job.x, worker.job.y);
      if (targetTile) targetTile.reserved = false;
    }

    for (const tile of state.map.tiles) {
      if (tile.reservedBy === worker.id) {
        tile.reserved = false;
        tile.reservedBy = null;
      }
      if (tile.worker === worker.id) tile.worker = null;
      if (tile.workerId === worker.id) tile.workerId = null;
      if (tile.occupiedBy === worker.id) tile.occupiedBy = null;
      if (tile.mine?.worker === worker.id) tile.mine.worker = null;
      if (tile.mine?.workerId === worker.id) tile.mine.workerId = null;
    }
  }

  getJobInfo(type) {
    if (type === 'buildWall') {
      return {
        duration: GameConfig.wall.buildDuration,
        startMessage: GameConfig.text.wallBuildStarted,
        finishMessage: GameConfig.text.wallBuilt
      };
    }

    return GameConfig.jobs[type];
  }
}
