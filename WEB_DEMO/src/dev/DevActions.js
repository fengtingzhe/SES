import { GameConfig } from '../game/config/GameConfig.js';
import { createArcher, createWorker } from '../game/state/createInitialState.js';
import { TileType } from '../game/world/TileMap.js';

export function runDevAction(actionId, context) {
  const action = DEV_ACTIONS[actionId];
  if (!action) {
    context.showMessage(`Dev：未实现调试命令 ${actionId}。`);
    return false;
  }

  const message = action(context);
  if (message) context.showMessage(message);
  return true;
}

const DEV_ACTIONS = {
  'resources:addStone1': ({ state }) => {
    state.resources.stone += 1;
    return 'Dev：辉石 +1。';
  },
  'resources:addStone5': ({ state }) => {
    state.resources.stone += 5;
    return 'Dev：辉石 +5。';
  },
  'resources:removeStone1': ({ state }) => {
    state.resources.stone = Math.max(0, state.resources.stone - 1);
    return 'Dev：辉石 -1。';
  },
  'resources:clearStone': ({ state }) => {
    state.resources.stone = 0;
    return 'Dev：辉石已清零。';
  },
  'resources:spawnNaturalStone': ({ state }) => {
    const point = findNearbyGround(state);
    if (!point) return 'Dev：附近没有可放置自然辉石的地面。';
    state.world.map.setStone(point.x, point.y, GameConfig.resource.defaultStoneValue, null, false);
    return 'Dev：已在附近生成自然辉石。';
  },
  'resources:spawnPlacedStone': ({ state }) => {
    const point = findNearbyGround(state);
    if (!point) return 'Dev：附近没有可放置临时辉石的地面。';
    state.world.map.setStone(
      point.x,
      point.y,
      GameConfig.resource.placedStoneValue,
      GameConfig.resource.placedStoneLife,
      true
    );
    return 'Dev：已在附近生成临时辉石。';
  },
  'time:setDay': ({ state }) => {
    setPhase(state, 'day');
    return 'Dev：时间切到白天。';
  },
  'time:setDusk': ({ state }) => {
    setPhase(state, 'dusk');
    return 'Dev：时间切到黄昏。';
  },
  'time:setNight': ({ state }) => {
    setPhase(state, 'night');
    state.monsterSpawn.spawnedThisNight = 0;
    state.monsterSpawn.cooldown = 0;
    return 'Dev：时间切到黑夜，黑影计数已重置。';
  },
  'time:nextDay': ({ state }) => {
    const nextDayIndex = state.time.day;
    state.time.elapsed = nextDayIndex * GameConfig.dayNight.dayLength + GameConfig.dayNight.initialTime;
    state.time.day = nextDayIndex + 1;
    state.time.phase = 'day';
    state.time.wasNight = false;
    state.weather.dayRolled = 0;
    return 'Dev：已推进到下一天白天。';
  },
  'weather:rain': ({ state, weatherSystem }) => {
    weatherSystem.startWeather(state, 'rain');
    return null;
  },
  'weather:snow': ({ state, weatherSystem }) => {
    weatherSystem.startWeather(state, 'snow');
    return null;
  },
  'weather:wind': ({ state, weatherSystem }) => {
    weatherSystem.startWeather(state, 'wind');
    return null;
  },
  'weather:clear': ({ state }) => {
    Object.assign(state.weather, { current: null, remaining: 0, duration: 0 });
    return 'Dev：天气已清除。';
  },
  'weather:checkEventNow': ({ state, weatherEventSystem }) => {
    if (!state.weather.current) return 'Dev：当前没有天气，条件事件不会触发。';
    const previousEvent = state.weatherEvents.lastEvent;
    state.weatherEvents.checkTimer = GameConfig.weatherEvents.checkIntervalSeconds;
    weatherEventSystem.update(state, 0);
    return state.weatherEvents.lastEvent !== previousEvent
      ? 'Dev：天气事件已触发。'
      : 'Dev：已立即判定天气事件，本次未触发。';
  },
  'units:spawnWorker': ({ state, campSystem }) => {
    const point = findNearbyGround(state);
    if (!point) return 'Dev：附近没有可生成工人的地面。';
    const home = campSystem.nearestHome(state, point);
    state.workers.push(createWorker(state.nextEntityId, point.x, point.y, home.id));
    state.nextEntityId += 1;
    return 'Dev：已生成 1 名工人。';
  },
  'units:addUnassigned': ({ state, campSystem }) => {
    const home = campSystem.nearestHome(state, state.player);
    state.population.unassigned.push({ x: home.x, y: home.y });
    return 'Dev：待转职人口 +1。';
  },
  'units:spawnArcher': ({ state, campSystem }) => {
    const point = findNearbyGround(state);
    if (!point) return 'Dev：附近没有可生成弓箭手的地面。';
    const home = campSystem.nearestHome(state, point);
    state.archers.push(createArcher(state.nextEntityId, point.x, point.y, home.id));
    state.nextEntityId += 1;
    return 'Dev：已生成 1 名弓箭手。';
  },
  'units:spawnMonster': ({ state, campSystem }) => {
    const point = findNearbyGround(state);
    if (!point) return 'Dev：附近没有可生成黑影的地面。';
    state.monsters.push(createMonster(state, point, campSystem.nearestHome(state, point)));
    state.monsterSpawn.nextId += 1;
    return 'Dev：已生成 1 个黑影。';
  },
  'units:clearMonsters': ({ state }) => {
    state.monsters = [];
    state.monsterSpawn.cooldown = 0;
    return 'Dev：已清除场上黑影。';
  },
  'units:returnWorkers': ({ state, workerSystem }) => {
    let count = 0;
    for (const worker of state.workers) {
      if (worker.lost) continue;
      workerSystem.releaseWorkerTask(state, worker);
      workerSystem.returnHome(state, worker);
      count += 1;
    }
    return `Dev：已召回 ${count} 名可用工人。`;
  },
  'events:spawnRefugeeFire': ({ state }) => {
    const point = placeTileNearPlayer(state, TileType.REFUGEE_FIRE, {
      refugee: { available: true, cooldown: 0 },
      regionTag: 'forest'
    });
    return point ? 'Dev：已生成流民火堆。' : 'Dev：附近没有可生成流民火堆的地面。';
  },
  'events:startFoxWedding': ({ state, specialEventSystem }) => {
    const point = findTile(state, tile => tile.type === TileType.FOX_WEDDING)
      ?? placeTileNearPlayer(state, TileType.FOX_WEDDING, {
        event: { type: 'foxWedding', completed: false },
        regionTag: 'forest'
      });
    if (!point) return 'Dev：附近没有可生成狐狸成亲事件点的地面。';
    specialEventSystem.startFoxWedding(state, point);
    return null;
  },
  'events:completeFoxWedding': ({ state, specialEventSystem }) => {
    if (!state.events.foxWedding.active) return 'Dev：狐狸成亲事件当前未进行。';
    specialEventSystem.endFoxWedding(state, true);
    return null;
  },
  'events:failFoxWedding': ({ state, specialEventSystem }) => {
    if (!state.events.foxWedding.active) return 'Dev：狐狸成亲事件当前未进行。';
    specialEventSystem.endFoxWedding(state, false);
    return null;
  },
  'events:spawnFog': ({ state }) => {
    const point = placeTileNearPlayer(state, TileType.FOG, { regionTag: 'forest' });
    return point ? 'Dev：已生成雾门。' : 'Dev：附近没有可生成雾门的地面。';
  },
  'events:spawnMine': ({ state }) => {
    const point = placeTileNearPlayer(state, TileType.MINE, {
      mine: { workerId: null },
      regionTag: 'forest'
    });
    return point ? 'Dev：已生成矿山。' : 'Dev：附近没有可生成矿山的地面。';
  },
  'events:spawnInvertedForest': ({ state }) => {
    const center = findNearbyGround(state);
    if (!center) return 'Dev：附近没有可生成颠倒森林的地面。';
    paintInvertedForest(state, center);
    return 'Dev：已生成小片颠倒森林。';
  },
  'events:completeGoal': ({ state }) => {
    state.status = 'completed';
    state.completion = { type: 'devConsole', day: state.time.day };
    return 'Dev：已直接完成当前旅程目标。';
  },
  'events:resetGame': ({ resetGame }) => {
    resetGame();
    return 'Dev：已重置游戏。';
  }
};

function setPhase(state, phase) {
  const dayIndex = Math.max(0, state.time.day - 1);
  const ratioByPhase = {
    day: Math.max(GameConfig.dayNight.nightStartEarly + 0.04, 0.12),
    dusk: (GameConfig.dayNight.duskStart + GameConfig.dayNight.nightStartLate) / 2,
    night: Math.min(GameConfig.dayNight.nightStartLate + 0.05, 0.9)
  };

  state.time.elapsed = dayIndex * GameConfig.dayNight.dayLength +
    ratioByPhase[phase] * GameConfig.dayNight.dayLength;
  state.time.day = dayIndex + 1;
  state.time.phase = phase;
  state.time.wasNight = phase === 'night';
}

function createMonster(state, point, raidCamp) {
  return {
    id: state.monsterSpawn.nextId,
    x: point.x,
    y: point.y,
    hp: GameConfig.monster.hp,
    attackTimer: 0,
    attacking: false,
    returning: false,
    raidCamp,
    targetKey: null,
    targetLock: 0,
    dead: false
  };
}

function findNearbyGround(state, maxRadius = 5) {
  const map = state.world.map;
  const origin = {
    x: Math.round(state.player.x),
    y: Math.round(state.player.y)
  };

  for (let radius = 0; radius <= maxRadius; radius += 1) {
    for (let y = origin.y - radius; y <= origin.y + radius; y += 1) {
      for (let x = origin.x - radius; x <= origin.x + radius; x += 1) {
        if (Math.max(Math.abs(x - origin.x), Math.abs(y - origin.y)) !== radius) continue;
        const tile = map.cell(x, y);
        if (tile?.type === TileType.GROUND && !tile.reserved) return { x, y };
      }
    }
  }

  return null;
}

function placeTileNearPlayer(state, type, extra = {}) {
  const point = findNearbyGround(state);
  if (!point) return null;
  state.world.map.setTile(point.x, point.y, type, extra);
  return point;
}

function findTile(state, predicate) {
  let result = null;
  state.world.map.forEach((tile, x, y) => {
    if (!result && predicate(tile, x, y)) result = { x, y };
  });
  return result;
}

function paintInvertedForest(state, center) {
  const map = state.world.map;
  const radius = Math.min(2, GameConfig.events.invertedForest.radius);

  for (let y = center.y - radius; y <= center.y + radius; y += 1) {
    for (let x = center.x - radius; x <= center.x + radius; x += 1) {
      const tile = map.cell(x, y);
      if (!tile || tile.type !== TileType.GROUND) continue;
      if (Math.hypot(x - center.x, y - center.y) > radius + GameConfig.events.invertedForest.edgePadding) continue;
      map.setTile(x, y, TileType.INVERTED_FOREST, {
        invertLabel: x === center.x && y === center.y,
        regionTag: 'invertedForest'
      });
    }
  }
}
