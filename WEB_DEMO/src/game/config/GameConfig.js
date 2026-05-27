export const GameConfig = {
  // 当前 WEB_DEMO 版本号，只用于 HUD、文档核对和本地验收提示；属于程序常量。
  version: 'WEB_DEMO v1.2-config-prep',

  map: {
    // 地图宽度，单位：格。影响世界尺寸、寻路范围和小地图比例；调整会改变整张地图结构。
    width: 74,
    // 地图高度，单位：格。影响世界尺寸、寻路范围和小地图比例；调整会改变整张地图结构。
    height: 54,
    // 玩家、起始营地和初始视野中心，单位：格坐标。改动风险高，会影响开局所有工作点布局。
    start: { x: 5, y: 27 },
    // 终点灯塔位置，单位：格坐标。用于胜利目标和小地图标记。
    goal: { x: 68, y: 27 },
    // 地图生成随机种子。用于稳定主路、分支、河流和资源散点；调参时会整体改变关卡。
    seed: 2077,

    generation: {
      path: {
        // 主路开始随机上下摆动的 x 阈值，单位：格。过早摆动会影响新手区稳定性。
        wanderStartX: 8,
        // 主路靠近终点前停止随机摆动的尾部距离，单位：格。
        goalPadding: 2,
        // 主路每隔多少列尝试一次上下摆动，单位：格。
        wanderEvery: 3,
        // 主路上下摆动的随机取值数量，当前 3 表示 -1/0/+1。
        yRandomChoices: 3,
        // 主路上下摆动随机值的偏移量，当前配合 3 得到 -1/0/+1。
        yDeltaOffset: 1,
        // 主路最低 y 坐标，单位：格。避免主路贴近地图边缘。
        minY: 8,
        // 主路最高 y 坐标使用 height - maxYMargin 计算，单位：格。
        maxYMargin: 9,
        // 主路横向铺开的半径，单位：格。当前会铺出 3 格宽主路。
        laneRadius: 1,
        // 主路每隔多少列额外开一个侧向地块，单位：格。
        sideEvery: 6,
        // 侧向地块向上或向下的概率阈值。
        sideChance: 0.5,
        // 侧向地块距离主路中心的偏移，单位：格。
        sideOffset: 2
      },

      branches: {
        // 地图分支数量，单位：条。过多会降低路线可读性。
        count: 8,
        // 分支锚点从主路第几个点后开始抽取，单位：主路径下标。
        anchorStart: 8,
        // 分支锚点避开主路尾部的距离，单位：主路径下标。
        anchorEndPadding: 16,
        // 分支向上或向下延展的概率阈值。
        directionChance: 0.5,
        // 单条分支最短长度，单位：步。
        minLength: 4,
        // 单条分支额外随机长度取值数量，当前形成 4 到 11 步。
        lengthRandomChoices: 8,
        // 分支 x 方向随机取值数量，当前配合偏移量形成 -1/0/+1。
        xRandomChoices: 3,
        // 分支 x 方向随机值偏移量。
        xDeltaOffset: 1,
        // 分支最低 x 坐标，单位：格。
        minX: 4,
        // 分支最高 x 坐标使用 width - maxXMargin 计算，单位：格。
        maxXMargin: 5,
        // 分支每步沿 y 方向推进的概率阈值。
        yStepChance: 0.75,
        // 分支最低 y 坐标，单位：格。
        minY: 5,
        // 分支最高 y 坐标使用 height - maxYMargin 计算，单位：格。
        maxYMargin: 6,
        // 分支额外横向铺开的宽度，单位：格。
        widthExtraX: 1,
        // 分支每隔多少步额外开一个旁路地块。
        extraEvery: 3
      },

      rivers: {
        // 河流基础 x 坐标数组，单位：格。每条河会在此基础上轻随机偏移。
        baseXs: [22, 45],
        // 河流 x 偏移随机取值数量，当前表示 0 到 2。
        xRandomChoices: 3,
        // 河流开始 y 坐标，单位：格。
        minY: 3,
        // 河流结束 y 坐标使用 height - maxYMargin 计算，单位：格。
        maxYMargin: 3
      },

      placement: {
        // 特殊点贴近主路放置时的最低 y 坐标，单位：格。
        minY: 4,
        // 特殊点贴近主路放置时的最高 y 坐标使用 height - maxYMargin 计算。
        maxYMargin: 5,
        // 普通特殊点寻找附近空地的搜索半径，单位：格。
        normalSearchRadius: 6,
        // 要求可从起点到达的特殊点搜索半径，单位：格。
        reachableSearchRadius: 12
      },

      specialSites: {
        // 颠倒森林中心锚点，pathIndex 为主路下标，offsetY 为相对主路 y 偏移。
        invertedForests: [
          { pathIndex: 10, offsetY: -5 },
          { pathIndex: 50, offsetY: -4 }
        ],
        // 狐狸婚仪事件点锚点，单位同上。
        foxWedding: { pathIndex: 27, offsetY: -5 },
        // 旧火塘事件点锚点，单位同上。
        oldFirepit: { pathIndex: 31, offsetY: 2 },
        // 雾门锚点列表，单位同上；会影响夜晚黑影来源。
        fogGates: [
          { pathIndex: 36, offsetY: -4 },
          { pathIndex: 48, offsetY: 5 }
        ],
        // 初始流民火堆锚点列表，单位同上；requireStartPath 表示必须能从起点寻路到达。
        refugeeFires: [
          { pathIndex: 16, offsetY: 4, requireStartPath: true },
          { pathIndex: 30, offsetY: 4, requireStartPath: true }
        ]
      },

      startArea: {
        // 起点安全区左上角相对起点偏移，单位：格。
        offsetMin: { x: -3, y: -4 },
        // 起点安全区右下角相对起点偏移，单位：格。
        offsetMax: { x: 5, y: 4 },
        // 初始矿山相对起点偏移，单位：格。
        mineOffset: { x: 2, y: 0 },
        // 工人屋相对营地偏移，单位：格。
        workerHutOffset: { x: 1, y: 2 },
        // 弓箭手营相对营地偏移，单位：格。
        archerCampOffset: { x: 3, y: 2 },
        // 围墙基座相对营地偏移数组，单位：格。
        wallBaseOffsets: [
          { x: 4, y: 1 },
          { x: -2, y: 1 }
        ],
        // 起点附近可砍树点相对起点偏移数组，单位：格。
        treeOffsets: [
          { x: 3, y: -2 },
          { x: 4, y: -2 },
          { x: 4, y: 2 }
        ]
      },

      starterStones: {
        // 起点旁第一颗辉石相对起点偏移，单位：格。
        firstOffset: { x: 1, y: 0 },
        // 固定辉石沿主路的下标数组，单位：主路径下标。
        fixedPathIndexes: [10, 15, 24, 34, 43, 52],
        // 固定辉石相对主路上下交错的偏移，单位：格。
        fixedSideOffset: 2,
        // 第一颗固定辉石的数量，单位：个。
        firstFixedValue: 2,
        // 其他固定辉石的数量，单位：个。
        fixedValue: 1,
        // 随机散落辉石尝试数量，单位：次。
        randomCount: 16,
        // 随机辉石最低 x 坐标，单位：格。
        randomMinX: 6,
        // 随机辉石最高 x 坐标使用 width - randomMaxXMargin 计算。
        randomMaxXMargin: 12,
        // 随机辉石最低 y 坐标，单位：格。
        randomMinY: 5,
        // 随机辉石最高 y 坐标使用 height - randomMaxYMargin 计算。
        randomMaxYMargin: 10,
        // 随机辉石默认数量，单位：个。
        randomValue: 1
      }
    }
  },

  player: {
    // 玩家移动速度，单位：格/秒。影响探索、躲避和事件跟随手感。
    speed: 4.2,
    // 玩家初始朝向。影响开局 Space 面前优先互动目标。
    initialFacing: { x: 1, y: 0 },
    // 颠倒森林离开后的状态迟滞时间，单位：秒。过低会让边界状态抖动。
    invertedExitGraceSeconds: 0.3
  },

  resource: {
    // 开局辉石数量，单位：个。影响早期派工、招募和容错。
    initialStone: 6,
    // 单颗辉石默认数量，单位：个。用于自然拾取、临时放置和掉落兜底。
    defaultStoneValue: 1,
    // 玩家主动放置的临时辉石数量，单位：个。
    placedStoneValue: 1,
    // 砍树完成后掉落的辉石数量，单位：个。
    treeChopDropStone: 1,
    // 主动放置辉石的存在时间，单位：秒。影响黑影诱导窗口。
    placedStoneLife: 10,
    // 自然掉落辉石的存在时间，单位：秒。
    droppedStoneLife: 10,
    // 自然辉石自动拾取半径，单位：格。临时辉石不走自动拾取。
    pickupRadius: 0.8,
    // 主动放置辉石时寻找空地的半径，单位：格。
    placeSearchRadius: 2,
    // 系统掉落辉石时寻找附近空地的半径，单位：格。
    dropSearchRadius: 2
  },

  worker: {
    // 工人移动速度，单位：格/秒。影响派工效率、返程和逃跑时间。
    speed: 2.25,
    // 默认工作时长，单位：秒。砍树、修桥、建营地、建墙默认共用。
    workDuration: 4,
    // 夜晚工人感知黑影并撤退的范围，单位：格。
    threatRange: 3,
    // 采矿工人自动复工前检查矿山安全的范围，单位：格。
    resumeThreatRange: 4,
    // 工人接近路径节点后视为到达的距离，单位：格；属于程序常量。
    arrivalDistance: 0.05
  },

  job: {
    // 任务辉石成本，单位：个。属于策划参数，改动会直接影响经济节奏。
    costs: {
      chop: 1,
      repair: 2,
      camp: 2,
      mine: 0,
      wall: 2
    },
    // 任务耗时，单位：秒。mine 为持续产出型任务，不使用一次性工作时长。
    durations: {
      chop: 4,
      repair: 4,
      camp: 4,
      mine: 0,
      wall: 4
    }
  },

  population: {
    // 开局工人数量，单位：人。需要与 createInitialState 的初始工人列表保持一致。
    initialWorkers: 2,
    // 开局工人相对起点的出生偏移，单位：格；当前长度应与 initialWorkers 保持一致。
    initialWorkerOffsets: [
      { x: 0, y: -1 },
      { x: 0, y: 1 }
    ],
    // 招募流民消耗辉石，单位：个。
    recruitCost: 1,
    // 流民火堆被招募后的冷却时间，单位：秒。
    refugeeFireCooldown: 10,
    // 返程流民移动速度，单位：格/秒。
    refugeeSpeed: 1.75,
    // 待转职人口转为工人或弓箭手的成本，单位：个辉石。
    conversionCost: 1
  },

  mine: {
    // 矿山产出周期，单位：秒。当前约 30 秒产出一次。
    productionSeconds: 30,
    // 每次矿山产出的辉石数量，单位：个。
    outputStone: 1
  },

  wall: {
    // 围墙最大生命值，单位：HP。当前黑影每次攻击造成 1 点伤害。
    maxHp: 3,
    // 黑影攻击围墙的间隔，单位：秒。
    attackSeconds: 1,
    // 黑影开始攻击围墙的距离，单位：格。
    attackDistance: 0.6,
    // 黑影每次攻击围墙造成的伤害，单位：HP。
    damagePerMonsterHit: 1
  },

  archer: {
    // 弓箭手索敌射程，单位：格。
    range: 5.5,
    // 弓箭手锁定目标后的瞄准时间，单位：秒。
    aimSeconds: 0.6,
    // 弓箭手射击后的冷却时间，单位：秒。
    cooldownSeconds: 2.2,
    // 单次射击伤害，单位：HP。当前黑影 HP 为 1，因此一箭击杀。
    damage: 1
  },

  monster: {
    // 每晚计划生成的黑影数量，单位：个。
    perNight: 2,
    // 黑影生成间隔，单位：秒。
    spawnInterval: 3,
    // 场上黑影达到该数量后暂停继续生成，单位：个。
    maxActiveBeforePause: 5,
    // 黑影局部战术感知范围，单位：格。当前核心规则为 4 格感知。
    tacticalRange: 4,
    // 黑影切换非营地目标前的锁定时间，单位：秒。
    targetLockSeconds: 1.2,
    // 黑影移动速度，单位：格/秒。
    speed: 1.6,
    // 黑影命中玩家、工人、弓箭手或辉石的距离，单位：格。
    hitDistance: 0.35,
    // 黑影推进到营地附近后停止的距离，单位：格。
    campStopDistance: 0.25,
    // 黑影生命值，单位：HP。与 archer.damage 共同决定击杀箭数。
    hp: 1,
    // 玩家被黑影袭击时损失的辉石数量，单位：个。
    playerStoneLoss: 1,
    // 玩家被黑影袭击后的无敌时间，单位：秒。
    playerInvulnerableSeconds: 1.6,
    // 非围墙目标移动接近阈值，单位：格；属于程序常量。
    moveEpsilon: 0.05,
    // 通用归一化保护阈值，单位：格；属于程序常量。
    normalizeEpsilon: 0.001
  },

  dayNight: {
    // 一天总时长，单位：秒。
    dayLength: 95,
    // 开局时间偏移，单位：秒。用于避免开局立刻处于夜晚。
    initialTime: 8,
    // 昼夜进度小于该比例也判定为夜晚，用于跨日后的凌晨。
    nightStartEarly: 0.08,
    // 黄昏开始比例，取值 0 到 1。
    duskStart: 0.52,
    // 夜晚开始比例，取值 0 到 1。
    nightStartLate: 0.66
  },

  weather: {
    // 每个游戏日进入判定阶段后只判定一次天气；数值越高，天气越常出现。
    dailyChance: 0.45,
    // 天气判定阶段。当前昼夜系统的白天阶段为 day，避免夜晚和黄昏重复 roll。
    rollPhase: 'day',
    // 天气随机种子；用于让开发验证时的天气序列可复现。
    seed: 9317,
    // 天气历史记录保留条数，单位：条；只影响调试和 HUD 扩展。
    historyLimit: 6,
    // 天气类型表。权重影响抽中概率，持续时间范围单位为秒，标签供后续事件条件使用。
    types: {
      rain: {
        name: '雨',
        weight: 40,
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
    // 判断玩家所在区域时扫描的附近格范围，单位：格。
    regionScanRadius: 1,
    // 天气事件生成点搜索半径，单位：格。只寻找玩家附近可通行空地。
    spawnSearchRadius: 4,
    // 条件事件随机种子，仅用于事件概率判定。
    seed: 4207,
    // 天气事件历史记录保留条数，单位：条；只影响调试和 HUD 扩展。
    historyLimit: 8,
    // 天气条件事件规则数组。WeatherSystem 只维护天气状态，事件由 WeatherEventSystem 按规则触发。
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

  events: {
    invertedForest: {
      // 颠倒森林半径，单位：格。
      radius: 3,
      // 圆形绘制额外包边，单位：格；属于地图形状程序常量。
      edgePadding: 0.3
    },
    foxWedding: {
      // 狐狸婚仪成功奖励辉石，单位：个。
      rewardStone: 4,
      // 狐狸婚仪总持续时间，单位：秒。
      durationSeconds: 13,
      // 狐狸队列移动/停顿循环周期，单位：秒。
      moveCycleSeconds: 4,
      // 每个周期内队伍移动的时长，单位：秒。
      moveSeconds: 2.8,
      // 狐狸队伍移动速度，单位：格/秒。
      speed: 0.75,
      // 狐狸队伍成员数量，单位：只。
      foxCount: 5,
      // 狐狸队伍成员间距，单位：格。
      spacing: 0.8,
      // 玩家距离队首超过该值会失败，单位：格。
      maxDistance: 3.2,
      // 狐狸停下时玩家若仍移动且距离小于该值会失败，单位：格。
      stopDistance: 3.5,
      // 狐狸队伍上下摆动频率，属于表现型程序常量。
      bobFrequency: 2,
      // 狐狸队伍上下摆动幅度，单位：格，属于表现型程序常量。
      bobAmplitude: 0.08
    }
  },

  home: {
    // 初始家园 id。用于工人、流民和寻家逻辑绑定；属于程序常量。
    startId: 'home-start'
  },

  entity: {
    // 初始实体 id 起点。当前 1、2 被开局两名工人占用；属于程序常量。
    initialNextEntityId: 3,
    // 黑影 id 初始值；属于程序常量。
    initialMonsterNextId: 1
  },

  interaction: {
    // Space 附近互动扫描半径，单位：格。
    scanRadius: 2,
    // 附近候选互动目标最大距离，单位：格。
    maxDistance: 1.7
  },

  vision: {
    // 玩家视野半径，单位：格。
    playerRadius: 6,
    // 起点和营地自动揭示半径，单位：格。
    startRadius: 5
  },

  camera: {
    // 单格基础像素尺寸，单位：px。影响主画面缩放和菱形网格大小。
    tileSize: 28,
    // 主画面缩放倍率。调高会拉近视角。
    zoom: 1.15,
    // 镜头跟随插值系数，取值越高跟随越快。
    follow: 0.08,
    // 小地图最大尺寸，单位：px。
    miniMapSize: 140
  },

  ui: {
    // 初始是否显示小地图。
    initialShowMiniMap: true,
    // HUD 坐标显示的小数位数。
    positionDecimals: 1,
    // HUD 辅助提示使用的距离阈值，单位：格。
    assistHintDistances: {
      naturalStone: 1.6,
      placedStone: 1.7,
      fogGate: 3.2,
      goal: 2.4
    },
    // 世界画面内短标签显示距离，单位：格；只影响可读性提示，不改变交互范围。
    worldLabelDistances: {
      stone: 2.2
    }
  },

  message: {
    // Toast 消息默认显示时长，单位：秒。
    ttlSeconds: 2.2,
    // 新开局初始提示文本。只影响 UI 展示，不影响玩法规则。
    initialText: 'v1.2-config-prep：GameConfig 整理与配置化准备。'
  },

  app: {
    // 单帧最大模拟时间，单位：秒。避免切后台后一次性推进过多逻辑。
    maxFrameDeltaSeconds: 0.05
  }
};
