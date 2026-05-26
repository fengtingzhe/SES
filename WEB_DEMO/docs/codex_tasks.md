# Codex Tasks

---

# 当前任务：WEB_DEMO v0.7-audit-fix 审计文档同步修复

## 任务背景

WEB_DEMO v0.7-refactor 的代码已经完成并通过静态审核，核心内容包括：

```text
1. 流民火堆
2. 招募流民
3. 流民返程
4. 待转职人口池
5. 工人屋
6. 弓箭手营
7. 消耗辉石转职为工人
8. 消耗辉石转职为弓箭手
```

但是审核发现：

```text
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md 没有同步更新 v0.7 状态。
```

当前问题是：

```text
1. “流民”仍标记为待实现。
2. “转职”仍标记为待实现。
3. “流民火堆”仍标记为待实现。
4. “HUD”仍停留在 v0.6 部分实现。
5. 缺少完整的 v0.7-refactor 代码迁移记录。
```

本轮只修正文档，不修改代码。

---

## 本轮目标

同步更新审计文档，使它准确反映 v0.7-refactor 的实现状态。

---

# 允许修改

```text
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
WEB_DEMO/docs/codex_tasks.md
```

---

# 禁止修改

```text
WEB_DEMO/src/**
GPT_DEMO/**
AI_RULES/**
DESIGN_HUB/**
AI_TASKS/**
根目录 README.md
PROJECT_STATUS.md
```

---

# 必须修正的审计表状态

在 `WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md` 的规则继承审计表中，必须修正：

## 1. 流民

当前类似为：

```text
流民 | 招募返程，抵达后入待转职人口 | 必须继承 | 待实现 | 不应直接变工人
```

应改为：

```text
流民 | 招募返程，抵达后入待转职人口 | 必须继承 | v0.7 已实现 | 已实现流民火堆招募、返程实体、抵达后进入待转职人口池；暂未实现黑影攻击返程流民、流民夜晚减速或流民 lost
```

## 2. 转职

当前类似为：

```text
转职 | 待转职人口在工人屋/弓箭手营消耗 1 辉石转职 | 必须继承 | 待实现 | 职业系统不要过度扩展
```

应改为：

```text
转职 | 待转职人口在工人屋/弓箭手营消耗 1 辉石转职 | 必须继承 | v0.7 已实现 | 已实现工人屋转工人、弓箭手营转弓箭手；弓箭手本轮只创建实体和显示，未实现射击战斗
```

## 3. 流民火堆

当前类似为：

```text
流民火堆 | 招募后约 10 秒冷却并刷新 | 默认继承，刷新上限待确认 | 待实现 | 后续可做策划确认
```

应改为：

```text
流民火堆 | 招募后约 10 秒冷却并刷新 | 默认继承，刷新上限待确认 | v0.7 已实现 | 已实现可招募、消耗 1 辉石、冷却约 10 秒后恢复；刷新上限仍待策划确认
```

## 4. HUD

当前类似为：

```text
HUD | 显示天数、阶段、辉石、人口、单位、夜晚黑影计数 | 必须继承信息价值 | v0.6 部分实现 | 已显示当前版本所需的天数、阶段、辉石、工人、采矿、撤退、失踪和黑影信息
```

应改为：

```text
HUD | 显示天数、阶段、辉石、人口、单位、夜晚黑影计数 | 必须继承信息价值 | v0.7 部分实现 | 已显示天数、阶段、辉石、工人、采矿、撤退、失踪、黑影、待转职人口、返程流民、弓箭手和流民火堆状态
```

---

# 必须新增 v0.7 代码迁移记录

在审计文档中新增：

```markdown
## v0.7-refactor 代码迁移记录

### 迁移系统

流民火堆 / 招募流民 / 流民返程 / 待转职人口池 / 工人屋 / 弓箭手营 / 工人转职 / 弓箭手转职

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 相关函数：由 Codex 根据实际定位填写。
- 相关状态：由 Codex 根据实际定位填写。
- 相关常量：由 Codex 根据实际定位填写。

### GPT_DEMO 原始行为

- 地图中存在流民火堆。
- 玩家消耗 1 个辉石招募流民。
- 被招募流民不会立即变成工人，而是返回最近家园。
- 流民抵达家园后进入待转职人口池。
- 工人屋用于消耗 1 个辉石和 1 个待转职人口转职为工人。
- 弓箭手营用于消耗 1 个辉石和 1 个待转职人口转职为弓箭手。
- 流民火堆招募后进入约 10 秒冷却，冷却后重新可招募。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/world/TileMap.js`
- `WEB_DEMO/src/game/world/MapGenerator.js`
- `WEB_DEMO/src/game/systems/PopulationSystem.js`
- `WEB_DEMO/src/game/systems/InteractionSystem.js`
- `WEB_DEMO/src/game/state/createInitialState.js`
- `WEB_DEMO/src/game/config/GameConfig.js`
- `WEB_DEMO/src/app/GameApp.js`
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`

### 保持一致的规则

- 流民需要先招募再返程。
- 流民抵达后进入待转职人口池，不直接变成工人。
- 工人转职和弓箭手转职都需要消耗 1 个辉石和 1 个待转职人口。
- 流民火堆招募后进入冷却，冷却后重新可招募。
- 弓箭手本轮只创建实体和显示，不提前实现射击战斗。

### 有意重构的部分

- 将 GPT_DEMO 单文件中的人口补给和职业转换逻辑拆入 `PopulationSystem`。
- 将职业点地块拆分为 `WORKER_HUT` 与 `ARCHER_CAMP`。
- 将待转职人口集中到 `state.population.unassigned`。
- 将返程流民集中到 `state.refugees`。
- 将弓箭手实体集中到 `state.archers`。

### 有意重设计的部分

无。

### 待确认问题

- 新营地建成后是否自动生成工人屋和弓箭手营。
- 流民火堆是否无限刷新，是否需要刷新次数上限。
- 黑影攻击返程流民、流民夜晚减速、流民 lost 留到后续版本。
- 弓箭手射击、黑影攻击弓箭手、防御闭环留到后续版本。
```

---

# 验收标准

必须满足：

```text
1. 审计表中“流民”状态更新为 v0.7 已实现。
2. 审计表中“转职”状态更新为 v0.7 已实现。
3. 审计表中“流民火堆”状态更新为 v0.7 已实现。
4. 审计表中“HUD”状态更新为 v0.7 部分实现。
5. 审计文档新增完整 v0.7-refactor 代码迁移记录。
6. 本轮不修改任何 WEB_DEMO/src 代码。
7. GPT_DEMO 未被修改。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改了哪些文档。
2. 审计表中哪些状态被更新。
3. 是否新增 v0.7-refactor 代码迁移记录。
4. 是否修改了代码文件。
5. 是否修改了 GPT_DEMO。
```
