import { GameConfig } from '../config/GameConfig.js';
import { CampSystem } from '../systems/CampSystem.js';
import { MapGenerator } from '../world/MapGenerator.js';

export function createInitialState() {
  const generator = new MapGenerator(GameConfig.map);
  const world = generator.generate();
  const campSystem = new CampSystem();
  const startHome = campSystem.createStartHome();

  return {
    version: GameConfig.version,
    world,
    homes: [startHome],
    monsters: [],
    refugees: [],
    archers: [],
    nextEntityId: 3,
    monsterSpawn: {
      spawnedThisNight: 0,
      cooldown: 0,
      nextId: 1
    },
    status: 'playing',
    time: {
      elapsed: GameConfig.dayNight.initialTime,
      day: 1,
      phase: 'day',
      wasNight: false
    },
    workers: [
      createWorker(1, GameConfig.map.start.x, GameConfig.map.start.y - 1, startHome.id),
      createWorker(2, GameConfig.map.start.x, GameConfig.map.start.y + 1, startHome.id)
    ],
    player: {
      x: GameConfig.map.start.x,
      y: GameConfig.map.start.y,
      facing: { ...GameConfig.player.initialFacing },
      invulnerable: 0
    },
    resources: {
      stone: GameConfig.resource.initialStone
    },
    population: {
      initialWorkers: GameConfig.population.initialWorkers,
      unassigned: []
    },
    camera: {
      x: 0,
      y: 0
    },
    hover: null,
    message: {
      text: 'v0.7-refactor：流民、人口池与职业转换迁移中。',
      ttl: GameConfig.messageSeconds
    }
  };
}

export function createWorker(id, x, y, homeId) {
  return {
    id,
    x,
    y,
    homeId,
    state: 'idle',
    job: null,
    path: [],
    pathIndex: 0,
    progress: 0,
    carry: 0,
    lost: false,
    flee: false,
    interruptedJob: null
  };
}

export function createArcher(id, x, y, homeId) {
  return {
    id,
    x,
    y,
    homeId,
    state: 'idle',
    lost: false
  };
}
