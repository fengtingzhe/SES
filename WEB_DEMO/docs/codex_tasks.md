# Codex Tasks

本文件记录 WEB_DEMO 的开发任务。

---

# 当前任务：WEB_DEMO v0.4 夜晚黑影压力系统

## 任务名称

```text
WEB_DEMO v0.4 夜晚黑影压力系统
```

---

## 任务背景

```text
1. WEB_DEMO v0.2.1 已经完成最小核心循环：探索、辉石、工人派遣、砍树、修桥、点亮营地、日夜循环、阶段目标、轻随机地图。
2. WEB_DEMO v0.3 已经建立 GameConfig.js，把玩家、工人、任务、辉石、昼夜、地图生成和基础文案集中管理。
3. GameConfig.js 是当前阶段的静态配置中心，后续新增系统的静态配置、数值、文案、范围、时长、数量都必须优先写入 GameConfig。
4. v0.4 目标是迁移夜晚压力系统，让游戏从“白天开路 Demo”进入“有风险、有策略张力的远征 Demo”。
5. 本轮重点是黑影、黑雾口、夜晚生成、局部感知、辉石诱敌、工人风险。
6. 本轮不做围墙、弓箭手、矿山、流民、奇遇等系统。
```

---

## 前置条件

开始本任务前，必须确认：

```text
1. WEB_DEMO/src/game/config/GameConfig.js 已存在。
2. GameConfig 已包含 version、player、worker、jobs、stone、dayNight、map、text 等配置段。
3. GameConfig 中字段有中文注释，便于策划理解和维护。
4. 当前 WEB_DEMO/index.html 仍是薄入口，只加载 /src/main.js。
5. 当前 WEB_DEMO/src/main.js 仍只负责启动 GameApp。
```

如果 v0.3 未完成，不要执行本任务。

---

## 任务目标

实现最小夜晚黑影压力系统：

```text
白天探索与派工
↓
夜晚黑雾口生成黑影
↓
黑影向最近已激活营地行军
↓
行军过程中在局部范围内寻找目标
↓
玩家可以用地面辉石诱导黑影
↓
工人夜晚在外有被抓风险
↓
被抓工人从队伍中移除或标记不可用
```

这一版的目标是验证：

```text
夜晚压力 + 工人风险 + 辉石诱敌
```

是否成立。

---

# 本轮只做

## 一、黑雾口

新增黑雾口概念。

要求：

```text
1. 地图上生成若干黑雾口。
2. 黑雾口应出现在主路径附近或森林边缘，不能挡住必经通路。
3. 黑雾口夜晚生成黑影。
4. 黑雾口白天不主动生成黑影。
5. 黑雾口先用简单图形表现即可。
```

建议新增或修改：

```text
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/presentation/renderers/TileRenderer.js
```

如需新增 tile type，可添加：

```text
fog_gate
```

也可以用独立实体数组表示黑雾口，例如：

```text
state.fogGates
```

---

## 二、黑影实体

新增黑影实体。

黑影至少包含：

```text
id
x
y
state
target
targetType
speed
```

推荐状态：

```text
spawning / marching / chasing / consumingStone / catchingWorker / leaving
```

本轮可以简化，但必须能看出：

```text
黑影从黑雾口出现
黑影朝营地方向移动
黑影能响应局部范围目标
黑影能抓走工人或吃掉辉石
```

建议新增：

```text
WEB_DEMO/src/game/systems/MonsterSystem.js
```

---

## 三、夜晚生成规则

夜晚开始后，黑雾口生成黑影。

要求：

```text
1. 每晚生成数量由 GameConfig.monster.perNight 控制。
2. 每晚生成次数不能跨天重复累计。
3. 黑影只在夜晚生成。
4. 白天到来时，剩余黑影可以消失或撤退，本轮任选一种简单实现。
5. HUD 或调试信息中能看到本夜黑影数量。
```

注意：

```text
不要把黑影生成数量硬编码在 MonsterSystem 中。
必须从 GameConfig.monster 读取。
```

---

## 四、黑影行军逻辑

黑影默认目标不是全图随机目标，而是：

```text
最近已激活营地 / 部落
```

规则：

```text
1. 黑影出生后选择最近已激活营地作为远程行军方向。
2. 黑影不应该无视附近营地，直接去攻击部落。
3. 黑影行军过程中只在局部感知范围内切换目标。
4. 远距离辉石不应影响黑影目标。
```

这条规则来自当前项目已确认设计：

```text
黑影先就近攻击距离最近的营地；
在行进过程中，4 格范围内如果有可攻击目标，再按目标优先级判定。
```

---

## 五、4 格局部感知

黑影局部感知范围必须从 GameConfig 读取。

推荐配置：

```js
monster: {
  // 黑影局部感知范围，单位：格。只在该范围内寻找辉石、工人、玩家等目标。
  tacticalRange: 4,
}
```

感知规则：

```text
1. 黑影只响应 tacticalRange 范围内的局部目标。
2. 范围外的辉石不能吸引黑影。
3. 范围外的工人不能立刻吸引黑影。
4. 这样可以避免玩家远距离反复丢辉石 / 捡辉石造成黑影拉扯。
```

---

## 六、目标优先级

本轮最小目标优先级：

```text
1. 地面放置的辉石
2. 正在外出的工人
3. 玩家
4. 当前行军目标营地
```

说明：

```text
辉石只指玩家放置到地面的辉石，不包括所有自然辉石。
工人包括 moving / working / returning 状态的工人。
idle 且在营地附近的工人本轮可以暂时不被抓。
玩家被追上后本轮可以只显示提示，不做失败结算。
营地本轮只作为黑影行军方向，不做营地伤害。
```

---

## 七、辉石诱敌

本轮需要恢复辉石作为诱饵的基础作用。

规则：

```text
1. 玩家放置在地面的辉石可以吸引 4 格范围内的黑影。
2. 黑影接触辉石后，辉石消失。
3. 黑影可以同时消失，表示被辉石驱散；或者进入 leaving 状态后离开，本轮任选一种简单实现。
4. 自然生成的可拾取辉石本轮建议不吸引黑影，避免早期地图混乱。
```

推荐：

```text
只有 stone.source === 'placed' 的辉石吸引黑影。
```

---

## 八、工人风险

本轮需要让夜晚派出去的工人有风险。

规则：

```text
1. 黑影接近外出工人后，可以抓走工人。
2. 被抓工人从 state.workers 中移除，或标记为 captured 并不再可用。
3. 如果工人被抓时正在执行任务，必须释放目标 tile 的 reserved 状态。
4. 如果工人被抓时正在采集或占用某个工作点，必须释放工作点占用。
5. v0.4 当前没有矿山，但要为后续矿山占用释放留好规则。
```

这一点非常重要，因为此前 GPT_DEMO 中出现过类似问题：

```text
矿山上的工人被抓走后，矿山仍提示已有工人。
```

v0.4 必须从一开始就避免这类占用残留问题。

---

## 九、工人撤退

本轮可以做最小撤退逻辑。

规则：

```text
1. 夜晚来临时，在外工人可以继续执行任务，也可以尝试返回，本轮由 Codex 选择简单实现。
2. 如果检测到附近黑影，工人可以进入 fleeing 状态，返回最近营地。
3. 如果不做 fleeing 状态，必须在 known_issues.md 记录：工人遇到黑影主动撤退逻辑后续完善。
```

推荐：

```text
v0.4 可以先实现“被黑影接近后抓走”，不强制实现复杂躲避。
```

---

# GameConfig 要求

必须在 `GameConfig.js` 中新增或预留 `monster` 配置段。

示例结构：

```js
// 黑影系统配置：控制夜晚黑影生成、移动、感知、抓人和辉石诱导。
monster: {
  // 每晚最多生成的黑影数量。数值越大，夜晚压力越强。
  perNight: 2,

  // 黑影移动速度，单位：格 / 秒。
  moveSpeed: 1.6,

  // 黑影局部感知范围，单位：格。只在该范围内寻找辉石、工人、玩家等目标。
  tacticalRange: 4,

  // 黑影接触辉石的判定距离，单位：格。
  consumeStoneRange: 0.55,

  // 黑影抓走工人的判定距离，单位：格。
  catchWorkerRange: 0.55,

  // 黑影追上玩家的判定距离，单位：格。本轮只显示提示，不做失败结算。
  touchPlayerRange: 0.6,

  // 白天到来时是否清空剩余黑影。v0.4 可设为 true，降低复杂度。
  clearAtDay: true,
}
```

字段必须有中文注释，说明用途、单位、影响范围和调参风险。

如果需要新增文本，写入：

```js
text: {
  nightStarts: '夜晚降临，黑影开始游荡。',
  monsterConsumedStone: '黑影被辉石吸引并消散。',
  workerCaptured: '一名工人被黑影抓走了。',
  playerTouchedByMonster: '黑影贴近了你，寒意刺骨。',
}
```

---

# 建议新增文件

可以新增：

```text
WEB_DEMO/src/game/systems/MonsterSystem.js
```

如有需要，也可以新增：

```text
WEB_DEMO/src/game/entities/monster.js
```

但不要过度抽象。

---

# 允许修改

允许修改：

```text
WEB_DEMO/src/game/config/GameConfig.js
WEB_DEMO/src/game/state/GameState.js
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/game/systems/MonsterSystem.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/ResourceSystem.js
WEB_DEMO/src/game/systems/DayNightSystem.js
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
1. 不实现围墙。
2. 不实现弓箭手。
3. 不实现矿山。
4. 不实现流民火堆。
5. 不实现狐狸成亲。
6. 不实现颠倒森林。
7. 不接入正式图片资源。
8. 不接入音乐音效。
9. 不做 CSV / JSON 读取。
10. 不做存档系统。
11. 不做移动端虚拟摇杆。
12. 不改视觉视角。
13. 不做复杂失败结算。
14. 不做复杂战斗系统。
```

---

# 文档更新要求

完成后必须更新：

## 1. WEB_DEMO/docs/changelog.md

新增：

```markdown
## v0.4.0

状态：夜晚黑影压力系统

内容：
- 新增黑雾口与黑影实体。
- 夜晚从黑雾口生成黑影。
- 黑影默认向最近已激活营地行军。
- 黑影在局部感知范围内响应放置辉石、外出工人和玩家。
- 放置辉石可以吸引并驱散黑影。
- 黑影可以抓走外出工人。
- 工人被抓后释放任务目标的 reserved 状态。
- 黑影相关静态配置集中在 GameConfig.monster，并配有中文注释。
```

## 2. WEB_DEMO/docs/acceptance_tests.md

新增 v0.4 验收项：

```text
测试名称：WEB_DEMO v0.4 夜晚黑影压力系统
前置条件：已安装 Node.js，v0.3 GameConfig 已完成
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
5. 等待进入夜晚，观察黑影是否从黑雾口生成
6. 观察黑影是否向最近已激活营地行军
7. 在黑影 4 格范围内放置辉石
8. 确认黑影被辉石吸引，并在接触辉石后辉石消失
9. 派工人在夜晚执行任务，观察黑影接近后是否能抓走工人
10. 工人被抓后，再次尝试与原任务目标互动
预期结果：
1. 浏览器控制台无 JavaScript 报错
2. 夜晚能生成黑影
3. 黑影默认向最近已激活营地移动
4. 4 格范围外的辉石不会远距离吸引黑影
5. 4 格范围内的放置辉石可以吸引黑影
6. 黑影接触放置辉石后，辉石消失，黑影消散或离开
7. 黑影接近外出工人后，工人被抓走或不可再用
8. 工人被抓后，原任务目标不应永久 reserved
9. 白天到来时黑影清空或撤退
10. v0.2.1 核心循环仍可运行
11. GameConfig.monster 字段有中文注释
```

## 3. WEB_DEMO/docs/known_issues.md

记录本轮未做内容：

```text
v0.4 只实现最小黑影压力，不包含围墙、弓箭手、防御战、复杂失败结算、矿山、流民、奇遇。
工人主动躲避黑影、黑影更复杂的寻路和战斗反馈可以后续完善。
```

---

# 验收标准

必须满足：

```text
1. WEB_DEMO v0.3 已完成，GameConfig.js 存在。
2. GameConfig 新增 monster 配置段，并有中文注释。
3. 地图中存在黑雾口或等价黑影出生点。
4. 夜晚能生成黑影。
5. 黑影每晚生成数量从 GameConfig.monster.perNight 读取。
6. 黑影默认向最近已激活营地移动。
7. 黑影只在 GameConfig.monster.tacticalRange 范围内响应局部目标。
8. 玩家放置的辉石可以吸引范围内黑影。
9. 黑影接触放置辉石后，辉石消失，黑影消散或离开。
10. 黑影可以抓走外出工人。
11. 工人被抓后，不应留下永久 reserved 目标。
12. 白天到来时黑影清空或撤退。
13. v0.2.1 核心循环未被破坏。
14. 不实现围墙、弓箭手、矿山、流民、奇遇等非本轮内容。
15. WEB_DEMO/index.html 未被修改。
16. WEB_DEMO/src/main.js 仍只负责启动 GameApp。
17. GPT_DEMO 未被修改。
18. changelog、acceptance_tests、known_issues 已更新。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改了哪些文件。
2. 新增了哪些模块。
3. GameConfig.monster 包含哪些字段。
4. 黑影生成和目标选择逻辑是什么。
5. 如何保证黑影默认攻击最近营地，而不是远距离攻击部落。
6. 4 格局部感知如何实现。
7. 工人被抓后如何释放 reserved 状态。
8. 如何运行和验证。
9. 哪些内容留到 v0.5。
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
WEB_DEMO/src/game/systems/ResourceSystem.js
WEB_DEMO/src/game/systems/DayNightSystem.js
WEB_DEMO/src/app/GameApp.js
```

必要时再读取渲染相关文件：

```text
WEB_DEMO/src/presentation/renderers/TileRenderer.js
WEB_DEMO/src/presentation/renderers/UnitRenderer.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
```

不要读取或复制 GPT_DEMO/index.html，本轮不需要参考 GPT_DEMO 代码。
