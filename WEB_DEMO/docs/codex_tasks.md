# Codex Tasks

本文件记录 WEB_DEMO 的开发任务。

---

# 当前任务：WEB_DEMO v0.3 GameConfig 基础配置集中化

## 任务名称

```text
WEB_DEMO v0.3 GameConfig 基础配置集中化
```

## 任务背景

```text
1. WEB_DEMO v0.2.1 已经完成最小核心循环验证：探索、辉石、工人派遣、砍树、修桥、点亮营地、日夜循环、阶段目标、轻随机地图。
2. 现阶段仍要继续迁移游戏功能，而不是立即拆 CSV / JSON。
3. 但后续功能迁移过程中，所有静态数值、文案、生成区间、成本、时长、速度、范围、数量等配置，不能继续散落在各系统代码里。
4. 本轮目标是建立一个中间层配置文件 GameConfig.js。
5. 未来当核心功能基本完成后，再把 GameConfig.js 拆分到 CSV / JSON 配置文件中。
```

## 任务目标

新增统一配置入口：

```text
WEB_DEMO/src/game/config/GameConfig.js
```

把 v0.2.1 已有系统中的静态配置集中进去，后续所有新功能都必须优先从 GameConfig 读取配置。

核心目标：

```text
当前阶段不做 CSV / JSON 读取；
当前阶段不新增玩法；
当前阶段只建立 GameConfig 作为统一静态配置中心；
后续功能迁移时，Codex 不允许把静态数值继续散落在系统文件中。
```

---

# 本轮只做

## 一、新增 GameConfig.js

创建：

```text
WEB_DEMO/src/game/config/GameConfig.js
```

建议结构如下，可根据当前代码实际情况微调：

```js
export const GameConfig = {
  version: 'WEB_DEMO v0.3',

  player: {
    moveSpeed: 4.2,
    pickupRadius: 0.65,
  },

  worker: {
    initialCount: 3,
    moveSpeed: 2.0,
    returnSpeed: 2.25,
    states: {
      idle: 'idle',
      moving: 'moving',
      working: 'working',
      returning: 'returning',
    },
  },

  jobs: {
    chop: {
      cost: 1,
      duration: 2.8,
      targetTile: 'tree_block',
      resultTile: 'grass',
      startMessage: '工人开始砍树。',
      finishMessage: '树障已清理，掉落 1 个辉石。',
      rewardStone: 1,
      label: '砍树障',
    },
    repair: {
      cost: 1,
      duration: 3.2,
      targetTile: 'broken_bridge',
      resultTile: 'bridge',
      startMessage: '工人开始修桥。',
      finishMessage: '断桥已修复。',
      label: '修桥',
    },
    lightCamp: {
      cost: 1,
      duration: 3.0,
      targetTile: 'old_camp',
      resultTile: 'camp',
      startMessage: '工人开始点亮营地。',
      finishMessage: '新营地已点亮。',
      label: '点亮营地',
    },
  },

  stone: {
    placedTtl: 10,
    naturalValue: 1,
    placedValue: 1,
    rewardValue: 1,
  },

  dayNight: {
    dayLength: 72,
    phases: [
      { id: 'day', label: '白天', end: 0.58, overlay: 0 },
      { id: 'dusk', label: '黄昏', end: 0.78, overlay: 0.12 },
      { id: 'night', label: '夜晚', end: 1, overlay: 0.34 },
    ],
  },

  map: {
    width: 46,
    height: 26,
    startX: 4,
    startYMin: 11,
    startYMax: 15,

    path: {
      minX: 2,
      endPadding: 2,
      yMin: 6,
      yMaxPadding: 7,
      carveRadius: 2,
      startCarveRadius: 4,
      goalCarveRadius: 2,
    },

    pathWave: {
      frequencyA: 0.27,
      frequencyB: 0.61,
      amplitudeAMin: 1.2,
      amplitudeAMax: 2.7,
      amplitudeBMin: 0.4,
      amplitudeBMax: 1.1,
    },

    treeIndexMin: 11,
    treeIndexMax: 15,
    treeGateHalfHeight: 4,

    riverIndexMin: 22,
    riverIndexMax: 27,
    riverSpanMin: 5,
    riverSpanMax: 7,

    campIndexMin: 31,
    campIndexMax: 36,

    goalIndexMin: 40,
    goalIndexMax: 43,

    stoneCountMin: 5,
    stoneCountMax: 8,

    forestClusterMin: 4,
    forestClusterMax: 6,
    forestClusterReservedGap: 3,
    forestClusterSpacing: 5,
    forestClusterLengthMin: 2,
    forestClusterLengthMax: 4,
  },

  text: {
    startMessage: '收集辉石，按 Space 派遣工人开路，向远方信标前进。',
    goalReached: '你抵达了阶段终点。',
    noStoneToPlace: '没有辉石可放置。',
    noPlaceForStone: '附近没有可放置辉石的位置。',
    placedStone: '放置了一枚辉石。',
    pickupStone: count => `拾取辉石 +${count}`,
    needStone: count => `需要 ${count} 个辉石。`,
    noIdleWorker: '没有空闲工人。',
    noWorkSpot: '工人找不到可到达的位置。',
    noPath: '通往目标的道路还没有打开。',
    workerSent: '已派遣工人。',
    goalText: '目标：收集辉石，派工人清路，抵达远方信标',
    controlsText: '操作：WASD / 方向键移动，Space 互动或放置辉石，R 重开',
  },
};
```

注意：

```text
1. 以上结构是建议，不要求逐字一致。
2. 但必须能覆盖当前 v0.2.1 中散落的主要静态数值和文案。
3. 不要为了“完美配置化”而做复杂抽象。
4. GameConfig.js 只是中间层，未来会拆分 CSV / JSON。
```

---

## 二、迁移当前已有硬编码

请把当前 v0.2.1 中已有的静态配置尽量迁移到 GameConfig。

重点迁移：

```text
1. 版本号：WEB_DEMO v0.3
2. 玩家移动速度
3. 玩家拾取辉石半径
4. 工人初始数量
5. 工人移动速度
6. 工人返回速度
7. 工人状态字符串
8. 砍树 / 修桥 / 点亮营地的成本
9. 砍树 / 修桥 / 点亮营地的工作时间
10. 砍树 / 修桥 / 点亮营地的目标 tile 和结果 tile
11. 砍树奖励辉石数量
12. 辉石放置持续时间
13. 辉石 value
14. 一天时长
15. 白天 / 黄昏 / 夜晚阶段比例和遮罩强度
16. 地图宽高
17. 起点位置范围
18. 主路径生成参数
19. 树障区间
20. 河流区间和河流跨度
21. 旧营地区间
22. 终点区间
23. 辉石数量范围
24. 森林簇数量、长度、间距
25. HUD 文案
26. 系统提示文案
```

---

## 三、需要改造的文件

优先修改这些文件，让它们从 GameConfig 读取静态配置：

```text
WEB_DEMO/src/game/state/GameState.js
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/systems/PlayerSystem.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/game/systems/ResourceSystem.js
WEB_DEMO/src/game/systems/DayNightSystem.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
```

如有必要，也可以轻微修改：

```text
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/presentation/renderers/TileRenderer.js
WEB_DEMO/src/presentation/renderers/UnitRenderer.js
```

但本轮不要做大改。

---

# 本轮不要做

禁止本轮实现以下内容：

```text
1. 不实现黑影。
2. 不实现围墙。
3. 不实现弓箭手。
4. 不实现矿山。
5. 不实现流民火堆。
6. 不实现狐狸成亲。
7. 不实现颠倒森林。
8. 不实现移动端虚拟摇杆。
9. 不接入正式图片资源。
10. 不接入音乐音效。
11. 不做 CSV 读取逻辑。
12. 不做 JSON 读取逻辑。
13. 不做存档系统。
14. 不改视觉视角，不把俯视角改成 45 度等距。
15. 不修改 GPT_DEMO。
16. 不修改 WEB_DEMO/index.html。
17. 不把 main.js 改成大单文件。
```

---

# 后续开发硬规则

从 v0.3 开始，必须遵守：

```text
所有新增系统的静态配置、数值、文案、生成区间、成本、时长、速度、范围、数量，必须优先写入 GameConfig.js。
不要把静态配置散落在系统文件中。
```

例如后续黑影系统，不允许在系统文件中直接硬编码：

```js
const MONSTER_SPEED = 1.6;
const MONSTER_RANGE = 4;
const MONSTERS_PER_NIGHT = 2;
```

而应写入：

```js
GameConfig.monster = {
  speed: 1.6,
  tacticalRange: 4,
  perNight: 2,
};
```

后续围墙系统应写入：

```js
GameConfig.wall = {
  cost: 2,
  hp: 3,
  buildTime: 4,
};
```

后续矿山与流民系统应写入：

```js
GameConfig.mine = {
  gatherTime: 5,
  yieldStone: 1,
};

GameConfig.refugee = {
  returnSpeed: 1.7,
  fireCooldown: 10,
};
```

---

# 允许修改

允许修改：

```text
WEB_DEMO/src/game/config/GameConfig.js
WEB_DEMO/src/game/state/GameState.js
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/systems/PlayerSystem.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/game/systems/ResourceSystem.js
WEB_DEMO/src/game/systems/DayNightSystem.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/docs/codex_tasks.md
```

谨慎修改：

```text
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/presentation/renderers/TileRenderer.js
WEB_DEMO/src/presentation/renderers/UnitRenderer.js
WEB_DEMO/README.md
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

# 文档更新要求

完成后必须更新：

## 1. WEB_DEMO/docs/changelog.md

新增：

```markdown
## v0.3.0

状态：GameConfig 基础配置集中化

内容：
- 新增 WEB_DEMO/src/game/config/GameConfig.js。
- 将 v0.2.1 中散落在系统代码中的主要静态数值集中到 GameConfig。
- 玩家、工人、任务、辉石、昼夜、地图生成和基础文案开始从 GameConfig 读取。
- 不做 CSV / JSON 读取，GameConfig 作为未来拆分配置文件前的中间层。
```

## 2. WEB_DEMO/docs/acceptance_tests.md

新增 v0.3 验收项：

```text
测试名称：WEB_DEMO v0.3 GameConfig 基础配置集中化
前置条件：已安装 Node.js
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
5. 完成 v0.2.1 核心循环验收：移动、拾取辉石、放置辉石、派工人砍树、修桥、点亮营地、观察昼夜、抵达阶段终点
6. 修改 GameConfig.js 中一个安全参数，例如 player.moveSpeed 或 dayNight.dayLength
7. 重新运行，确认对应效果变化
预期结果：
1. 浏览器控制台无 JavaScript 报错
2. v0.2.1 核心玩法不被破坏
3. GameConfig.js 存在并被多个系统引用
4. 主要静态数值不再散落在各系统文件中
5. 修改 GameConfig 的关键参数能影响游戏表现
6. WEB_DEMO/index.html 仍只加载 /src/main.js
7. WEB_DEMO/src/main.js 仍只负责启动 GameApp
```

## 3. WEB_DEMO/docs/known_issues.md

新增或更新：

```text
GameConfig 目前仍是 JS 静态配置文件，尚未拆分到 CSV / JSON。
这是当前阶段有意保留的中间形态。
未来核心功能基本迁移完成后，再进行 CSV / JSON 拆分。
```

---

# 验收标准

必须满足：

```text
1. 新增 WEB_DEMO/src/game/config/GameConfig.js。
2. GameConfig 至少包含 version、player、worker、jobs、stone、dayNight、map、text 这些配置段。
3. GameState 使用 GameConfig.version 和 GameConfig.text.startMessage。
4. PlayerSystem 使用 GameConfig.player.moveSpeed 或 GameState 初始化时从 GameConfig 读取速度。
5. ResourceSystem 使用 GameConfig.player.pickupRadius、GameConfig.stone.placedTtl 和相关文案。
6. WorkerSystem 使用 GameConfig.worker.moveSpeed、returnSpeed、jobs 配置、任务文案、奖励配置。
7. InteractionSystem 从 GameConfig.jobs 构建可互动目标，而不是在本文件中硬编码 TARGETS。
8. DayNightSystem 使用 GameConfig.dayNight.dayLength 和 phases。
9. MapGenerator 使用 GameConfig.map 中的宽高、起点范围、段落范围、辉石数量范围、森林簇参数等。
10. HudRenderer 使用 GameConfig.text 中的目标和操作说明，或至少从 state / config 获取对应文案。
11. v0.2.1 的核心玩法不被破坏。
12. 不引入 CSV / JSON 读取。
13. 不新增黑影、围墙、弓箭手、矿山、流民、奇遇等新玩法。
14. WEB_DEMO/index.html 未被修改。
15. WEB_DEMO/src/main.js 仍只负责启动 GameApp。
16. GPT_DEMO 未被修改。
17. changelog、acceptance_tests、known_issues 已更新。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改了哪些文件。
2. 新增了哪些配置段。
3. 哪些硬编码已经迁移到 GameConfig。
4. 如何运行。
5. 如何验证 GameConfig 生效。
6. 哪些内容留到后续 CSV / JSON 拆分。
7. 是否存在已知问题。
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
WEB_DEMO/src/game/state/GameState.js
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/game/systems/ResourceSystem.js
WEB_DEMO/src/game/systems/DayNightSystem.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
```

必要时再读取：

```text
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/game/systems/PlayerSystem.js
WEB_DEMO/src/engine/math/pathfinding.js
```

不要读取或复制 GPT_DEMO/index.html，本轮不需要参考 GPT_DEMO 代码。
