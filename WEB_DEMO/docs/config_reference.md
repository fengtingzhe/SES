# WEB_DEMO 配置参考 v1.2-config-prep

本文件记录 `WEB_DEMO/src/game/config/GameConfig.js` 当前配置字段。当前版本仍以 `GameConfig.js` 作为唯一配置中心，没有拆分 JSON / CSV，也没有接入外部配置读取。

“是否策划参数”的含义：

- 是：推荐进入后续数值表，策划可按体验目标调整。
- 否：偏程序常量、状态初始化或渲染实现细节，调整前需要工程确认。
- 部分：模块中既有策划参数，也有程序常量。

## 配置字段表

| 字段路径 | 中文说明 | 默认值 | 单位 | 是否策划参数 | 影响系统 | 注意事项 |
|---|---|---:|---|---|---|---|
| version | 当前 WEB_DEMO 版本号 | `WEB_DEMO v1.2-config-prep` | 文本 | 否 | HUD、验收 | 只用于显示和核对，不影响玩法 |
| map.width | 地图宽度 | 74 | 格 | 是 | 地图、寻路、小地图 | 改动会影响所有生成坐标 |
| map.height | 地图高度 | 54 | 格 | 是 | 地图、寻路、小地图 | 改动会影响所有生成坐标 |
| map.start | 起点坐标 | `{ x: 5, y: 27 }` | 格坐标 | 是 | 玩家、家园、视野、开局设施 | 高风险字段，改动需同步开局布局 |
| map.goal | 终点坐标 | `{ x: 68, y: 27 }` | 格坐标 | 是 | 终点、胜利、小地图 | 影响完整旅程长度 |
| map.seed | 地图随机种子 | 2077 | 整数 | 是 | 地图生成 | 改动会重排主路、分支、资源和特殊点 |
| map.generation.path.wanderStartX | 主路开始上下摆动的 x 阈值 | 8 | 格 | 是 | 地图生成 | 过早摆动会影响新手区稳定性 |
| map.generation.path.goalPadding | 主路靠近终点停止摆动的尾部距离 | 2 | 格 | 是 | 地图生成 | 影响终点附近路径稳定性 |
| map.generation.path.wanderEvery | 主路每隔多少列尝试摆动 | 3 | 格 | 是 | 地图生成 | 越小主路越弯 |
| map.generation.path.yRandomChoices | 主路 y 摆动随机取值数量 | 3 | 取值数 | 否 | 地图生成 | 当前配合 `yDeltaOffset` 得到 -1/0/+1 |
| map.generation.path.yDeltaOffset | 主路 y 摆动偏移量 | 1 | 格 | 否 | 地图生成 | 和 `yRandomChoices` 成对调整 |
| map.generation.path.minY | 主路最低 y 坐标 | 8 | 格 | 是 | 地图生成 | 防止贴边 |
| map.generation.path.maxYMargin | 主路最高 y 使用 `height - maxYMargin` | 9 | 格 | 是 | 地图生成 | 防止贴边 |
| map.generation.path.laneRadius | 主路铺开半径 | 1 | 格 | 是 | 地图生成、通行 | 当前形成 3 格宽主路 |
| map.generation.path.sideEvery | 主路侧向地块间隔 | 6 | 格 | 是 | 地图生成、探索 | 影响主路可读性 |
| map.generation.path.sideChance | 侧向地块向上/向下概率阈值 | 0.5 | 概率 | 是 | 地图生成 | 仅控制方向，不控制是否生成 |
| map.generation.path.sideOffset | 侧向地块偏移 | 2 | 格 | 是 | 地图生成 | 影响道路宽松度 |
| map.generation.branches.count | 分支数量 | 8 | 条 | 是 | 地图生成、探索 | 过多会降低路线可读性 |
| map.generation.branches.anchorStart | 分支锚点起始主路下标 | 8 | 下标 | 是 | 地图生成 | 避免开局区域过乱 |
| map.generation.branches.anchorEndPadding | 分支避开主路尾部距离 | 16 | 下标 | 是 | 地图生成 | 避免终点附近过乱 |
| map.generation.branches.directionChance | 分支向上/向下概率阈值 | 0.5 | 概率 | 是 | 地图生成 | 只影响方向分布 |
| map.generation.branches.minLength | 分支最短长度 | 4 | 步 | 是 | 地图生成 | 影响探索分叉深度 |
| map.generation.branches.lengthRandomChoices | 分支额外随机长度取值数 | 8 | 取值数 | 是 | 地图生成 | 当前形成 4 到 11 步 |
| map.generation.branches.xRandomChoices | 分支 x 随机取值数量 | 3 | 取值数 | 否 | 地图生成 | 当前配合偏移得到 -1/0/+1 |
| map.generation.branches.xDeltaOffset | 分支 x 随机偏移量 | 1 | 格 | 否 | 地图生成 | 和 `xRandomChoices` 成对调整 |
| map.generation.branches.minX | 分支最低 x 坐标 | 4 | 格 | 是 | 地图生成 | 防止贴边 |
| map.generation.branches.maxXMargin | 分支最高 x 使用 `width - maxXMargin` | 5 | 格 | 是 | 地图生成 | 防止贴边 |
| map.generation.branches.yStepChance | 分支沿 y 推进概率 | 0.75 | 概率 | 是 | 地图生成 | 越高分支越偏离主路 |
| map.generation.branches.minY | 分支最低 y 坐标 | 5 | 格 | 是 | 地图生成 | 防止贴边 |
| map.generation.branches.maxYMargin | 分支最高 y 使用 `height - maxYMargin` | 6 | 格 | 是 | 地图生成 | 防止贴边 |
| map.generation.branches.widthExtraX | 分支额外横向铺开宽度 | 1 | 格 | 是 | 地图生成 | 当前每步多开 1 格 |
| map.generation.branches.extraEvery | 分支旁路地块间隔 | 3 | 步 | 是 | 地图生成 | 影响分支宽松度 |
| map.generation.rivers.baseXs | 河流基础 x 坐标数组 | `[22, 45]` | 格 | 是 | 河流、断桥、路线门槛 | 影响修桥节奏 |
| map.generation.rivers.xRandomChoices | 河流 x 偏移随机取值数量 | 3 | 取值数 | 是 | 地图生成 | 当前表示 0 到 2 |
| map.generation.rivers.minY | 河流起始 y 坐标 | 3 | 格 | 是 | 地图生成 | 防止贴边 |
| map.generation.rivers.maxYMargin | 河流结束 y 使用 `height - maxYMargin` | 3 | 格 | 是 | 地图生成 | 防止贴边 |
| map.generation.placement.minY | 特殊点贴近主路放置最低 y | 4 | 格 | 是 | 地图生成 | 狐狸、雾门、火堆等共用 |
| map.generation.placement.maxYMargin | 特殊点最高 y 使用 `height - maxYMargin` | 5 | 格 | 是 | 地图生成 | 狐狸、雾门、火堆等共用 |
| map.generation.placement.normalSearchRadius | 普通特殊点找空地半径 | 6 | 格 | 是 | 地图生成 | 过小可能找不到空地 |
| map.generation.placement.reachableSearchRadius | 要求可达特殊点找空地半径 | 12 | 格 | 是 | 地图生成、寻路 | 当前用于流民火堆 |
| map.generation.specialSites.invertedForests | 颠倒森林锚点列表 | `[{10,-5},{50,-4}]` | 主路下标/格 | 是 | 地图、颠倒森林 | 调整会改变特殊区域位置 |
| map.generation.specialSites.foxWedding | 狐狸婚仪锚点 | `{ pathIndex: 27, offsetY: -5 }` | 主路下标/格 | 是 | 特殊事件 | 调整会改变事件可遇见时机 |
| map.generation.specialSites.oldFirepit | 旧火塘锚点 | `{ pathIndex: 31, offsetY: 2 }` | 主路下标/格 | 是 | 营地扩张 | 影响第二营地节奏 |
| map.generation.specialSites.fogGates | 雾门锚点列表 | `[{36,-4},{48,5}]` | 主路下标/格 | 是 | 夜晚、黑影 | 影响黑影来源和压力方向 |
| map.generation.specialSites.refugeeFires | 初始流民火堆锚点 | `[{16,4},{30,4}]` | 主路下标/格 | 是 | 流民、人口 | 当前要求起点可达 |
| map.generation.startArea.offsetMin | 起点安全区左上偏移 | `{ x: -3, y: -4 }` | 格 | 是 | 开局地图 | 影响新手区大小 |
| map.generation.startArea.offsetMax | 起点安全区右下偏移 | `{ x: 5, y: 4 }` | 格 | 是 | 开局地图 | 影响新手区大小 |
| map.generation.startArea.mineOffset | 初始矿山偏移 | `{ x: 2, y: 0 }` | 格 | 是 | 矿山、资源 | 影响早期采矿可达性 |
| map.generation.startArea.workerHutOffset | 工人屋偏移 | `{ x: 1, y: 2 }` | 格 | 是 | 转职、营地 | 新营地也复用 |
| map.generation.startArea.archerCampOffset | 弓箭手营偏移 | `{ x: 3, y: 2 }` | 格 | 是 | 转职、防御 | 新营地也复用 |
| map.generation.startArea.wallBaseOffsets | 围墙基座偏移列表 | `[{4,1},{-2,1}]` | 格 | 是 | 围墙、防御 | 起点和新营地复用 |
| map.generation.startArea.treeOffsets | 开局可砍树偏移 | `[{3,-2},{4,-2},{4,2}]` | 格 | 是 | 派工、资源 | 影响早期砍树目标 |
| map.generation.starterStones.firstOffset | 起点旁辉石偏移 | `{ x: 1, y: 0 }` | 格 | 是 | 资源、新手引导 | 影响开局即时拾取 |
| map.generation.starterStones.fixedPathIndexes | 固定辉石主路下标 | `[10,15,24,34,43,52]` | 下标 | 是 | 资源、探索 | 影响沿途补给 |
| map.generation.starterStones.fixedSideOffset | 固定辉石上下偏移 | 2 | 格 | 是 | 资源、探索 | 影响离主路距离 |
| map.generation.starterStones.firstFixedValue | 第一颗固定辉石数量 | 2 | 个 | 是 | 资源 | 当前第一颗较高价值 |
| map.generation.starterStones.fixedValue | 其他固定辉石数量 | 1 | 个 | 是 | 资源 | 沿途基础补给 |
| map.generation.starterStones.randomCount | 随机辉石尝试次数 | 16 | 次 | 是 | 资源、探索 | 不是保证生成数量 |
| map.generation.starterStones.randomMinX | 随机辉石最低 x | 6 | 格 | 是 | 资源、探索 | 避免起点左侧 |
| map.generation.starterStones.randomMaxXMargin | 随机辉石最高 x 边距 | 12 | 格 | 是 | 资源、探索 | 避免贴近终点外侧 |
| map.generation.starterStones.randomMinY | 随机辉石最低 y | 5 | 格 | 是 | 资源、探索 | 防止贴边 |
| map.generation.starterStones.randomMaxYMargin | 随机辉石最高 y 边距 | 10 | 格 | 是 | 资源、探索 | 防止贴边 |
| map.generation.starterStones.randomValue | 随机辉石数量 | 1 | 个 | 是 | 资源 | 单点默认补给 |
| player.speed | 玩家移动速度 | 4.2 | 格/秒 | 是 | 玩家移动、探索、事件 | 过高会削弱夜晚压力 |
| player.initialFacing | 初始朝向 | `{ x: 1, y: 0 }` | 方向向量 | 是 | Space 面前互动 | 改动会影响开局互动目标 |
| player.invertedExitGraceSeconds | 颠倒森林退出迟滞 | 0.3 | 秒 | 是 | 玩家控制 | 过低会出现边界抖动 |
| resource.initialStone | 开局辉石 | 6 | 个 | 是 | 经济、派工、容错 | 影响早期所有决策 |
| resource.defaultStoneValue | 默认单颗辉石数量 | 1 | 个 | 是 | 资源拾取、掉落 | 多处兜底值 |
| resource.placedStoneValue | 主动放置辉石数量 | 1 | 个 | 是 | 辉石、黑影诱导 | 当前放置消耗同值 |
| resource.treeChopDropStone | 砍树掉落辉石 | 1 | 个 | 是 | 砍树、资源 | 砍树回报参数 |
| resource.placedStoneLife | 临时辉石存在时间 | 10 | 秒 | 是 | 辉石、黑影诱导 | 过长会降低夜晚风险 |
| resource.droppedStoneLife | 掉落辉石存在时间 | 10 | 秒 | 是 | 资源 | 用于系统掉落 |
| resource.pickupRadius | 自然辉石自动拾取半径 | 0.8 | 格 | 是 | 资源拾取 | 临时辉石不自动拾取 |
| resource.placeSearchRadius | 放置辉石寻找空地半径 | 2 | 格 | 是 | 辉石放置 | 过大可能越过障碍感明显 |
| resource.dropSearchRadius | 掉落辉石寻找空地半径 | 2 | 格 | 是 | 掉落资源 | 影响砍树和采矿掉落 |
| worker.speed | 工人移动速度 | 2.25 | 格/秒 | 是 | 派工、返程、逃跑 | 影响白天效率和夜晚风险 |
| worker.workDuration | 默认工作时长 | 4 | 秒 | 是 | 派工 | 仍作为任务时长兜底 |
| worker.threatRange | 工人夜晚威胁感知范围 | 3 | 格 | 是 | 工人避险 | 与黑影 4 格战术范围不同 |
| worker.resumeThreatRange | 采矿复工安全检查范围 | 4 | 格 | 是 | 采矿复工 | 过低会导致反复出门 |
| worker.arrivalDistance | 工人到达路径点阈值 | 0.05 | 格 | 否 | 工人移动 | 程序常量，不建议策划调整 |
| job.costs.chop | 砍树成本 | 1 | 辉石 | 是 | 派工、经济 | 原 `jobCosts.js` 中数值已迁入 |
| job.costs.repair | 修桥成本 | 2 | 辉石 | 是 | 派工、地图门槛 | 原 `jobCosts.js` 中数值已迁入 |
| job.costs.camp | 建营地成本 | 2 | 辉石 | 是 | 扩张、经济 | 原 `jobCosts.js` 中数值已迁入 |
| job.costs.mine | 采矿派工成本 | 0 | 辉石 | 是 | 采矿、经济 | 当前继承 0 成本规则 |
| job.costs.wall | 建墙成本 | 2 | 辉石 | 是 | 防御、经济 | 原 `jobCosts.js` 中数值已迁入 |
| job.durations.chop | 砍树时长 | 4 | 秒 | 是 | 派工 | 默认等于原 `worker.workDuration` |
| job.durations.repair | 修桥时长 | 4 | 秒 | 是 | 派工 | 默认等于原 `worker.workDuration` |
| job.durations.camp | 建营地时长 | 4 | 秒 | 是 | 派工、扩张 | 默认等于原 `worker.workDuration` |
| job.durations.mine | 采矿一次性工作时长 | 0 | 秒 | 是 | 采矿 | 采矿到达后转为持续产出 |
| job.durations.wall | 建墙时长 | 4 | 秒 | 是 | 防御、派工 | 默认等于原 `worker.workDuration` |
| population.initialWorkers | 开局工人数 | 2 | 人 | 是 | 人口、派工 | 需与 `initialWorkerOffsets` 长度一致 |
| population.initialWorkerOffsets | 开局工人出生偏移 | `[{0,-1},{0,1}]` | 格 | 是 | 人口、开局 | 影响起点周边站位 |
| population.recruitCost | 招募流民成本 | 1 | 辉石 | 是 | 流民、经济 | 当前招募后进入返程 |
| population.refugeeFireCooldown | 流民火堆冷却 | 10 | 秒 | 是 | 流民 | 当前可反复冷却刷新 |
| population.refugeeSpeed | 返程流民速度 | 1.75 | 格/秒 | 是 | 流民返程 | 影响人口补给节奏 |
| population.conversionCost | 转职成本 | 1 | 辉石 | 是 | 工人屋、弓箭手营 | 工人和弓箭手共用 |
| mine.productionSeconds | 矿山产出周期 | 30 | 秒 | 是 | 采矿、资源 | 当前约 30 秒产出一次 |
| mine.outputStone | 单次矿山产出 | 1 | 个 | 是 | 采矿、资源 | 本轮从代码写死值迁入 |
| wall.maxHp | 围墙最大 HP | 3 | HP | 是 | 围墙、防御 | 黑影每次攻击造成 1 点 |
| wall.attackSeconds | 黑影攻墙间隔 | 1 | 秒 | 是 | 黑影、围墙 | 影响围墙承压时间 |
| wall.attackDistance | 黑影攻墙距离 | 0.6 | 格 | 是 | 黑影、围墙 | 过大可能隔墙攻击感强 |
| wall.damagePerMonsterHit | 黑影每次攻墙伤害 | 1 | HP | 是 | 黑影、围墙 | 与围墙 HP 共同决定承压次数 |
| archer.range | 弓箭手射程 | 5.5 | 格 | 是 | 弓箭手、黑影 | 影响夜晚防御覆盖 |
| archer.aimSeconds | 弓箭手瞄准时间 | 0.6 | 秒 | 是 | 弓箭手 | 过低会让防御过强 |
| archer.cooldownSeconds | 弓箭手冷却时间 | 2.2 | 秒 | 是 | 弓箭手 | 影响持续输出 |
| archer.damage | 弓箭手伤害 | 1 | HP | 是 | 弓箭手、黑影 | 黑影 HP=1，因此当前一箭击杀 |
| monster.perNight | 每晚黑影生成数量 | 2 | 个 | 是 | 黑影、夜晚压力 | 影响夜晚难度 |
| monster.spawnInterval | 黑影生成间隔 | 3 | 秒 | 是 | 黑影 | 影响压力节奏 |
| monster.maxActiveBeforePause | 场上黑影暂停生成阈值 | 5 | 个 | 是 | 黑影 | 避免同场过多 |
| monster.tacticalRange | 黑影局部战术感知范围 | 4 | 格 | 是 | 黑影 AI | 核心规则，不宜随意改 |
| monster.targetLockSeconds | 黑影目标锁定时间 | 1.2 | 秒 | 是 | 黑影 AI | 防止频繁抖动切目标 |
| monster.speed | 黑影移动速度 | 1.6 | 格/秒 | 是 | 黑影 | 影响追击压力 |
| monster.hitDistance | 黑影命中距离 | 0.35 | 格 | 是 | 黑影、玩家、单位 | 玩家受击、工人 lost、辉石被吃共用 |
| monster.campStopDistance | 黑影营地推进停止距离 | 0.25 | 格 | 是 | 黑影、营地压力 | 当前未实现营地损坏 |
| monster.hp | 黑影 HP | 1 | HP | 是 | 黑影、弓箭手 | 与 `archer.damage` 共同决定箭数 |
| monster.playerStoneLoss | 玩家被黑影袭击时损失辉石 | 1 | 个 | 是 | 玩家、黑影、资源 | 与失败条件相关，调大风险高 |
| monster.playerInvulnerableSeconds | 玩家受击无敌时间 | 1.6 | 秒 | 是 | 玩家、黑影 | 文档中归到玩家相关风险 |
| monster.moveEpsilon | 非围墙目标移动接近阈值 | 0.05 | 格 | 否 | 黑影移动 | 程序常量 |
| monster.normalizeEpsilon | 归一化保护阈值 | 0.001 | 格 | 否 | 黑影移动 | 程序常量 |
| dayNight.dayLength | 一天总时长 | 95 | 秒 | 是 | 昼夜、天气、黑影 | 影响整体节奏 |
| dayNight.initialTime | 开局时间偏移 | 8 | 秒 | 是 | 昼夜 | 避免开局立即夜晚 |
| dayNight.nightStartEarly | 跨日凌晨夜晚比例 | 0.08 | 比例 | 是 | 昼夜 | 0 到 1 |
| dayNight.duskStart | 黄昏开始比例 | 0.52 | 比例 | 是 | 昼夜、HUD | 0 到 1 |
| dayNight.nightStartLate | 夜晚开始比例 | 0.66 | 比例 | 是 | 昼夜、黑影 | 0 到 1 |
| weather.dailyChance | 每日天气触发概率 | 0.45 | 概率 | 是 | 天气 | 每日判定一次 |
| weather.rollPhase | 天气判定阶段 | `day` | phase id | 是 | 天气、昼夜 | 当前只在白天判定 |
| weather.seed | 天气随机种子 | 9317 | 整数 | 是 | 天气 | 用于复现开发验证 |
| weather.historyLimit | 天气历史保留条数 | 6 | 条 | 否 | 天气、调试 | 只影响历史记录 |
| weather.types.rain | 雨配置 | `name=雨, weight=40, duration=[35,70]` | 混合 | 是 | 天气、天气事件 | 标签为 `wet/low_visibility` |
| weather.types.snow | 雪配置 | `name=雪, weight=25, duration=[35,70]` | 混合 | 是 | 天气、天气事件 | 标签为 `cold/slow` |
| weather.types.wind | 大风配置 | `name=大风, weight=35, duration=[25,55]` | 混合 | 是 | 天气、天气事件 | 标签为 `windy/unstable` |
| weatherEvents.checkIntervalSeconds | 条件事件检查间隔 | 6 | 秒 | 是 | 天气事件 | 避免每帧重复 roll |
| weatherEvents.regionScanRadius | 区域扫描半径 | 1 | 格 | 是 | 天气事件 | 读取玩家附近 regionTag |
| weatherEvents.spawnSearchRadius | 事件生成点搜索半径 | 4 | 格 | 是 | 天气事件 | 当前寻找附近空地 |
| weatherEvents.seed | 天气事件随机种子 | 4207 | 整数 | 是 | 天气事件 | 用于复现触发序列 |
| weatherEvents.historyLimit | 天气事件历史保留条数 | 8 | 条 | 否 | 天气事件、调试 | 只影响历史记录 |
| weatherEvents.rules | 天气事件规则数组 | `rain_forest_test_refugee` | 规则 | 是 | 天气事件 | WeatherSystem 不写事件，WeatherEventSystem 按规则触发 |
| weatherEvents.rules[].id | 天气事件规则 id | `rain_forest_test_refugee` | 文本 | 是 | 天气事件 | 需要唯一 |
| weatherEvents.rules[].regionTag | 触发区域标签 | `forest` | 文本 | 是 | 天气事件、地图 | 依赖地图 regionTag |
| weatherEvents.rules[].weather | 触发天气 | `rain` | 天气 id | 是 | 天气事件 | 需匹配 `weather.types` |
| weatherEvents.rules[].chance | 单次检查触发概率 | 0.25 | 概率 | 是 | 天气事件 | 每次检查间隔内 roll |
| weatherEvents.rules[].eventId | 事件处理器 id | `rainRefugee` | 文本 | 否 | 天气事件 | 需要代码中存在 handler |
| weatherEvents.rules[].cooldownDays | 规则冷却天数 | 1 | 天 | 是 | 天气事件 | 防止同日无限刷 |
| events.invertedForest.radius | 颠倒森林半径 | 3 | 格 | 是 | 地图、玩家控制 | 影响反转区域大小 |
| events.invertedForest.edgePadding | 颠倒森林圆形包边 | 0.3 | 格 | 否 | 地图生成 | 地图形状程序常量 |
| events.foxWedding.rewardStone | 狐狸婚仪成功奖励 | 4 | 辉石 | 是 | 特殊事件、资源 | 改动影响事件收益 |
| events.foxWedding.durationSeconds | 狐狸婚仪持续时间 | 13 | 秒 | 是 | 特殊事件 | 影响跟随难度 |
| events.foxWedding.moveCycleSeconds | 狐狸移动/停顿周期 | 4 | 秒 | 是 | 特殊事件 | 与 moveSeconds 配合 |
| events.foxWedding.moveSeconds | 每周期移动时长 | 2.8 | 秒 | 是 | 特殊事件 | 影响停顿窗口 |
| events.foxWedding.speed | 狐狸队伍速度 | 0.75 | 格/秒 | 是 | 特殊事件 | 影响跟随难度 |
| events.foxWedding.foxCount | 狐狸数量 | 5 | 只 | 是 | 特殊事件、表现 | 影响队列长度 |
| events.foxWedding.spacing | 狐狸间距 | 0.8 | 格 | 是 | 特殊事件、表现 | 影响队列视觉 |
| events.foxWedding.maxDistance | 失败最大距离 | 3.2 | 格 | 是 | 特殊事件 | 玩家离队过远失败 |
| events.foxWedding.stopDistance | 停顿时误动判定距离 | 3.5 | 格 | 是 | 特殊事件 | 影响停走规则 |
| events.foxWedding.bobFrequency | 狐狸上下摆动频率 | 2 | 系数 | 否 | 特殊事件表现 | 表现参数 |
| events.foxWedding.bobAmplitude | 狐狸上下摆动幅度 | 0.08 | 格 | 否 | 特殊事件表现 | 表现参数 |
| home.startId | 初始家园 id | `home-start` | 文本 | 否 | 家园、工人 | 程序常量 |
| entity.initialNextEntityId | 初始实体 id 起点 | 3 | id | 否 | 工人、流民、弓箭手 | 1、2 当前为开局工人 |
| entity.initialMonsterNextId | 初始黑影 id 起点 | 1 | id | 否 | 黑影 | 程序常量 |
| interaction.scanRadius | Space 附近互动扫描半径 | 2 | 格 | 是 | 交互 | 面前目标仍优先 |
| interaction.maxDistance | 附近互动最大距离 | 1.7 | 格 | 是 | 交互 | 过大可能误选目标 |
| vision.playerRadius | 玩家视野半径 | 6 | 格 | 是 | 视野、探索 | 影响信息揭示 |
| vision.startRadius | 起点/营地揭示半径 | 5 | 格 | 是 | 视野、家园 | 营地也使用此半径 |
| camera.tileSize | 基础格子尺寸 | 28 | px | 部分 | 渲染、相机 | 属于视觉参数 |
| camera.zoom | 主画面缩放 | 1.15 | 倍率 | 部分 | 渲染、相机 | 调整会影响可视范围 |
| camera.follow | 镜头跟随速度 | 0.08 | 插值系数 | 部分 | 相机 | 过高会更紧跟玩家 |
| camera.miniMapSize | 小地图最大尺寸 | 140 | px | 部分 | 小地图 | 实际尺寸还受视口限制 |
| ui.initialShowMiniMap | 初始显示小地图 | `true` | 布尔 | 是 | UI、小地图 | 可作为后续辅助开关 |
| ui.positionDecimals | HUD 坐标小数位 | 1 | 位 | 否 | HUD | 只影响显示 |
| ui.assistHintDistances.naturalStone | 自然辉石辅助提示距离 | 1.6 | 格 | 是 | HUD 辅助信息 | 不改变拾取半径 |
| ui.assistHintDistances.placedStone | 临时辉石辅助提示距离 | 1.7 | 格 | 是 | HUD 辅助信息 | 不改变互动距离 |
| ui.assistHintDistances.fogGate | 雾门辅助提示距离 | 3.2 | 格 | 是 | HUD 辅助信息 | 提醒夜晚风险 |
| ui.assistHintDistances.goal | 终点辅助提示距离 | 2.4 | 格 | 是 | HUD 辅助信息 | 提醒完成目标 |
| ui.worldLabelDistances.stone | 世界画面辉石标签显示距离 | 2.2 | 格 | 是 | 世界渲染、标签 | 只影响提示可见性，不改变拾取或互动 |
| message.ttlSeconds | Toast 消息显示时长 | 2.2 | 秒 | 是 | UI 消息 | 过短会读不清 |
| message.initialText | 新开局初始提示 | `v1.2-config-prep...` | 文本 | 是 | UI 消息 | 只影响文案 |
| app.maxFrameDeltaSeconds | 单帧最大模拟时间 | 0.05 | 秒 | 否 | 主循环 | 防止切后台后一次性推进过多 |

## 当前仍未迁入 GameConfig 的内容

| 当前位置 | 内容 | 暂不迁移原因 | 后续建议 |
|---|---|---|---|
| `WEB_DEMO/src/game/rules/interactionPriority.js` | Space 互动优先级表 | 当前是规则顺序，不是单纯数值；迁移前需要确认策划是否要调优先级 | 后续可迁入 `GameConfig.interaction.priorities` |
| `WEB_DEMO/src/game/rules/monsterTargetPriority.js` | 黑影目标优先级类型和 key 生成 | 目标优先级和目标识别逻辑绑定较紧 | 后续可拆成 `GameConfig.monster.targetPriority` 和目标解析器 |
| `WEB_DEMO/src/presentation/renderers/WorldRenderer.js` | 大量绘制像素、颜色、字体、标签偏移 | 任务卡允许 CSS / 渲染局部像素微调暂不迁移 | 后续视觉整理版本可新增 `GameConfig.render` 或主题文件 |
| `WEB_DEMO/src/styles.css` | HUD、顶部阶段天气条、Toast 的 CSS 尺寸和颜色 | 属于纯样式参数，本轮只记录，不进入玩法配置 | 后续 UI 主题化时再拆分 |
| `WEB_DEMO/src/game/world/TileMap.js` | `TileType`、通行地块集合、基础 tile 默认结构 | 属于地块类型定义和程序常量 | 后续如做关卡编辑器，可抽为 tile schema |

## 配置化边界

- 本轮只整理 `GameConfig.js`，没有拆分 JSON / CSV。
- 本轮没有实现外部配置加载器、配置编辑器或热更新。
- 本轮没有新增玩法系统，只让现有规则参数更容易被查找、说明和后续迁移。
- 围墙当前仍为可通行地块，是否改为地形阻挡仍属于策划待确认项。
