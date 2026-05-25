# Codex Tasks

本文件记录 WEB_DEMO 的开发任务。

---

# 当前任务：WEB_DEMO v0.5 围墙 / 弓箭手 / 防御系统

## 任务名称

```text
WEB_DEMO v0.5 围墙 / 弓箭手 / 防御系统
```

---

## 任务背景

```text
1. WEB_DEMO v0.2.1 已经完成最小核心循环：探索、辉石、工人派遣、砍树、修桥、点亮营地、日夜循环、阶段目标、轻随机地图。
2. WEB_DEMO v0.3 已经建立 GameConfig.js，所有静态配置、数值、文案、范围、时长、数量都应优先写入 GameConfig。
3. WEB_DEMO v0.4 已经完成最小夜晚黑影压力：黑雾口、黑影生成、最近营地行军、4 格局部感知、辉石诱敌、工人被抓与 reserved 释放。
4. v0.5 目标是在黑影压力基础上加入最小防御闭环。
5. 本轮重点是墙基、围墙、围墙 HP、黑影攻击围墙、弓箭手、弓箭手自动射击黑影。
6. 黑影当前可以继续使用 v0.4 的直线移动，本轮不强制实现复杂寻路。
```

---

## 前置条件

开始本任务前，必须确认：

```text
1. WEB_DEMO/src/game/config/GameConfig.js 已存在。
2. GameConfig 已包含 monster 配置段，并有中文注释。
3. WEB_DEMO/src/game/systems/MonsterSystem.js 已存在。
4. 夜晚可以生成黑影。
5. 黑影可以被玩家放置的辉石吸引。
6. 黑影可以抓走外出工人，并释放任务目标 reserved 状态。
7. WEB_DEMO/index.html 仍是薄入口，只加载 /src/main.js。
8. WEB_DEMO/src/main.js 仍只负责启动 GameApp。
```

如果 v0.4 未完成，不要执行本任务。

---

## 任务目标

实现最小防御闭环：

```text
白天收集辉石
↓
玩家在营地附近建造墙基 / 围墙
↓
夜晚黑影靠近营地
↓
黑影优先攻击局部范围内的围墙
↓
围墙承受伤害并可能被摧毁
↓
玩家可以招募弓箭手
↓
弓箭手自动射击范围内黑影
↓
夜晚压力从“只能用辉石诱敌”升级为“辉石诱敌 + 防御建设”
```

这一版的目标是验证：

```text
防御建设 + 自动单位防守 + 黑影夜袭压力
```

是否成立。

---

# 本轮只做

## 一、墙基与围墙

新增最小围墙系统。

要求：

```text
1. 地图上应存在可建造墙的位置。
2. 墙位优先出现在起点部落 / 已激活营地附近。
3. 玩家靠近墙基或可建墙位置，按 Space 可以消耗辉石派工人建墙。
4. 工人到达后执行建墙工作。
5. 建造完成后生成围墙。
6. 围墙有 HP。
7. 围墙可以被黑影攻击。
8. 围墙 HP <= 0 后被摧毁，恢复为可建墙状态或普通地面，本轮任选一种简单实现。
```

建议表现：

```text
墙基：浅灰 / 木桩图形
围墙：深色木墙 / 石墙块
受损围墙：颜色变暗或显示 HP 文本
```

---

## 二、围墙建造规则

本轮可以采用简单规则，不需要复杂自由建造。

推荐方案：

```text
1. 每个已激活营地左右两侧或关键通路附近生成固定墙基。
2. 玩家只能在墙基上建墙。
3. 不做任意地点自由放置围墙。
4. 不做复杂建筑规划 UI。
```

原因：

```text
v0.5 目标是验证防御闭环，不是验证完整建造编辑器。
```

---

## 三、黑影攻击围墙

扩展 MonsterSystem，使黑影在局部感知范围内可以识别围墙。

目标优先级建议调整为：

```text
1. 地面放置的辉石
2. 外出工人
3. 可攻击围墙
4. 玩家
5. 当前行军目标营地
```

说明：

```text
1. 辉石仍然是最高优先级诱敌目标。
2. 工人仍然有夜晚风险。
3. 围墙用于保护营地与路线，是黑影接近营地时的主要攻击目标。
4. 玩家被追上本轮仍只显示提示，不做失败结算。
5. 营地本轮仍可只作为行军目标，不做营地 HP。
```

围墙攻击规则：

```text
1. 黑影接近围墙后进入攻击状态或停留攻击。
2. 按 GameConfig.monster.attackInterval 或 wallDamageInterval 对围墙造成伤害。
3. 每次伤害值从 GameConfig.monster.wallDamage 读取。
4. 围墙 HP 归零后被摧毁。
5. 黑影摧毁围墙后继续选择目标。
```

---

## 四、弓箭手

新增最小弓箭手单位。

要求：

```text
1. 玩家可以消耗辉石招募弓箭手。
2. 弓箭手可以从起点部落或已激活营地生成。
3. 弓箭手不需要玩家直接操作。
4. 弓箭手自动寻找射程内黑影。
5. 弓箭手按攻击间隔射击。
6. 黑影被命中后扣 HP。
7. 黑影 HP <= 0 后消失。
```

本轮可以简化：

```text
1. 弓箭手可以站在营地附近，不需要复杂巡逻。
2. 弓箭可以用简单线条或闪光表现。
3. 不需要弹道物理。
4. 不需要弓箭手被黑影攻击。
```

---

## 五、弓箭手招募入口

本轮不做复杂职业系统。

推荐简单方案：

```text
1. 在起点部落 / 已激活营地附近添加“弓箭训练点”或“弓箭营占位点”。
2. 玩家靠近后按 Space，消耗辉石招募弓箭手。
3. 招募出的弓箭手留在营地附近防守。
4. 后续版本再和流民 / 职业系统合并。
```

如果 Codex 认为本轮做弓箭训练点过多，也可以采用临时方案：

```text
玩家靠近部落按指定互动目标招募弓箭手。
```

但必须保证：

```text
弓箭手招募成本、射程、攻击间隔、伤害、HP 等静态参数进入 GameConfig.archer。
```

---

# GameConfig 要求

必须在 `GameConfig.js` 中新增或扩展以下配置段：

## wall

```js
// 围墙系统配置：控制建墙成本、建造时间、生命值和损坏反馈。
wall: {
  // 建造一段围墙需要消耗的辉石数量。
  buildCost: 2,

  // 建造围墙所需工作时间，单位：秒。
  buildDuration: 4,

  // 围墙最大生命值。黑影攻击会扣除该值；数值越大，夜晚防御越稳。
  maxHp: 3,

  // 围墙被摧毁后是否恢复为墙基。true 表示玩家后续可以重建。
  restoreFoundationOnDestroy: true,
}
```

## archer

```js
// 弓箭手系统配置：控制招募成本、射程、攻击频率和伤害。
archer: {
  // 招募一名弓箭手需要消耗的辉石数量。
  recruitCost: 2,

  // 弓箭手自动攻击范围，单位：格。过大会让防守过强，过小会难以命中黑影。
  attackRange: 5,

  // 弓箭手攻击间隔，单位：秒。数值越小，射击越频繁。
  attackCooldown: 1.2,

  // 单次攻击造成的黑影伤害。
  damage: 1,

  // 弓箭手生成点相对营地中心的偏移，单位：格。
  spawnOffsets: [
    { x: -1.2, y: -1.2 },
    { x: -1.2, y: 1.2 },
    { x: 1.2, y: -1.2 },
    { x: 1.2, y: 1.2 },
  ],
}
```

## monster 扩展

```js
monster: {
  // 黑影最大生命值。被弓箭手攻击会扣除。
  maxHp: 2,

  // 黑影攻击围墙的间隔，单位：秒。
  wallAttackInterval: 1.2,

  // 黑影每次攻击围墙造成的伤害。
  wallDamage: 1,

  // 黑影攻击围墙的判定距离，单位：格。
  attackWallRange: 0.7,
}
```

字段必须有中文注释，说明用途、单位、影响范围和调参风险。

如果需要新增文本，写入：

```js
text: {
  wallBuildStarted: '工人开始建造围墙。',
  wallBuilt: '围墙建好了。',
  wallDestroyed: '围墙被黑影摧毁了。',
  archerRecruited: '一名弓箭手加入了防守。',
  needMoreStoneForWall: count => `建墙需要 ${count} 个辉石。`,
  needMoreStoneForArcher: count => `招募弓箭手需要 ${count} 个辉石。`,
}
```

---

# 建议新增文件

可以新增：

```text
WEB_DEMO/src/game/systems/DefenseSystem.js
WEB_DEMO/src/game/systems/ArcherSystem.js
```

也可以合并为一个较小的系统，但不要把所有逻辑堆到 MonsterSystem 或 GameApp 中。

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
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/game/systems/DefenseSystem.js
WEB_DEMO/src/game/systems/ArcherSystem.js
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
1. 不实现矿山。
2. 不实现流民火堆。
3. 不实现完整职业系统。
4. 不实现狐狸成亲。
5. 不实现颠倒森林。
6. 不接入正式图片资源。
7. 不接入音乐音效。
8. 不做 CSV / JSON 读取。
9. 不做存档系统。
10. 不做移动端虚拟摇杆。
11. 不改视觉视角。
12. 不做复杂失败结算。
13. 不做复杂弹道物理。
14. 不强制重写黑影寻路；v0.5 可继续使用 v0.4 的直线移动。
```

---

# 文档更新要求

完成后必须更新：

## 1. WEB_DEMO/docs/changelog.md

新增：

```markdown
## v0.5.0

状态：围墙 / 弓箭手 / 防御系统

内容：
- 新增墙基与围墙。
- 玩家可以消耗辉石派工人建造围墙。
- 围墙拥有 HP，并可以被黑影攻击和摧毁。
- 新增弓箭手单位或弓箭手防守点。
- 玩家可以消耗辉石招募弓箭手。
- 弓箭手自动攻击射程内黑影。
- 黑影拥有 HP，可以被弓箭手击败。
- 围墙与弓箭手相关静态配置集中在 GameConfig.wall / GameConfig.archer，并配有中文注释。
```

## 2. WEB_DEMO/docs/acceptance_tests.md

新增 v0.5 验收项：

```text
测试名称：WEB_DEMO v0.5 围墙 / 弓箭手 / 防御系统
前置条件：已安装 Node.js，v0.4 黑影系统已完成
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
5. 收集足够辉石
6. 靠近墙基或可建墙位置，按 Space 派工人建墙
7. 等待围墙建成
8. 招募至少 1 名弓箭手
9. 等待夜晚黑影生成
10. 观察黑影接近围墙后的行为
11. 观察弓箭手是否自动攻击黑影
12. 如围墙被攻击，观察 HP 或受损表现
预期结果：
1. 浏览器控制台无 JavaScript 报错
2. GameConfig.js 存在 wall / archer 配置段，关键字段有中文注释
3. 玩家可以建造围墙
4. 围墙拥有 HP
5. 黑影可以攻击围墙
6. 围墙 HP 归零后被摧毁或恢复为墙基
7. 玩家可以招募弓箭手
8. 弓箭手可以自动攻击射程内黑影
9. 黑影拥有 HP，可以被弓箭手击败
10. v0.4 的黑影夜晚压力、辉石诱敌、工人被抓仍可运行
11. 本轮不包含矿山、流民、奇遇或复杂职业系统
```

## 3. WEB_DEMO/docs/known_issues.md

记录本轮未做内容：

```text
v0.5 只实现最小防御闭环，不包含矿山、流民、完整职业系统、复杂建造规划、复杂弹道物理或正式美术表现。
黑影仍可继续使用直线移动，复杂寻路后续再处理。
弓箭手当前可以是固定防守单位，巡逻、编队、站位优化后续再处理。
```

---

# 验收标准

必须满足：

```text
1. GameConfig 新增 wall 配置段，并有中文注释。
2. GameConfig 新增 archer 配置段，并有中文注释。
3. GameConfig.monster 扩展黑影 HP、攻击围墙间隔、攻击围墙伤害、攻击围墙范围等配置，并有中文注释。
4. 地图中存在墙基或可建墙位置。
5. 玩家可以消耗辉石派工人建墙。
6. 工人建墙命令不可取消，并遵循 existing WorkerSystem 的派遣 / 工作流程。
7. 围墙建成后拥有 HP。
8. 黑影在局部感知或接近营地过程中可以攻击围墙。
9. 围墙 HP 归零后会被摧毁或恢复为墙基。
10. 玩家可以消耗辉石招募弓箭手。
11. 弓箭手会自动寻找射程内黑影。
12. 弓箭手会按攻击间隔对黑影造成伤害。
13. 黑影 HP <= 0 后消失。
14. v0.4 的黑影生成、4 格局部感知、辉石诱敌、工人被抓和 reserved 释放不被破坏。
15. 本轮不实现矿山、流民、奇遇、复杂职业系统、正式美术、CSV / JSON 读取。
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
3. GameConfig.wall / GameConfig.archer / GameConfig.monster 新增了哪些字段。
4. 围墙建造流程是什么。
5. 黑影攻击围墙逻辑是什么。
6. 弓箭手自动攻击逻辑是什么。
7. 如何运行和验证。
8. 哪些内容留到 v0.6。
9. 是否存在已知问题。
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
WEB_DEMO/src/game/systems/MonsterSystem.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/app/GameApp.js
```

必要时再读取渲染相关文件：

```text
WEB_DEMO/src/presentation/renderers/TileRenderer.js
WEB_DEMO/src/presentation/renderers/UnitRenderer.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
```

不要读取或复制 GPT_DEMO/index.html，本轮不需要参考 GPT_DEMO 代码。
