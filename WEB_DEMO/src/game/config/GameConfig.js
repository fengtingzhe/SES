import { TILE_TYPES } from '../world/TileMap.js';

/**
 * GameConfig 是 WEB_DEMO 当前阶段的统一静态配置中心。
 *
 * 当前定位：
 * 1. 先集中管理数值、文案、生成区间和基础规则，避免继续散落在系统代码中。
 * 2. 暂不读取 CSV / JSON；未来核心系统稳定后，再把这里拆分成策划表或 JSON 配置。
 * 3. 后续新增系统时，静态配置必须优先写入本文件，并补充中文注释。
 */
export const GameConfig = {
  // 当前 Web Demo 展示版本号。会显示在 HUD 上；改动时应同步 changelog。
  version: 'WEB_DEMO v0.6',

  /**
   * 玩家相关配置：控制主角移动、拾取范围和抵达目标判定。
   * 这些参数直接影响基础手感，调参时需要试玩确认移动是否顺滑、拾取是否过宽或过窄。
   */
  player: {
    // 玩家移动速度，单位：格 / 秒。数值越大移动越快；过高会导致穿越窄路时不精确。
    moveSpeed: 4.2,

    // 自动拾取辉石的判定半径，单位：格。数值过大时会让拾取缺少“靠近”的感觉。
    pickupRadius: 0.65,

    // 抵达阶段目标的判定半径，单位：格。数值越大越容易触发终点提示。
    goalRadius: 0.75
  },

  /**
   * 工人相关配置：控制初始工人数、移动速度、状态字符串和出生偏移。
   * 工人速度会影响任务等待时间和远征节奏，后续新增职业也应从这里扩展。
   */
  worker: {
    // 初始工人数量，单位：个。数量越多，开局推进能力越强。
    initialCount: 3,

    // 工人前往任务目标时的移动速度，单位：格 / 秒。过慢会拖长等待，过快会削弱派遣感。
    moveSpeed: 2.0,

    // 工人完成任务后返回营地的移动速度，单位：格 / 秒。略高可减少回收等待。
    returnSpeed: 2.25,

    // 工人状态字符串，显示在单位标签和 HUD 统计中；改名会影响调试观察。
    states: {
      // 空闲，可被派遣。
      idle: 'idle',
      // 正在前往任务目标。
      moving: 'moving',
      // 正在执行任务，有工作进度条。
      working: 'working',
      // 任务完成后返回部落或营地。
      returning: 'returning'
    },

    // 工人出生点相对部落中心的偏移，单位：格。数量应不少于 initialCount。
    spawnOffsets: [
      { x: -0.7, y: -0.8 },
      { x: -0.8, y: 0.8 },
      { x: 0.7, y: 0.7 }
    ]
  },

  /**
   * 任务配置：控制 Space 派工后执行的基础工作。
   * cost 均表示消耗辉石数量；duration 单位均为秒；tile 字段对应 TileMap.js 中的 tile type。
   */
  jobs: {
    chop: {
      // 交互标签，显示在底部提示中。
      label: '砍树障',
      // 目标地块类型，对应 TileMap.js 的 TILE_TYPES.TREE_BLOCK。
      targetTile: TILE_TYPES.TREE_BLOCK,
      // 完成后地块类型，对应 TileMap.js 的 TILE_TYPES.GRASS。
      resultTile: TILE_TYPES.GRASS,
      // 派遣工人需要消耗的辉石数量。
      cost: 1,
      // 砍树工作时长，单位：秒。调大后开路节奏变慢。
      duration: 2.8,
      // 砍树完成后掉落的奖励辉石数量。
      rewardStone: 1,
      // 工人抵达目标并开始工作时显示的提示文案。
      startMessage: '工人开始砍树。',
      // 任务完成时显示的提示文案。
      finishMessage: '树障已清理，掉落 1 个辉石。'
    },

    repair: {
      // 交互标签，显示在底部提示中。
      label: '修桥',
      // 目标地块类型，对应 TileMap.js 的 TILE_TYPES.BROKEN_BRIDGE。
      targetTile: TILE_TYPES.BROKEN_BRIDGE,
      // 完成后地块类型，对应 TileMap.js 的 TILE_TYPES.BRIDGE。
      resultTile: TILE_TYPES.BRIDGE,
      // 派遣工人需要消耗的辉石数量。
      cost: 1,
      // 修桥工作时长，单位：秒。调大后过河节奏变慢。
      duration: 3.2,
      // 工人抵达目标并开始工作时显示的提示文案。
      startMessage: '工人开始修桥。',
      // 任务完成时显示的提示文案。
      finishMessage: '断桥已修复。'
    },

    lightCamp: {
      // 交互标签，显示在底部提示中。
      label: '点亮营地',
      // 目标地块类型，对应 TileMap.js 的 TILE_TYPES.OLD_CAMP。
      targetTile: TILE_TYPES.OLD_CAMP,
      // 完成后地块类型，对应 TileMap.js 的 TILE_TYPES.CAMP。
      resultTile: TILE_TYPES.CAMP,
      // 派遣工人需要消耗的辉石数量。
      cost: 1,
      // 点亮营地所需时间，单位：秒。调大后建立返回点更慢。
      duration: 3.0,
      // 工人抵达目标并开始工作时显示的提示文案。
      startMessage: '工人开始点亮营地。',
      // 任务完成时显示的提示文案。
      finishMessage: '新营地已点亮。'
    }
  },

  /**
   * 辉石配置：控制自然辉石、放置辉石和奖励辉石的数值。
   * 当前辉石是唯一资源，调大产出或延长持续时间会显著降低资源压力。
   */
  stone: {
    // 自然生成辉石的单颗价值，单位：辉石数量。
    naturalValue: 1,
    // 玩家主动放置辉石的单颗价值，单位：辉石数量。
    placedValue: 1,
    // 任务奖励辉石的默认单颗价值，单位：辉石数量。
    rewardValue: 1,
    // 放置辉石在地面保留的时间，单位：秒；数值越大，夜晚可诱敌窗口越长，但会降低黑影压力。
    placedTtl: 10
  },

  /**
   * 围墙系统配置：控制墙基布局、建墙成本、建造时间、生命值和摧毁后的反馈。
   * 围墙会改变营地周边的夜晚防御强度，成本或生命值过高会让黑影压力明显下降。
   */
  wall: {
    // 建造一段围墙需要消耗的辉石数量，单位：辉石数量。过低会让早期防御过快成型。
    buildCost: 2,
    // 建造围墙所需工作时间，单位：秒。过长会让建墙节奏拖沓，过短会削弱工人派遣风险。
    buildDuration: 4,
    // 围墙最大生命值，单位：HP。黑影攻击会扣除该值；数值越大，夜晚防御越稳。
    maxHp: 3,
    // 围墙被摧毁后是否恢复为墙基。true 表示玩家后续可以重建；false 会永久清空该防御点。
    restoreFoundationOnDestroy: true,
    // 墙基相对营地中心的固定偏移，单位：格。位置过密会堵路，过远会无法保护营地。
    foundationOffsets: [
      { x: -2, y: -1 },
      { x: -2, y: 1 },
      { x: 2, y: -1 },
      { x: 2, y: 1 }
    ]
  },

  /**
   * 弓箭手系统配置：控制招募入口、招募成本、射程、攻击频率和伤害。
   * 弓箭手是自动防守单位，射程或伤害过高会让黑影在靠近前被稳定清除。
   */
  archer: {
    // 招募一名弓箭手需要消耗的辉石数量，单位：辉石数量。过低会让防守人数膨胀过快。
    recruitCost: 2,
    // 弓箭手自动攻击范围，单位：格。过大会让防守覆盖全屏，过小会难以支援围墙。
    attackRange: 5,
    // 弓箭手攻击间隔，单位：秒。数值越小，射击越频繁，黑影承压越大。
    attackCooldown: 1.2,
    // 单次攻击造成的黑影伤害，单位：HP。过高会让黑影生命值配置失去意义。
    damage: 1,
    // 弓箭手生成点相对营地中心的偏移，单位：格。用于分散站位，避免单位重叠。
    spawnOffsets: [
      { x: -1.2, y: -1.2 },
      { x: -1.2, y: 1.2 },
      { x: 1.2, y: -1.2 },
      { x: 1.2, y: 1.2 }
    ],
    // 弓箭训练点相对营地中心的固定偏移，单位：格。位置过远会让招募入口不清晰。
    postOffsets: [
      { x: 0, y: -2 },
      { x: 0, y: 2 }
    ],
    // 训练点距离已激活营地多近才可使用，单位：格。过小会导致旧营地点亮后训练点失效。
    postActiveRange: 3
  },

  /**
   * 矿山系统配置：控制矿山生成、采矿派遣成本、采矿周期和单次产出。
   * 矿山会给玩家提供持续辉石来源，产出过快会削弱探索和防御取舍压力。
   */
  mine: {
    // 派遣工人占用矿山需要消耗的辉石数量，单位：辉石数量。过低会让持续资源过早启动。
    assignCost: 1,
    // 工人完成一次采矿所需时间，单位：秒。数值越大，矿山产出越慢。
    workDuration: 6,
    // 单次采矿产出的辉石数量，单位：辉石数量。过高会让后期资源膨胀。
    yieldStone: 1,
    // 地图生成的矿山最小数量，单位：个。过少会让资源补给不稳定。
    countMin: 1,
    // 地图生成的矿山最大数量，单位：个。过多会让玩家过早获得大量稳定收入。
    countMax: 2,
    // 矿山生成主路径索引最小值，单位：路径索引。过早会降低前期资源压力。
    indexMin: 14,
    // 矿山生成主路径索引最大值，单位：路径索引。过晚会让矿山很难参与中段循环。
    indexMax: 36,
    // 矿山之间的优先间距，单位：路径索引。过小会让资源点扎堆。
    spacing: 8,
    // 矿山与树障、河流、营地、终点的避让距离，单位：路径索引。
    reservedGap: 3,
    // 矿山相对主路径 y 坐标的候选偏移，单位：格。绝对值越大越靠近路边。
    yOffsetCandidates: [-3, -2, 2, 3]
  },

  /**
   * 流民系统配置：控制流民火堆生成、招募成本、返程速度和转化判定。
   * 流民是人口补给来源，成本过低或返程过快会显著降低工人损失的压力。
   */
  refugee: {
    // 招募一个流民需要消耗的辉石数量，单位：辉石数量。过低会让人口补给过强。
    recruitCost: 1,
    // 流民返回营地的移动速度，单位：格 / 秒。过低会让返程等待过长，过高会削弱远征风险。
    moveSpeed: 1.7,
    // 流民抵达营地并转化为工人的判定距离，单位：格。过大可能提前转化。
    arriveRange: 0.6,
    // 每个流民火堆初始流民数量最小值，单位：个。
    countPerCampMin: 1,
    // 每个流民火堆初始流民数量最大值，单位：个。过高会让人口补给过密。
    countPerCampMax: 2,
    // 地图生成流民火堆最小数量，单位：个。过少会让人口补给不稳定。
    fireCountMin: 1,
    // 地图生成流民火堆最大数量，单位：个。过多会削弱工人被抓的代价。
    fireCountMax: 2,
    // 流民火堆生成主路径索引最小值，单位：路径索引。过早会让人口补给太快出现。
    fireIndexMin: 10,
    // 流民火堆生成主路径索引最大值，单位：路径索引。过晚会让流民很难参与中段节奏。
    fireIndexMax: 34,
    // 流民火堆之间的优先间距，单位：路径索引。过小会让补给点扎堆。
    fireSpacing: 9,
    // 流民火堆与关键节点的避让距离，单位：路径索引。
    fireReservedGap: 3,
    // 流民火堆相对主路径 y 坐标的候选偏移，单位：格。
    fireYOffsetCandidates: [-3, -2, 2, 3]
  },

  /**
   * 人口系统配置：控制流民转化为工人时的出生位置和人口提示。
   * 这些参数影响新工人是否容易被玩家发现，以及补给是否会挤在营地中心。
   */
  population: {
    // 流民转化为工人时，是否生成在抵达营地附近。false 时会保留流民抵达位置。
    spawnAtCamp: true,
    // 新工人相对营地中心的出生偏移候选，单位：格。数量越多，新增工人越不容易重叠。
    workerSpawnOffsets: [
      { x: -0.7, y: -0.8 },
      { x: -0.8, y: 0.8 },
      { x: 0.7, y: 0.7 },
      { x: 0.8, y: -0.7 }
    ]
  },

  /**
   * 昼夜循环配置：控制一天时长、阶段比例和画面暗化。
   * end 为一天进度比例，取值范围 0～1；overlay 为暗化透明度，取值范围 0～1。
   */
  dayNight: {
    // 一天总时长，单位：秒。调大后昼夜变化更慢；调小会让阶段切换更频繁。
    dayLength: 72,
    // 阶段表按 end 从小到大排列；最后一个阶段 end 应保持为 1。
    phases: [
      // 白天阶段，不加暗化遮罩。
      { id: 'day', label: '白天', end: 0.58, overlay: 0 },
      // 黄昏阶段，轻微暗化，用于提示夜晚将至。
      { id: 'dusk', label: '黄昏', end: 0.78, overlay: 0.12 },
      // 夜晚阶段，明显暗化；黑影只会在该阶段从黑雾口生成。
      { id: 'night', label: '夜晚', end: 1, overlay: 0.34 }
    ]
  },

  /**
   * 黑影配置：控制夜晚生成、移动、局部感知和接触判定。
   * 这些参数直接影响夜晚压力与辉石诱敌价值，调大感知或速度会明显增加工人损失风险。
   */
  monster: {
    // 黑影最大生命值，单位：HP。被弓箭手攻击会扣除；过高会削弱弓箭手反馈。
    maxHp: 2,
    // 每晚最多生成黑影数量，单位：只。数值越大夜晚压力越强，过高会让早期资源无法承受。
    perNight: 2,
    // 黑影移动速度，单位：格 / 秒。过高会让辉石诱敌和工人撤离几乎没有反应时间。
    moveSpeed: 1.55,
    // 黑影局部战术感知半径，单位：格。只在该范围内寻找辉石、外出工人和玩家；过大将削弱“局部压力”。
    tacticalRange: 4,
    // 黑影吞噬已放置辉石的判定半径，单位：格。过大时会出现隔空吞噬，过小会显得贴近后仍不触发。
    consumeStoneRange: 0.55,
    // 黑影抓住外出工人的判定半径，单位：格。过大时工人损失会过于突然。
    catchWorkerRange: 0.55,
    // 黑影碰到玩家的提示判定半径，单位：格。本轮只做提示，不做生命值或失败结算。
    touchPlayerRange: 0.6,
    // 黑影抵达默认营地目标后的消散半径，单位：格。当前不实现营地伤害，抵达后仅清除实体。
    reachCampRange: 0.7,
    // 黑影攻击围墙的间隔，单位：秒。过短会让围墙快速崩塌，过长会让围墙几乎无损。
    wallAttackInterval: 1.2,
    // 黑影每次攻击围墙造成的伤害，单位：HP。过高会使低级围墙失去拖延价值。
    wallDamage: 1,
    // 黑影攻击围墙的判定距离，单位：格。过大时会隔空拆墙，过小会出现贴近后不攻击。
    attackWallRange: 0.7,
    // 夜晚分批生成间隔，单位：秒。过短会让同一晚压力集中爆发，过长可能导致天亮前无法生成完。
    spawnInterval: 4,
    // 玩家被黑影触碰提示的冷却时间，单位：秒。防止连续接触时消息刷屏。
    touchPlayerMessageCooldown: 2.5,
    // 天亮时是否清除仍在场黑影。true 表示昼夜边界明确；false 会让黑影跨天残留，风险更高。
    clearAtDay: true,
    // 黑影状态字符串，仅用于渲染和调试观察；改名会影响 HUD / 调试脚本读取。
    states: {
      // 默认朝最近已点亮营地或起点部落行进。
      marching: 'marching',
      // 4 格内发现更高优先级目标后转向追逐。
      chasing: 'chasing',
      // 接近围墙后停留攻击。
      attackingWall: 'attacking_wall'
    }
  },

  /**
   * 地图生成配置：控制地图尺寸、主路径、关键节点段落和轻随机范围。
   * 所有 index 字段表示主路径 x 方向索引范围；区间重叠会增加不可达风险。
   */
  map: {
    // 地图宽度，单位：格。
    width: 46,
    // 地图高度，单位：格。
    height: 26,
    // 起点部落 x 坐标，保持在地图左侧。
    startX: 4,
    // 起点部落 y 坐标随机最小值，单位：格。
    startYMin: 11,
    // 起点部落 y 坐标随机最大值，单位：格。
    startYMax: 15,

    path: {
      // 主路径生成起始 x 索引，单位：格。
      minX: 2,
      // 主路径距离地图右边界的保留格数，避免终点贴边。
      endPadding: 2,
      // 主路径 y 坐标最小值，避免路径贴近地图上边界。
      yMin: 6,
      // 主路径 y 坐标距离地图下边界的保留格数。
      yMaxPadding: 7,
      // 主路径每个点开路半径，单位：格。越大路径越宽。
      carveRadius: 2,
      // 起点区域开路半径，单位：格。越大开局活动空间越大。
      startCarveRadius: 4,
      // 终点区域开路半径，单位：格。越大终点更容易靠近。
      goalCarveRadius: 2
    },

    pathWave: {
      // 主路径第一条波形频率。影响路径上下起伏密度。
      frequencyA: 0.27,
      // 主路径第二条波形频率。与 A 叠加，避免路径过于规则。
      frequencyB: 0.61,
      // 第一条波形振幅随机最小值，单位：格。
      amplitudeAMin: 1.2,
      // 第一条波形振幅随机最大值，单位：格；过高会让路径贴近边界。
      amplitudeAMax: 2.7,
      // 第二条波形振幅随机最小值，单位：格。
      amplitudeBMin: 0.4,
      // 第二条波形振幅随机最大值，单位：格。
      amplitudeBMax: 1.1
    },

    // 树障出现的主路径 x 索引最小值，控制前段开路节点。
    treeIndexMin: 11,
    // 树障出现的主路径 x 索引最大值。
    treeIndexMax: 15,
    // 树障周围森林收窄的半高，单位：格。过大会让视觉阻挡更强。
    treeGateHalfHeight: 4,

    // 河流 / 断桥出现的主路径 x 索引最小值。
    riverIndexMin: 22,
    // 河流 / 断桥出现的主路径 x 索引最大值。
    riverIndexMax: 27,
    // 河流纵向跨度随机最小半径，单位：格。
    riverSpanMin: 5,
    // 河流纵向跨度随机最大半径，单位：格。
    riverSpanMax: 7,

    // 旧营地出现的主路径 x 索引最小值。
    campIndexMin: 31,
    // 旧营地出现的主路径 x 索引最大值。
    campIndexMax: 36,

    // 阶段终点出现的主路径 x 索引最小值，应保持在右侧。
    goalIndexMin: 40,
    // 阶段终点出现的主路径 x 索引最大值，应小于地图宽度减去边界。
    goalIndexMax: 43,

    // 自然辉石数量随机最小值，单位：颗。
    stoneCountMin: 5,
    // 自然辉石数量随机最大值，单位：颗。过多会降低资源取舍压力。
    stoneCountMax: 8,
    // 自然辉石生成主路径 x 索引最小值。
    stoneIndexMin: 6,
    // 自然辉石生成时距离主路径终点的保留格数。
    stoneEndPadding: 7,
    // 自然辉石与关键节点避让距离，单位：路径索引。
    stoneReservedGap: 2,
    // 自然辉石之间的优先间距，单位：路径索引。
    stoneSpacing: 3,
    // 自然辉石相对主路径 y 坐标的候选偏移，单位：格。
    stoneYOffsetCandidates: [-2, -1, 0, 1, 2],

    // 森林簇数量随机最小值，单位：组。
    forestClusterMin: 4,
    // 森林簇数量随机最大值，单位：组。
    forestClusterMax: 6,
    // 森林簇与树障、河流、营地、终点的避让距离，单位：路径索引。
    forestClusterReservedGap: 3,
    // 森林簇之间的优先间距，单位：路径索引。
    forestClusterSpacing: 5,
    // 森林簇长度随机最小值，单位：格。
    forestClusterLengthMin: 2,
    // 森林簇长度随机最大值，单位：格。
    forestClusterLengthMax: 4,
    // 森林簇相对主路径 y 坐标的候选偏移，单位：格。
    forestClusterYOffsetCandidates: [-4, -3, 3, 4],

    // 黑雾口数量随机最小值，单位：个。数量越多，夜晚黑影来源越分散。
    fogGateCountMin: 2,
    // 黑雾口数量随机最大值，单位：个。过高会增加视觉噪音，也会放大未来生成压力。
    fogGateCountMax: 3,
    // 黑雾口生成主路径 x 索引最小值，单位：路径索引。过早会压迫开局安全区。
    fogGateIndexMin: 18,
    // 黑雾口生成主路径 x 索引最大值，单位：路径索引。过晚会让夜晚压力集中在终点附近。
    fogGateIndexMax: 39,
    // 黑雾口与树障、河流、营地、终点的避让距离，单位：路径索引。
    fogGateReservedGap: 3,
    // 黑雾口之间的优先间距，单位：路径索引。过小会让多个生成点挤在一起。
    fogGateSpacing: 8,
    // 黑雾口相对主路径 y 坐标的候选偏移，单位：格。绝对值越大越靠近森林边缘。
    fogGateYOffsetCandidates: [-5, -4, -3, 3, 4, 5]
  },

  /**
   * 交互配置：控制玩家按 Space 搜索可互动目标的范围。
   * 搜索范围过大会让玩家隔空互动，过小会让目标难以选中。
   */
  interaction: {
    // 互动搜索半径，单位：格。玩家附近小于该距离的目标会被选中。
    searchRadius: 1.7
  },

  /**
   * 文案配置：集中管理 HUD 和系统提示。
   * message 字段会出现在底部提示或屏幕中央，调整时应注意文字长度和可读性。
   */
  text: {
    // 新开局底部提示文案，显示在游戏开始后的短时间内。
    startMessage: '收集辉石，按 Space 派遣工人开路，向远方信标前进。',
    // 抵达阶段终点时的提示文案，显示在屏幕中央和消息区。
    goalReached: '你抵达了阶段终点。',
    // 玩家没有辉石但尝试放置时显示。
    noStoneToPlace: '没有辉石可放置。',
    // 玩家附近没有可放置地块时显示。
    noPlaceForStone: '附近没有可放置辉石的位置。',
    // 成功放置辉石时显示。
    placedStone: '放置了一枚辉石。',
    // 夜晚开始并生成黑影压力时显示。
    nightStarts: '夜色压下来，黑雾开始涌动。',
    // 黑影吞噬玩家放置的辉石时显示。
    monsterConsumedStone: '黑影被辉石引开，吞下光芒后散去了。',
    // 黑影抓住外出工人时显示。
    workerCaptured: '一名外出的工人被黑影抓走了。',
    // 黑影触碰玩家时显示；本轮只提示，不进入失败流程。
    playerTouchedByMonster: '黑影擦过你身边，火光之外很危险。',
    // 天亮清除残留黑影时显示。
    monstersClearedAtDay: '天色转亮，残留的黑影退回雾中。',
    // 工人开始建造围墙时显示。
    wallBuildStarted: '工人开始建造围墙。',
    // 围墙建成时显示。
    wallBuilt: '围墙建好了。',
    // 围墙被黑影摧毁时显示。
    wallDestroyed: '围墙被黑影摧毁了。',
    // 招募弓箭手成功时显示。
    archerRecruited: '一名弓箭手加入了防守。',
    // 派遣工人采矿成功时显示。
    mineAssigned: '工人开始采矿。',
    // 矿山已有工人占用时显示。
    mineOccupied: '这座矿山已有工人。',
    // 矿山周期性产出辉石时显示；count 单位：辉石数量。
    mineProduced: count => `矿山产出辉石 +${count}`,
    // 招募流民成功时显示。
    refugeeRecruited: '一名流民正在返回营地。',
    // 流民抵达营地并转化为工人时显示。
    refugeeJoined: '一名流民加入，成为新的工人。',
    // 流民火堆没有剩余流民时显示。
    refugeeFireEmpty: '这里已经没有流民了。',
    // 辉石不足以建墙时显示；count 单位：辉石数量。
    needMoreStoneForWall: count => `建墙需要 ${count} 个辉石。`,
    // 辉石不足以招募弓箭手时显示；count 单位：辉石数量。
    needMoreStoneForArcher: count => `招募弓箭手需要 ${count} 个辉石。`,
    // 辉石不足以派遣工人采矿时显示；count 单位：辉石数量。
    needMoreStoneForMine: count => `采矿需要 ${count} 个辉石。`,
    // 辉石不足以招募流民时显示；count 单位：辉石数量。
    needMoreStoneForRefugee: count => `招募流民需要 ${count} 个辉石。`,
    // 拾取辉石时显示；count 单位：辉石数量。
    pickupStone: count => `拾取辉石 +${count}`,
    // 辉石不足以派遣工人时显示；count 单位：辉石数量。
    needStone: count => `需要 ${count} 个辉石。`,
    // 没有 idle 工人可派遣时显示。
    noIdleWorker: '没有空闲工人。',
    // 目标附近没有可站立工作点时显示。
    noWorkSpot: '工人找不到可到达的位置。',
    // 工人无法从当前位置走到工作点时显示。
    noPath: '通往目标的道路还没有打开。',
    // 成功派遣工人时显示。
    workerSent: '已派遣工人。',
    // HUD 当前目标文案。
    goalText: '目标：开路、建设防御，并建立辉石与人口补给',
    // HUD 操作说明文案。
    controlsText: '操作：WASD / 方向键移动，Space 互动或放置辉石，R 重开',
    // 无互动目标时底部提示文案。
    noInteractionPrompt: '附近无互动目标：Space 放置一枚辉石',
    // 互动目标提示；label 是任务名，cost 单位：辉石数量。
    interactionPrompt: (label, cost) => `${label}：Space 派遣工人，消耗 ${cost} 辉石`,

    // 提示文案显示时长配置，单位：秒。过短会让玩家看不清反馈，过长会遮挡下一条反馈。
    messageDuration: {
      // 开局引导提示持续时间，单位：秒。
      start: 5,
      // 普通短提示持续时间，单位：秒，例如拾取、放置、派遣成功。
      short: 2,
      // 普通任务结果提示持续时间，单位：秒，例如砍树、修桥、点营地完成。
      normal: 3,
      // 抵达阶段终点提示持续时间，单位：秒。
      goal: 8
    }
  }
};
