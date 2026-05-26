# Codex Tasks

---

# 当前任务：WEB_DEMO v0.3-refactor 自动拾取修正 + 工人派工与营地扩张迁移

## 任务名称

```text
WEB_DEMO v0.3-refactor 自动拾取修正 + 工人派工与营地扩张迁移
```

---

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
```

v0.2 已实现：

```text
1. 最小 Vite 工程
2. 基础地图
3. 玩家移动
4. 玩家朝向
5. 视野揭示
6. Space 面前优先互动
7. 辉石采集与放置
8. 基础 HUD
```

但 v0.2 审计中发现一个需要修正的规则差异：

```text
GPT_DEMO 中自然辉石是靠近自动拾取；
v0.2 中实现成了 Space 拾取。
```

主控对话已确认：

```text
WEB_DEMO 后续采用 GPT_DEMO 方式：自然辉石靠近自动拾取。
```

该决策已写入：

```text
WEB_DEMO/design/decisions/resource_pickup_rule.md
```

---

## 本轮目标

本轮目标分为两部分：

```text
第一部分：修正辉石拾取规则，回归 GPT_DEMO 的“靠近自动拾取”。
第二部分：从 GPT_DEMO/index.html 定向迁移工人派工、砍树、修桥、建营地和营地扩张的最小闭环。
```

本轮重点验证：

```text
1. 自然辉石靠近自动拾取。
2. Space 不再用于拾取自然辉石。
3. Space 仍然用于面前格优先互动和无目标放置辉石。
4. 玩家可以消耗辉石派工人砍树。
5. 玩家可以消耗辉石派工人修桥。
6. 玩家可以消耗辉石派工人建营地。
7. 工人命令不可取消。
8. 工人完成任务后返回所属营地。
9. 建成新营地后，执行建营的工人留驻新营地。
10. 新营地成为新的家园点，为后续黑影 raidCamp、流民返程、工人返程预留基础。
```

---

# 重要开发原则

本轮仍然必须采用：

```text
规则基线 + GPT_DEMO 定向代码迁移 + 模块化重构 + 规则继承审计
```

Codex 必须先定位 `GPT_DEMO/index.html` 中对应代码逻辑，再迁移到 WEB_DEMO 新模块。

禁止：

```text
1. 只根据需求描述凭空重写。
2. 整文件复制 GPT_DEMO/index.html。
3. 为了实现方便改变 GPT_DEMO 已验证规则。
4. 提前迁移黑影、昼夜、围墙、弓箭手、矿山、流民或特殊事件。
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

## 一、修正辉石拾取规则

必须按已确认决策实现：

```text
自然辉石靠近自动拾取。
```

要求：

```text
1. 玩家靠近自然辉石后自动拾取。
2. 拾取后自然辉石从地图上移除。
3. 玩家辉石库存增加对应数量。
4. Space 不再用于拾取自然辉石。
5. Space 仍然用于面前格优先互动。
6. 无互动目标时 Space 仍然放置 1 个临时辉石。
```

建议实现：

```text
1. 在 ResourceSystem 中新增 autoPickup 或 updatePickup 逻辑。
2. 每帧或移动后检查玩家附近自然辉石。
3. 自然辉石与玩家距离达到拾取范围后自动进入库存。
4. 临时放置辉石可以暂时不自动拾回，避免玩家刚放下又自动捡起。
```

需要区分：

```text
自然辉石：地图生成 / 掉落，用于自动拾取。
临时辉石：玩家主动放置，用于后续黑影诱敌，不自动拾回。
```

---

## 二、迁移可砍树

从 `GPT_DEMO/index.html` 中定位可砍树相关代码。

必须继承：

```text
1. 不是所有森林都可砍。
2. 只有被标记为可砍任务点的树可以互动。
3. 砍树需要消耗 1 个辉石。
4. 玩家通过 Space 派工人执行砍树。
5. 工人到达后工作一段时间。
6. 砍树完成后，树变为可通行地面。
7. 砍树完成后掉落 / 产出 1 个辉石。
```

v0.3 只需要最小实现：

```text
1. 地图中生成少量可砍树任务点。
2. HUD / 标签能提示“派工砍树”。
3. 完成后能看到地块变化和辉石产出。
```

---

## 三、迁移断桥与修桥

从 `GPT_DEMO/index.html` 中定位断桥 / 修桥相关代码。

必须继承：

```text
1. 断桥是路线推进门槛。
2. 断桥初始不可通行。
3. 修桥需要消耗 2 个辉石。
4. 玩家通过 Space 派工人修桥。
5. 工人到达后工作一段时间。
6. 修桥完成后断桥变成可通行桥。
```

v0.3 只需要最小实现：

```text
1. 主路径上至少存在一个断桥。
2. 玩家必须修桥后才能继续通过该位置。
3. 不需要完整迁移所有 GPT_DEMO 桥梁布局。
```

---

## 四、迁移旧火塘与建营地

从 `GPT_DEMO/index.html` 中定位旧火塘 / 建营地相关代码。

必须继承：

```text
1. 旧火塘是可建设营地的位置。
2. 建营地需要消耗 2 个辉石。
3. 玩家通过 Space 派工人建营地。
4. 工人到达后工作一段时间。
5. 建成后旧火塘变为营地。
6. 新营地加入家园点列表。
7. 执行建营的工人留驻新营地。
```

v0.3 暂不完整生成职业点、墙基、矿山等设施，但必须预留结构。

最低要求：

```text
1. 主路径中段至少存在一个旧火塘。
2. 建成后地图显示为营地。
3. 新营地可作为工人返程点。
4. state 中存在 homes / camps / homeId 一类结构，为后续黑影和流民系统服务。
```

---

## 五、迁移工人基础系统

从 `GPT_DEMO/index.html` 中定位工人、派工、移动、工作、返程相关代码。

必须继承：

```text
1. 初始工人数量为 2。
2. 工人位于起点附近。
3. 工人有状态：空闲 / 前往目标 / 工作 / 返程。
4. 派工会选择可用工人。
5. 派工后目标进入 reserved / occupied 状态，避免重复派工。
6. 工人命令不可取消。
7. 工人到达目标后工作一段时间。
8. 工人完成任务后返回所属营地。
9. 返回中的工人可以被重新派工。
10. 建营地完成后，执行建营的工人留驻新营地，并将所属营地切换到新营地。
```

v0.3 暂不实现：

```text
1. 工人夜晚避险。
2. 工人被黑影抓走。
3. 工人恢复原任务。
4. 矿山占用释放。
```

但数据结构要为后续预留。

---

## 六、迁移工人任务锁 / reserved

必须实现任务锁，避免重复派工。

要求：

```text
1. 可砍树、断桥、旧火塘在派工后进入 reserved 状态。
2. reserved 状态下再次互动，应提示已有工人正在处理。
3. 工人完成任务后，目标被转换为完成状态。
4. 如果派工失败，不应扣除辉石，也不应设置 reserved。
5. 本轮可以暂不实现异常释放，但要为后续黑影抓走释放 reserved 预留方法。
```

---

## 七、基础 HUD 扩展

HUD 需要新增：

```text
1. 工人总数。
2. 空闲工人数。
3. 正在执行任务的工人数。
4. 营地数量 / 家园数量。
5. 当前交互提示。
```

---

# 建议新增 / 修改模块

可以新增：

```text
WEB_DEMO/src/game/systems/WorkerSystem.js
WEB_DEMO/src/game/systems/TaskSystem.js
WEB_DEMO/src/game/systems/CampSystem.js
WEB_DEMO/src/game/rules/jobCosts.js
WEB_DEMO/src/game/rules/jobDurations.js
```

可以修改：

```text
WEB_DEMO/src/game/config/GameConfig.js
WEB_DEMO/src/game/state/createInitialState.js
WEB_DEMO/src/game/world/TileMap.js
WEB_DEMO/src/game/world/MapGenerator.js
WEB_DEMO/src/game/systems/InteractionSystem.js
WEB_DEMO/src/game/systems/ResourceSystem.js
WEB_DEMO/src/app/GameApp.js
WEB_DEMO/src/presentation/renderers/WorldRenderer.js
WEB_DEMO/src/presentation/renderers/HudRenderer.js
```

不要提前创建大量空模块。

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
WEB_DEMO/design/decisions/resource_pickup_rule.md
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
1. 不做昼夜系统。
2. 不做黑影。
3. 不做黑雾口。
4. 不做工人夜晚逃跑。
5. 不做工人被抓。
6. 不做围墙。
7. 不做弓箭手。
8. 不做矿山。
9. 不做流民。
10. 不做工人屋 / 弓箭手营转职。
11. 不做狐嫁女。
12. 不做颠倒森林。
13. 不做小地图。
14. 不做 CSV / JSON 配置读取。
15. 不接入正式图片、音乐、字体。
16. 不做存档系统。
17. 不做移动端虚拟摇杆。
18. 不把 GPT_DEMO/index.html 整文件复制到 WEB_DEMO。
```

---

# 文档更新要求

完成后必须更新：

## 1. WEB_DEMO/docs/changelog.md

新增：

```markdown
## v0.3-refactor

状态：自动拾取修正 + 工人派工与营地扩张迁移

内容：
- 修正自然辉石拾取为 GPT_DEMO 规则：靠近自动拾取。
- Space 不再用于自然辉石拾取，继续用于面前优先互动和无目标放置辉石。
- 从 GPT_DEMO/index.html 定向迁移初始工人、工人移动、派工、工作和返程。
- 从 GPT_DEMO/index.html 定向迁移可砍树、断桥修桥和旧火塘建营地。
- 新增任务 reserved / occupied 机制，避免重复派工。
- 新增营地 / 家园基础结构。
- 建成新营地后，执行建营的工人留驻新营地。
- 本轮不迁移昼夜、黑影、围墙、弓箭手、矿山、流民或奇遇。
```

## 2. WEB_DEMO/docs/acceptance_tests.md

新增 v0.3-refactor 验收项：

```text
测试名称：WEB_DEMO v0.3-refactor 自动拾取修正 + 工人派工与营地扩张迁移
前置条件：已安装 Node.js
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
5. 移动靠近自然辉石，确认自动拾取
6. 在无互动目标处按 Space，确认仍可放置辉石
7. 靠近可砍树，按 Space 派工人砍树
8. 观察辉石消耗、工人移动、工作、完成和返程
9. 靠近断桥，按 Space 派工人修桥
10. 修桥完成后确认断桥变为可通行桥
11. 靠近旧火塘，按 Space 派工人建营地
12. 建营完成后确认旧火塘变为营地，工人留驻新营地
13. 观察 HUD 工人数量、空闲工人、任务工人和营地数量
预期结果：
1. 工程能正常启动
2. 浏览器控制台无 JavaScript 报错
3. 自然辉石靠近自动拾取
4. Space 不再用于拾取自然辉石
5. 无目标 Space 仍会放置 1 个临时辉石
6. 可砍树派工消耗 1 个辉石
7. 砍树完成后地块变为可通行地面，并产出辉石
8. 修桥派工消耗 2 个辉石
9. 修桥完成后断桥变为可通行桥
10. 建营地派工消耗 2 个辉石
11. 建成后旧火塘变为营地
12. 执行建营的工人留驻新营地
13. 任务 reserved 防止重复派工
14. 本轮没有实现昼夜、黑影、围墙、弓箭手、矿山、流民或奇遇
15. 审计文档记录 GPT_DEMO 到 WEB_DEMO 的迁移关系
```

## 3. WEB_DEMO/docs/known_issues.md

记录：

```text
v0.3-refactor 仍不包含昼夜、黑影、围墙、弓箭手、矿山、流民、特殊事件、小地图或正式资源。
工人夜晚避险、被抓、任务恢复和矿山占用释放将在后续版本迁移。
营地建成后的职业点、墙基、矿山等设施暂不完整生成，后续版本逐项迁移。
```

## 4. WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md

必须新增 v0.3-refactor 迁移记录。

记录格式至少包含：

```markdown
## v0.3-refactor 代码迁移记录

### 迁移系统

自动拾取 / 工人派工 / 砍树 / 修桥 / 建营地 / 工人返程 / 营地归属 / reserved

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
1. 自然辉石靠近自动拾取。
2. Space 不再用于自然辉石拾取。
3. Space 无目标时仍可放置临时辉石。
4. 初始工人为 2 名。
5. 地图中存在可砍树任务点。
6. 地图中存在断桥。
7. 地图中存在旧火塘。
8. 玩家可以消耗辉石派工人砍树。
9. 玩家可以消耗辉石派工人修桥。
10. 玩家可以消耗辉石派工人建营地。
11. 工人会移动到目标。
12. 工人会工作一段时间。
13. 工人完成砍树后地块变为地面并产出辉石。
14. 工人完成修桥后断桥变为可通行桥。
15. 工人完成建营后旧火塘变为营地。
16. 执行建营的工人留驻新营地。
17. 其他完成任务的工人返回所属营地。
18. reserved / occupied 防止重复派工。
19. HUD 显示工人和营地基础信息。
20. 没有迁移昼夜、黑影、围墙、弓箭手、矿山、流民或奇遇。
21. GPT_DEMO 未被修改。
22. 审计文档记录了 GPT_DEMO 到 WEB_DEMO 的迁移关系。
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
9. 哪些内容留到 v0.4-refactor。
```

---

# 给 Codex 的提醒

本轮的重点不是做很多系统，而是把 GPT_DEMO 的“派工建设”核心手感迁移正确。

尤其关注：

```text
自然辉石自动拾取；
Space 面前优先；
无目标放置辉石；
消耗辉石派工；
工人命令不可取消；
任务 reserved；
完成任务后返程；
建营地后工人留驻新营地。
```
