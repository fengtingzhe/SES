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
    workers: [
      createWorker(1, GameConfig.map.start.x, GameConfig.map.start.y - 1, startHome.id),
      createWorker(2, GameConfig.map.start.x, GameConfig.map.start.y + 1, startHome.id)
    ],
    player: {
      x: GameConfig.map.start.x,
      y: GameConfig.map.start.y,
      facing: { ...GameConfig.player.initialFacing }
    },
    resources: {
      stone: GameConfig.resource.initialStone
    },
    population: {
      initialWorkers: GameConfig.population.initialWorkers
    },
    camera: {
      x: 0,
      y: 0
    },
    hover: null,
    message: {
      text: 'v0.3-refactor：自动拾取与派工建设已启动。',
      ttl: GameConfig.messageSeconds
    }
  };
}

function createWorker(id, x, y, homeId) {
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
    lost: false
  };
}
