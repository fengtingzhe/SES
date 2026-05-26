export const GameConfig = {
  version: 'WEB_DEMO v0.2-refactor',

  map: {
    width: 74,
    height: 54,
    start: { x: 5, y: 27 },
    goal: { x: 68, y: 27 },
    seed: 2077
  },

  player: {
    speed: 4.2,
    initialFacing: { x: 1, y: 0 }
  },

  resource: {
    initialStone: 6,
    placedStoneLife: 10
  },

  population: {
    reservedWorkers: 2
  },

  vision: {
    playerRadius: 6,
    startRadius: 5
  },

  camera: {
    tileSize: 28,
    zoom: 1.15,
    follow: 0.08
  },

  messageSeconds: 2.2
};
