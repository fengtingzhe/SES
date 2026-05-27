# GPT_DEMO -> WEB_DEMO 规则审计 v1

## v1.2-config-prep 配置化准备记录

### 任务目标

本轮目标是整理 `WEB_DEMO` 内部配置结构，为后续 JSON / CSV 或其他外部配置拆分做准备。它不属于 GPT_DEMO 玩法迁移任务，不新增玩法系统，也不修改 GPT_DEMO。

### 修改位置

- `WEB_DEMO/src/game/config/GameConfig.js`
- `WEB_DEMO/src/game/world/MapGenerator.js`
- `WEB_DEMO/src/game/state/createInitialState.js`
- `WEB_DEMO/src/game/rules/jobCosts.js`
- `WEB_DEMO/src/game/rules/jobDurations.js`
- `WEB_DEMO/src/game/systems/InteractionSystem.js`
- `WEB_DEMO/src/game/systems/ResourceSystem.js`
- `WEB_DEMO/src/game/systems/WorkerSystem.js`
- `WEB_DEMO/src/game/systems/MonsterSystem.js`
- `WEB_DEMO/src/game/systems/SpecialEventSystem.js`
- `WEB_DEMO/src/game/systems/WeatherSystem.js`
- `WEB_DEMO/src/game/systems/WeatherEventSystem.js`
- `WEB_DEMO/src/app/GameApp.js`
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`
- `WEB_DEMO/docs/config_reference.md`
- `WEB_DEMO/docs/changelog.md`
- `WEB_DEMO/docs/acceptance_tests.md`
- `WEB_DEMO/docs/known_issues.md`
- `WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md`

### 保持一致的规则

- 不改变地图尺寸、起点、终点、初始辉石、初始工人、昼夜节奏、黑影节奏、任务成本、任务时长、矿山产出、围墙 HP、弓箭手攻击参数、天气概率、特殊事件奖励等默认值。
- 不改变自然辉石自动拾取、临时辉石 Space 拾回、工人派工 / reserved、矿山 occupied / reserved、流民转职、围墙防御、弓箭手夜晚攻击、特殊事件和终点目标等既有体验。
- 不引入外部配置读取，因此运行路径仍与 v1.1-weather-event 保持一致。

### 本轮配置化内容

- GameConfig 重新按系统分组，并用中文注释标注用途、单位、影响范围和调参风险。
- 地图生成中的主路、分支、河流、特殊地点、起点区域、开局辉石等参数迁入 GameConfig。
- 成本、时长、数量、距离、概率、冷却、奖励、产出、UI 辅助距离、消息时长等明显魔法数字迁入 GameConfig。
- 任务成本和任务时长继续通过 `jobCosts.js` / `jobDurations.js` 暴露，但底层默认值改为读取 GameConfig，保留现有调用边界。
- 新增 `config_reference.md`，记录当前字段路径和后续拆表边界。

### 有意保留在代码中的内容

- 互动优先级表和黑影目标优先级表暂时保留在规则模块中，避免本轮改变判定顺序。
- `WorldRenderer.js` 中局部绘制像素、颜色、字体和标签偏移暂不迁移，避免配置中心膨胀为视觉主题文件。
- CSS 中 HUD、顶部阶段天气条、Toast 等样式值暂不迁移，后续 UI 主题化任务再统一处理。
- `TileType`、通行集合和实体枚举仍作为程序常量，不作为策划调参字段。

### 待确认问题

- 后续拆 JSON / CSV 时，GameConfig 是整体拆分，还是按 map / economy / combat / event / ui 等域拆分。
- 策划参数是否需要 schema、单位校验、范围校验和默认值回退。
- 地图生成参数是否进入正式关卡表，还是继续作为随机生成器默认参数。
- 优先级表是否开放给策划调参，或继续作为核心规则常量由程序维护。

## v1.1-weather-event 设计与实现记录

### 新增系统

- `WeatherSystem`
- `WeatherEventSystem`
- `regionTag` / 区域标签能力

### 设计来源

- 用户新增策划需求：天气影响后续随机事件发生，例如“地图 A + 下雨天 + B 概率 -> 触发事件 C”。

### 实现规则

- 天气包括雨、雪、大风。
- 天气在每日进入白天后按概率触发。
- 天气按权重选择类型。
- 天气有持续时间和剩余时间。
- 天气结束后恢复晴 / 无天气。
- `WeatherSystem` 只提供世界天气状态，不直接写死具体事件。
- `WeatherEventSystem` 根据区域标签、天气、概率、eventId 和冷却触发事件。
- 测试事件 `rain_forest_test_refugee` 在雨天森林区域按概率触发“雨中流民”。

### 修改位置

- `WEB_DEMO/src/game/systems/WeatherSystem.js`
- `WEB_DEMO/src/game/systems/WeatherEventSystem.js`
- `WEB_DEMO/src/game/config/GameConfig.js`
- `WEB_DEMO/src/game/state/createInitialState.js`
- `WEB_DEMO/src/game/world/TileMap.js`
- `WEB_DEMO/src/game/world/MapGenerator.js`
- `WEB_DEMO/src/app/GameApp.js`
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`

### 有意重构 / 扩展

- 将“天气状态”和“事件触发”拆成两个系统，避免把具体事件写死在 WeatherSystem 中。
- 天气事件通过规则表配置，后续可增加“河边 + 雨”“桥边 + 大风”“颠倒森林 + 大风”等事件。
- `regionTag` 当前是轻量区域标记，主路森林、颠倒森林、营地、河流和终点已具备基础标签。

### 测试事件

- 事件规则：`forest + rain + 25% -> rainRefugee`。
- 事件效果：在玩家附近可通行空地生成一个流民火堆，并记录最近天气事件为“雨中流民”。
- 防重复机制：规则记录 `lastTriggeredDay`，并使用 `cooldownDays` 阻止同一天高频重复触发。

### 待确认问题

- 天气未来是否影响移动速度、视野、火种、黑影或资源产出。
- `regionTag` 是否升级为正式 `RegionSystem`。
- 天气触发频率、持续时间和事件概率是否进入后续数值配置化。
- 是否为天气增加正式视觉、音效或剧情事件。

## v1.0-fix-1 修复记录

### 修复问题

- 采矿工人遇到黑影撤退后不会自动返回原矿山。
- 颠倒森林边界输入反转频繁切换导致卡顿 / 抖动。

### 修改位置

- `WEB_DEMO/src/game/systems/WorkerSystem.js`
- `WEB_DEMO/src/game/systems/PlayerSystem.js`
- `WEB_DEMO/src/game/config/GameConfig.js`
- `WEB_DEMO/src/game/state/createInitialState.js`
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`
- `WEB_DEMO/docs/changelog.md`
- `WEB_DEMO/docs/acceptance_tests.md`
- `WEB_DEMO/docs/known_issues.md`
- `WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md`

### 保持一致的规则

- 工人夜晚遇到黑影仍会撤退。
- 采矿仍然是持续产出任务，约 30 秒产出 1 个辉石。
- 采矿恢复不额外扣除辉石。
- 采矿恢复只在原矿山仍存在、未被其他工人占用 / reserved、路径可达且矿山附近安全时发生。
- 颠倒森林仍只影响玩家移动输入，不影响工人、黑影、流民或弓箭手 AI。

### 有意重构

- 采矿中断任务保留为 `interruptedJob`，工人回家后进入 `waitingResume` 状态，等待原矿山安全后自动复工。
- 新增 `worker.resumeThreatRange`，用于判断原矿山附近是否安全。
- 颠倒森林输入反转从每帧实时 tile 覆盖，调整为 `updateInvertedControlState(state, dt)` 维护的稳定状态。
- 新增 `player.invertedExitGraceSeconds` 和 `player.invertedExitTimer`，用于离开颠倒森林后的短暂迟滞。

### 是否修改玩家朝向

未修改。玩家朝向仍由原始输入 `raw` 更新；本轮只修复边界反转卡顿，不改变 Space 面向交互体验。

### 待确认问题

- 是否需要把自动恢复扩展到砍树、修桥、建营地、建墙等其他工人任务。
- 颠倒森林中玩家朝向是否应继续跟随原始输入，还是改为跟随实际移动方向。

## v1.0-refactor 代码迁移记录

### 迁移系统

小地图 / 辅助信息 / HUD 完整化 / 可见标签提示 / 规则一致性回归文档。

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 小地图开关状态：`showMiniMap = true`。
- 小地图绘制：`mini()` 只绘制 `seen` 地块，并用颜色区分水域、营地、颠倒森林、狐狸婚仪、职业点、雾门、辉石、围墙等对象。
- 小地图调用：主绘制流程中 `if (showMiniMap) mini()`。
- 输入开关：`keydown` 中 F3 切换小地图显示。
- HUD 来源：`drawHud()` 显示版本、天数 / 阶段、辉石、安全状态、工人、弓箭手、人口、流民、黑影、狐狸事件、当前互动和 F2 / F3 辅助提示。
- 标签来源：`drawTile()` 中对矿山、流民火堆、工人屋、弓箭手营、颠倒森林、狐狸婚仪、雾门、桥、营地、旧火塘、部落、终点、围墙等可见对象绘制文字提示。

### GPT_DEMO 原始行为

- 小地图默认开启，玩家可通过 F3 切换显示。
- 小地图只展示玩家已经探索过的区域，不直接暴露未探索地块完整信息。
- 小地图用简化色块和少量标记帮助玩家定位玩家、营地、终点和危险来源。
- HUD 是完整体验辅助层，帮助玩家同时判断资源、人口、单位、夜晚压力、特殊事件和当前互动。
- 可见对象会出现短标签，让玩家知道附近对象用途和当前状态。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/config/GameConfig.js`：版本更新为 v1.0，并新增小地图尺寸配置。
- `WEB_DEMO/src/game/state/createInitialState.js`：新增 `state.ui.showMiniMap`，默认显示小地图。
- `WEB_DEMO/src/game/systems/InputManager.js`：新增 F3 / M 切换小地图输入。
- `WEB_DEMO/src/app/GameApp.js`：新增 `toggleMiniMap()`，负责切换 UI 状态并显示提示。
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`：新增小地图绘制、关键标记、已探索地块过滤，以及辉石 / 雾门等标签提示补充。
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`：补充状态、小地图开关、辅助信息、快捷键提示和完整 HUD 状态。
- `WEB_DEMO/docs/changelog.md`、`WEB_DEMO/docs/acceptance_tests.md`、`WEB_DEMO/docs/known_issues.md`：同步 v1.0 体验回归记录、验收清单和问题分类。

### 保持一致的规则

- 小地图不显示未探索地块的完整信息。
- 小地图作为辅助定位工具，不改变探索、视野、交互、战斗或资源规则。
- HUD 必须持续展示对完整旅程有判断价值的关键状态。
- 自然辉石保持靠近自动拾取；临时辉石保持不能自动拾回但可 Space 主动拾回。
- 雾门、黑影、工人、矿山、流民、围墙、弓箭手、颠倒森林、狐狸婚仪和终点灯塔的既有规则不因本轮信息整理改变。

### 有意重构的部分

- GPT_DEMO 的全局 `showMiniMap` 在 WEB_DEMO 中收敛为 `state.ui.showMiniMap`。
- GPT_DEMO 的 `mini()` 被拆入 `WorldRenderer.drawMiniMap()`，继续遵守只显示已探索地块的体验约束。
- GPT_DEMO 的 HUD 文案由 canvas 绘制迁移为 DOM HUD 渲染，便于展示更完整的状态行和辅助提示。
- 在保留 F3 的基础上补充 M 作为小地图切换键，属于输入层辅助重构，不改变核心玩法。

### 有意重设计的部分

无。本轮不改变玩法规则，不接入正式剧情演出、完整结算、正式资源、存档系统或 CSV / JSON 配置读取。

### 待确认问题

- F3 / M 小地图和辅助信息是否作为正式功能保留，还是后续改为可配置辅助开关。
- 小地图是否需要正式图例、缩放、更多目标标记或标签开关。
- 围墙是否继续保持可通行地块。
- 黑影攻击弓箭手 / 弓箭手 lost 是否正式保留。
- 狐狸婚仪和终点看海是否在后续版本扩展为正式剧情演出与完整结算。

状态：初始审计完成
来源：`GPT_DEMO/README.md`、`GPT_DEMO/index.html`、`WEB_DEMO/README.md`、`WEB_DEMO/design/production/web_demo_refactor_policy.md`
审计目标：确认 WEB_DEMO 后续重构应继承的 GPT_DEMO 玩法规则，并定义下一阶段最小迁移范围。

## 一、审计结论

1. WEB_DEMO 当前阶段应以“理解并重构 GPT_DEMO”为主线，不再沿用旧 v0.2 - v0.6 的扩展式路线。
2. GPT_DEMO 的核心规则已经形成闭环：探索、辉石、派工、营地扩张、昼夜压力、黑影局部 AI、围墙/弓箭手防御、矿山补给、流民人口补给、特殊事件和终点目标。
3. WEB_DEMO 可以重构工程结构，但不得在未确认的情况下改变玩家体验。
4. 下一阶段 v0.2-refactor 不应一次性迁移全部玩法，应先建立最小工程骨架和基础交互闭环。

## 二、规则继承审计表

| 系统 | GPT_DEMO 已验证规则 | WEB_DEMO 处理方式 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| 核心循环 | 探索 -> 辉石投入 -> 派工建设 -> 夜晚承压 -> 扩营 -> 补人口 -> 到达目标 | 必须继承体验主线 | 待实现 | 不以旧 WEB_DEMO v0.2-v0.6 为主线 |
| 工程结构 | 单文件原型承载全部逻辑 | 有意重构 | v0.2 已实现骨架 | 可拆模块，但规则不漂移 |
| 地图尺寸 | 74 x 54，起点 `(5,27)`，终点 `(68,27)` | 默认继承，尺寸是否锁死待确认 | v0.2 已实现 | v0.2-refactor 先继承默认值 |
| 地图生成 | 主路径、分支、河流、断桥、雾门、营地、资源和特殊点 | 必须继承节奏 | v0.6 部分实现 | 已有基础骨架、断桥、旧火塘、雾门和矿山；完整特殊点后续迁移 |
| 通行规则 | 深林阻挡，多数功能地块可通行，断桥需修复 | 必须继承门槛关系 | v0.2 基础地块已实现 | 围墙可通行需确认 |
| 视野 | 未探索区域不提供互动信息 | 必须继承 | v0.2 已实现 | 使用 discovered / visible |
| 玩家控制 | WASD/方向键移动，Space 互动，R 重置 | 必须继承 | v0.2 已实现 | F2/F3 是否正式保留待确认 |
| 朝向互动 | Space 优先面前格，再查附近目标 | 必须继承 | v0.2 已实现 | 是 GPT_DEMO 手感关键 |
| 互动优先级 | 目标、流民、职业点、矿山、事件、墙基、砍树、修桥、营地 | 必须继承相对顺序 | v0.9 部分实现 | 已实现目标、流民、职业点、矿山、狐狸成亲事件、墙基、临时辉石拾回、reserved、砍树、修桥、建营地；特殊事件已接入，完整辅助信息后置 |
| 无目标 Space | 放置 1 个辉石 | 必须继承 | v0.2 已实现 | 支撑夜晚诱敌 |
| 辉石 | 建设成本、诱饵、失败缓冲三重用途 | 必须继承 | v0.6 部分实现 | 已实现采集/放置/主动拾回/生命周期、夜晚诱敌、玩家失败缓冲和矿山产出 |
| 成本表 | 修桥/营地/墙 2，砍树/流民/转职 1，采矿派工代码中 0 | 默认继承，采矿成本待确认 | v0.8 部分实现 | 已实现砍树 1、修桥 2、建营地 2、建墙 2、招募流民 1、转职 1、采矿 0 |
| 工人派工 | 选择最佳可达空闲工人，目标加锁 | 必须继承 | v0.5 已实现 | 返回工人可重派，逃跑 / lost 工人不可派 |
| 工人返程 | 完成任务后回家，建营后留驻新营地 | 必须继承 | v0.3 已实现 | 营地归属影响后续路线 |
| 工人夜晚效率 | 安全圈外夜晚工作和移动变慢 | 必须继承 | 待实现 | 安全圈不是免疫圈 |
| 工人避险 | 局部感知黑影、释放任务、回家、恢复任务 | 必须继承 | v0.5 部分实现 | 已实现感知、释放任务、撤退回家和回家后可派；完整恢复原任务待确认 |
| 工人被抓 | lost，释放任务锁和矿山占用 | 必须继承 | v0.6 部分实现 | 已实现 lost、普通任务释放和矿山占用释放 |
| 营地 | 旧火塘建营，生成职业点、墙基、矿山 | 必须继承 | v0.8 部分实现 | 已实现旧火塘建营、家园结构、职业点和墙基生成；新营地矿山生成仍待确认 |
| 安全范围 | 约 3.1 格，影响效率，不提供黑影免疫 | 必须继承 | 待实现 | 不恢复旧免疫逻辑 |
| 昼夜 | DAY=95，白天/黄昏/夜晚分段 | 默认继承，节奏可调待确认 | v0.4 已实现 | 夜晚开始计数用相位切换 |
| 雾门 | 黑影夜晚从雾门生成，结束后回雾门 | 必须继承 | v0.4 已实现 | 雾门是夜晚压力入口 |
| 黑影生成 | 每夜 2 个，约 3 秒间隔，同场超过 5 暂停 | 必须继承默认值 | v0.4 已实现 | 可配置但不任意改 |
| 黑影 raidCamp | 从雾门选择最近家园作为推进目标 | 必须继承 | v0.4 已实现 | 避免全图乱追 |
| 黑影局部感知 | 4 格方格距离，目标锁约 1.2 秒 | 必须继承 | v0.4 已实现 | 局部压力核心 |
| 黑影目标优先级 | 辉石 > 围墙 > 工人 > 弓箭手 > 返程流民 > 玩家 | 必须继承 | v0.8 部分实现 | 已实现辉石 > 围墙 > 工人 > 弓箭手 > 玩家 > 家园推进；返程流民目标后置。v0.8 已额外实现黑影接触弓箭手后使其 lost，属于相对任务卡的超前实现，待策划确认是否保留 |
| 玩家失败 | 被黑影命中损失辉石，0 辉石时失败 | 必须继承 | v0.4 已实现 | 构成资源风险 |
| 围墙 | 墙基，成本 2，HP 3，被黑影每秒攻击 | 必须继承体验 | v0.8 已实现 | 已实现墙基、建墙派工、围墙 HP 3、黑影约每秒攻墙和围墙摧毁；WALL 当前仍为可通行地块，是否改为地形阻挡待策划确认 |
| 弓箭手 | 夜晚自动瞄准 0.6 秒，伤害 1，冷却 2.2 秒 | 必须继承 | v0.8 已实现 | 已实现夜晚自动瞄准、1 点伤害、击杀 HP 1 黑影和 2.2 秒冷却；同时 v0.8 代码已实现弓箭手可被黑影拖走 lost，该部分属于超前实现，待策划确认 |
| 矿山 | 占用式持续采矿，约 30 秒产 1 辉石 | 必须继承 | v0.6 已实现 | 派工默认 0 成本；是否扣费仍待策划确认 |
| 流民 | 招募返程，抵达后入待转职人口 | 必须继承 | v0.7 已实现 | 已实现流民火堆招募、返程实体、抵达后进入待转职人口池；暂未实现黑影攻击返程流民、流民夜晚减速或流民 lost |
| 转职 | 待转职人口在工人屋/弓箭手营消耗 1 辉石转职 | 必须继承 | v0.7 已实现 | 已实现工人屋转工人、弓箭手营转弓箭手；弓箭手本轮只创建实体和显示，未实现射击战斗 |
| 流民火堆 | 招募后约 10 秒冷却并刷新 | 默认继承，刷新上限待确认 | v0.7 已实现 | 已实现可招募、消耗 1 辉石、冷却约 10 秒后恢复；刷新上限仍待策划确认 |
| 颠倒森林 | 玩家输入方向反转 | 必须继承体验 | v0.9 已实现 | 已实现地图区域、玩家输入反转、离开恢复和 HUD / 角色提示 |
| 狐嫁女 | 跟随事件，成功 +4 辉石，失败无奖，事件清除 | 必须继承体验或明确后置 | v0.9 已实现 | 已实现狐狸成亲事件点、跟随 / 停止同步判定、成功 +4、失败无奖和事件清除 |
| HUD | 显示天数、阶段、辉石、人口、单位、夜晚黑影计数 | 必须继承信息价值 | v0.9 部分实现 | 已显示天数、阶段、辉石、工人、采矿、撤退、失踪、黑影、待转职人口、返程流民、弓箭手、弓箭手瞄准 / 冷却、流民火堆、围墙、受损围墙、颠倒森林、狐狸婚仪和旅程完成状态 |
| 终点 | 与目标灯塔互动完成目标 | 必须继承 | v0.9 已实现 | 已实现远方灯塔 / 看海目标、Space 完成、completed 状态和基础胜利提示；完整结算后置 |

## 三、WEB_DEMO 必须继承项

1. 核心循环：探索、辉石、派工、建设、夜晚、防御、扩张、人口补给、终点。
2. Space 交互手感：面前优先，无目标放辉石。
3. 辉石的三重身份：成本、诱饵、生命缓冲。
4. 工人派工状态：任务锁、返程、可重派、逃跑不可派、建营留驻。
5. 夜晚局部压力：雾门、每夜固定黑影、raidCamp、4 格感知、目标锁。
6. 黑影目标优先级：辉石、围墙、工人、弓箭手、返程流民、玩家。
7. 安全圈不是免疫圈。
8. 围墙 HP 和黑影攻墙。
9. 弓箭手夜晚自动防御。
10. 矿山占用释放，尤其是工人 lost 后不能残留。
11. 流民两段式人口补给。
12. 颠倒森林、狐嫁女等探索记忆点的体验价值。

## 四、可工程化重构但体验不变项

1. 单文件结构拆成模块化目录。
2. 数值常量集中到 GameConfig。
3. 地块、实体、任务、互动候选、目标优先级表数据化。
4. 昼夜、怪物、工人、弓箭手、流民拆成独立系统。
5. 地图随机使用可注入随机源，便于测试。
6. UI 可重新设计，但关键状态信息必须保留。
7. 代码实现可使用现代前端工程方式，但不改变规则判断顺序。

## 五、需要策划确认项

| 问题 | GPT_DEMO 当前表现 | 建议处理 |
| --- | --- | --- |
| 围墙是否可通行 | 围墙地块可通行 | 暂按 GPT_DEMO 继承；若改为阻挡，标记为有意重设计 |
| 采矿派工是否扣辉石 | 代码中未扣辉石 | 暂按 0 成本继承；后续由策划确认是否调整 |
| 地图尺寸是否锁死 | 74 x 54 | v0.2-refactor 先继承，后续可配置 |
| 工人威胁范围 | 横纵差不超过 3 | 暂继承；是否统一为 4 格待确认 |
| F2/F3 是否正式功能 | GPT_DEMO 可用 | 初期可作为辅助功能，正式 UI 待定 |
| 流民火堆是否无限刷新 | 冷却后重新出现流民 | 暂继承；是否限制次数待确认 |
| 狐嫁女迁移时机 | 已验证事件 | 已在 v0.9-refactor 迁移最小事件体验 |
| 营地设施相对位置 | 固定偏移生成 | 初期继承，后续可配置 |
| DAY=95 是否锁定 | 一天 95 秒 | 初期继承，调参需记录 |
| 胜利结算 | 到达目标灯塔互动 | 初期保留完成提示，完整结算后置 |

## 六、v0.2-refactor 最小迁移范围建议

v0.2-refactor 应只迁移“能证明 WEB_DEMO 开始正确继承 GPT_DEMO 手感”的最小闭环：

必须包含：
1. 工程骨架和渲染循环。
2. GPT_DEMO 默认地图尺寸、起点、终点、初始辉石和初始工人数量的数据定义。
3. 基础地图生成：主路径、起点、终点、基础地块、至少可验证的辉石和阻挡。
4. 玩家移动、朝向、视野揭示。
5. Space 交互：面前优先，再查附近。
6. 辉石采集。
7. 无目标 Space 放置 1 个临时辉石。
8. HUD 显示时间/辉石/基础状态。
9. 不引入 GPT_DEMO 不存在的新玩法。

不建议包含：
1. 黑影完整 AI。
2. 围墙、弓箭手、矿山、流民。
3. 狐嫁女、颠倒森林。
4. CSV / JSON 读取。
5. 复杂职业系统。

v0.2-refactor 的验收重点：
- 玩家操作手感与 GPT_DEMO 一致。
- Space 的面前优先和放置辉石可验证。
- 地图和视野为后续派工、昼夜、黑影系统留出结构。

## 七、建议版本路线

v0.1-refactor：规则基线与审计
- 完成 GPT_DEMO 规则提取。
- 完成 GPT -> WEB 规则审计。
- 确认 WEB_DEMO 后续以“工程化继承 GPT_DEMO”为主线。

v0.2-refactor：最小工程骨架与基础交互
- 可运行工程、地图、玩家移动、朝向、视野、Space 交互、辉石采集/放置。
- 不迁移复杂系统。

v0.3-refactor：工人派工与营地扩张
- 工人派工、任务锁、砍树、修桥、建营地、返程、营地归属、基础设施生成。

v0.4-refactor：昼夜与黑影局部压力
- 昼夜、雾门、每夜黑影、raidCamp、4 格目标、目标锁、辉石诱敌、玩家受击。

v0.5-refactor：工人避险与资源补给
- 工人夜晚感知、逃跑、恢复任务、被抓释放、矿山占用与持续产出。

v0.6-refactor：临时辉石拾回与矿山
- 临时辉石主动拾回、矿山、采矿派工、持续产出、矿山占用释放。

v0.7-refactor：流民、人口池与职业转换
- 流民火堆、招募流民、返程流民、待转职人口池、工人屋、弓箭手营、工人转职、弓箭手转职。

v0.8-refactor：围墙、防御与弓箭手战斗闭环
- 墙基、建墙、围墙 HP、黑影攻墙、墙毁坏、弓箭手夜晚自动瞄准、弓箭手攻击黑影、弓箭手冷却。

v0.9-refactor：特殊事件与终点体验
- 颠倒森林、狐狸成亲事件、终点灯塔 / 看海目标、基础胜利提示。
- 小地图 / 辅助信息回归后置，不作为 v0.9 核心验收阻塞项。

v1.0-refactor：体验回归与辅助信息
- 小地图 / 辅助信息、标签体验、HUD 完整化。
- 对照 GPT_DEMO 做完整规则回归。

## 八、v0.1-refactor 文档阶段约束回顾

v0.1-refactor 只补全文档，已确认当时不创建或修改以下内容：
- `WEB_DEMO/package.json`
- `WEB_DEMO/index.html`
- `WEB_DEMO/src/**`
- `GPT_DEMO/**`

## v0.2-refactor 代码迁移记录

### 迁移系统

基础地图 / 玩家移动 / 朝向 / 视野 / Space 互动 / 辉石采集与放置 / HUD

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 基础常量：`W`、`H`、`START`、`GOAL`、`T`，位于约 123 - 181 行。
- 地图工具：`mkTile()`、`blank()`、`pass()`，位于约 213 - 228 行。
- 初始状态：`resetGame()` 中的玩家、初始工人、辉石、时间等状态，位于约 324 - 346 行。
- 地图生成：`makeMap()`、`scatter()`、`river()`、`startArea()`，位于约 362 - 454 行。
- 玩家移动与朝向：`move(dt)`，位于约 547 - 570 行。
- 视野揭示：`reveal()`，位于约 573 - 585 行。
- 辉石采集与生命周期：`pickup()`、`life(dt)`，位于约 587 - 612 行。
- Space 互动：`infoAt()`、`findInteract()`、`interact()`，位于约 648 - 698 行。
- 无目标放置辉石：`placeStone()`，位于约 700 - 729 行。
- 输入与主循环：`keydown` / `keyup`、`loop()`、`update()`，位于约 523 - 532 行和 1608 - 1635 行。
- 渲染与 HUD：`draw()`、`drawTile()`、`drawPlayer()`、`drawHud()`，位于约 1347 - 1605 行。

### GPT_DEMO 原始行为

- 地图基础参数为 74 x 54，起点 `(5,27)`，终点 `(68,27)`，初始辉石 6，初始工人 2。
- 地图由深林、地面、主路径、分支、河流、起点、终点和辉石等节点组成。
- WASD / 方向键控制玩家移动。
- 玩家移动时保存四方向朝向。
- 玩家移动后揭示附近区域，未探索区域不显示完整信息。
- Space 优先检查玩家面前一格，再检查附近 2 格范围内的候选目标。
- 无互动目标时 Space 放置 1 个辉石，优先放在面前格，再寻找周围空地。
- 放置辉石消耗 1 个玩家辉石，并拥有 10 秒生命周期。
- HUD 展示玩家决策所需的基础状态。

### WEB_DEMO 迁移位置

- `WEB_DEMO/package.json`：最小 Vite 工程脚本。
- `WEB_DEMO/index.html`：只加载 `src/main.js`。
- `WEB_DEMO/src/main.js`：只负责启动 `GameApp`。
- `WEB_DEMO/src/app/GameApp.js`：应用装配、主循环、重置、消息和系统调用。
- `WEB_DEMO/src/game/config/GameConfig.js`：基础地图、玩家、资源、视野、镜头和版本配置。
- `WEB_DEMO/src/game/state/createInitialState.js`：初始状态创建。
- `WEB_DEMO/src/game/world/TileMap.js`：地块类型、通行规则和地块读写。
- `WEB_DEMO/src/game/world/MapGenerator.js`：基础地图骨架生成。
- `WEB_DEMO/src/game/systems/InputManager.js`：WASD / 方向键 / Space / R 输入。
- `WEB_DEMO/src/game/systems/PlayerSystem.js`：玩家移动、分轴碰撞和朝向更新。
- `WEB_DEMO/src/game/systems/VisionSystem.js`：`discovered / visible` 视野揭示。
- `WEB_DEMO/src/game/systems/InteractionSystem.js`：面前优先、附近候选、目标互动。
- `WEB_DEMO/src/game/systems/ResourceSystem.js`：辉石采集、放置和生命周期。
- `WEB_DEMO/src/game/rules/interactionPriority.js`：v0.2 互动优先级。
- `WEB_DEMO/src/presentation/renderers/*`：Canvas 世界渲染与 HUD 渲染。

### 保持一致的规则

- 地图尺寸、起点、终点、初始辉石和基础工人数量沿用 GPT_DEMO。
- 玩家使用 WASD / 方向键移动。
- 玩家拥有四方向朝向，朝向影响 Space 面前格判断。
- 移动后揭示视野，未探索区域不暴露完整信息。
- Space 面前格优先，然后检查附近候选。
- 无互动目标时放置 1 个辉石。
- 放置辉石消耗 1 个辉石，并保留 10 秒生命周期。
- HUD 显示基础状态和当前互动提示。

### 有意重构的部分

- GPT_DEMO 的单文件逻辑被拆成 GameApp、TileMap、MapGenerator、PlayerSystem、VisionSystem、InteractionSystem、ResourceSystem 和 Renderer。
- v0.2 地图只迁移基础骨架，不迁移完整 GPT_DEMO 地图生成。
- 视野使用 `discovered / visible` 双标记，体验对应 GPT_DEMO 的 `seen`，并为后续可见/已探索分层预留空间。
- 渲染保留等距投影和玩家朝向箭头，但 UI 和样式不复制 GPT_DEMO。
- 互动优先级表只包含 v0.2 范围内的目标：终点与辉石。

### 有意重设计的部分

无。本轮不引入已确认的玩法重设计。

### 与 GPT_DEMO 不一致或待确认的问题

- GPT_DEMO 中辉石靠 `pickup()` 自动拾取；v0.2 曾按当时任务卡实现 Space 采集。该差异已通过 `WEB_DEMO/design/decisions/resource_pickup_rule.md` 确认为无意偏差，并在 v0.3-refactor 修正为自然辉石靠近自动拾取。
- v0.2 暂不迁移颠倒森林，因此移动方向反转未实现。
- v0.2 暂不迁移 F2 标签和 F3 小地图。
- v0.2 暂不迁移断桥、旧火塘、雾门、营地、矿山、流民火堆、狐嫁女和围墙等地图节点。

## v0.3-refactor 代码迁移记录

### 迁移系统

自动拾取 / 工人派工 / 砍树 / 修桥 / 建营地 / 工人返程 / 营地归属 / reserved

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 地图与地块状态：`mkTile()`、`blank()`、`pass()`、`neigh()`，位于约 213 - 234 行。
- 寻路：`findPath()`，位于约 237 - 258 行。
- 家园查询：`nearestHome()`、`homePath()`，位于约 305 - 318 行。
- 初始工人：`resetGame()` 中 `workers = [mkUnit(...), mkUnit(...)]`，位于约 324 - 346 行。
- 工人数据结构：`mkUnit()`，位于约 351 - 359 行。
- 可砍树生成：`makeMap()` 中带 `job='chop'` 的树，位于约 430 - 435 行。
- 断桥生成：`river()` 中 `T.B` 与 `job='repair'`，位于约 439 - 446 行。
- 旧火塘生成：`place(path, 39, 0, c => { c.t = T.FS; c.job = 'camp'; })`，位于约 397 行。
- 自动拾取与辉石生命周期：`pickup()`、`life(dt)`、`drop()`，位于约 587 - 624 行。
- 互动目标与派工入口：`infoAt()`、`findInteract()`、`interact()`，位于约 630 - 698 行。
- 最佳工人选择：`bestWorker()`，位于约 759 - 768 行。
- 工人更新：`updateUnits()`、`walk()`、`finish()`、`home()`，位于约 797 - 968 行。
- 任务锁释放预留：`release()`，位于约 905 - 923 行。

### GPT_DEMO 原始行为

- 自然辉石靠近玩家后自动拾取，拾取后从地图移除并增加库存。
- 玩家主动放置的辉石拥有生命周期，后续用于黑影诱敌。
- 不是所有森林都可砍，只有带 `job='chop'` 的树可以互动。
- 砍树消耗 1 个辉石，派工完成后树变为地面并掉落 1 个辉石。
- 断桥初始不可通行，修桥消耗 2 个辉石，完成后变为可通行桥。
- 旧火塘可消耗 2 个辉石派工建设为营地。
- 初始工人为 2 名，派工选择可达路径最短的空闲或返程工人。
- 派工后目标设置 lock / reserved，防止重复派工。
- 工人到达目标后工作约 4 秒。
- 普通任务完成后工人返程；建营地完成后，执行建营的工人留在新营地并切换归属。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/world/TileMap.js`：新增断桥、桥、营地、旧火塘、任务和 reserved 地块字段。
- `WEB_DEMO/src/game/world/MapGenerator.js`：生成可砍树、断桥和旧火塘的最小地图节点。
- `WEB_DEMO/src/game/world/pathfinding.js`：迁移 BFS 寻路。
- `WEB_DEMO/src/game/systems/CampSystem.js`：管理起点家园、新营地、最近家园和返程路径。
- `WEB_DEMO/src/game/systems/WorkerSystem.js`：迁移最佳工人选择、派工、移动、工作、完成、返程、建营留驻和 reserved 释放预留。
- `WEB_DEMO/src/game/systems/ResourceSystem.js`：修正自然辉石自动拾取，保留临时辉石生命周期，并新增砍树掉落辉石。
- `WEB_DEMO/src/game/systems/InteractionSystem.js`：移除自然辉石 Space 拾取，新增砍树、修桥、建营地和 reserved 提示。
- `WEB_DEMO/src/game/rules/jobCosts.js`、`WEB_DEMO/src/game/rules/jobDurations.js`：集中工人成本和工时。
- `WEB_DEMO/src/game/state/createInitialState.js`：新增初始工人和 homes 结构。
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`：显示可砍树、断桥、旧火塘、营地、工人和路径。
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`：显示工人总数、空闲工人、任务工人和家园数量。

### 保持一致的规则

- 自然辉石靠近自动拾取，Space 不再拾取自然辉石。
- 无目标 Space 仍放置 1 个临时辉石。
- 初始工人为 2 名。
- 可砍树、断桥、旧火塘通过 Space 面前优先互动触发派工。
- 砍树成本 1，修桥成本 2，建营地成本 2。
- 派工失败不扣辉石，不设置 reserved。
- reserved 防止重复派工。
- 工人到达目标后工作一段时间。
- 砍树完成后地块变为地面并产出辉石。
- 修桥完成后断桥变为可通行桥。
- 建营地完成后旧火塘变为营地，执行工人留驻新营地。
- 普通任务完成后工人返回所属家园。

### 有意重构的部分

- GPT_DEMO 单文件工人逻辑拆为 `WorkerSystem`、`CampSystem`、`pathfinding`、`jobCosts` 和 `jobDurations`。
- GPT_DEMO 的 `lock` 字段在 WEB_DEMO 中命名为 `reserved`，语义保持一致，并为后续异常释放保留 `releaseReservedTarget()`。
- v0.3 地图只生成最小验证所需的可砍树、断桥和旧火塘，不完整迁移 GPT_DEMO 所有特殊点。
- WEB_DEMO 明确区分自然/掉落辉石与玩家临时放置辉石：`placed=false` 的辉石可自动拾取，`placed=true` 的辉石暂不自动拾回。
- 普通任务返程使用工人当前归属家园 `homeId`，以匹配任务卡要求的“返回所属营地”。

### 有意重设计的部分

无。本轮不引入已确认的玩法重设计。

### 待确认问题

- GPT_DEMO 中工人完成普通任务后调用 `homePath()` 返回最近可达家园；v0.3 按任务卡“所属营地”要求返回 `homeId` 对应家园。后续若出现多营地调度体验差异，需要确认最终口径。
- 砍树掉落辉石在玩家靠近时会自动拾取，符合自动拾取规则；是否需要延迟自动拾取以便玩家看清掉落表现，后续可做体验确认。
- 新营地暂不生成职业点、墙基、矿山等设施，需在后续对应系统迁移时补齐。

## v0.4-refactor 代码迁移记录

### 迁移系统

昼夜 / 雾门 / 黑影生成 / 家园推进目标 / 4 格局部感知 / 目标锁 / 辉石诱导 / 玩家辉石损失 / 失败状态

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 相关常量：`DAY`、`MONSTERS_PER_NIGHT`、`MONSTER_TACTICAL_RANGE`、`MONSTER_TARGET_LOCK`，位于约 181 - 195 行。
- 阶段函数：`phase()`、`night()`、`phText()`，位于约 272 - 279 行。
- 夜晚生成计数：`updateNightSpawnCounter()`，位于约 491 - 499 行。
- 雾门地图节点：`makeMap()` 中 `T.FOG` 生成逻辑，位于约 398 - 401 行。
- 黑影生成：`spawnMonsters()`，位于约 1076 - 1099 行。
- 黑影局部感知与目标键：`tacticalDist()`、`inTacticalRange()`、`targetKey()`，位于约 1040 - 1063 行。
- 黑影目标选择：`findNearestTarget()`，位于约 1101 - 1158 行。
- 黑影移动、拾取辉石、袭击玩家和夜尽返回：`updateMonsters()`、`nearestFog()`、`hitPlayer()`，位于约 1160 - 1286 行。
- 相关状态：`time`、`wasNight`、`nightSpawned`、`spawnCooldown`、`monsters`、玩家 `inv`、库存辉石。

### GPT_DEMO 原始行为

- 一天默认 95 秒，按时间比例切分白天、黄昏和夜晚。
- 进入夜晚时重置当夜黑影生成计数和生成冷却。
- 黑影只在夜晚生成，每夜默认 2 个，生成间隔约 3 秒，同场黑影超过 5 个时暂停。
- 黑影从随机雾门出现，生成时选择最近家园作为 `raidCamp`。
- 黑影只响应 4 格方格距离内的局部目标，并使用约 1.2 秒目标锁降低目标抖动。
- 局部目标中辉石优先级最高；黑影接触辉石后移除辉石并消失。
- 黑影没有局部目标时向 `raidCamp` 推进，不做全图追逐。
- 黑影接触玩家后，如果玩家有辉石则扣 1 个辉石并让黑影消失；如果玩家没有辉石则进入失败。
- 夜晚结束后，黑影返回最近雾门并在抵达后被移除。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/config/GameConfig.js`：新增昼夜和黑影配置，默认值继承 GPT_DEMO。
- `WEB_DEMO/src/game/systems/DayNightSystem.js`：负责阶段计算、天数计算和夜晚进入时的生成计数重置。
- `WEB_DEMO/src/game/systems/MonsterSystem.js`：负责黑影生成、raidCamp、局部目标选择、目标锁、移动、辉石诱导、玩家受击和夜尽返雾。
- `WEB_DEMO/src/game/rules/monsterTargetPriority.js`：集中黑影目标类型和目标键。
- `WEB_DEMO/src/game/utils/grid.js`：新增方格战术距离工具。
- `WEB_DEMO/src/game/world/TileMap.js`：新增雾门地块类型和通行规则。
- `WEB_DEMO/src/game/world/MapGenerator.js`：在最小地图中生成至少 2 个雾门。
- `WEB_DEMO/src/game/state/createInitialState.js`：新增时间、黑影、生成计数、失败状态和玩家受击无敌时间状态。
- `WEB_DEMO/src/app/GameApp.js`：接入昼夜和黑影系统，并在失败后暂停可运行系统更新。
- `WEB_DEMO/src/game/systems/InteractionSystem.js`：失败后阻止继续互动，保留 R 重置。
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`：显示雾门、黑影、昼夜遮罩和失败提示。
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`：显示天数、阶段、黑影数量和当夜生成计数。

### 保持一致的规则

- 一天长度默认 95 秒。
- 夜晚进入时重置当夜黑影计数和生成冷却。
- 黑影只在夜晚从随机雾门出现。
- 每夜默认最多生成 2 个黑影，生成间隔约 3 秒，同场超过 5 个暂停生成。
- 黑影 HP 为 1。
- 黑影生成时选择最近家园作为推进目标，新营地也可成为候选家园。
- 黑影只响应 4 格方格距离内目标。
- 黑影目标锁约 1.2 秒。
- 临时辉石是黑影最高优先级局部目标。
- 黑影接触辉石后，辉石移除，黑影消失。
- 黑影接触玩家后，玩家有辉石则损失 1 个辉石，黑影消失。
- 玩家 0 辉石时接触黑影进入失败状态。
- 夜晚结束后，黑影返回最近雾门并消失。

### 有意重构的部分

- GPT_DEMO 的昼夜、生成计数和黑影 AI 被拆分为 `DayNightSystem`、`MonsterSystem`、`monsterTargetPriority` 和配置项。
- WEB_DEMO 使用 `state.status = 'playing' | 'failed'` 表达失败状态，避免把失败逻辑散落在系统内。
- v0.4 的黑影目标优先级只接入本轮允许的辉石、玩家和家园推进；围墙、工人、弓箭手、返程流民目标保留在规则审计中，等待对应版本迁移。
- 夜晚遮罩和失败提示由 WEB_DEMO renderer 表达，不复制 GPT_DEMO 的界面样式。
- 玩家被袭击后直接扣库存辉石，不生成可被自动拾回的掉落辉石，以避免当前自动拾取规则抵消“辉石损失”验收目标；该点列入待确认。

### 有意重设计的部分

无。本轮不引入已确认的玩法重设计。

### 待确认问题

- GPT_DEMO 中玩家被袭击后会在玩家附近掉落辉石；v0.4 为确保“损失 1 个辉石”可验证，暂不生成掉落辉石。后续若要求完全一致，需要定义掉落辉石与自动拾取的关系。
- GPT_DEMO 完整黑影目标优先级包含围墙、工人、弓箭手和返程流民；v0.4 按任务卡禁止范围没有迁移这些目标，后续版本接入时需保持原优先级。
- v0.4 地图只生成最小雾门节点，尚未完整恢复 GPT_DEMO 所有地图特殊点。

## v0.5-refactor 代码迁移记录

### 迁移系统

v0.4 小修复 / 工人夜晚感知 / 工人逃跑 / 任务释放 / 工人 lost / 黑影抓工人

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 工人基础状态：`mkUnit()` 中的 `lost`、`flee`、`savedJob`，位于约 351 - 357 行。
- 派工筛选：`bestWorker()` 过滤 `!w.lost && !w.flee && (idle || return)`，位于约 759 - 768 行。
- 工人更新入口：`updateUnits(dt)`，位于约 797 - 824 行。
- 工人威胁检测：`checkThreat(w)`，位于约 827 - 879 行。
- 工人行走与回家：`walk(u, dt)`、`home(w)`，位于约 882 - 968 行。
- 任务释放：`release(u)`，位于约 905 - 923 行。
- 黑影局部目标：`findNearestTarget(m)` 中的 `workerTargets`，位于约 1125 - 1129 行。
- 黑影命中工人：`updateMonsters(dt)` 中 `ti.kind === 'worker'` 分支与 `hitWorker(id)`，位于约 1246 - 1289 行。
- HUD 统计：`drawHud()` 中 `idle` / `alive` 工人统计，位于约 1591 - 1600 行。
- 相关状态：`worker.lost`、`worker.flee`、`worker.savedJob`、`worker.job`、地块 `lock`、黑影 `monsters`。

### GPT_DEMO 原始行为

- 只有未 lost 且未 flee 的空闲 / 返回工人可被派工。
- 工人执行任务时，如果横纵差 3 格内出现黑影，会保存原任务、释放目标 lock，并撤退回家。
- 工人撤退中不会被重新派工。
- 工人 lost 后从可用工人统计中移除。
- 黑影局部目标包含工人，且在完整目标顺序中位于围墙之后、弓箭手和返程流民之前。
- 黑影接触工人后调用 `hitWorker()`：释放工人任务锁，将工人标记 lost，黑影消失。
- gpt.11.7 中 `release()` 还会清理矿山占用，避免工人 lost 后矿山永久占用。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/config/GameConfig.js`：新增 `worker.threatRange = 3`，并更新版本为 v0.5。
- `WEB_DEMO/src/game/state/createInitialState.js`：新增工人 `flee`、`interruptedJob` 状态，并修正初始提示文案。
- `WEB_DEMO/src/game/systems/WorkerSystem.js`：新增夜晚威胁感知、撤退、释放任务、撤退不可派工、回家恢复空闲和可复用任务释放方法。
- `WEB_DEMO/src/game/systems/MonsterSystem.js`：修正同场上限判断，保持 raidCamp 停留，新增工人局部目标和抓工人逻辑。
- `WEB_DEMO/src/game/rules/monsterTargetPriority.js`：新增工人目标类型和工人目标键。
- `WEB_DEMO/src/app/GameApp.js`：将 `WorkerSystem` 注入 `MonsterSystem`，用于黑影抓工人时释放任务。
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`：新增撤退和失踪工人统计。
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`：显示撤退工人标签，lost 工人不再显示。
- `WEB_DEMO/index.html`、`WEB_DEMO/package.json`：同步 v0.5 版本标识。

### 保持一致的规则

- 工人威胁感知范围默认继承 GPT_DEMO 当前表现：横纵差不超过 3。
- 工人只在夜晚风险中响应附近黑影。
- 工人执行任务时感知黑影，会释放当前任务 reserved 并撤退。
- 撤退中的工人不可重新派工。
- 撤退工人回到所属家园后恢复为空闲状态。
- 黑影局部目标包含工人。
- 本轮允许范围内的黑影目标顺序为辉石 > 工人 > 玩家 > 家园推进，继承完整顺序中“辉石优先、工人在玩家之前”的关系。
- 黑影接触工人后，工人进入 lost 状态，原任务 reserved 被释放，黑影消失。
- lost 工人不再计入可用工人。
- 黑影达到同场上限时暂停生成。
- 黑影夜晚到达 raidCamp 附近后保持停留 / 等待局部目标，不无故返回雾门。

### 有意重构的部分

- GPT_DEMO 的 `lock` 字段在 WEB_DEMO 中继续对应为 `reserved`。
- GPT_DEMO 的 `release(u)` 被拆为 `releaseWorkerTask()` 和 `releaseReservedTarget()`，后续矿山占用释放可复用该入口。
- WEB_DEMO 使用 `state = 'flee'` 加 `flee = true` 明确表达撤退状态，渲染和 HUD 直接读取该状态。
- 黑影抓工人通过向 `MonsterSystem` 注入 `WorkerSystem` 完成任务释放，避免复制释放逻辑。
- v0.4 的“无局部目标返回雾门”保险分支调整为只在非夜晚或显式 returning 时回收；夜晚中无局部目标始终保留 raidCamp 推进目标。

### 有意重设计的部分

无。本轮不引入已确认的玩法重设计。

### 待确认问题

- GPT_DEMO 中撤退工人在黑影远离后会尝试继续原任务；v0.5 先按任务卡验收实现“回家后恢复为空闲”，并保留 `interruptedJob` 作为后续任务恢复基础。是否自动恢复原任务需策划确认。
- GPT_DEMO 的 `release()` 会清理矿山占用；WEB_DEMO 当前还没有迁移矿山，本轮只释放普通任务 reserved。矿山进入任务卡后需接入同一释放入口。
- 完整黑影目标优先级中的围墙、弓箭手和返程流民仍未迁移，后续版本接入时需保持原顺序。

## v0.6-refactor 代码迁移记录

### 迁移系统

临时辉石拾回 / 矿山 / 采矿派工 / 持续产出 / 矿山占用释放

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 地块类型：`T.MN`，位于约 137 行。
- 通行规则：`pass()` 中 `T.MN` 可通行，位于约 224 - 228 行。
- 辉石拾取、生命周期、掉落：`pickup()`、`life(dt)`、`drop()`，位于约 587 - 624 行。
- 辉石放置：`placeStone()`，位于约 700 - 729 行。
- 初始矿山生成：`startArea()` 中 `START.x + 2` 位置生成 `T.MN`，位于约 449 - 453 行。
- 营地附近矿山生成：`createMine(x, y)`，位于约 479 - 486 行。
- 矿山互动识别：`infoAt()` 中 `act = 'mine'`，位于约 638 行。
- 采矿派工：`sendMine(it, c)`，位于约 773 - 790 行。
- 工人采矿更新：`updateUnits(dt)` 中 `state === 'mining'` 分支，位于约 803 - 814 行。
- 任务释放：`release(u)` 清理普通任务和 `mine.worker`，位于约 905 - 923 行。
- 到达矿山后的状态切换：`finish(w)` 中 `type === 'mine'` 分支，位于约 949 - 956 行。
- 矿山和采矿渲染：矿山标签与 `drawWorker(w)` 的采矿标签，位于约 1429 行和约 1498 行。
- 相关状态：地块 `mine.worker` / `lock`，工人 `state = 'mining'`、`prog`、`lost`。

### GPT_DEMO 原始行为

- 出生点附近存在矿山，矿山是可通行资源点。
- 玩家与矿山互动后，使用最佳可用工人前往矿山。
- 采矿派工不消耗辉石。
- 矿山派工途中用 `lock` 防止重复任务；工人到达后写入 `mine.worker`。
- 工人到达矿山后进入 `mining` 状态，不再执行普通返程。
- 采矿工人每约 30 秒在附近掉落 1 个辉石。
- 如果工人 lost 或任务释放，`release()` 会清理该工人占用的矿山，避免矿山永久显示已有工人。
- GPT_DEMO 的辉石只有 `T.S` 一类，靠近会自动拾取；玩家放置辉石同样使用 `T.S` 与 `life=10`。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/world/TileMap.js`：新增 `TileType.MINE`、通行规则和 `mine` 地块状态。
- `WEB_DEMO/src/game/world/MapGenerator.js`：在出生点附近生成 1 个矿山。
- `WEB_DEMO/src/game/config/GameConfig.js`：新增 `mine.productionSeconds = 30`，并更新版本为 v0.6。
- `WEB_DEMO/src/game/rules/jobCosts.js`：新增 `JobType.MINE`，采矿成本为 0。
- `WEB_DEMO/src/game/rules/jobDurations.js`：新增采矿到达后的即时完成入口。
- `WEB_DEMO/src/game/rules/interactionPriority.js`：新增临时辉石拾回和矿山互动优先级。
- `WEB_DEMO/src/game/systems/ResourceSystem.js`：新增 `pickPlacedStone()`，只允许主动拾回 `placed=true` 的临时辉石。
- `WEB_DEMO/src/game/systems/InteractionSystem.js`：识别临时辉石 Space 拾回和矿山 Space 派工。
- `WEB_DEMO/src/game/systems/WorkerSystem.js`：新增矿山派工、采矿状态、持续产出、矿山占用释放和 stale 占用清理。
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`：显示矿山、前往矿山、采矿中和采矿倒计时。
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`：显示采矿工人数。
- `WEB_DEMO/index.html`、`WEB_DEMO/package.json`：同步 v0.6 版本标识。

### 保持一致的规则

- 自然辉石靠近自动拾取。
- 玩家主动放置的临时辉石拥有生命周期，并仍能作为黑影诱饵。
- 黑影仍会优先吃局部范围内的临时辉石。
- 地图中存在矿山。
- 矿山可通过 Space 互动派工。
- 采矿派工默认 0 辉石成本。
- 只有可用工人可以被派去采矿，撤退 / lost 工人不可派。
- 矿山 reserved / occupied 防止重复派工。
- 工人到达矿山后进入 `mining` 状态。
- 矿山约 30 秒产出 1 个辉石。
- 产出方式继承 GPT_DEMO：在矿山附近掉落辉石，而不是直接进入库存。
- 工人逃跑或 lost 后会释放矿山占用，避免无人采矿但提示已有工人的卡死。

### 有意重构的部分

- GPT_DEMO 的 `lock` / `mine.worker` 在 WEB_DEMO 中拆为 `reserved` / `mine.workerId`。
- `release()` 被扩展为 `releaseWorkerTask()`、`releaseReservedTarget()` 和 `releaseMineOccupation()`，让普通任务和矿山占用共用释放入口。
- `sendMine()` 被并入 `WorkerSystem.assignJob()`，通过 `JobType.MINE` 和 0 成本表统一派工。
- 采矿产出时间集中到 `GameConfig.mine.productionSeconds`。
- WEB_DEMO 区分自然辉石和临时辉石：`placed=false` 的自然 / 掉落辉石自动拾取，`placed=true` 的临时辉石不自动拾回。

### 有意重设计的部分

无。本轮不引入已确认的玩法重设计。

### 待确认问题

- GPT_DEMO 中玩家放置的辉石也会被 `pickup()` 靠近自动拾取；WEB_DEMO 按任务卡要求改为临时辉石不自动拾回，但可 Space 主动拾回，以保留诱敌策略。
- GPT_DEMO 新营地建成后会调用 `createMine()` 在营地附近生成矿山；v0.6 最小实现只保证出生点附近矿山，后续是否补齐新营地设施生成需随对应任务卡确认。
- 采矿派工是否应消耗辉石仍是策划待确认项；v0.6 默认继承 GPT_DEMO 当前 0 成本表现。
- GPT_DEMO 当前采矿工人在 `updateUnits()` 中不主动做威胁检测；v0.6 为满足任务卡“工人逃跑时释放矿山占用”，允许采矿工人感知黑影并撤退，后续可由策划确认是否保留。

## v0.7-refactor 代码迁移记录

### 迁移系统

流民火堆 / 招募流民 / 流民返程 / 待转职人口池 / 工人屋 / 弓箭手营 / 工人转职 / 弓箭手转职

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 地块类型：`T.RF`、`T.HUT`、`T.AR`，位于约 141、144、145 行。
- 通行规则：`pass()` 中允许 `T.RF`、`T.HUT`、`T.AR` 通行，位于约 224 - 225 行。
- 状态变量：`pop`、`refs`、`archers`，位于约 180 行；`resetGame()` 初始化 `pop = []`、`refs = []`，位于约 332 - 333 行。
- 地图生成：`makeMap()` 中沿主路径放置流民火堆，`startArea()` 和营地建成后调用 `spawnCareer()` 生成工人屋与弓箭手营，位于约 389 - 465 行和约 939 行。
- 流民火堆刷新：`updateRefugeeFires(dt)`，位于约 505 - 515 行。
- 互动识别：`infoAt()` 中流民火堆、工人屋、弓箭手营优先级，位于约 635 - 637 行。
- 招募与转职：`recruit(it, c)`、`convert(kind)`，位于约 735 - 755 行。
- 流民返程：`updateRefs(dt)`，位于约 973 - 991 行。
- 渲染与 HUD：流民火堆、职业点、返程流民、待转职人口和弓箭手显示逻辑，位于约 1430 - 1600 行。

### GPT_DEMO 原始行为

- 地图中存在流民火堆，火堆可作为人口补给来源。
- 玩家与可招募流民火堆互动时消耗 1 个辉石，生成返程流民。
- 招募后流民火堆进入约 10 秒冷却，冷却结束后再次可招募。
- 返程流民沿路径移动到最近家园；抵达后进入待转职人口池，而不是直接成为工人。
- 工人屋用于把待转职人口转成工人，弓箭手营用于把待转职人口转成弓箭手。
- 每次转职消耗 1 个辉石和 1 个待转职人口。
- 弓箭手实体可以显示；完整战斗逻辑属于后续防御系统。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/world/TileMap.js`：新增 `REFUGEE_FIRE`、`WORKER_HUT`、`ARCHER_CAMP` 地块类型、通行规则和 `refugee` 地块状态。
- `WEB_DEMO/src/game/world/MapGenerator.js`：生成流民火堆，并在起点家园附近生成工人屋和弓箭手营。
- `WEB_DEMO/src/game/config/GameConfig.js`：新增人口相关配置，包括初始工人、流民招募成本、流民火堆冷却、流民返程速度和转职成本。
- `WEB_DEMO/src/game/state/createInitialState.js`：新增 `refugees`、`archers`、`population.unassigned` 和 `createArcher()`。
- `WEB_DEMO/src/game/systems/PopulationSystem.js`：新增流民火堆冷却、招募流民、返程流民、抵达后进入人口池、转职为工人 / 弓箭手。
- `WEB_DEMO/src/game/systems/InteractionSystem.js`：新增流民火堆、工人屋、弓箭手营互动识别和执行。
- `WEB_DEMO/src/game/rules/interactionPriority.js`：新增招募、职业点转职和流民火堆冷却互动优先级。
- `WEB_DEMO/src/game/systems/WorkerSystem.js`：新营地建成后生成工人屋与弓箭手营。
- `WEB_DEMO/src/app/GameApp.js`：接入 `PopulationSystem` 更新。
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`：显示流民火堆、返程流民、工人屋、弓箭手营和弓箭手实体。
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`：显示待转职人口、返程流民、弓箭手和流民火堆状态。
- `WEB_DEMO/index.html`、`WEB_DEMO/package.json`：同步 v0.7 版本标识。

### 保持一致的规则

- 流民火堆是人口补给来源，互动招募成本为 1 个辉石。
- 招募后生成返程流民实体，流民不会立刻变成工人。
- 流民抵达家园后进入待转职人口池。
- 待转职人口需要在职业点消耗辉石转职。
- 工人屋转职为工人，弓箭手营转职为弓箭手。
- 转职成本为 1 个辉石和 1 个待转职人口。
- 流民火堆冷却约 10 秒后恢复可招募。
- 弓箭手本轮只作为实体存在并显示，不具备射击战斗。

### 有意重构的部分

- GPT_DEMO 的 `pop` 在 WEB_DEMO 中表达为 `state.population.unassigned`，保留“待转职而非工人”的语义。
- GPT_DEMO 的 `refs` 被迁移为 `state.refugees` 并由独立 `PopulationSystem` 更新。
- GPT_DEMO 的火堆字段 `ref/refCd` 在 WEB_DEMO 中表达为 `tile.refugee.available/cooldown`。
- GPT_DEMO 的 `spawnCareer()` 被拆到 `MapGenerator.placeCareerSites()` 和 `WorkerSystem.createCareerSitesNear()`，分别处理初始家园和新营地。
- 职业转换通过 `createWorker()` / `createArcher()` 统一实体创建入口，避免把逻辑塞回单文件结构。

### 有意重设计的部分

无。本轮不引入已确认的玩法重设计。

### 待确认问题

- GPT_DEMO 中流民火堆是否无限刷新仍是策划待确认项；v0.7 暂按约 10 秒冷却后重新可招募继承。
- 新营地职业点位置本轮按 GPT_DEMO 的固定偏移继承，后续若有正式营地布局需要策划确认。
- 弓箭手战斗、弓箭手被黑影攻击、黑影攻击返程流民、流民夜晚减速和流民 lost 均按任务卡后置。

## v0.8-refactor 代码迁移记录

### 迁移系统

墙基 / 建墙派工 / 围墙 HP / 黑影攻击围墙 / 弓箭手自动瞄准 / 弓箭手攻击黑影 / 弓箭手冷却

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 地块类型：`T.WB`、`T.WL`，位于约 149 - 150 行。
- 通行规则：`pass()` 中允许 `T.WB`、`T.WL` 通行，位于约 224 - 225 行。
- 墙基生成：`spawnWallBases(cx, cy)`，位于约 467 - 476 行；`startArea()` 和建营完成后调用，位于约 453 - 454 行和约 939 行。
- 建墙互动：`infoAt()` 中 `act = 'wall'`、优先级 7、文案 `建造围墙 2`，位于约 640 行；`interact()` 中将 `wall` 计入 2 辉石成本，位于约 682 行。
- 建墙完成：`finish(w)` 中 `type === 'wall'` 分支将墙基变为围墙并设置 `hp = 3`，位于约 934 行。
- 弓箭手基础状态：`mkUnit()` 中 `shoot`、`aimProg`，位于约 351 - 356 行。
- 弓箭手系统：`updateArchers(dt)`，位于约 995 - 1034 行。
- 黑影目标键：`targetKey(ti)` 支持 `wall` 和 `archer`，位于约 1050 - 1058 行。
- 黑影目标选择：`findNearestTarget(m)` 扫描局部围墙、工人、弓箭手，并按辉石 > 围墙 > 工人 > 弓箭手 > 返程流民 > 玩家排序，位于约 1114 - 1151 行。
- 黑影攻墙：`updateMonsters(dt)` 中 `ti.kind === 'wall'` 分支，位于约 1208 - 1227 行。
- 黑影接触弓箭手：`updateMonsters(dt)` 中 `ti.kind === 'archer'` 分支会移除 / 拖走弓箭手，位于约 1253 - 1257 行。该来源属于 GPT_DEMO 已存在逻辑，但在 WEB_DEMO v0.8 任务卡中属于超前实现。
- 渲染与 HUD：墙基、围墙 HP、弓箭手瞄准 / 冷却标签和 HUD 弓箭手统计，位于约 1432 - 1599 行。

### GPT_DEMO 原始行为

- 部落 / 营地附近会生成墙基，墙基是可建设防御点。
- 玩家与墙基互动可消耗 2 个辉石派工建墙。
- 建墙任务使用工人派工、目标锁和工作时间；完成后墙基变成围墙，围墙 HP 默认为 3。
- 黑影只扫描 4 格局部范围内的目标，不全图追踪围墙。
- 黑影目标优先级中辉石最高，围墙高于工人、弓箭手、返程流民和玩家。
- 黑影接触围墙后约每秒造成 1 点伤害，围墙 HP 归零后被摧毁。
- GPT_DEMO 还包含黑影接触弓箭手后拖走 / 移除弓箭手的行为；该行为虽与 GPT_DEMO 规则一致，但在 WEB_DEMO v0.8 原任务卡范围中属于轻微超前。
- 弓箭手只在夜晚搜索射程内黑影，射程约 5.5 格。
- 弓箭手瞄准约 0.6 秒后造成 1 点伤害；黑影 HP 为 1，因此被命中后消失。
- 弓箭手攻击后进入约 2.2 秒冷却。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/config/GameConfig.js`：新增 `wall.maxHp`、`wall.attackSeconds`、`wall.attackDistance`、`archer.range`、`archer.aimSeconds`、`archer.cooldownSeconds` 和 `archer.damage`。
- `WEB_DEMO/src/game/world/TileMap.js`：新增 `WALL_BASE`、`WALL` 地块类型、通行规则和 `hp` 地块状态。
- `WEB_DEMO/src/game/world/MapGenerator.js`：起点家园附近生成墙基。
- `WEB_DEMO/src/game/rules/jobCosts.js`、`WEB_DEMO/src/game/rules/jobDurations.js`：新增 `JobType.WALL`、2 辉石成本和默认工作时长。
- `WEB_DEMO/src/game/rules/interactionPriority.js`：新增墙基互动优先级。
- `WEB_DEMO/src/game/systems/InteractionSystem.js`：识别墙基互动和建墙中 reserved 状态。
- `WEB_DEMO/src/game/systems/WorkerSystem.js`：完成建墙后生成 HP 3 围墙，新营地建成后生成墙基。
- `WEB_DEMO/src/game/rules/monsterTargetPriority.js`：新增 `WALL` 和 `ARCHER` 目标类型。
- `WEB_DEMO/src/game/systems/MonsterSystem.js`：扩展局部目标为辉石 > 围墙 > 工人 > 弓箭手 > 玩家 > 家园推进，并新增黑影攻墙逻辑；其中弓箭手被抓 / lost 属于 v0.8 任务卡范围外的有意超前实现，待策划确认。
- `WEB_DEMO/src/game/systems/ArcherSystem.js`：新增夜晚自动瞄准、攻击、击杀和冷却逻辑。
- `WEB_DEMO/src/game/state/createInitialState.js`：弓箭手实体新增瞄准目标、瞄准计时和冷却状态。
- `WEB_DEMO/src/app/GameApp.js`：接入 `ArcherSystem`，并保持弓箭手先于黑影更新。
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`：显示墙基、围墙 HP、黑影攻墙、弓箭手瞄准线和冷却标签。
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`：显示围墙 / 受损围墙、弓箭手瞄准 / 冷却状态。
- `WEB_DEMO/index.html`、`WEB_DEMO/package.json`：同步 v0.8 版本标识。

### 保持一致的规则

- 墙基可通过 Space 派工建设，建墙成本为 2 个辉石。
- 建墙复用工人派工、工作、返程和 reserved 机制。
- 建墙完成后围墙 HP 默认为 3。
- 黑影仍只响应 4 格局部范围内目标。
- 黑影目标优先级保持为辉石 > 围墙 > 工人 > 弓箭手 > 玩家 > 家园推进；返程流民目标本轮后置。
- 黑影接触围墙后约每秒造成 1 点伤害，围墙 HP 归零后被摧毁。
- 黑影把弓箭手纳入局部目标优先级，与 GPT_DEMO 目标顺序一致；黑影接触弓箭手后使其 lost 的具体伤害分支暂标记为有意超前实现 / 待策划确认。
- 弓箭手只在夜晚参与防御。
- 弓箭手优先攻击射程内最近黑影。
- 弓箭手瞄准约 0.6 秒、造成 1 点伤害、攻击后冷却约 2.2 秒。
- 黑影 HP 为 1，被弓箭手命中后消失。

### 有意重构的部分

- GPT_DEMO 的墙基 / 围墙地块被迁移为 `TileType.WALL_BASE` 和 `TileType.WALL`。
- GPT_DEMO 的建墙逻辑并入 WEB_DEMO 现有 `WorkerSystem.assignJob()` / `finish()` 派工框架。
- GPT_DEMO 的黑影目标选择扩展在 `MonsterSystem` 中拆成 `findWallTargets()`、`findWorkerTargets()`、`findArcherTargets()` 等局部扫描函数。
- GPT_DEMO 的 `updateArchers(dt)` 拆成独立 `ArcherSystem`，由 `GameApp` 在黑影更新前调用。
- 弓箭手状态从 GPT_DEMO 的 `shoot` / `aimProg` 命名重构为 `cooldown` / `aimTimer` / `aimingTargetId`。

### 有意超前实现 / 待策划确认

- v0.8 中已经实现黑影将弓箭手作为局部目标，并在接触后使弓箭手进入 lost 状态。
- 该行为相对 v0.8 原任务卡属于范围轻微超前，不是 v0.8 防御闭环的核心目标。
- 由于 GPT_DEMO 黑影目标优先级包含弓箭手，当前实现暂时保留，并标记为待策划确认。
- 如果后续决定保留，应正式纳入黑影目标规则；如果后续决定不保留，应移除 `ARCHER` 目标伤害分支和 `hitArcher`。

### 有意重设计的部分

无。本轮不引入已确认的玩法重设计。

### 待确认问题

- GPT_DEMO 围墙地块可通行；WEB_DEMO 当前按 GPT_DEMO 继承，是否改为阻挡仍待策划确认。
- WALL 当前仍在 WEB_DEMO 通行地块集合中；围墙是否只作为 HP 防御点，还是应作为阻挡玩家 / 工人 / 黑影移动的地形，需要策划确认。若改为阻挡，应记录为有意重设计。
- GPT_DEMO 围墙 HP 归零后直接变为空地；WEB_DEMO 当前也按摧毁处理，是否退回墙基以便重建待确认。
- 新营地建成后本轮补齐墙基生成，但新营地矿山生成仍沿 v0.6 待确认项后置。
- 弓箭手攻击当前为即时命中，是否需要正式弹道、命中特效或音效待确认。
- 围墙升级、营地损坏、黑影攻击返程流民、流民夜晚减速、流民 lost、特殊事件和小地图均留到后续任务卡。

## v0.9-refactor 代码迁移记录

### 迁移系统

颠倒森林 / 狐狸成亲事件 / 终点灯塔 / 看海目标 / 基础胜利提示 / 小地图后置记录

### GPT_DEMO 来源

- 文件：`GPT_DEMO/index.html`
- 相关常量：地块类型 `T.INV`、`T.FOX`、`T.GO`，位于约 143 - 146 行和约 146 - 147 行。
- 相关状态：`foxes`、`foxEvent`、玩家 `pl.ctrlInv`，位于约 180 - 181 行和约 329 行。
- 相关函数：`paintInvert()`、`inInvert()`、`move()`、`infoAt()`、`interact()`、`startFox()`、`updateFox()`、`endFox()`、`drawHud()`。
- 通行规则：`pass()` 中允许 `T.INV`、`T.FOX`、`T.GO` 通行，位于约 224 - 225 行。
- 颠倒森林判定：`inInvert(o)`，位于约 281 - 285 行。
- 地图生成：`paintInvert(cx, cy, r)`、`place(path, 27, -5, ...)`、终点 `cell(GOAL.x, GOAL.y).t = T.GO`，位于约 390 - 426 行和约 407 行。
- 玩家移动反转：`move(dt)` 中 `pl.ctrlInv` 与输入方向反转逻辑，位于约 544 - 570 行。
- 互动识别与执行：`infoAt()` 中 `goal` / `fox` 分支，`interact()` 中目标完成和 `startFox()`，位于约 630 - 690 行。
- 狐狸成亲事件：`startFox(it, c)`、`updateFox(dt)`、`endFox(ok)`，位于约 1300 - 1341 行。
- 渲染与 HUD：颠倒森林、狐狸成亲、狐狸队列、方向反转、狐狸奇遇状态和终点标签，位于约 1433 - 1602 行。

### GPT_DEMO 原始行为

- 地图中存在颠倒森林区域，中心格显示“颠倒森林”标签。
- 玩家处于颠倒森林时，移动输入方向反转；离开后恢复正常。
- 方向反转只影响玩家移动输入，不影响工人、黑影、流民或弓箭手 AI。
- 地图中存在狐狸成亲事件点，玩家通过 Space 触发。
- 事件开始后生成狐狸队列；队伍会周期性移动和停顿。
- 玩家需要跟随队伍，距离过远会失败；队伍停下时玩家继续移动也会失败。
- 事件持续约 13 秒，成功后奖励辉石 +4；失败无奖励。
- 事件结束后原事件点变成普通地面，避免重复刷奖励。
- 玩家与终点远方信标互动后，显示“听见海风 / 阶段目标完成”的基础提示。

### WEB_DEMO 迁移位置

- `WEB_DEMO/src/game/config/GameConfig.js`：新增 `events.invertedForest` 和 `events.foxWedding` 配置，并同步版本为 v0.9。
- `WEB_DEMO/src/game/world/TileMap.js`：新增 `INVERTED_FOREST`、`FOX_WEDDING` 地块类型、通行规则、`event` 和 `invertLabel` 状态。
- `WEB_DEMO/src/game/world/MapGenerator.js`：新增颠倒森林区域生成、狐狸成亲事件点生成，并继续生成终点目标。
- `WEB_DEMO/src/game/systems/PlayerSystem.js`：根据玩家所在地块反转玩家移动输入，并写入 `player.controlInverted`。
- `WEB_DEMO/src/game/systems/SpecialEventSystem.js`：新增狐狸婚仪开始、进行中、成功、失败、结束状态机。
- `WEB_DEMO/src/game/systems/InteractionSystem.js`：新增狐狸成亲互动分支，并将终点互动设置为 `completed` 状态。
- `WEB_DEMO/src/game/state/createInitialState.js`：新增事件状态和完成状态。
- `WEB_DEMO/src/app/GameApp.js`：接入 `SpecialEventSystem`，并在主循环中更新特殊事件。
- `WEB_DEMO/src/presentation/renderers/WorldRenderer.js`：显示颠倒森林、狐狸成亲事件点、狐狸队列、远方灯塔和完成覆盖层。
- `WEB_DEMO/src/presentation/renderers/HudRenderer.js`：显示颠倒森林、狐狸婚仪和旅程完成状态。
- `WEB_DEMO/src/game/rules/interactionPriority.js`：新增狐狸成亲事件互动优先级。
- `WEB_DEMO/index.html`、`WEB_DEMO/package.json`：同步 v0.9 版本标识。

### 保持一致的规则

- 颠倒森林是地图区域，不是单点。
- 颠倒森林只反转玩家移动输入，不影响其他 AI。
- 玩家离开颠倒森林后，移动输入恢复正常。
- 狐狸成亲通过 Space 触发。
- 狐狸成亲事件有开始、进行中、成功、失败和结束状态。
- 狐狸队列移动时需要跟随，队伍停下时玩家也需要停止。
- 成功奖励辉石 +4。
- 失败无奖励。
- 事件结束后清除事件点，避免重复刷奖励。
- 玩家与终点灯塔 / 看海目标互动后完成阶段目标。
- 完成后进入 `completed` 状态，基础失败压力停止，R 重置仍可用。

### 有意重构的部分

- GPT_DEMO 的 `foxes` / `foxEvent` 全局变量被收敛到 `state.events.foxWedding`。
- GPT_DEMO 的 `startFox()`、`updateFox()`、`endFox()` 被拆成独立 `SpecialEventSystem`。
- GPT_DEMO 的 `pl.ctrlInv` 在 WEB_DEMO 中表达为 `state.player.controlInverted`，由 `PlayerSystem` 根据当前地块更新。
- GPT_DEMO 的终点提示从单纯 toast 扩展为 `state.status = 'completed'`，用于停止主要系统推进并显示基础完成覆盖层。
- 特殊地形和事件点仍由 `MapGenerator` 生成，但使用 `TileType` 和 `GameConfig` 保持工程化结构。

### 有意重设计的部分

无。本轮不引入已确认的玩法重设计。`completed` 状态只用于满足任务卡“胜利后停止主要游戏推进或至少停止失败压力”的要求，不扩展为完整结算系统。

### 待确认问题

- GPT_DEMO 中 F3 小地图 / 辅助信息本轮未迁移，后续是否作为 v1.0 体验回归内容需要确认。
- 狐狸成亲当前仍是最小队列 / 同步判定，没有正式剧情演出、镜头、音效或美术表现。
- 终点完成当前只有基础提示和完成覆盖层，完整结算系统、统计和剧情收束后置。
- 颠倒森林区域位置和半径暂按 GPT_DEMO 默认体验迁移，正式关卡布局仍可后续策划调整。
