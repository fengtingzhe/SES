# Codex Tasks

---

# 当前任务：WEB_DEMO v1.3-dev-balance-console 随机辉石修正 + 数值基线 + 内置调试控制台

## 任务背景

WEB_DEMO 已完成：

```text
v1.0-refactor：GPT_DEMO 到 WEB_DEMO 的完整玩法迁移
v1.0-fix-1：采矿复工与颠倒森林迟滞修复
v1.1-weather-event：天气系统与条件事件触发框架
v1.2-config-prep：GameConfig 整理与配置化准备
```

当前项目已经具备完整核心链路：

```text
探索 → 收集辉石 → 派工建设 → 昼夜压力 → 黑影威胁 → 采矿与复工 → 流民与转职 → 围墙与弓箭手 → 特殊事件 → 天气事件 → 终点看海
```

接下来需要同时解决三件事：

```text
1. 修复 v1.2 审核中发现的随机辉石生成范围配置语义风险。
2. 建立基础数值框架与试玩节奏基线，为后续调参做准备。
3. 新增 WEB_DEMO 内置调试控制台 / 策划测试台，提高数值、天气、事件和单位状态验证效率。
```

本轮合并三个原计划版本：

```text
WEB_DEMO v1.2-fix-1：随机辉石生成范围命名/公式修正
WEB_DEMO v1.3-balance-foundation：基础数值框架与试玩节奏基线
WEB_DEMO 内置调试控制台 / 策划测试台
```

合并后的版本名称：

```text
WEB_DEMO v1.3-dev-balance-console
```

---

# 本轮总目标

本轮分三条子任务推进：

```text
A. 随机辉石生成范围命名 / 公式修正
B. 基础数值框架与试玩节奏基线文档
C. 内置调试控制台 / 策划测试台
```

核心原则：

```text
1. 修正配置语义风险。
2. 建立数值设计文档，而不是做正式数值平衡。
3. 增加开发调试工具，而不是新增正式玩家玩法。
4. 不拆 JSON / CSV。
5. 不修改 GPT_DEMO。
6. 不新增正式剧情、美术、音效、存档或移动端适配。
```

---

# A. 随机辉石生成范围命名 / 公式修正

## 问题说明

v1.2-config-prep 中，随机辉石生成使用了：

```js
x = randomMinX + randomInt(width - randomMaxXMargin)
y = randomMinY + randomInt(height - randomMaxYMargin)
```

当前字段名 `randomMaxXMargin` / `randomMaxYMargin` 容易被理解为“右侧 / 下侧边距”。

但当前公式实际最大值接近：

```text
randomMinX + (width - randomMaxXMargin - 1)
randomMinY + (height - randomMaxYMargin - 1)
```

这会导致字段名语义与实际范围不一致，后续调参容易出错。

## 修正目标

推荐方案：保留“边距”语义，修正公式。

修正为：

```js
x = randomMinX + randomInt(width - randomMaxXMargin - randomMinX)
y = randomMinY + randomInt(height - randomMaxYMargin - randomMinY)
```

这样实际生成范围为：

```text
x >= randomMinX
x < width - randomMaxXMargin

y >= randomMinY
y < height - randomMaxYMargin
```

## 要求

必须修改：

```text
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/config/GameConfig.js
WEB_DEMO/docs/config_reference.md
```

要求：

```text
1. 保留 randomMaxXMargin / randomMaxYMargin 命名，明确其含义是右侧 / 下侧边距。
2. 修正 MapGenerator.placeStarterStones 中随机辉石 x/y 公式。
3. 防御性处理：如果范围小于等于 0，不应崩溃，可跳过随机辉石生成或 clamp 到最小安全范围。
4. config_reference.md 中说明该字段控制右侧 / 下侧边距。
5. changelog / audit 记录这是配置语义修正，不是玩法扩展。
```

---

# B. 基础数值框架与试玩节奏基线

## 目标

新增文档：

```text
WEB_DEMO/docs/balance_notes.md
```

该文档用于建立当前 Demo 的数值设计基线，不要求本轮正式改数值。

## 核心问题

文档需要回答：

```text
1. 一局 WEB_DEMO 目标时长是多少？建议先按 10~15 分钟记录为目标假设。
2. 旅程应如何分成早期 / 中期 / 后期？
3. 辉石收入来源有哪些？
4. 辉石消耗出口有哪些？
5. 工人派遣的成本、耗时和回报是什么？
6. 黑影压力曲线如何随天数 / 夜晚推进？
7. 矿山产出节奏如何支撑中后期经济？
8. 流民和转职如何影响扩张节奏？
9. 围墙和弓箭手如何影响防御节奏？
10. 天气事件频率会怎样影响旅程随机性？
```

## balance_notes.md 建议结构

```markdown
# WEB_DEMO 数值与节奏基线 v1.3

## 1. Demo 目标时长

## 2. 旅程阶段划分

| 阶段 | 预计时间 | 玩家目标 | 核心压力 | 主要资源变化 |
|---|---:|---|---|---|

## 3. 辉石经济表

| 类型 | 来源 / 出口 | 数值 | 频率 | 作用 | 风险 |
|---|---|---:|---|---|---|

## 4. 工人任务成本与回报

| 任务 | 成本 | 时长 | 回报 | 风险 | 备注 |
|---|---:|---:|---|---|---|

## 5. 黑影压力表

| 天数 / 阶段 | 黑影数量 | 生成节奏 | 玩家应对方式 | 风险 |
|---|---:|---|---|---|

## 6. 人口与职业成长

## 7. 天气与条件事件频率

## 8. 当前默认数值意图

## 9. 待调参问题

## 10. 后续数值表拆分建议
```

## 要求

```text
1. 不要求本轮正式平衡数值。
2. 可以引用 GameConfig 当前默认值。
3. 如果发现明显风险，只写入“待调参问题”，不要擅自大改数值。
4. 文档必须适合策划阅读，不要只写程序字段。
```

---

# C. WEB_DEMO 内置调试控制台 / 策划测试台

## 定位

这是开发期工具，不是正式玩家功能。

目标：让策划和 Codex 快速验证：

```text
资源、时间、天气、天气事件、黑影、工人状态、采矿复工、流民火堆、特殊事件、终点完成
```

## 打开方式

第一版使用：

```text
F1 打开 / 关闭 Dev Console
```

要求：

```text
1. F1 不应影响原有 F3 / M 小地图开关。
2. Console 关闭后不影响正常游戏。
3. Console 操作必须显示 Toast，例如“Dev：已添加 5 辉石”。
4. Console 必须明显标记为 Dev / 调试工具，不要伪装成正式 UI。
```

---

## 建议文件结构

推荐新增：

```text
WEB_DEMO/src/dev/DevConsole.js
WEB_DEMO/src/dev/DevActions.js
WEB_DEMO/src/dev/DevSelectors.js
```

职责：

```text
DevConsole.js：负责 UI 渲染、页签、按钮、开关显示。
DevActions.js：负责修改 state，例如加辉石、切天气、生成黑影。
DevSelectors.js：负责统计当前状态，例如工人数、黑影数、待复工数。
GameApp.js：负责挂载 DevConsole，并把 state 与必要系统引用传入。
```

如果 Codex 认为第一版拆三文件过重，可以用两个文件：

```text
WEB_DEMO/src/dev/DevConsole.js
WEB_DEMO/src/dev/DevActions.js
```

但不要把大量调试按钮逻辑直接塞进 `GameApp.js`。

---

## Console 页签设计

第一版建议 5 个页签：

```text
1. Overview 总览
2. Resources 资源
3. Time / Weather 时间与天气
4. Units 单位
5. Events 事件
```

暂时不要做命令行解析，先做按钮 + 状态面板。

---

## 1. Overview 总览

显示：

```text
版本号
游戏状态：playing / failed / completed
当前天数
当前阶段：白天 / 黄昏 / 黑夜
当前天气
玩家坐标
辉石数量
工人数
空闲工人
待复工工人
lost 工人
流民数量
返程流民数量
待转职人口
弓箭手数量
黑影数量
营地数量
围墙数量 / 受损围墙数量
最近天气事件
狐狸婚仪状态
```

---

## 2. Resources 资源页

功能按钮：

```text
+1 辉石
+5 辉石
-1 辉石
清空辉石
在玩家附近生成自然辉石
在玩家附近生成临时辉石
```

显示：

```text
当前辉石数量
地图自然辉石数量
地图临时辉石数量
```

要求：

```text
1. 不允许把辉石数量减到负数。
2. 生成辉石必须找玩家附近可通行空地。
3. 如果附近没有空地，显示 Dev 提示，不崩溃。
```

---

## 3. Time / Weather 时间与天气页

功能按钮：

```text
切到白天
切到黄昏
切到黑夜
推进到下一天
强制触发雨
强制触发雪
强制触发大风
清除天气
立即执行天气事件判定
```

显示：

```text
当前 day
当前 phase
weather.current
weather.remaining
weather.dayRolled
weatherEvents.lastEvent
```

要求：

```text
1. 强制天气应复用 WeatherSystem.startWeather 或等价安全方法。
2. 清除天气应把 current / remaining / duration 清空。
3. 立即执行天气事件判定可以通过将 checkTimer 设置到阈值，或调用安全的 dev 方法。
4. 不要破坏 WeatherSystem 正常每日 roll 逻辑。
```

---

## 4. Units 单位页

功能按钮：

```text
生成 1 个工人
生成 1 个流民火堆
增加 1 个待转职人口
生成 1 个弓箭手
在玩家附近生成 1 个黑影
清除所有黑影
让所有工人回家
```

显示工人列表：

```text
id
state
job
lost
homeId
interruptedJob
```

显示单位统计：

```text
workers
refugees
archers
monsters
```

要求：

```text
1. 生成单位时必须分配唯一 id。
2. 生成位置必须找玩家附近可通行空地。
3. 清除黑影不应影响工人 / 弓箭手 / 流民。
4. 让所有工人回家必须尽量走现有 home / path 逻辑，不要直接删除工人。
5. 如果实现“让所有工人回家”风险较高，可以第一版只做“标记为 idle 并提示后续完善”，但必须在 known_issues 说明。
```

---

## 5. Events 事件页

功能按钮：

```text
触发狐狸婚仪
强制完成狐狸婚仪
强制失败狐狸婚仪
在玩家附近生成流民火堆
在玩家附近生成雾门
在玩家附近生成矿山
在玩家附近生成颠倒森林小区域
完成终点目标
重置游戏
```

显示：

```text
foxWedding.active
foxWedding.timer
foxWedding.failed
foxWedding.lastResult
weatherEvents.lastEvent
completion
```

要求：

```text
1. 触发狐狸婚仪优先复用 SpecialEventSystem.startFoxWedding 或等价逻辑。
2. 完成终点目标可以直接设置 completed，但必须只作为 Dev 操作。
3. 生成雾门 / 矿山 / 颠倒森林时必须找附近合法地块。
4. 如果某个按钮风险太高，可以在第一版隐藏或标记“后续”，不要做半坏实现。
```

---

# Dev Console UI 要求

```text
1. Console 建议固定在右侧或底部。
2. 可滚动。
3. 不遮挡全部画面。
4. 样式可以简单，但要清晰区分按钮、状态和页签。
5. 不使用正式美术资源。
6. 不引入大型 UI 框架。
```

可以新增 CSS：

```text
WEB_DEMO/src/styles.css
```

但只做轻量样式。

---

# 本轮不要做

禁止本轮实现：

```text
1. 不做文本命令行解析。
2. 不做配置热更新。
3. 不做 JSON / CSV 编辑器。
4. 不做存档。
5. 不做复杂地图编辑器。
6. 不做正式玩家 UI。
7. 不新增正式剧情演出。
8. 不新增正式美术、音乐、字体。
9. 不做移动端适配。
10. 不修改 GPT_DEMO/**。
```

---

# 允许修改

```text
WEB_DEMO/src/**
WEB_DEMO/docs/balance_notes.md
WEB_DEMO/docs/config_reference.md
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

# 文档更新要求

完成后必须更新：

```text
WEB_DEMO/docs/balance_notes.md
WEB_DEMO/docs/config_reference.md
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
```

## changelog.md

新增：

```markdown
## v1.3-dev-balance-console

状态：开发测试工具与数值基线完成。

内容：
- 修正随机辉石生成范围的边距语义与公式，避免后续配置调参误解。
- 新增 `WEB_DEMO/docs/balance_notes.md`，建立 Demo 目标时长、阶段节奏、辉石经济、工人任务、黑影压力、人口成长和天气事件频率基线。
- 新增 WEB_DEMO 内置 Dev Console / 策划测试台，支持 F1 打开 / 关闭。
- Dev Console 支持查看核心状态，并通过按钮测试资源、时间、天气、单位和事件。
- 本轮不新增正式玩家玩法，不拆 JSON / CSV，不接入存档，不修改 GPT_DEMO。
```

## acceptance_tests.md

新增 v1.3 验收：

```text
1. npm run dev 可以正常启动。
2. 随机辉石生成范围公式使用 randomMinX / randomMaxXMargin 的真实边距语义。
3. 固定辉石和随机辉石仍能在合理区域生成。
4. balance_notes.md 存在，且包含 Demo 目标时长、阶段节奏、辉石经济、任务回报、黑影压力、人口成长、天气事件频率和待调参问题。
5. 按 F1 可以打开 / 关闭 Dev Console。
6. Dev Console Overview 能显示当前核心状态。
7. Resources 页可以增加 / 减少辉石，并能在玩家附近生成自然辉石 / 临时辉石。
8. Time / Weather 页可以切换白天 / 黄昏 / 黑夜，强制雨 / 雪 / 大风，并清除天气。
9. Units 页可以生成黑影、清除黑影，并显示工人状态。
10. Events 页至少能生成流民火堆、完成终点或显示后续按钮状态。
11. Console 关闭后正常游戏不受影响。
12. 本轮没有修改 GPT_DEMO。
13. 本轮没有拆 JSON / CSV、没有新增存档、没有新增正式玩家玩法。
```

## known_issues.md

新增或更新：

```text
1. Dev Console 是开发期工具，不是正式玩家 UI。
2. 第一版 Dev Console 不做文本命令行、不做配置热更新、不做地图编辑器。
3. 某些高风险 Dev 操作如果第一版未实现，应记录为后续。
4. balance_notes.md 只是数值基线，不代表正式平衡完成。
5. 后续仍需进入正式调参版本。
```

## gpt_to_web_rule_audit_v1.md

新增：

```markdown
## v1.3-dev-balance-console 记录

### 本轮目标

- 修正随机辉石生成范围配置语义。
- 新增基础数值框架与试玩节奏基线文档。
- 新增 WEB_DEMO 内置 Dev Console / 策划测试台。

### 修改位置

由 Codex 根据实际修改填写。

### 保持一致的规则

- 不改变核心玩法规则。
- 不新增正式玩家玩法。
- 不接入外部配置读取。
- 不修改 GPT_DEMO。

### 有意重构 / 扩展

- 将随机辉石生成范围公式修正为与边距字段语义一致。
- 将数值意图从隐含经验整理为 balance_notes.md。
- 将测试操作从手动等待流程扩展为 Dev Console 按钮操作。

### 待确认问题

- Dev Console 后续是否保留到正式 Demo，还是仅开发构建启用。
- 哪些数值字段进入正式数值表。
- 是否需要配置校验器和数值模拟器。
```

---

# 验收标准

必须满足：

```text
1. 修正随机辉石生成范围公式或命名，使配置语义清晰。
2. 新增 balance_notes.md。
3. Dev Console 可以通过 F1 打开 / 关闭。
4. Dev Console 至少包含 Overview、Resources、Time / Weather、Units、Events 五类信息或等价分区。
5. Dev Console 至少能执行：加辉石、减辉石、切天气、清天气、生成黑影、清除黑影、生成流民火堆。
6. Dev Console 能查看工人状态，尤其是 waitingResume / interruptedJob。
7. Console 关闭后正常游戏不受影响。
8. changelog、acceptance_tests、known_issues、audit 已同步。
9. 本轮没有拆 JSON / CSV。
10. 本轮没有新增正式玩家玩法。
11. 本轮没有修改 GPT_DEMO。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改 / 新增了哪些文件。
2. 随机辉石范围公式如何修正。
3. balance_notes.md 包含哪些数值基线内容。
4. Dev Console 如何打开 / 关闭。
5. Dev Console 支持哪些页签和按钮。
6. 哪些 Dev 操作未实现并后置。
7. 是否改变了任何正式玩法数值。
8. 是否修改了 GPT_DEMO。
9. 如何运行和验证。
10. 后续建议进入什么版本。
```
