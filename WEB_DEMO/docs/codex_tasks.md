# Codex Tasks

本文件记录 WEB_DEMO 的开发任务。

---

# 当前任务：WEB_DEMO v0.6 矿山 / 流民 / 人口补给系统

## 任务名称

```text
WEB_DEMO v0.6 矿山 / 流民 / 人口补给系统
```

---

## 任务背景

```text
1. WEB_DEMO v0.2.1 已完成最小核心循环：探索、辉石、工人派遣、砍树、修桥、点亮营地、日夜循环、阶段目标、轻随机地图。
2. WEB_DEMO v0.3 已建立 GameConfig.js，所有静态配置、数值、文案、范围、时长、数量都应优先写入 GameConfig。
3. WEB_DEMO v0.4 已完成夜晚黑影压力：黑雾口、黑影生成、最近营地行军、4 格局部感知、辉石诱敌、工人被抓与 reserved 释放。
4. WEB_DEMO v0.5 已完成最小防御闭环：墙基、围墙、围墙 HP、黑影攻击围墙、弓箭手招募与自动射击。
5. v0.6 目标是加入最小资源点与人口补给系统，让玩家不再只依赖初始工人和地图散落辉石。
6. 本轮重点是矿山、矿工采矿、矿山占用释放、流民火堆、招募流民、流民返回营地、流民转化为空闲工人。
```

---

## 前置条件

开始本任务前，必须确认：

```text
1. GameConfig.js 已存在，并包含 player / worker / jobs / stone / dayNight / monster / wall / archer / map / text 等配置段。
2. v0.5 的围墙与弓箭手系统已经能运行。
3. 黑影可以抓走外出工人，并且 WorkerSystem 已有 releaseWorkerReservation / captureWorker 一类清理逻辑。
4. WEB_DEMO/index.html 仍是薄入口，只加载 /src/main.js。
5. WEB_DEMO/src/main.js 仍只负责启动 GameApp。
```

如果 v0.5 未完成，不要执行本任务。

---

## 任务目标

实现最小资源点与人口补给闭环：

```text
玩家探索地图
↓
发现矿山和流民火堆
↓
玩家消耗辉石派工人占用矿山采矿
↓
矿山周期性产出辉石
↓
玩家消耗辉石招募流民
↓
流民返回最近已激活营地
↓
流民抵达营地后转化为空闲工人
↓
玩家获得更长线的资源与人口补给
```

这一版的目标是验证：

```text
持续资源产出 + 人口补充 + 远征补给线
```

是否成立。

---

# 本轮只做

## 一、矿山

新增最小矿山系统。

要求：

```text
1. 地图上生成若干矿山。
2. 矿山应出现在主路径附近，不能挡住必经通路。
3. 玩家靠近矿山按 Space，可以消耗辉石派遣空闲工人采矿。
4. 同一矿山同一时间只能被一个工人占用。
5. 工人到达矿山后进入 mining / working 状态，本轮可复用 working，也可新增 mining 状态。
6. 矿山按周期产出辉石。
7. 产出的辉石可以直接进入玩家资源，也可以掉落在矿山旁，本轮任选一种简单实现。
8. 工人被黑影抓走、死亡、移除或任务中断时，矿山占用必须释放。
```

重点：

```text
必须避免“矿工被抓走后，矿山仍提示已有工人”的问题。
```

这是本轮最高优先级风险点。

---

## 二、矿山占用规则

矿山必须有明确占用状态。

建议字段：

```text
mineId
workerId
occupied
progress
```

可以存在于：

```text
state.mines
```

也可以存在于 tile 上，例如：

```text
tile.mine = { workerId, progress }
```

但必须保证：

```text
1. 工人被抓后能通过 worker.id 找到并释放矿山。
2. 工人完成或取消占用后，矿山不再提示已有工人。
3. 如果后续扩展矿山等级或产出速度，不需要重写整套逻辑。
```

---

## 三、流民火堆

新增最小流民火堆系统。

要求：

```text
1. 地图上生成若干流民火堆。
2. 流民火堆应出现在主路径附近或营地之间。
3. 玩家靠近流民火堆按 Space，可以消耗辉石招募流民。
4. 每个流民火堆可以有有限流民数量，例如 1～2 个。
5. 招募后生成一个 refugee 实体。
6. 流民会自动返回最近已激活营地或部落。
7. 流民抵达营地后转化为空闲工人。
8. 转化后从 state.refugees 中移除，并向 state.workers 增加新工人。
```

本轮不要求：

```text
1. 流民火堆刷新。
2. 流民复杂 AI。
3. 流民被黑影抓走。
4. 流民职业选择。
```

如果实现流民被黑影抓走成本过高，可记录到 known_issues。

---

## 四、人口补给

新增基本人口统计。

要求：

```text
1. HUD 显示当前工人数、流民数或人口补给信息。
2. 流民转化为空闲工人后，工人数量增加。
3. 新工人应能被派遣去砍树、修桥、点营地、建墙或采矿。
4. 新工人应拥有唯一 id，不能和已有工人冲突。
```

---

## 五、与黑影系统的关系

本轮必须处理：

```text
1. 黑影抓走正在采矿的工人时，矿山占用被释放。
2. 黑影抓走普通任务工人时，v0.4 / v0.5 的 reserved 释放逻辑不被破坏。
3. 黑影是否抓流民，本轮可选。
```

推荐：

```text
v0.6 暂不让黑影抓流民，只记录为 known_issues；优先保证矿山占用释放正确。
```

---

# GameConfig 要求

必须在 `GameConfig.js` 中新增或扩展以下配置段。

## mine

```js
// 矿山系统配置：控制矿山生成、采矿成本、采矿周期和产出。
mine: {
  // 派遣工人占用矿山需要消耗的辉石数量。
  assignCost: 1,

  // 工人完成一次采矿所需时间，单位：秒。数值越大，矿山产出越慢。
  workDuration: 6,

  // 单次采矿产出的辉石数量。
  yieldStone: 1,

  // 地图生成的矿山最小数量，单位：个。
  countMin: 1,

  // 地图生成的矿山最大数量，单位：个。
  countMax: 2,

  // 矿山生成主路径索引最小值，单位：路径索引。
  indexMin: 14,

  // 矿山生成主路径索引最大值，单位：路径索引。
  indexMax: 36,
}
```

## refugee

```js
// 流民系统配置：控制流民火堆、招募成本、返程速度和转化规则。
refugee: {
  // 招募一个流民需要消耗的辉石数量。
  recruitCost: 1,

  // 流民返回营地的移动速度，单位：格 / 秒。
  moveSpeed: 1.7,

  // 流民抵达营地并转化为工人的判定距离，单位：格。
  arriveRange: 0.6,

  // 每个流民火堆初始流民数量最小值，单位：个。
  countPerCampMin: 1,

  // 每个流民火堆初始流民数量最大值，单位：个。
  countPerCampMax: 2,

  // 地图生成流民火堆最小数量，单位：个。
  fireCountMin: 1,

  // 地图生成流民火堆最大数量，单位：个。
  fireCountMax: 2,

  // 流民火堆生成主路径索引最小值，单位：路径索引。
  fireIndexMin: 10,

  // 流民火堆生成主路径索引最大值，单位：路径索引。
  fireIndexMax: 34,
}
```

## population

```js
// 人口系统配置：控制新工人 id、出生偏移和人口提示。
population: {
  // 流民转化为工人时，是否生成在抵达营地附近。
  spawnAtCamp: true,

  // 新工人相对营地中心的出生偏移候选，单位：格。
  workerSpawnOffsets: [
    { x: -0.7, y: -0.8 },
    { x: -0.8, y: 0.8 },
    { x: 0.7, y: 0.7 },
    { x: 0.8, y: -0.7 }
  ],
}
```

字段必须有中文注释，说明用途、单位、影响范围和调参风险。

如果需要新增文本，写入：

```js
text: {
  mineAssigned: '工人开始采矿。',
  mineOccupied: '这座矿山已有工人。',
  mineProduced: count => `矿山产出辉石 +${count}`,
  refugeeRecruited: '一名流民正在返回营地。',
  refugeeJoined: '一名流民加入，成为新的工人。',
  refugeeFireEmpty: '这里已经没有流民了。',
  needMoreStoneForMine: count => `采矿需要 ${count} 个辉石。`,
  needMoreStoneForRefugee: count => `招募流民需要 ${count} 个辉石。`,
}
```

---

# 建议新增文件

可以新增：

```text
WEB_DEMO/src/game/systems/MineSystem.js
WEB_DEMO/src/game/systems/RefugeeSystem.js
```

也可以将人口转化逻辑放入：

```text
WEB_DEMO/src/game/systems/PopulationSystem.js
```

但不要把所有逻辑堆到 `GameApp.js`、`MapGenerator.js` 或 `InteractionSystem.js` 中。

---

# 允许修改

允许修改：

```text
WEB_DEMO/src/game/config/GameConfig.js
WEB_DEMO/src/game/state/GameState.js
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/game/systems/MineSystem.js
WEB_DEMO/src/game/systems/RefugeeSystem.js
WEB_DEMO/src/game/systems/PopulationSystem.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/MonsterSystem.js
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/app/GameApp.js
WEB_DEMO/src/presentation/renderers/TileRenderer.js
WEB_DEMO/src/presentation/renderers/UnitRenderer.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/docs/codex_tasks.md
```

---

# 禁止修改

禁止修改：

```text
GPT_DEMO/**
WEB_DEMO/index.html
WEB_DEMO/src/main.js
AI_RULES/**
DESIGN_HUB/**
AI_TASKS/**
根目录 README.md
PROJECT_STATUS.md
```

---

# 本轮不要做

禁止本轮实现：

```text
1. 不实现完整职业系统。
2. 不实现矿山升级。
3. 不实现流民火堆刷新。
4. 不实现流民复杂 AI。
5. 不实现狐狸成亲。
6. 不实现颠倒森林。
7. 不接入正式图片资源。
8. 不接入音乐音效。
9. 不做 CSV / JSON 读取。
10. 不做存档系统。
11. 不做移动端虚拟摇杆。
12. 不改视觉视角。
13. 不做复杂失败结算。
14. 不强制重写黑影寻路；v0.6 可继续使用直线移动。
```

---

# 文档更新要求

完成后必须更新：

## 1. WEB_DEMO/docs/changelog.md

新增：

```markdown
## v0.6.0

状态：矿山 / 流民 / 人口补给系统

内容：
- 新增矿山资源点。
- 玩家可以消耗辉石派工人采矿。
- 矿山同一时间只能被一个工人占用。
- 矿山周期性产出辉石。
- 工人被黑影抓走后，矿山占用会被释放。
- 新增流民火堆。
- 玩家可以消耗辉石招募流民。
- 流民会返回最近已激活营地，并转化为空闲工人。
- 新增人口补给信息展示。
- 矿山、流民和人口相关静态配置集中在 GameConfig.mine / GameConfig.refugee / GameConfig.population，并配有中文注释。
```

## 2. WEB_DEMO/docs/acceptance_tests.md

新增 v0.6 验收项：

```text
测试名称：WEB_DEMO v0.6 矿山 / 流民 / 人口补给系统
前置条件：已安装 Node.js，v0.5 防御系统已完成
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
5. 观察地图上是否存在矿山和流民火堆
6. 收集足够辉石
7. 靠近矿山，按 Space 派工人采矿
8. 确认矿山进入占用状态，并周期性产出辉石
9. 在矿工外出或采矿时等待夜晚黑影接近，观察矿工被抓后的矿山状态
10. 矿工被抓后，再次靠近同一矿山尝试派遣新工人
11. 靠近流民火堆，按 Space 招募流民
12. 观察流民是否返回最近已激活营地
13. 流民抵达营地后，确认工人数增加
预期结果：
1. 浏览器控制台无 JavaScript 报错
2. GameConfig.js 存在 mine / refugee / population 配置段，关键字段有中文注释
3. 地图中存在矿山和流民火堆
4. 玩家可以派工人采矿
5. 同一矿山同一时间只能被一个工人占用
6. 矿山能产出辉石
7. 矿工被抓后，矿山占用被释放，可再次派遣工人
8. 玩家可以招募流民
9. 流民会返回最近已激活营地或部落
10. 流民抵达后转化为空闲工人，工人数增加
11. 新工人可以继续执行砍树、修桥、点营地、建墙或采矿
12. v0.5 的黑影、防御、弓箭手系统不被破坏
13. 本轮不包含完整职业系统、矿山升级、流民火堆刷新或奇遇
```

## 3. WEB_DEMO/docs/known_issues.md

记录本轮未做内容：

```text
v0.6 只实现最小矿山 / 流民 / 人口补给闭环，不包含完整职业系统、矿山升级、流民火堆刷新、流民被黑影抓走、复杂人口管理或正式美术表现。
矿山产出和流民补给仍是原型数值，后续需要配合整体经济节奏调参。
```

---

# 验收标准

必须满足：

```text
1. GameConfig 新增 mine 配置段，并有中文注释。
2. GameConfig 新增 refugee 配置段，并有中文注释。
3. GameConfig 新增 population 配置段，并有中文注释。
4. 地图中存在矿山。
5. 地图中存在流民火堆。
6. 玩家可以消耗辉石派工人采矿。
7. 同一矿山同一时间只能被一个工人占用。
8. 矿山能周期性产出辉石。
9. 矿工被黑影抓走后，矿山占用会释放。
10. 玩家可以消耗辉石招募流民。
11. 流民会返回最近已激活营地或部落。
12. 流民抵达后转化为空闲工人。
13. 新工人拥有唯一 id，并可参与既有任务。
14. v0.5 的围墙、弓箭手、黑影、辉石诱敌和工人被抓逻辑不被破坏。
15. 本轮不实现完整职业系统、矿山升级、流民火堆刷新、奇遇、正式美术、CSV / JSON 读取。
16. WEB_DEMO/index.html 未被修改。
17. WEB_DEMO/src/main.js 仍只负责启动 GameApp。
18. GPT_DEMO 未被修改。
19. changelog、acceptance_tests、known_issues 已更新。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改了哪些文件。
2. 新增了哪些模块。
3. GameConfig.mine / GameConfig.refugee / GameConfig.population 新增了哪些字段。
4. 矿山采矿流程是什么。
5. 矿山占用如何防止残留。
6. 流民招募和返程逻辑是什么。
7. 流民如何转化为空闲工人。
8. 如何运行和验证。
9. 哪些内容留到 v0.7。
10. 是否存在已知问题。
```

---

# 给 Codex 的读取方式

Codex 开始本任务时，应优先读取：

```text
WEB_DEMO/docs/codex_tasks.md
WEB_DEMO/README.md
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/src/game/config/GameConfig.js
WEB_DEMO/src/game/state/GameState.js
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/MonsterSystem.js
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/app/GameApp.js
```

必要时再读取：

```text
WEB_DEMO/src/game/systems/ResourceSystem.js
WEB_DEMO/src/game/systems/CampSystem.js
WEB_DEMO/src/presentation/renderers/TileRenderer.js
WEB_DEMO/src/presentation/renderers/UnitRenderer.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
```

不要读取或复制 GPT_DEMO/index.html，本轮不需要参考 GPT_DEMO 代码。
