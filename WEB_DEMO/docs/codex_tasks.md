# Codex Tasks

---

# 当前任务：WEB_DEMO v0.9-audit-fix 补充 v0.9 代码迁移记录

## 任务背景

WEB_DEMO v0.9-refactor 的代码已经完成并通过静态审核，核心内容包括：

```text
1. 颠倒森林
2. 狐嫁女 / 狐狸成亲事件
3. 终点灯塔 / 看海目标
4. 基础胜利提示
5. 小地图 / 辅助信息回归后置记录
```

审核结论：

```text
WEB_DEMO v0.9-refactor：代码通过，文档需补 v0.9 代码迁移记录。
```

当前问题是：

```text
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md 的审计表已经更新 v0.9 状态，
但缺少完整的 `v0.9-refactor 代码迁移记录` 章节。
```

本轮只做文档同步，不修改代码。

---

## 本轮目标

补充完整的 v0.9-refactor 代码迁移记录，使审计文档与 v0.9 当前实现状态一致。

---

# 允许修改

```text
WEB_DEMO/docs/codex_tasks.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
WEB_DEMO/docs/changelog.md
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

# 必须新增：v0.9-refactor 代码迁移记录

在文件：

```text
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
```

中新增以下章节：

```markdown
## v0.9-refactor 代码迁移记录

### 迁移系统

颠倒森林 / 狐嫁女事件 / 终点灯塔 / 看海目标 / 基础胜利提示 / 小地图后置记录

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 相关函数：由 Codex 根据实际定位填写。
- 相关状态：由 Codex 根据实际定位填写。
- 相关常量：由 Codex 根据实际定位填写。

### GPT_DEMO 原始行为

- 地图中存在颠倒森林区域。
- 玩家进入颠倒森林后，移动输入方向反转。
- 玩家离开颠倒森林后，移动输入恢复正常。
- 地图中存在狐嫁女 / 狐狸成亲事件点。
- 玩家靠近或互动后触发狐嫁女事件。
- 事件期间玩家需要跟随队列或保持同步。
- 事件成功后奖励辉石，默认 +4。
- 事件失败后无奖励。
- 事件结束后应清除或标记已完成，避免重复刷奖励。
- 玩家抵达终点灯塔 / 看海目标后，可以完成阶段目标。
- 完成目标后显示基础胜利提示。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/world/TileMap.js`
- `WEB_DEMO/src/game/world/MapGenerator.js`
- `WEB_DEMO/src/game/systems/PlayerSystem.js`
- `WEB_DEMO/src/game/systems/SpecialEventSystem.js`
- `WEB_DEMO/src/game/systems/InteractionSystem.js`
- `WEB_DEMO/src/game/config/GameConfig.js`
- `WEB_DEMO/src/game/state/createInitialState.js`
- `WEB_DEMO/src/game/rules/interactionPriority.js`
- `WEB_DEMO/src/app/GameApp.js`
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`

### 保持一致的规则

- 颠倒森林只影响玩家输入，不影响工人、黑影、流民或弓箭手 AI。
- 颠倒森林离开后恢复正常输入。
- 狐嫁女事件具备开始、进行、成功、失败和结束状态。
- 狐嫁女事件成功奖励 +4 辉石。
- 狐嫁女事件失败无奖励。
- 狐嫁女事件结束后清除事件点或标记完成，避免重复刷奖励。
- 终点灯塔 / 看海目标通过 Space 互动触发完成。
- 完成后进入 completed / victory 类状态。
- R 重置仍可用。

### 有意重构的部分

- 将 GPT_DEMO 单文件中的特殊事件逻辑拆入 `SpecialEventSystem`。
- 将颠倒森林地块以 `INVERTED_FOREST` 标记并由 `PlayerSystem` 处理输入反转。
- 将狐嫁女事件点以 `FOX_WEDDING` 标记并由事件系统管理状态。
- 将终点完成状态记录在 `state.status` 和 `state.completion`。
- 将事件提示和胜利提示拆分到 HUD 与 WorldRenderer 表现层。

### 有意重设计的部分

无。

### 待确认问题

- 当前狐嫁女事件为简化队列 / 同步实现，后续是否需要更接近最终玩法表现待确认。
- 小地图 / 辅助信息回归已后置到 v1.0-refactor 或后续体验回归任务。
- 完整胜利结算、正式剧情演出、正式图片、音乐和字体均后置。
```

---

# changelog 更新要求

在文件：

```text
WEB_DEMO/docs/changelog.md
```

中新增：

```markdown
## v0.9-audit-fix

状态：审计同步修复。

内容：
- 补充 v0.9-refactor 代码迁移记录。
- 明确 v0.9 已迁移颠倒森林、狐嫁女事件、终点灯塔 / 看海目标和基础胜利提示。
- 明确小地图 / 辅助信息回归后置到 v1.0-refactor 或后续体验回归任务。
- 本轮不修改 WEB_DEMO/src 代码，不修改 GPT_DEMO。
```

---

# 本轮不要做

禁止本轮实现或修改：

```text
1. 不修改 WEB_DEMO/src/**。
2. 不修改 GPT_DEMO/**。
3. 不新增玩法功能。
4. 不修改颠倒森林、狐嫁女或终点逻辑。
5. 不迁移小地图。
6. 不做正式剧情演出。
7. 不做完整结算系统。
8. 不做正式图片、音乐、字体。
9. 不做存档系统。
```

---

# 验收标准

必须满足：

```text
1. gpt_to_web_rule_audit_v1.md 新增完整 `v0.9-refactor 代码迁移记录`。
2. 迁移记录包含迁移系统、GPT_DEMO 来源、GPT_DEMO 原始行为、WEB_DEMO 迁移位置、保持一致规则、有意重构、有意重设计和待确认问题。
3. changelog.md 新增 v0.9-audit-fix 记录。
4. 本轮没有修改 WEB_DEMO/src/**。
5. 本轮没有修改 GPT_DEMO/**。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改了哪些文档。
2. 是否新增 v0.9-refactor 代码迁移记录。
3. 是否修改了 WEB_DEMO/src/**。
4. 是否修改了 GPT_DEMO/**。
5. 是否可以进入 v1.0-refactor。
```
