# Codex Tasks

---

# 当前任务：WEB_DEMO v1.2-config-prep GameConfig 整理与配置化准备

## 任务背景

WEB_DEMO 当前已经完成第一轮核心功能迁移，并新增了天气与条件事件框架：

```text
v1.0-refactor：体验回归与辅助信息整理
v1.0-fix-1：采矿工人自动复工 + 颠倒森林反转迟滞修复
v1.1-weather-event：天气系统与条件事件触发框架
后续小调整：顶部阶段 / 天气状态条、颠倒森林边界手感优化
```

当前项目已经具备：

```text
探索、辉石、派工、昼夜、黑影、矿山、流民、职业、围墙、防御、特殊事件、终点、天气、条件事件、小地图、HUD 辅助信息
```

继续新增玩法前，需要先整理配置结构。否则后续数值设计、调参、内容扩展和外部配置拆分都会变得困难。

本轮目标不是新增系统，而是把当前 WEB_DEMO 的静态数值、规则参数、事件参数、HUD / UI 参数和可配置文案整理清楚。

---

# 本轮目标

版本名称：

```text
WEB_DEMO v1.2-config-prep GameConfig 整理与配置化准备
```

本轮要完成：

```text
1. 整理 GameConfig 结构。
2. 给所有配置字段补充清晰中文注释。
3. 区分“策划参数”和“程序常量”。
4. 把散落在代码中的魔法数字尽量集中到 GameConfig。
5. 新增 WEB_DEMO/docs/config_reference.md。
6. 在 config_reference.md 中说明字段路径、中文含义、默认值、单位、是否策划参数、影响系统和注意事项。
7. 为后续 JSON / CSV 拆分做准备。
```

---

# 重要原则

## 一、本轮只做配置整理，不做外部配置读取

禁止本轮实现：

```text
1. 不拆 JSON。
2. 不拆 CSV。
3. 不接入外部配置加载器。
4. 不做配置编辑器。
5. 不做 Excel / 表格导入。
6. 不做运行时热更新配置。
```

当前仍然使用：

```text
WEB_DEMO/src/game/config/GameConfig.js
```

作为唯一配置中心。

---

## 二、本轮不做数值平衡

可以整理字段、补注释、归类参数，但不要随意改默认数值。

允许小范围重命名或移动字段，但必须保证行为基本一致。

如果必须调整数值，需要在 changelog 和审计文档中说明原因。

---

## 三、优先保证现有玩法不坏

整理配置时必须保持现有功能可运行：

```text
探索、拾取辉石、临时辉石、派工砍树、修桥、建营地、采矿、昼夜、黑影、流民、转职、围墙、弓箭手、颠倒森林、狐狸婚仪、终点、天气、小地图、HUD
```

---

# 推荐 GameConfig 结构

请根据当前代码实际情况整理，不要求完全一字不差，但建议形成以下结构：

```js
GameConfig = {
  version,

  map: {},
  player: {},
  resource: {},
  worker: {},
  job: {},
  population: {},
  mine: {},
  wall: {},
  archer: {},
  monster: {},
  dayNight: {},
  weather: {},
  weatherEvents: {},
  events: {},
  vision: {},
  camera: {},
  ui: {},
  message: {}
}
```

如果当前已有字段不适合移动，可以保留，但需要在 `config_reference.md` 中说明。

---

# 必须整理的配置模块

## 1. map 地图配置

至少包含或说明：

```text
地图宽高
起点坐标
终点坐标
地图随机种子
主路径 / 分支 / 河流 / 特殊点生成相关参数，如果当前仍散落在 MapGenerator 中，应尽量迁入 GameConfig.map 或 GameConfig.mapGeneration
```

注意：不要求重写地图生成算法，只迁移明显魔法数字。

---

## 2. player 玩家配置

至少包含或说明：

```text
玩家速度
初始朝向
颠倒森林退出迟滞时间
颠倒森林移动锁定相关配置，如果有
无敌时间如果由 monster.playerInvulnerableSeconds 管理，需要在文档中说明
```

---

## 3. resource 辉石配置

至少包含或说明：

```text
初始辉石
放置辉石持续时间
掉落辉石持续时间
自然辉石拾取半径
临时辉石拾回相关距离 / 规则
```

---

## 4. worker 工人配置

至少包含或说明：

```text
工人移动速度
默认工作时长
夜晚威胁感知范围
采矿复工安全范围
待复工状态相关参数
```

---

## 5. job 任务配置

建议将任务成本与时长统一整理到 `GameConfig.job` 或保持现有 `jobCosts.js / jobDurations.js` 但在配置文档说明来源。

至少覆盖：

```text
砍树成本 / 时长
修桥成本 / 时长
建营地成本 / 时长
建墙成本 / 时长
采矿成本 0 的规则
```

如果当前成本还在独立 rules 文件中，不强制迁移，但必须在 `config_reference.md` 说明：

```text
当前任务成本仍位于 WEB_DEMO/src/game/rules/jobCosts.js，后续可迁入 GameConfig.job。
```

---

## 6. population 人口与转职配置

至少包含或说明：

```text
初始工人数量
招募流民成本
流民火堆冷却
流民移动速度
转职成本
待转职人口规则
```

---

## 7. mine 矿山配置

至少包含或说明：

```text
矿山产出周期
每次产出辉石数量，如果当前写死为 1，需要迁入配置或记录待迁移
矿山占用规则说明
```

---

## 8. wall 围墙配置

至少包含或说明：

```text
围墙最大 HP
黑影攻墙间隔
攻墙距离
围墙是否可通行：当前为待策划确认项，必须在文档中保留说明
```

---

## 9. archer 弓箭手配置

至少包含或说明：

```text
射程
瞄准时间
冷却时间
伤害
黑影 HP=1 因此一箭击杀的关系说明
```

---

## 10. monster 黑影配置

至少包含或说明：

```text
每晚生成数量
生成间隔
最大活跃数
4 格战术感知范围
目标锁定时间
移动速度
攻击距离
营地推进距离
HP
玩家受击无敌时间
目标优先级如仍在代码中，需在 config_reference.md 说明位置和后续可配置化方向
```

---

## 11. dayNight 昼夜配置

至少包含或说明：

```text
一天总时长
初始时间
黄昏开始比例
夜晚开始比例
夜晚判定点
顶部阶段显示是否只读取当前 phase
```

---

## 12. weather 天气配置

至少包含或说明：

```text
每日触发概率
判定阶段
随机种子
雨 / 雪 / 大风配置
天气权重
持续时间范围
天气标签
```

---

## 13. weatherEvents 天气事件配置

至少包含或说明：

```text
检查间隔
区域扫描半径
生成点搜索半径
随机种子
事件规则数组
规则 id
regionTag
weather
chance
eventId
cooldownDays
```

必须说明：

```text
WeatherSystem 不直接写死事件，WeatherEventSystem 根据规则触发事件。
```

---

## 14. events 特殊事件配置

至少包含或说明：

```text
颠倒森林半径
狐狸婚仪奖励辉石
狐狸婚仪持续时间
移动周期
移动时长
队列速度
狐狸数量
队列间距
成功 / 失败距离阈值
```

---

## 15. vision / camera / ui / message

至少包含或说明：

```text
玩家视野半径
起点初始揭示半径
格子尺寸
镜头缩放
镜头跟随速度
小地图尺寸
HUD / 顶部阶段天气条相关配置，如当前在 CSS 中则说明
消息显示时长
```

---

# 魔法数字清理要求

请扫描以下目录：

```text
WEB_DEMO/src/game/**
WEB_DEMO/src/app/**
WEB_DEMO/src/presentation/**
```

将明显可配置的魔法数字迁入 GameConfig。

优先迁移：

```text
时间
距离
半径
数量
成本
产出
冷却
概率
UI 尺寸
消息持续时间
事件奖励
```

不强制迁移：

```text
循环索引
数组下标
简单数学常量
渲染中非常局部的像素微调
CSS 纯样式尺寸
```

如果不迁移，需要在 config_reference 或 known_issues 中说明后续可迁移方向。

---

# config_reference.md 要求

新增文件：

```text
WEB_DEMO/docs/config_reference.md
```

必须使用表格，至少包含以下列：

```text
字段路径
中文说明
默认值
单位
是否策划参数
影响系统
注意事项
```

示例：

```markdown
| 字段路径 | 中文说明 | 默认值 | 单位 | 是否策划参数 | 影响系统 | 注意事项 |
|---|---:|---:|---|---|---|---|
| worker.speed | 工人移动速度 | 2.25 | 格/秒 | 是 | 工人移动、派工、返程、逃跑 | 过低会降低白天效率，过高会削弱夜晚风险 |
```

要求：

```text
1. 覆盖 GameConfig 中所有一级模块。
2. 重点字段必须逐项说明。
3. 对仍未迁入 GameConfig 的配置来源，要在文档中标明当前位置和后续迁移建议。
4. 中文说明必须让非程序策划也能理解用途。
```

---

# 文档更新要求

完成后必须更新：

```text
WEB_DEMO/docs/config_reference.md
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
```

## changelog.md

新增：

```markdown
## v1.2-config-prep

状态：GameConfig 整理与配置化准备完成。

内容：
- 整理 `GameConfig` 结构，补充中文注释。
- 区分策划参数与程序常量。
- 将部分散落的魔法数字迁入配置中心。
- 新增 `WEB_DEMO/docs/config_reference.md`，说明字段路径、默认值、单位、影响系统和注意事项。
- 本轮不拆 JSON / CSV，不接入外部配置读取，不新增玩法系统。
```

## acceptance_tests.md

新增 v1.2-config-prep 验收：

```text
1. 执行 npm run dev 后项目能正常启动。
2. 从起点到终点的核心流程仍能运行。
3. GameConfig 结构清晰，字段有中文注释。
4. config_reference.md 存在且覆盖所有一级配置模块。
5. 任务成本、时间、半径、概率、天气、事件、HUD / UI 等关键参数能在配置文档中找到。
6. 本轮没有拆 JSON / CSV。
7. 本轮没有修改 GPT_DEMO。
8. 本轮没有新增玩法系统。
```

## known_issues.md

新增或更新：

```text
1. 当前仍使用 GameConfig.js 作为配置中心，JSON / CSV 拆分后置。
2. 部分渲染像素参数和 CSS 样式参数暂不迁入配置。
3. 任务成本如仍在 jobCosts.js / jobDurations.js 中，记录后续是否迁入 GameConfig.job。
4. 后续需要进入数值平衡版本，对字段默认值做正式调参。
```

## gpt_to_web_rule_audit_v1.md

新增：

```markdown
## v1.2-config-prep 配置化准备记录

### 本轮目标

- 整理 GameConfig。
- 补中文注释。
- 新增 config_reference.md。
- 为未来 JSON / CSV 拆分做准备。

### 修改位置

由 Codex 根据实际修改填写。

### 保持一致的规则

- 本轮不改变核心玩法规则。
- 本轮不新增玩法系统。
- 本轮不接入外部配置读取。

### 有意重构

- 将部分散落的静态参数迁入 GameConfig。
- 将配置字段说明从代码隐含知识转为文档化说明。

### 待确认问题

- 何时拆分 JSON / CSV。
- 哪些字段进入正式数值表。
- 是否建立配置校验器。
- 是否建立策划用配置编辑器。
```

---

# 允许修改

```text
WEB_DEMO/src/game/config/GameConfig.js
WEB_DEMO/src/game/**
WEB_DEMO/src/app/**
WEB_DEMO/src/presentation/**
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

# 本轮不要做

禁止本轮实现：

```text
1. 不新增玩法系统。
2. 不做天气新事件。
3. 不做正式剧情演出。
4. 不做完整结算系统。
5. 不做正式图片、音乐、字体。
6. 不做存档系统。
7. 不做 JSON / CSV 配置读取。
8. 不做配置编辑器。
9. 不做移动端适配。
10. 不大规模重构核心玩法系统。
11. 不修改 GPT_DEMO/**。
```

---

# 验收标准

必须满足：

```text
1. GameConfig 结构更清晰。
2. 关键字段有中文注释。
3. 明确区分策划参数和程序常量，至少在 config_reference.md 中说明。
4. 明显的时间、距离、半径、概率、成本、奖励等魔法数字已尽量迁入 GameConfig，或在文档中说明暂不迁移。
5. 新增 WEB_DEMO/docs/config_reference.md。
6. config_reference.md 覆盖所有一级配置模块。
7. changelog、acceptance_tests、known_issues、审计文档已同步。
8. npm run dev 不应因配置整理报错。
9. 现有核心玩法不应因配置整理失效。
10. 本轮没有拆 JSON / CSV。
11. 本轮没有新增玩法系统。
12. 本轮没有修改 GPT_DEMO。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改 / 新增了哪些文件。
2. GameConfig 做了哪些结构整理。
3. 哪些魔法数字迁入了 GameConfig。
4. 哪些魔法数字暂未迁移，原因是什么。
5. config_reference.md 覆盖了哪些模块。
6. 是否改变了任何默认数值或玩法规则。
7. 是否修改了 GPT_DEMO。
8. 如何运行和验证。
9. 后续 JSON / CSV 拆分建议。
```
