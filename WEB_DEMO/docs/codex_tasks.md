# Codex Tasks

---

# 当前任务：WEB_DEMO v0.4-refactor 昼夜与黑影局部压力迁移

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
```

v0.3 体验验证已经确认：

```text
通过定向迁移 GPT_DEMO/index.html 的工人派工、砍树、修桥、建营地、自动拾取等逻辑，WEB_DEMO 基本还原了 GPT_DEMO 的开发效果。
“规则基线 + GPT_DEMO 定向代码迁移 + 模块化重构 + 审计”的开发方向有效。
```

v0.4 继续沿用该方式，迁移 GPT_DEMO 中的夜晚压力系统。

---

## 本轮目标

从 `GPT_DEMO/index.html` 中定向迁移：

```text
昼夜循环
雾门
夜晚黑影生成
黑影向最近家园推进
4 格局部感知
辉石诱导黑影
玩家接触黑影后的辉石损失
0 辉石时失败
夜晚结束后的黑影回收
```

本轮目标是验证：

```text
夜晚压力 + 辉石诱导 + 玩家辉石缓冲
```

不要在本轮实现完整战斗、防御、人口或特殊事件。

---

## 重要开发原则

本轮必须继续采用：

```text
规则基线 + GPT_DEMO 定向代码迁移 + 模块化重构 + 规则继承审计
```

Codex 必须先定位 `GPT_DEMO/index.html` 中对应代码逻辑，再迁移到 WEB_DEMO 新模块。

禁止：

```text
1. 只根据需求描述凭空重写。
2. 整文件复制 GPT_DEMO/index.html。
3. 为了实现方便改变 GPT_DEMO 已验证规则。
4. 提前迁移围墙、弓箭手、矿山、流民、工人夜晚避险或特殊事件。
```

完成后必须说明：

```text
1. GPT_DEMO 中对应代码位置 / 函数 / 变量 / 常量。
2. GPT_DEMO 原始行为是什么。
3. WEB_DEMO 迁移到了哪些模块。
4. 哪些规则保持一致。
5. 哪些属于有意重构。
6. 是否存在有意重设计。
7. 是否存在待确认问题。
```

---

# 本轮只做

## 一、昼夜系统

必须继承：

```text
1. 一天长度默认 95 秒。
2. 存在白天 / 黄昏 / 夜晚阶段。
3. 夜晚开始时重置当夜黑影生成计数。
4. HUD 显示天数和当前阶段。
```

建议新增：

```text
WEB_DEMO/src/game/systems/DayNightSystem.js
```

---

## 二、雾门

必须继承：

```text
1. 地图中存在雾门。
2. 黑影夜晚从雾门出现。
3. 夜晚结束后黑影返回雾门或被回收。
```

v0.4 最小要求：

```text
1. 地图中至少生成 2 个雾门。
2. WorldRenderer 能显示雾门。
```

---

## 三、黑影生成

必须继承：

```text
1. 黑影只在夜晚生成。
2. 每夜默认生成 2 个黑影。
3. 生成间隔约 3 秒。
4. 同场黑影超过 5 个时暂停生成。
5. 黑影从随机雾门生成。
6. 黑影 HP 为 1。
```

建议新增：

```text
WEB_DEMO/src/game/systems/MonsterSystem.js
```

---

## 四、黑影推进目标

必须继承：

```text
1. 黑影出现时，从雾门选择最近家园作为推进目标。
2. 如果没有局部目标，黑影向该家园推进。
3. 新营地建成后也能成为候选家园。
```

本轮不要求营地损坏或营地失败。

---

## 五、4 格局部感知与目标锁

必须继承：

```text
1. 黑影只对 4 格战术范围内的目标作出反应。
2. 战术距离使用方格距离：max(abs(dx), abs(dy))。
3. 目标锁定时间约 1.2 秒，避免频繁抖动。
4. 超出局部范围时，不做全图追逐。
```

建议新增或扩展：

```text
WEB_DEMO/src/game/rules/monsterTargetPriority.js
WEB_DEMO/src/game/utils/grid.js
```

---

## 六、辉石诱导黑影

必须继承：

```text
1. 黑影局部目标中，辉石优先级最高。
2. 黑影看到 4 格范围内的临时辉石后，优先靠近辉石。
3. 黑影接触辉石后，辉石被移除，黑影消失。
4. 玩家主动放置的临时辉石是夜晚诱导工具。
```

注意：

```text
自然辉石仍然靠近自动拾取。
临时辉石不自动拾回。
```

---

## 七、玩家接触黑影后的辉石损失与失败

必须继承：

```text
1. 黑影接触玩家时，如果玩家有辉石，则玩家损失 1 个辉石。
2. 黑影接触玩家后消失。
3. 玩家 0 辉石时接触黑影，进入失败状态。
4. R 重置仍可用。
```

建议实现：

```text
state.status 或 state.gameOver
HUD 失败提示
失败后暂停继续生成黑影
```

---

## 八、夜晚结束后的黑影回收

必须继承体验：

```text
1. 夜晚结束后，黑影不应永久留在场上。
2. 推荐返回最近雾门后消失。
3. 如果 v0.4 简化为夜晚结束直接清理黑影，必须在审计文档中标记为有意重构。
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

# 允许读取

```text
GPT_DEMO/index.html
GPT_DEMO/README.md
WEB_DEMO/README.md
WEB_DEMO/design/production/web_demo_refactor_policy.md
WEB_DEMO/design/production/gpt_code_migration_policy.md
WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
WEB_DEMO/design/decisions/resource_pickup_rule.md
WEB_DEMO/docs/codex_tasks.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
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
1. 不做围墙。
2. 不做弓箭手。
3. 不做矿山。
4. 不做流民。
5. 不做工人屋 / 弓箭手营转职。
6. 不做狐嫁女。
7. 不做颠倒森林。
8. 不做小地图。
9. 不做工人夜晚避险。
10. 不做工人被黑影带走。
11. 不做工人恢复原任务。
12. 不做围墙相关目标。
13. 不做弓箭手相关目标。
14. 不做返程流民相关目标。
15. 不做营地损坏。
16. 不做 CSV / JSON 配置读取。
17. 不接入正式图片、音乐、字体。
18. 不做存档系统。
19. 不做移动端虚拟摇杆。
20. 不把 GPT_DEMO/index.html 整文件复制到 WEB_DEMO。
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

其中审计文档必须新增：

```markdown
## v0.4-refactor 代码迁移记录

### 迁移系统

昼夜 / 雾门 / 黑影生成 / 家园推进目标 / 4 格局部感知 / 目标锁 / 辉石诱导 / 玩家辉石损失 / 失败状态

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
1. 游戏存在白天 / 黄昏 / 夜晚阶段。
2. HUD 显示天数和当前阶段。
3. 地图中存在雾门。
4. 黑影只在夜晚从雾门出现。
5. 每夜默认最多出现 2 个黑影。
6. 出现间隔约为 3 秒。
7. 同场黑影超过 5 个时暂停出现。
8. 黑影无局部目标时向最近家园推进。
9. 黑影只响应 4 格战术范围内目标。
10. 黑影目标锁约 1.2 秒。
11. 黑影优先靠近 4 格范围内的临时辉石。
12. 黑影接触辉石后，辉石移除，黑影消失。
13. 黑影接触玩家后，若玩家有辉石，则玩家损失 1 个辉石，黑影消失。
14. 玩家 0 辉石时接触黑影，进入失败状态。
15. R 重置仍可用。
16. 夜晚结束后，黑影返回雾门或被回收。
17. 没有迁移围墙、弓箭手、矿山、流民、工人夜晚避险或特殊事件。
18. GPT_DEMO 未被修改。
19. 审计文档记录了 GPT_DEMO 到 WEB_DEMO 的迁移关系。
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
9. 哪些内容留到 v0.5-refactor。
```

---

# 给 Codex 的提醒

本轮的重点不是做完整战斗系统，而是把 GPT_DEMO 的“夜晚压力”迁移正确。

尤其关注：

```text
夜晚出现；
雾门来源；
家园推进目标；
4 格局部感知；
辉石诱导；
玩家辉石损失；
0 辉石失败。
```

不要提前实现围墙、弓箭手、矿山、流民或工人夜晚避险。
