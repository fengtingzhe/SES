# Codex Tasks

---

# 当前任务：WEB_DEMO v1.0-fix-1 采矿工人自动复工 + 颠倒森林反转迟滞修复

## 任务背景

WEB_DEMO v1.0-refactor 已完成 GPT_DEMO 到 WEB_DEMO 的第一轮完整迁移，并进入可试玩回归阶段。

试玩发现两个明确问题，已通过代码核准确认：

```text
1. 派到矿山的工人，夜晚遇到黑影后会撤退，但安全后不会自动返回矿山继续采矿，需要玩家重新派驻。
2. 玩家进入颠倒森林时，由于输入反转状态在边界频繁切换，会出现卡顿 / 抖动，和 GPT_DEMO 阶段曾经遇到的问题一致。
```

本轮是 v1.0 后的小修复任务，只修这两个问题，不新增新系统。

---

## 已确认的问题来源

### 问题 1：采矿工人撤退后不会自动返回矿山

当前 `WorkerSystem` 中：

```text
1. mining 工人遇到黑影后，checkThreat() 会生成 interruptedJob。
2. releaseWorkerTask() 会释放矿山占用。
3. 工人 state 变为 flee 并返回家园。
4. 工人抵达家园后 walk() 调用 home(worker)。
5. home(worker) 会把 interruptedJob 清空。
6. 因此工人变回 idle，不会自动恢复原采矿工作。
```

这与预期不一致。

正确预期：

```text
采矿工人遇到黑影后可以先撤退；
当原矿山附近不再有黑影，且矿山仍存在、未被其他工人占用、路径可达时，应自动返回原矿山继续采矿。
```

---

### 问题 2：颠倒森林边界反转导致卡顿

当前 `PlayerSystem` 中：

```text
1. 每一帧根据玩家当前所在 tile 是否为 INVERTED_FOREST 来决定是否反转输入。
2. 玩家在颠倒森林边界时，这一帧可能在森林内，输入被反转。
3. 下一帧可能离开森林，输入恢复正常。
4. 玩家持续按同一个方向时，会被反复推回 / 推出边界。
5. 最终表现为卡顿、抖动、难以进入或离开。
```

正确预期：

```text
进入颠倒森林后，反转状态应稳定维持；
离开颠倒森林后，应延迟一小段时间或离开足够距离后再恢复正常；
不能在边界每一帧频繁切换反转状态。
```

---

# 本轮目标

只完成两个修复：

```text
1. 采矿工人遇到黑影撤退后，安全时自动返回原矿山继续采矿。
2. 颠倒森林输入反转加入迟滞 / buffer，避免边界反复切换导致卡顿。
```

---

# 修复要求一：采矿工人自动复工

## 目标行为

```text
1. 工人在 mining 状态时，如果夜晚黑影进入威胁范围，可以继续触发撤退。
2. 撤退时必须保留 interruptedJob，至少包含：type、tx、ty、label。
3. 工人逃回家园后，不应立刻清空 mining 的 interruptedJob。
4. 工人应进入等待恢复状态，例如 idle + interruptedJob，或 waitingResume。
5. 系统每帧检查该 interruptedJob 是否可恢复。
6. 当原矿山附近没有黑影时，自动让工人返回原矿山。
7. 回到矿山后重新进入 mining 状态，并重新占用矿山。
8. 恢复采矿不应再次扣除辉石，因为采矿成本为 0，且这是原任务恢复。
```

## 安全恢复条件

自动恢复采矿前必须检查：

```text
1. interruptedJob.type === JobType.MINE。
2. 原目标 tile 仍然存在。
3. 原目标 tile.type === TileType.MINE。
4. 原矿山没有被其他工人占用。
5. 原矿山没有被其他工人 reserved。
6. 当前工人不 lost。
7. 当前工人没有 flee。
8. 当前工人处于 idle 或 waitingResume 等可恢复状态。
9. 从工人当前位置到矿山存在路径。
10. 矿山附近指定范围内没有黑影。
```

## 威胁范围建议

新增配置：

```js
worker.resumeThreatRange
```

建议默认值：

```text
4
```

恢复条件应检查原矿山周围 `resumeThreatRange` 内没有活着的黑影。

## 状态建议

可以选择以下任一实现：

```text
方案 A：保留 worker.state = 'idle'，但保留 worker.interruptedJob，每帧尝试 resumeInterruptedJob()。
方案 B：新增 worker.state = 'waitingResume'，专门表示等待复工。
```

推荐方案 B，因为更容易在 HUD / 调试中看出工人正在等待复工。

## 必须避免的问题

```text
1. 不要让工人在黑影仍在矿山附近时反复出门又逃回。
2. 不要让两个工人恢复到同一个矿山。
3. 不要让恢复逻辑重复扣辉石。
4. 不要让恢复逻辑破坏普通派工、砍树、修桥、建营地、建墙逻辑。
5. 不要让 lost 工人恢复工作。
6. 不要让矿山已不存在时继续恢复。
```

## 最小实现范围

本轮只要求恢复采矿任务：

```text
只恢复 JobType.MINE。
不要求恢复砍树、修桥、建营地、建墙。
```

如果其他任务被中断，仍可保持原有行为，或记录为后续扩展。

---

# 修复要求二：颠倒森林输入反转迟滞

## 目标行为

```text
1. 玩家进入颠倒森林后，移动输入反转。
2. 玩家在颠倒森林内部移动时，反转状态稳定。
3. 玩家站在边界时，不会每帧反复切换反转 / 正常。
4. 玩家离开颠倒森林一小段时间后，输入恢复正常。
5. 该逻辑只影响玩家输入，不影响工人、黑影、流民、弓箭手 AI。
```

## 推荐方案：迟滞 / grace time

新增配置：

```js
player.invertedExitGraceSeconds
```

建议默认值：

```text
0.25 或 0.35
```

实现逻辑建议：

```text
1. 如果玩家当前 tile 是 INVERTED_FOREST：
   - controlInverted = true
   - invertedExitTimer = 0

2. 如果玩家当前 tile 不是 INVERTED_FOREST，但 controlInverted 当前为 true：
   - invertedExitTimer += dt
   - 在 invertedExitTimer < invertedExitGraceSeconds 期间，继续保持反转
   - 超过 grace 后，controlInverted = false

3. 如果 controlInverted 当前为 false，且当前 tile 不是 INVERTED_FOREST：
   - 保持 false
```

也可以采用距离判定方案，但要保证边界不抖动。

## 必须注意

当前 `PlayerSystem.update()` 中有两次 `state.player.controlInverted = ...` 赋值。修复后应避免移动前后用实时 tile 状态直接覆盖迟滞状态。

建议把逻辑拆成：

```text
updateInvertedControlState(state, dt)
```

然后使用稳定后的 `state.player.controlInverted` 决定本帧输入是否反转。

## 面向/交互方向

当前 `updateFacing(state.player, raw)` 使用原始输入 raw 更新朝向。

本轮不强制改朝向逻辑，但需要确认：

```text
1. 颠倒森林里按右键，角色实际向左移动；
2. 面向方向是否用 raw 还是 moveInput，要在审计中记录。
```

如果为了交互一致性，Codex 可以把朝向也改成实际移动方向 `moveInput`，但这属于有意调整，必须在审计中说明。

推荐：

```text
本轮优先修卡顿，不强制改朝向。
```

---

# 允许修改

```text
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/PlayerSystem.js
WEB_DEMO/src/game/config/GameConfig.js
WEB_DEMO/src/game/state/createInitialState.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
WEB_DEMO/docs/codex_tasks.md
```

---

# 禁止修改

```text
GPT_DEMO/**
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
1. 不新增新玩法系统。
2. 不做正式剧情演出。
3. 不做完整结算系统。
4. 不做正式图片、音乐、字体。
5. 不做存档系统。
6. 不做 CSV / JSON 配置读取。
7. 不做移动端虚拟摇杆。
8. 不做围墙升级。
9. 不做营地损坏。
10. 不做流民夜晚减速、流民 lost、黑影攻击返程流民。
11. 不大规模重构现有系统。
12. 不把 GPT_DEMO/index.html 整文件复制到 WEB_DEMO。
```

---

# 文档更新要求

完成后必须更新：

```text
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
```

## changelog.md

新增：

```markdown
## v1.0-fix-1

状态：试玩问题修复。

内容：
- 修复采矿工人夜晚遇到黑影撤退后不会自动返回矿山的问题。
- 采矿工人撤退后会保留原矿山任务，待矿山附近安全后自动返回继续采矿。
- 修复颠倒森林边界输入反转频繁切换导致的卡顿 / 抖动问题。
- 为颠倒森林输入反转加入迟滞 / grace time。
- 本轮不新增新系统，不修改 GPT_DEMO。
```

## acceptance_tests.md

新增 v1.0-fix-1 验收：

```text
1. 派工人到矿山。
2. 等工人进入 mining 状态。
3. 夜晚让黑影进入工人威胁范围。
4. 确认工人撤退回家。
5. 保持矿山附近仍有黑影，确认工人不会立刻返回矿山。
6. 黑影离开或被消灭后，确认工人自动返回原矿山。
7. 工人到达矿山后重新进入 mining 状态。
8. 不需要玩家重新派驻。
9. 进入颠倒森林，确认输入反转生效。
10. 在颠倒森林边界来回移动，确认不再出现明显卡顿 / 抖动。
11. 离开颠倒森林一小段时间后，确认输入恢复正常。
12. 确认工人、黑影、流民、弓箭手 AI 不受颠倒森林反转影响。
```

## known_issues.md

如果修复完成，应将这两个问题从“必须修复问题”移除或标记为已修复。

如果仍有残留限制，需要写入：

```text
采矿复工目前只支持 JobType.MINE，其他工人任务中断后自动恢复后置。
```

## gpt_to_web_rule_audit_v1.md

新增：

```markdown
## v1.0-fix-1 修复记录

### 修复问题

- 采矿工人遇到黑影撤退后不会自动返回矿山。
- 颠倒森林边界输入反转频繁切换导致卡顿 / 抖动。

### 修改位置

- `WEB_DEMO/src/game/systems/WorkerSystem.js`
- `WEB_DEMO/src/game/systems/PlayerSystem.js`
- `WEB_DEMO/src/game/config/GameConfig.js`
- 其他由 Codex 根据实际修改填写。

### 保持一致的规则

- 工人夜晚遇到黑影仍会撤退。
- 采矿仍然是持续产出任务。
- 采矿恢复不额外扣辉石。
- 颠倒森林仍只影响玩家输入。

### 有意重构

- 采矿中断任务保留为 interruptedJob 或 waitingResume 状态。
- 颠倒森林输入反转从实时 tile 判定调整为带迟滞的稳定状态。

### 待确认问题

- 是否需要把自动恢复扩展到砍树、修桥、建营地、建墙等其他工人任务。
- 颠倒森林中玩家朝向是否应跟随原始输入，还是跟随实际移动方向。
```

---

# 验收标准

必须满足：

```text
1. 采矿工人在 mining 状态遇到黑影后仍会撤退。
2. 撤退后不会丢失原矿山任务。
3. 原矿山附近有黑影时，工人不会自动返回。
4. 原矿山附近安全后，工人会自动返回原矿山。
5. 工人回到矿山后重新进入 mining 状态。
6. 自动恢复采矿不会重复扣辉石。
7. 自动恢复采矿不会抢占已有其他工人的矿山。
8. 颠倒森林输入反转仍然生效。
9. 玩家在颠倒森林边界不会明显卡顿 / 抖动。
10. 玩家离开颠倒森林后会恢复正常输入。
11. 颠倒森林反转不影响工人、黑影、流民、弓箭手 AI。
12. 本轮没有修改 GPT_DEMO。
13. 本轮没有新增正式资源、存档、CSV / JSON 配置读取或新玩法系统。
14. changelog、acceptance_tests、known_issues、审计文档均已同步。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改 / 新增了哪些文件。
2. 采矿工人自动复工是如何实现的。
3. 如何判断矿山附近安全。
4. 如何避免多个工人恢复到同一个矿山。
5. 颠倒森林迟滞是如何实现的。
6. 是否修改了玩家朝向逻辑。
7. 是否修改了 GPT_DEMO。
8. 如何运行和验证。
9. 哪些内容仍然后置。
```
