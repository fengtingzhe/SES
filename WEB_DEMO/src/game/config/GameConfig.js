export const GameConfig = {
  version: 'WEB_DEMO v1.0-fix-1',

  map: {
    width: 74,
    height: 54,
    start: { x: 5, y: 27 },
    goal: { x: 68, y: 27 },
    seed: 2077
  },

  player: {
    speed: 4.2,
    initialFacing: { x: 1, y: 0 },
    invertedExitGraceSeconds: 0.3
  },

  resource: {
    initialStone: 6,
    placedStoneLife: 10,
    pickupRadius: 0.8,
    droppedStoneLife: 10
  },

  population: {
    initialWorkers: 2,
    recruitCost: 1,
    refugeeFireCooldown: 10,
    refugeeSpeed: 1.75,
    conversionCost: 1
  },

  worker: {
    speed: 2.25,
    workDuration: 4,
    threatRange: 3,
    resumeThreatRange: 4
  },

  mine: {
    productionSeconds: 30
  },

  wall: {
    maxHp: 3,
    attackSeconds: 1,
    attackDistance: 0.6
  },

  archer: {
    range: 5.5,
    aimSeconds: 0.6,
    cooldownSeconds: 2.2,
    damage: 1
  },

  events: {
    invertedForest: {
      radius: 3
    },
    foxWedding: {
      rewardStone: 4,
      durationSeconds: 13,
      moveCycleSeconds: 4,
      moveSeconds: 2.8,
      speed: 0.75,
      foxCount: 5,
      spacing: 0.8,
      maxDistance: 3.2,
      stopDistance: 3.5
    }
  },

  dayNight: {
    dayLength: 95,
    initialTime: 8,
    nightStartEarly: 0.08,
    duskStart: 0.52,
    nightStartLate: 0.66
  },

  monster: {
    perNight: 2,
    spawnInterval: 3,
    maxActiveBeforePause: 5,
    tacticalRange: 4,
    targetLockSeconds: 1.2,
    speed: 1.6,
    hitDistance: 0.35,
    campStopDistance: 0.25,
    hp: 1,
    playerInvulnerableSeconds: 1.6
  },

  home: {
    startId: 'home-start'
  },

  vision: {
    playerRadius: 6,
    startRadius: 5
  },

  camera: {
    tileSize: 28,
    zoom: 1.15,
    follow: 0.08,
    miniMapSize: 140
  },

  messageSeconds: 2.2
};
