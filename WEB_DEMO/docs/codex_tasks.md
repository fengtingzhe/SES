# Codex Tasks

本文件记录 WEB_DEMO 的开发任务。

---

# 当前任务：WEB_DEMO v0.2.1 地图轻随机修正

## 任务名称

```text
WEB_DEMO v0.2.1 地图轻随机修正
```

## 任务背景

```text
1. WEB_DEMO v0.2 已经基本完成最小核心循环迁移。
2. 当前版本已实现主角移动、辉石拾取与放置、工人派遣、砍树、修桥、点亮营地、日夜循环和阶段目标。
3. 但代码审核发现 MapGenerator.generate() 目前是固定生成：起点、树障、河流、旧营地、终点、森林簇、辉石位置基本固定。
4. v0.2 任务卡要求“小型随机地图”和“地图可以随机生成”，因此当前版本未完全满足验收标准。
5. 本轮只做地图轻随机修正，不扩展新玩法。
```

## 任务目标

只修正 v0.2 中 `MapGenerator.generate()` 过于固定的问题，让每次 R 重开或刷新页面时地图布局有轻微随机变化，但仍保证核心路径可达。

核心目标：

```text
每次生成地图有差异；
起点仍在左侧，终点仍在右侧；
主路径始终可推进；
树障、河流、旧营地、辉石、森林簇位置有轻微变化；
不破坏 v0.2 的核心玩法循环。
```

---

# 本轮只做

## 一、地图轻随机

允许修改 `WEB_DEMO/src/game/world/MapGenerator.js`，为地图生成加入轻随机。

必须保留：

```text
1. 地图左侧有起点部落。
2. 地图右侧有阶段终点。
3. 主路径从起点通往终点。
4. 中途仍有可砍树障。
5. 中途仍有河流和断桥。
6. 中途仍有旧营地。
7. 地图上仍有可拾取辉石。
8. 森林仍形成边界和阻挡感。
9. 玩家理论上可以通过砍树、修桥、点亮营地推进到终点。
```

可以轻随机：

```text
1. 主路径的上下起伏。
2. 树障出现的大致段落。
3. 河流 / 断桥出现的大致段落。
4. 旧营地出现的大致段落。
5. 终点附近的具体位置。
6. 辉石的具体位置和数量。
7. 森林簇的位置。
8. 地图宽高可以保持当前值，也可以小范围调整。
```

轻随机要求：

```text
1. 每次调用 GameState.createNew() / MapGenerator.generate() 都应生成略有不同的地图。
2. 变化幅度要可控，不能出现完全混乱地图。
3. 不要生成不可达地图。
4. 不要让树障、河流、旧营地、终点重叠到不合理位置。
5. 不要让所有辉石刷在不可达区域。
6. 不需要实现种子输入，直接使用 Math.random() 可以接受。
```

---

## 二、文档更新

完成后更新：

```text
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
```

### changelog.md

新增：

```markdown
## v0.2.1

状态：地图轻随机修正

内容：
- 为 MapGenerator.generate() 加入轻随机。
- 树障、河流 / 断桥、旧营地、辉石和森林簇位置不再完全固定。
- 保留起点在左侧、终点在右侧、主路径可推进的结构。
- 修正 v0.2 中“地图可以随机生成”验收项未完全满足的问题。
```

### acceptance_tests.md

新增 v0.2.1 验收项：

```text
测试名称：WEB_DEMO v0.2.1 地图轻随机
前置条件：已安装 Node.js
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
5. 记录当前地图中树障、河流、旧营地、辉石的大致位置
6. 按 R 重开，重复观察 3 次
预期结果：
1. 每次重开地图布局有可见差异
2. 起点仍在左侧
3. 终点仍在右侧
4. 地图仍包含树障、河流 / 断桥、旧营地和辉石
5. 主路径仍可通过砍树、修桥、点亮营地推进到终点
6. 浏览器控制台无 JavaScript 报错
```

### known_issues.md

更新：

```text
将“地图节奏仍是代码内生成”保留为已知问题，但说明 v0.2.1 已加入轻随机；后续仍需要 CSV / JSON 配置化。
```

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
13. 不改视觉视角，不把俯视角改成 45 度等距。
14. 不修改 GPT_DEMO。
15. 不修改 WEB_DEMO/index.html。
16. 不修改 WEB_DEMO/src/main.js。
17. 不把大量玩法逻辑堆进 MapGenerator 以外的文件。
```

---

# 允许修改

允许修改：

```text
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
```

如果发现地图随机必须轻微配合其他文件，可以修改：

```text
WEB_DEMO/src/game/world/TileMap.js
```

但必须说明原因。

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

# 验收标准

必须满足：

```text
1. 在 WEB_DEMO 目录下执行 npm install 成功。
2. 执行 npm run dev 成功。
3. 浏览器打开后无 JS 控制台报错。
4. 连续按 R 重开 3 次，地图布局有可见差异。
5. 每次地图仍有左侧起点部落。
6. 每次地图仍有右侧阶段终点。
7. 每次地图仍有树障。
8. 每次地图仍有河流和断桥。
9. 每次地图仍有旧营地。
10. 每次地图仍有可拾取辉石。
11. 每次地图理论上都能通过砍树、修桥、点亮营地推进到阶段终点。
12. v0.2 已实现的玩家移动、辉石拾取 / 放置、工人派遣、砍树、修桥、点亮营地、日夜循环、阶段目标不被破坏。
13. WEB_DEMO/index.html 仍然只加载 /src/main.js。
14. WEB_DEMO/src/main.js 仍然只负责启动 GameApp。
15. GPT_DEMO 没有被修改。
16. changelog、acceptance_tests、known_issues 已更新。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改了哪些文件。
2. MapGenerator 的随机化策略是什么。
3. 如何保证地图仍可推进到终点。
4. 如何运行。
5. 已完成哪些验收标准。
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
WEB_DEMO/src/game/world/MapGenerator.js
```

必要时再读取：

```text
WEB_DEMO/src/game/state/GameState.js
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/engine/math/pathfinding.js
```

不要读取或复制 GPT_DEMO/index.html，本轮不需要参考 GPT_DEMO 代码。
