# Codex Tasks

---

# 当前任务：WEB_DEMO v0.5-refactor v0.4 小修复 + 工人夜晚避险、被抓与任务释放

## 任务背景

WEB_DEMO 当前采用新的重构路线：

```text
GPT_DEMO = 玩法验证原型与规则基线
WEB_DEMO = 工程化重构版本
```

当前已完成：

```text
v0.1-refactor：GPT_DEMO 规则基线提取与 WEB_DEMO 阶段重定义
v0.2-refactor：最小工程骨架与基础交互迁移
v0.3-refactor：自动拾取修正 + 工人派工与营地扩张迁移
v0.4-refactor：昼夜与黑影局部压力迁移
```

v0.4 已经迁移夜晚压力核心：昼夜、雾门、黑影生成、家园推进、4 格局部感知、辉石诱导、玩家辉石缓冲和失败状态。

本轮先修复 v0.4 审核中发现的小问题，再从 GPT_DEMO/index.html 定向迁移工人夜晚风险相关规则。

---

## 本轮目标

本轮目标分为两部分：

```text
第一部分：修复 v0.4 小问题。
第二部分：迁移工人夜晚避险、被黑影带走、lost 状态、任务 reserved 释放和任务恢复基础。
```

本轮重点验证：

```text
1. v0.4 文案和黑影小问题被修复。
2. 工人夜晚在黑影靠近时能感知危险。
3. 工人会释放当前任务并逃回所属家园。
4. 逃跑中的工人不可重新派工。
5. 黑影接触工人时，工人进入 lost 状态。
6. 工人 lost 后，从可用工人统计中移除。
7. 工人 lost 后，原任务 reserved / occupied 被释放或正确清理。
8. 工人安全回家后，可恢复为可派工状态。
```

---

# 重要开发原则

本轮必须继续采用：

```text
规则基线 + GPT_DEMO 定向代码迁移 + 模块化重构 + 规则继承审计
```

Codex 必须先定位 `GPT_DEMO/index.html` 中对应代码逻辑，再迁移到 WEB_DEMO 新模块。

禁止整文件复制 `GPT_DEMO/index.html`。

---

# 第一部分：v0.4 小修复

## 1. 修正初始提示文案

当前 `createInitialState.js` 初始 message 仍然是 v0.3 文案。

必须修正为 v0.5 或通用文案，例如：

```text
v0.5-refactor：夜晚风险与工人避险迁移中。
```

## 2. 修正黑影同场数量判断

检查 `MonsterSystem.spawn()`：

```text
如果设计目标是“同场达到 5 个就暂停生成”，使用 >=。
如果设计目标是“超过 5 个才暂停生成”，保留 >，但必须在审计中说明。
```

本轮建议修正为：

```text
state.monsters.length >= GameConfig.monster.maxActiveBeforePause
```

这样更符合“同场上限”的工程直觉。

## 3. 修正黑影到达 raidCamp 后立刻返回的问题

v0.4 审核中发现：黑影无局部目标时向家园推进，但到达家园附近后可能进入 returning，导致刚到家园就返回雾门。

本轮要求：

```text
1. 黑影无局部目标时持续以 raidCamp 为推进目标。
2. 到达 raidCamp 附近后，不应立刻自动返回雾门。
3. 黑影可以在 raidCamp 附近停留 / 巡游 / 等待局部目标。
4. 只有非夜晚阶段，或明确进入回收状态时，才返回雾门。
```

v0.5 不要求营地损坏。

---

# 第二部分：迁移工人夜晚避险

## 一、工人感知黑影

从 `GPT_DEMO/index.html` 中定位工人夜晚感知黑影逻辑。

必须继承：

```text
1. 工人只在夜晚风险中响应黑影。
2. 工人对附近黑影有局部感知范围。
3. GPT_DEMO 当前表现中，工人威胁范围约为横纵差不超过 3。
4. 是否与黑影 4 格战术范围统一，后续可再确认；本轮默认继承 GPT_DEMO 当前表现。
```

建议：

```text
在 GameConfig.worker 中新增 threatRange。
```

---

## 二、工人逃跑回家

必须继承：

```text
1. 工人感知黑影后，进入逃跑状态。
2. 工人释放当前任务锁。
3. 工人向所属家园返回。
4. 逃跑中不可重新派工。
5. 工人安全回到家园后，恢复为空闲状态。
```

建议状态：

```text
worker.state = 'flee'
worker.previousJob 或 worker.interruptedJob 可预留
worker.path 指向所属家园
```

---

## 三、释放任务 reserved / occupied

工人逃跑或被抓时，必须释放任务锁。

要求：

```text
1. 如果工人正在前往可砍树 / 断桥 / 旧火塘任务，逃跑时释放该地块 reserved。
2. 如果工人正在工作中，逃跑时也释放 reserved，允许后续重新派工。
3. 如果工人被黑影带走，也必须释放 reserved。
4. 释放逻辑应抽成方法，后续矿山占用释放可复用。
```

---

## 四、黑影抓工人

从 `GPT_DEMO/index.html` 中定位黑影抓工人逻辑。

必须继承：

```text
1. 黑影局部目标中可以包含工人。
2. 黑影接触工人后，工人进入 lost 状态。
3. lost 工人从可用工人统计中移除。
4. 黑影抓到工人后消失或继续行为，应按 GPT_DEMO 迁移。
5. 工人 lost 后必须释放其任务锁。
```

v0.5 只需要让黑影能抓工人，不需要实现复杂营救。

---

## 五、逃跑中不可派工

必须继承：

```text
1. 空闲工人可以派工。
2. 返回中的工人可以派工。
3. 逃跑中的工人不可派工。
4. lost 工人不可派工。
```

需要检查 `WorkerSystem.findAvailableWorker()` 或等价逻辑。

---

## 六、HUD 与表现

HUD 需要显示或能看出：

```text
1. lost 工人数或剩余工人数。
2. 逃跑中的工人数。
3. 工人状态：工作 / 前往 / 返回 / 逃跑 / lost。
```

WorldRenderer 需要显示：

```text
1. 逃跑工人的状态标签。
2. lost 工人不再显示，或以明确方式显示已失踪。
```

---

# 本轮不要做

禁止本轮实现：

```text
1. 不做围墙。
2. 不做弓箭手。
3. 不做矿山持续产出。
4. 不做流民。
5. 不做工人屋 / 弓箭手营转职。
6. 不做狐嫁女。
7. 不做颠倒森林。
8. 不做小地图。
9. 不做营地损坏。
10. 不做黑影攻击围墙。
11. 不做黑影攻击弓箭手。
12. 不做返程流民目标。
13. 不做 CSV / JSON 配置读取。
14. 不接入正式图片、音乐、字体。
15. 不做存档系统。
16. 不把 GPT_DEMO/index.html 整文件复制到 WEB_DEMO。
```

---

# 允许修改

```text
WEB_DEMO/src/**
WEB_DEMO/package.json
WEB_DEMO/index.html
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/docs/codex_tasks.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md
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

# 文档更新要求

完成后必须更新：

```text
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
```

审计文档必须新增：

```markdown
## v0.5-refactor 代码迁移记录

### 迁移系统

v0.4 小修复 / 工人夜晚感知 / 工人逃跑 / 任务释放 / 工人 lost / 黑影抓工人

### GPT_DEMO 来源

- 文件：GPT_DEMO/index.html
- 相关函数：由 Codex 填写
- 相关状态：由 Codex 填写
- 相关常量：由 Codex 填写

### GPT_DEMO 原始行为

由 Codex 填写。

### WEB_DEMO 迁移位置

由 Codex 填写。

### 保持一致的规则

由 Codex 填写。

### 有意重构的部分

由 Codex 填写。

### 有意重设计的部分

无，除非明确说明并获得策划确认。

### 待确认问题

由 Codex 填写。
```

---

# 验收标准

必须满足：

```text
1. 初始提示文案不再停留在 v0.3。
2. 黑影同场上限判断已明确，建议达到上限即暂停生成。
3. 黑影到达 raidCamp 附近后不会无故立刻返回雾门。
4. 工人夜晚能感知附近黑影。
5. 工人感知危险后进入逃跑状态。
6. 逃跑工人向所属家园移动。
7. 逃跑工人不可被重新派工。
8. 工人逃跑时释放当前任务 reserved。
9. 工人回到家园后恢复为空闲状态。
10. 黑影可以将工人带走 / 抓走。
11. 被抓工人进入 lost 状态。
12. lost 工人不再计入可用工人。
13. 工人被抓时释放当前任务 reserved。
14. HUD 能显示逃跑 / lost 相关状态或统计。
15. 没有迁移围墙、弓箭手、矿山、流民、职业系统或特殊事件。
16. GPT_DEMO 未被修改。
17. 审计文档记录 GPT_DEMO 到 WEB_DEMO 的迁移关系。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改 / 新增了哪些文件。
2. GPT_DEMO 中定位了哪些来源函数、变量、常量或逻辑块。
3. WEB_DEMO 中对应迁移到了哪些模块。
4. 哪些 GPT_DEMO 规则保持一致。
5. 哪些属于有意重构。
6. 是否存在有意重设计。
7. 是否存在待确认问题。
8. 如何运行和验证。
9. 哪些内容留到 v0.6-refactor。
```

---

# 给 Codex 的提醒

本轮重点是把 GPT_DEMO 的“工人夜晚风险”迁移正确。

尤其关注：

```text
工人感知危险；
释放任务锁；
逃回家园；
逃跑中不可派工；
黑影抓工人；
lost 工人清理；
为后续矿山占用释放复用释放逻辑。
```
