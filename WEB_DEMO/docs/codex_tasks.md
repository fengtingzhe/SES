# Codex Tasks

本文件记录 WEB_DEMO 的开发任务。

---

# 当前任务：WEB_DEMO v0.2 核心循环迁移

## 任务名称

```text
WEB_DEMO v0.2 核心循环迁移
```

## 任务背景

```text
1. GPT_DEMO/gpt.11.7 已经验证了《看海去》的完整玩法草图。
2. WEB_DEMO 已经建立了 Vite + Canvas 正式工程骨架。
3. 当前 WEB_DEMO/index.html 是薄入口，只加载 /src/main.js。
4. 本轮目标不是复现全部 GPT_DEMO，而是先迁移最小核心循环。
5. WEB_DEMO 是正式 Web 游戏工程，禁止再把大量玩法逻辑写回 index.html。
```

## 任务目标

在 WEB_DEMO 中实现《看海去》的最小核心玩法循环：

```text
探索 → 收集辉石 → 派遣工人 → 砍树 / 修桥 / 点亮营地 → 日夜变化 → 到达阶段目标
```

---

# 本轮只做

## 一、基础运行结构

1. 保持 `WEB_DEMO/index.html` 为薄入口。
2. 保持 Vite 工程可运行。
3. 从 `WEB_DEMO/src/main.js` 启动游戏。
4. 可以新建并使用以下模块：

```text
WEB_DEMO/src/app/GameApp.js
WEB_DEMO/src/engine/loop/GameLoop.js
WEB_DEMO/src/engine/input/InputManager.js
WEB_DEMO/src/engine/render/CanvasRenderer.js
WEB_DEMO/src/engine/math/pathfinding.js
WEB_DEMO/src/game/state/GameState.js
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/game/systems/PlayerSystem.js
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/DayNightSystem.js
WEB_DEMO/src/game/systems/CampSystem.js
WEB_DEMO/src/game/systems/ResourceSystem.js
WEB_DEMO/src/presentation/renderers/TileRenderer.js
WEB_DEMO/src/presentation/renderers/UnitRenderer.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
```

如果为了速度需要合并少量模块，可以接受，但不要把所有逻辑堆在 `main.js`。

---

## 二、核心玩法内容

### 1. 主角移动

- WASD / 方向键移动。
- 使用 Canvas 绘制。
- 保持 2D 俯视或 45 度等距风格均可，优先保证清晰可玩。

### 2. 小型随机地图

- 生成一个可探索地图。
- 包含起点部落。
- 包含阶段终点。
- 包含森林阻挡、普通地面、断桥、河流、可点亮营地。
- 保证从起点到终点理论上可通过砍树 / 修桥 / 点营地逐步推进。

### 3. 辉石资源

- 地图上生成可拾取辉石。
- 玩家靠近或踩到辉石后拾取。
- HUD 显示当前辉石数量。
- Space 在无互动目标时可以放置一枚辉石。
- 本轮辉石放置只需要显示在地面并随时间消失，不需要实现黑影诱敌。

### 4. 工人派遣

- 起点部落初始拥有若干工人，建议 2～3 个。
- 玩家靠近可互动目标并按 Space，可以派遣空闲工人。
- 工人命令一旦下达，本轮不可取消。
- 工人会移动到目标位置。
- 工人有状态显示或调试文字：

```text
idle / moving / working / returning
```

### 5. 砍树

- 某些森林格为可砍树障。
- 玩家互动后，消耗辉石派工人砍树。
- 工人到达后显示工作进度。
- 完成后该格变为可通行地面。
- 可掉落 1 个辉石，作为奖励。

### 6. 修桥

- 河流中存在断桥格。
- 玩家互动后，消耗辉石派工人修桥。
- 完成后断桥变为可通行桥。

### 7. 点亮营地

- 地图上存在可点亮的旧营火 / 营地。
- 玩家互动后，消耗辉石派工人点亮。
- 完成后成为新营地。
- 新营地本轮只需要作为视觉节点和工人返回点，不需要生成工棚、弓箭营、围墙。

### 8. 工人返回

- 工人完成任务后返回最近已激活营地或部落。
- 如果最近营地逻辑复杂，本轮可以先返回部落，但必须在 `WEB_DEMO/docs/known_issues.md` 中记录：

```text
工人完成任务后是否应返回最近营地，后续版本继续验证。
```

### 9. 日夜循环

- 实现白天 / 黄昏 / 夜晚循环。
- HUD 显示当前第几天和昼夜阶段。
- 本轮夜晚不生成黑影。
- 夜晚可以有轻微画面变暗效果。

### 10. 阶段目标

- 地图远端有一个阶段目标点，例如“远方信标”或“旅程终点”。
- 玩家抵达后显示提示：

```text
你抵达了阶段终点。
```

- 不需要做真正结局。

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
12. 不做存档系统。
13. 不做复杂 UI。
14. 不修改 GPT_DEMO。
15. 不把 GPT_DEMO/index.html 的全部代码直接复制进 WEB_DEMO/index.html。
16. 不把大量玩法逻辑堆在 WEB_DEMO/src/main.js。
```

---

# 允许参考

可以只读参考：

```text
GPT_DEMO/index.html
GPT_DEMO/README.md
WEB_DEMO/README.md
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
```

其中：

```text
GPT_DEMO 是玩法参考，不是代码结构参考。
WEB_DEMO/README.md 是工程结构参考。
当前开发必须服从 WEB_DEMO 的模块化结构。
```

---

# 允许修改

允许修改：

```text
WEB_DEMO/src/**
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/README.md
```

如有必要，可以修改：

```text
WEB_DEMO/public/assets/data/csv/**
```

但本轮不需要做 CSV 读取。

---

# 禁止修改

禁止修改：

```text
GPT_DEMO/**
AI_RULES/**
DESIGN_HUB/**
AI_TASKS/**
根目录 README.md
PROJECT_STATUS.md
```

除非任务过程中发现必须同步状态文档，否则不要改这些文件。

---

# 最低工程结构要求

`main.js` 应该只负责启动，例如：

```js
import { GameApp } from './app/GameApp.js';

const app = new GameApp({
  root: document.getElementById('game-root')
});

app.start();
```

不要让 `main.js` 变成新的大单文件。

---

# 表现要求

当前可以使用简单图形表现：

```text
玩家：圆形或小人图标
工人：小圆点或小人
森林：绿色块 / 树形符号
河流：蓝色块
断桥：棕色块
营地：火焰或圆圈
辉石：浅蓝色小点
目标点：蓝色信标
```

不要求美术精细，但必须清楚可读。

---

# HUD 要显示

HUD 至少显示：

```text
1. 当前版本：WEB_DEMO v0.2
2. 辉石数量
3. 工人数量和状态概览
4. 当前昼夜阶段
5. 当前目标
6. 基础操作说明
```

---

# 文档更新要求

完成后必须更新：

## 1. WEB_DEMO/docs/changelog.md

新增：

```markdown
## v0.2.0

状态：核心循环迁移

内容：
- 实现主角移动
- 实现小型随机地图
- 实现辉石拾取与放置
- 实现工人派遣
- 实现砍树
- 实现修桥
- 实现点亮营地
- 实现日夜循环
- 实现阶段目标
```

## 2. WEB_DEMO/docs/acceptance_tests.md

新增 v0.2 验收标准。

## 3. WEB_DEMO/docs/known_issues.md

记录本轮未做内容和可能遗留问题。

---

# 验收标准

必须满足：

```text
1. 在 WEB_DEMO 目录下执行 npm install 成功。
2. 执行 npm run dev 成功。
3. 浏览器打开后无 JS 控制台报错。
4. 玩家可以使用 WASD / 方向键移动。
5. 地图可以随机生成。
6. 玩家可以拾取辉石，HUD 数量增加。
7. 玩家可以放置辉石，地面出现辉石光点，并会随时间消失。
8. 玩家可以派工人砍树。
9. 工人到达树障后工作，完成后树障变为可通行地面。
10. 玩家可以派工人修桥。
11. 修桥完成后断桥变为可通行。
12. 玩家可以派工人点亮营地。
13. 营地点亮后在地图上有明显表现。
14. 工人完成任务后会返回部落或营地。
15. 昼夜循环正常，HUD 显示阶段。
16. 玩家抵达阶段终点后出现完成提示。
17. WEB_DEMO/index.html 仍然只加载 /src/main.js。
18. WEB_DEMO/src/main.js 没有堆积大量游戏逻辑。
19. GPT_DEMO 没有被修改。
20. changelog、acceptance_tests、known_issues 已更新。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改了哪些文件。
2. 新增了哪些模块。
3. 如何运行。
4. 已完成哪些验收标准。
5. 哪些内容留到 v0.3。
6. 是否存在已知问题。
```

---

# 给 Codex 的读取方式

Codex 开始本任务时，应优先读取：

```text
WEB_DEMO/docs/codex_tasks.md
WEB_DEMO/README.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
GPT_DEMO/README.md
```

如需理解玩法细节，再只读参考：

```text
GPT_DEMO/index.html
```

但不要把 GPT_DEMO 的单文件结构搬进 WEB_DEMO。
