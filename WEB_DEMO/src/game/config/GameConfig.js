export const GameConfig = {
  version: 'WEB_DEMO v1.1-weather-event',

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

  weather: {
    // 每个游戏日进入白天后只判定一次天气；数值越高，旅途中越常出现天气变化。
    dailyChance: 0.45,
    // 天气判定阶段。当前昼夜系统的白天阶段为 day，避免夜晚和黄昏重复 roll。
    rollPhase: 'day',
    // 天气随机种子；用于让开发验证时的天气序列可复现。
    seed: 9317,
    types: {
      rain: {
        name: '雨',
        weight: 40,
        // 单次天气持续时间范围，单位：秒。只影响天气状态和条件事件窗口。
        durationSeconds: [35, 70],
        tags: ['wet', 'low_visibility']
      },
      snow: {
        name: '雪',
        weight: 25,
        durationSeconds: [35, 70],
        tags: ['cold', 'slow']
      },
      wind: {
        name: '大风',
        weight: 35,
        durationSeconds: [25, 55],
        tags: ['windy', 'unstable']
      }
    }
  },

  weatherEvents: {
    // 条件事件检查间隔，单位：秒。避免满足条件时每帧重复 roll。
    checkIntervalSeconds: 6,
    // 判断玩家所在区域时扫描的附近格范围。半径越大，事件越容易识别到周边区域标签。
    regionScanRadius: 1,
    // 天气事件生成点搜索半径，单位：格。只寻找玩家附近可通行空地。
    spawnSearchRadius: 4,
    // 条件事件随机种子，仅用于事件概率判定。
    seed: 4207,
    rules: [
      {
        id: 'rain_forest_test_refugee',
        regionTag: 'forest',
        weather: 'rain',
        chance: 0.25,
        eventId: 'rainRefugee',
        cooldownDays: 1
      }
    ]
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
