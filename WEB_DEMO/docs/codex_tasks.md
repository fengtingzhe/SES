# Codex Tasks

---

# 当前任务：WEB_DEMO v1.1-weather-event 天气系统与条件事件触发框架

## 任务背景

WEB_DEMO 当前已经完成：

```text
v1.0-refactor：体验回归与辅助信息整理
v1.0-fix-1：采矿工人自动复工 + 颠倒森林反转迟滞修复
```

当前 WEB_DEMO 已经具备完整的第一轮核心链路：

```text
探索 → 收集辉石 → 派工建设 → 昼夜压力 → 防御 → 人口补给 → 特殊事件 → 终点看海
```

接下来需要开始增强“旅程变化感”和“随机事件扩展能力”。

本轮要新增一套可扩展的天气系统，并让天气成为随机事件触发条件之一。

设计目标不是做真实天气模拟，而是建立：

```text
天气 = 世界状态
条件事件触发器 = 根据区域 + 天气 + 概率 + 事件 id 决定是否触发事件
特殊事件系统 = 执行具体事件
```

重要原则：

```text
天气系统不直接写死事件逻辑。
天气系统只负责当前天气、持续时间、天气标签和天气状态。
事件触发系统根据配置规则判断是否触发事件。
```

---

## 用户设计要求

本轮来自策划新增需求：

```text
我想做一套天气系统，会影响后续随机事件的发生，比如在地图 A 上，下雨天有 B 概率触发事件 C。注意系统扩展性。
1. 天气包括：雨、雪、大风。
2. 概率触发天气。
```

---

# 本轮目标

新增：

```text
1. WeatherSystem：天气系统。
2. WeatherEventSystem 或 EventTriggerSystem：条件事件触发框架。
3. 天气类型：雨、雪、大风。
4. 每天或阶段开始时概率触发天气。
5. 天气持续一段时间。
6. HUD 显示当前天气和剩余时间。
7. 地图区域支持 regionTag 或等价区域标记。
8. 支持配置规则：区域 + 天气 + 概率 + 事件 id。
9. 至少实现 1 个最小测试事件。
```

本轮不是做大量天气事件内容，而是搭建可扩展框架。

---

# 核心架构要求

## 一、WeatherSystem 职责

WeatherSystem 只负责天气状态，不负责具体事件。

必须支持：

```text
1. 当前天气 currentWeather。
2. 天气剩余时间 timer / remainingSeconds。
3. 天气持续时间 durationSeconds。
4. 天气每日触发概率。
5. 天气类型按权重随机选择。
6. 天气结束后恢复 clear / none。
7. 天气历史或最近天气记录可以先选做。
```

建议状态结构：

```js
state.weather = {
  current: null,
  remaining: 0,
  duration: 0,
  dayRolled: 0,
  history: []
}
```

天气类型至少包括：

```text
rain：雨
snow：雪
wind：大风
```

建议配置：

```js
weather: {
  dailyChance: 0.45,
  checkPhase: 'dayStart',
  types: {
    rain: {
      name: '雨',
      weight: 40,
      durationSeconds: [35, 70],
      tags: ['wet', 'low_visibility']
    },
    snow: {
      name: '雪',
      weight: 25,
      durationSeconds: [35, 70],
      tags: ['cold', 'slow']
    },
    wind: {
      name: '大风',
      weight: 35,
      durationSeconds: [25, 55],
      tags: ['windy', 'unstable']
    }
  }
}
```

字段命名要清楚，并尽量写中文注释，说明字段用途。

---

## 二、概率触发天气

第一版建议采用“每天开始时判定天气”：

```text
1. 每天进入 day 阶段且尚未为当天判定天气时，roll 一次是否出现天气。
2. 如果未命中 dailyChance，则当天保持无天气。
3. 如果命中 dailyChance，则按天气类型 weight 抽取雨 / 雪 / 大风。
4. 随机持续时间。
5. 天气 remaining 随 dt 递减。
6. remaining <= 0 时天气结束。
```

必须避免：

```text
1. 每帧反复 roll 天气。
2. 一天内无限触发天气。
3. 天气结束后立刻再次在同一天触发。
```

可以用：

```text
state.weather.dayRolled = state.time.day
```

来避免同一天重复判定。

---

## 三、区域标记 regionTag

为支持“地图 A + 天气 + 概率 → 事件 C”，需要区域标记能力。

第一版可以不做复杂 RegionSystem，但至少要让 tile 或区域具备标签。

建议方式：

```js
tile.regionTag = 'forest'
tile.regionTag = 'river'
tile.regionTag = 'camp'
tile.regionTag = 'invertedForest'
tile.regionTag = 'foxWeddingArea'
```

最小要求：

```text
1. 至少为颠倒森林区域标记 regionTag = 'invertedForest'。
2. 至少为主路径附近部分森林 / 地面区域标记 regionTag = 'forest' 或等价区域。
3. EventTriggerSystem 能读取玩家当前位置或附近地块的 regionTag。
```

如果 Codex 认为直接给所有 tile 加 regionTag 风险较高，可以先实现辅助函数：

```text
getPlayerRegionTags(state)
```

根据玩家当前位置周围地块推导区域标签。

---

## 四、WeatherEventSystem / EventTriggerSystem 职责

该系统负责根据规则触发事件。

必须支持规则格式：

```js
weatherEventRules: [
  {
    id: 'rain_forest_test_refugee',
    regionTag: 'forest',
    weather: 'rain',
    chance: 0.25,
    eventId: 'rainRefugee',
    cooldownDays: 1
  }
]
```

字段含义必须清楚：

```text
id：规则 id。
regionTag：要求玩家所在区域或附近区域标签。
weather：要求天气类型。
chance：触发概率。
eventId：触发的事件 id。
cooldownDays：规则冷却天数，避免重复刷。
```

事件触发系统必须：

```text
1. 检查当前天气。
2. 检查玩家所在或附近区域标签。
3. 检查规则冷却。
4. 按 chance 概率触发。
5. 触发后记录 lastTriggeredDay 或触发历史。
6. 不要每帧高频 roll，建议每隔固定间隔检查一次。
```

建议配置：

```js
weatherEvents: {
  checkIntervalSeconds: 6,
  rules: [ ... ]
}
```

---

## 五、最小测试事件

本轮至少实现 1 个非侵入式测试事件，用来验证框架可用。

推荐事件：

```text
rain_forest_test_refugee
```

规则：

```text
森林区域 + 雨天 + 25% 概率 → 触发雨中流民事件
```

事件效果建议：

```text
在玩家附近可通行地块生成一个临时流民火堆 / 雨中流民点。
```

如果复用流民火堆成本太高，也可以先做最小事件：

```text
雨中流民事件触发后，显示提示，并在玩家附近掉落 1 个辉石或生成一个标记点。
```

但推荐优先生成临时流民火堆，因为它能和已有流民系统形成联动。

必须避免：

```text
1. 不要破坏已有流民火堆冷却规则。
2. 不要无限刷流民火堆。
3. 不要在不可通行地块、水中、深林中生成事件点。
4. 不要直接修改 GPT_DEMO。
```

---

# 三种天气第一版效果建议

## 雨 rain

第一版效果：

```text
1. HUD 显示“雨”。
2. 可作为森林类随机事件条件。
3. 可轻微改变 WorldRenderer 表现，例如半透明雨幕 / 蓝灰色覆盖层。
```

不要求第一版修改移动速度或视野。

## 雪 snow

第一版效果：

```text
1. HUD 显示“雪”。
2. 可作为寒冷 / 火种类事件条件。
3. 可轻微改变 WorldRenderer 表现，例如白色粒子 / 覆盖层。
```

不要求第一版降低工人速度，避免影响既有平衡。

## 大风 wind

第一版效果：

```text
1. HUD 显示“大风”。
2. 可作为不稳定事件条件。
3. 可轻微改变 WorldRenderer 表现，例如风线 / 摇动提示。
```

不要求第一版吹灭营火、影响箭矢或改变黑影行为。

---

# 配置化与扩展性要求

本轮必须注意扩展性。

不要写成：

```js
if (weather === 'rain') {
  triggerRainEvent();
}
```

而应写成：

```text
WeatherSystem 提供 weather.current。
WeatherEventSystem 遍历 weatherEventRules。
满足 regionTag + weather + chance + cooldown 后，调用对应 event handler。
```

事件 handler 可以先最小化，例如：

```js
handlers: {
  rainRefugee: triggerRainRefugee
}
```

后续可以扩展：

```text
森林 + 雨 = 雨中流民
河边 + 雨 = 河水上涨
桥边 + 大风 = 桥晃动
营地 + 雪 = 火种消耗加快
颠倒森林 + 大风 = 风中迷向
狐狸婚仪 + 雨 = 狐火婚仪
```

---

# HUD 与表现要求

HUD 至少显示：

```text
1. 当前天气：晴 / 雨 / 雪 / 大风。
2. 天气剩余时间。
3. 如果触发天气事件，显示最近触发事件提示。
```

WorldRenderer 可选表现：

```text
1. 雨：轻量蓝灰色覆盖层或简单雨线。
2. 雪：轻量白色点。
3. 大风：简单风线。
```

表现不作为核心阻塞项，但 HUD 必须完成。

---

# 本轮不要做

禁止本轮实现：

```text
1. 不做真实天气模拟。
2. 不做积雪、洪水、体温、疾病等复杂生存系统。
3. 不让天气大幅改变玩家 / 工人 / 黑影数值。
4. 不做大量天气事件内容。
5. 不做正式美术、音乐、音效。
6. 不做存档系统。
7. 不做 CSV / JSON 配置读取。
8. 不做移动端适配。
9. 不大规模重构现有事件系统。
10. 不修改 GPT_DEMO/**。
```

---

# 允许修改

```text
WEB_DEMO/src/**
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md
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
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
```

## changelog.md

新增：

```markdown
## v1.1-weather-event

状态：天气系统与条件事件触发框架完成。

内容：
- 新增 WeatherSystem，支持雨、雪、大风三类天气。
- 天气按每日概率触发，并按权重选择天气类型。
- 天气拥有持续时间，结束后恢复晴天 / 无天气。
- 新增 WeatherEventSystem / EventTriggerSystem，根据区域标签、天气、概率和冷却触发事件。
- 新增 regionTag 或等价区域判断能力。
- 新增至少 1 个天气测试事件，例如雨天森林触发雨中流民。
- HUD 显示当前天气和剩余时间。
- 本轮不做复杂生存天气效果，不修改 GPT_DEMO。
```

## acceptance_tests.md

新增 v1.1-weather-event 验收：

```text
1. 启动 WEB_DEMO。
2. 确认初始天气状态显示为晴 / 无天气。
3. 等到新的一天或通过调试方式触发每日天气判定。
4. 确认天气会按概率触发，且类型只会是雨、雪、大风之一。
5. 确认天气有剩余时间并随时间递减。
6. 确认天气结束后恢复晴 / 无天气。
7. 确认一天内不会每帧重复 roll 天气。
8. 进入带 regionTag 的区域，例如 forest 或 invertedForest。
9. 在符合天气和区域条件时，天气事件规则有概率触发。
10. 确认测试事件触发后有可见反馈，例如提示、临时流民火堆或事件点。
11. 确认测试事件不会无限重复刷。
12. 确认天气系统没有破坏已有探索、派工、黑影、采矿、流民、围墙、狐狸婚仪和终点目标。
13. 确认 GPT_DEMO 未被修改。
```

## known_issues.md

如未完成复杂效果，应记录为后续内容：

```text
1. 雨、雪、大风当前只作为事件条件和轻量表现，不做真实生存效果。
2. 天气事件第一版只实现测试事件，更多天气事件后置。
3. regionTag 第一版可能是轻量标记，后续可扩展正式 RegionSystem。
```

## gpt_to_web_rule_audit_v1.md

新增：

```markdown
## v1.1-weather-event 设计与迁移记录

### 新增系统

- WeatherSystem
- WeatherEventSystem / EventTriggerSystem
- regionTag / 区域标签能力

### 设计来源

- 用户新增策划需求：天气影响后续随机事件发生，例如地图 A 下雨天有 B 概率触发事件 C。

### 实现规则

- 天气包括雨、雪、大风。
- 天气按每日概率触发。
- 天气按权重选择类型。
- 天气有持续时间。
- 天气系统只提供世界状态，不直接写死具体事件。
- 条件事件系统根据区域标签、天气、概率和冷却触发事件。

### 有意重构 / 扩展

- 将“天气”和“事件触发”拆成两个系统，保证扩展性。
- 事件通过规则表配置，而不是写死在 WeatherSystem 中。

### 待确认问题

- 天气是否未来影响移动速度、视野、火种、黑影或资源产出。
- regionTag 是否升级为正式 RegionSystem。
- 天气触发频率、持续时间、事件概率是否进入后续数值配置化。
```

---

# 验收标准

必须满足：

```text
1. 天气类型包括雨、雪、大风。
2. 天气每日或阶段开始时按概率触发。
3. 天气类型按权重选择。
4. 天气有持续时间和剩余时间。
5. 天气结束后恢复晴 / 无天气。
6. HUD 显示当前天气和剩余时间。
7. 代码中存在 WeatherSystem 或等价模块。
8. 代码中存在 WeatherEventSystem / EventTriggerSystem 或等价模块。
9. 存在 regionTag 或等价区域判断机制。
10. 事件规则支持区域 + 天气 + 概率 + eventId。
11. 至少有 1 个测试天气事件。
12. 测试事件不会无限重复刷。
13. 天气系统不直接写死事件逻辑。
14. 不影响已有核心玩法闭环。
15. 不修改 GPT_DEMO。
16. 文档已同步。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改 / 新增了哪些文件。
2. WeatherSystem 如何实现每日概率天气。
3. 雨、雪、大风如何配置。
4. WeatherEventSystem 如何根据区域 + 天气 + 概率触发事件。
5. regionTag 或区域判断如何实现。
6. 最小测试事件是什么，如何避免无限重复刷。
7. HUD 如何显示天气。
8. 是否修改了 GPT_DEMO。
9. 如何运行和验证。
10. 哪些天气效果后置。
```
