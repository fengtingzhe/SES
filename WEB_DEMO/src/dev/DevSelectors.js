import { GameConfig } from '../game/config/GameConfig.js';
import { TileType } from '../game/world/TileMap.js';

export function getDevSummary(state) {
  const workers = state.workers.filter(worker => !worker.lost);
  const idleWorkers = workers.filter(worker => worker.state === 'idle').length;
  const miningWorkers = workers.filter(worker => worker.state === 'mining').length;
  const fleeingWorkers = workers.filter(worker => worker.flee).length;
  const waitingResumeWorkers = workers.filter(worker => worker.state === 'waitingResume').length;
  const lostWorkers = state.workers.filter(worker => worker.lost).length;
  const archers = state.archers.filter(archer => !archer.lost);
  const lostArchers = state.archers.filter(archer => archer.lost).length;
  const refugeeFires = countRefugeeFires(state);
  const walls = countWalls(state);

  return {
    overview: {
      version: state.version,
      status: statusLabel(state.status),
      position: `${state.player.x.toFixed(1)}, ${state.player.y.toFixed(1)}`,
      phase: phaseLabel(state.time.phase),
      day: state.time.day
    },
    resources: {
      stone: state.resources.stone,
      mapStones: countTiles(state, TileType.STONE),
      temporaryStones: countTiles(state, TileType.STONE, tile => tile.placed)
    },
    time: {
      elapsed: Math.floor(state.time.elapsed),
      phase: phaseLabel(state.time.phase),
      day: state.time.day
    },
    weather: {
      current: weatherLabel(state),
      remaining: state.weather.current ? Math.ceil(state.weather.remaining) : 0,
      lastEvent: state.weatherEvents.lastEvent?.label ?? '无'
    },
    units: {
      workers: workers.length,
      idleWorkers,
      miningWorkers,
      fleeingWorkers,
      waitingResumeWorkers,
      lostWorkers,
      archers: archers.length,
      lostArchers,
      monsters: state.monsters.length,
      refugees: state.refugees.filter(refugee => !refugee.done).length,
      unassigned: state.population.unassigned.length,
      homes: state.homes.length,
      workerRows: state.workers.map(worker => ({
        id: worker.id,
        state: worker.state,
        job: worker.job?.label ?? worker.job?.type ?? '无',
        lost: worker.lost ? '是' : '否',
        homeId: worker.homeId,
        interruptedJob: worker.interruptedJob?.label ?? worker.interruptedJob?.type ?? '无'
      }))
    },
    events: {
      foxWedding: foxWeddingLabel(state),
      refugeeFires,
      walls,
      fogGates: countTiles(state, TileType.FOG),
      mines: countTiles(state, TileType.MINE),
      invertedForestTiles: countTiles(state, TileType.INVERTED_FOREST),
      goalTiles: countTiles(state, TileType.GOAL)
    }
  };
}

function countTiles(state, type, predicate = null) {
  let count = 0;
  state.world.map.forEach(tile => {
    if (tile.type !== type) return;
    if (predicate && !predicate(tile)) return;
    count += 1;
  });
  return count;
}

function countRefugeeFires(state) {
  let available = 0;
  let cooling = 0;

  state.world.map.forEach(tile => {
    if (tile.type !== TileType.REFUGEE_FIRE) return;
    if (tile.refugee?.available) {
      available += 1;
      return;
    }
    if ((tile.refugee?.cooldown ?? 0) > 0) cooling += 1;
  });

  return { available, cooling, total: available + cooling };
}

function countWalls(state) {
  let total = 0;
  let damaged = 0;

  state.world.map.forEach(tile => {
    if (tile.type !== TileType.WALL) return;
    total += 1;
    if ((tile.hp ?? GameConfig.wall.maxHp) < GameConfig.wall.maxHp) damaged += 1;
  });

  return { total, damaged };
}

function phaseLabel(phase) {
  if (phase === 'night') return '黑夜';
  if (phase === 'dusk') return '黄昏';
  return '白天';
}

function statusLabel(status) {
  if (status === 'completed') return '已完成';
  if (status === 'failed') return '失败';
  return '进行中';
}

function weatherLabel(state) {
  if (!state.weather.current) return '晴 / 无天气';
  const config = GameConfig.weather.types[state.weather.current];
  return config?.name ?? state.weather.current;
}

function foxWeddingLabel(state) {
  const event = state.events.foxWedding;
  if (event.active) return `进行中 ${Math.ceil(event.timer)}s`;
  if (event.lastResult === 'success') return '成功';
  if (event.lastResult === 'failed') return '失败';
  return countTiles(state, TileType.FOX_WEDDING) > 0 ? '可触发' : '已结束 / 未放置';
}
