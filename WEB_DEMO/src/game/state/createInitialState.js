import { GameConfig } from '../config/GameConfig.js';
import { MapGenerator } from '../world/MapGenerator.js';

export function createInitialState() {
  const generator = new MapGenerator(GameConfig.map);
  const world = generator.generate();

  return {
    version: GameConfig.version,
    world,
    player: {
      x: GameConfig.map.start.x,
      y: GameConfig.map.start.y,
      facing: { ...GameConfig.player.initialFacing }
    },
    resources: {
      stone: GameConfig.resource.initialStone
    },
    population: {
      reservedWorkers: GameConfig.population.reservedWorkers
    },
    camera: {
      x: 0,
      y: 0
    },
    hover: null,
    message: {
      text: 'v0.2-refactor：最小工程骨架已启动。',
      ttl: GameConfig.messageSeconds
    }
  };
}
