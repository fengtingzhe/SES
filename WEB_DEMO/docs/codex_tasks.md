# Codex Tasks

---

# 当前任务：WEB_DEMO v0.6-refactor 临时辉石拾回修复 + 矿山与持续产出迁移

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
v0.5-refactor：v0.4 小修复 + 工人夜晚避险、被抓与任务释放
```

v0.5 审核发现一个需要优先修复的问题：

```text
玩家主动将辉石放到地上后，无法拾回。
```

当前原因：

```text
ResourceSystem.autoPickup() 会跳过 tile.placed === true 的临时辉石；
InteractionSystem 中也没有提供拾回临时辉石的 Space 互动分支。
```

本轮先修复这个资源操作闭环，再从 GPT_DEMO/index.html 定向迁移矿山与持续产出。

---

## 本轮目标

本轮目标分为两部分：

```text
第一部分：修复玩家主动放置辉石无法拾回的问题。
第二部分：迁移矿山、采矿派工、占用状态、持续产出和工人 lost 后占用释放。
```

本轮重点验证：

```text
1. 自然辉石仍然靠近自动拾取。
2. 玩家主动放置的临时辉石可以被玩家主动拾回。
3. 临时辉石不会因为靠近玩家而立刻自动拾回。
4. 黑影仍然可以优先吃临时辉石。
5. 地图中存在矿山。
6. 玩家可以与矿山互动并派工采矿。
7. 矿山派工默认按 GPT_DEMO 当前表现：0 辉石成本。
8. 工人到达矿山后进入持续采矿状态。
9. 矿山约 30 秒产出 1 个辉石。
10. 矿山占用状态可以防止重复派工。
11. 采矿工人逃跑或被黑影抓走时，矿山占用被释放。
```

---

# 重要开发原则

本轮继续采用：

```text
规则基线 + GPT_DEMO 定向代码迁移 + 模块化重构 + 规则继承审计
```

Codex 必须先定位 `GPT_DEMO/index.html` 中对应代码逻辑，再迁移到 WEB_DEMO 新模块。

禁止整文件复制 `GPT_DEMO/index.html`。

---

# 第一部分：临时辉石拾回修复

## 一、自然辉石与临时辉石规则区分

必须保持：

```text
1. 自然辉石：靠近自动拾取。
2. 玩家主动放置的临时辉石：不自动拾回。
3. 玩家主动放置的临时辉石：允许玩家通过 Space 互动拾回。
4. 黑影仍然可以优先吃临时辉石。
```

## 二、临时辉石拾回交互

必须实现：

```text
1. Space 面前优先互动中，可以识别 placed=true 的临时辉石。
2. 如果玩家面前格有临时辉石，按 Space 拾回。
3. 如果面前没有目标，附近候选里有临时辉石，也可以按 Space 拾回。
4. 拾回后地面辉石移除。
5. 玩家辉石库存 + 1 或增加 tile.value。
6. HUD / toast 给出提示，例如：拾回辉石 +1。
```

注意：

```text
不要把 placed=true 的临时辉石纳入 autoPickup。
否则玩家刚放下辉石会马上捡回，破坏诱敌策略。
```

---

# 第二部分：矿山与持续产出迁移

## 一、矿山地块与地图生成

从 `GPT_DEMO/index.html` 中定位矿山生成相关逻辑。

必须继承：

```text
1. 地图中存在矿山。
2. 矿山是资源补给点，不是一次性拾取物。
3. 矿山需要工人长期占用或驻守采矿。
```

v0.6 最小实现：

```text
1. 地图中至少生成 1 个矿山。
2. WorldRenderer 能显示矿山。
3. InteractionSystem 能识别矿山互动。
```

## 二、采矿派工

从 `GPT_DEMO/index.html` 中定位采矿派工逻辑。

必须继承当前 GPT_DEMO 表现：

```text
1. 采矿派工默认 0 辉石成本。
2. 玩家通过 Space 与矿山互动派工。
3. 只有可用工人可以被派去采矿。
4. 矿山被派工后进入 occupied / reserved 状态。
5. occupied 状态下再次互动，应提示矿山已有工人。
```

注意：

```text
采矿是否应该消耗辉石仍属于策划待确认项。
本轮默认继承 GPT_DEMO 当前表现：0 成本。
```

## 三、持续产出

必须继承：

```text
1. 工人到达矿山后进入 mining / mine 状态。
2. 矿山约 30 秒产出 1 个辉石。
3. 产出的辉石可以直接进入玩家库存，或在矿山附近掉落；优先按 GPT_DEMO 实现迁移。
4. HUD 或提示需要让玩家知道矿山产出了辉石。
```

## 四、矿山占用释放

必须实现：

```text
1. 工人正常采矿时，矿山保持 occupied。
2. 工人夜晚逃跑时，矿山 occupied 被释放。
3. 工人被黑影抓走进入 lost 时，矿山 occupied 被释放。
4. 工人 lost 后不能出现“矿山已有工人”但实际无人采矿的状态。
5. 释放逻辑应复用 v0.5 的任务释放逻辑，或扩展为统一 releaseWorkerOccupation 方法。
```

---

# 本轮不要做

禁止本轮实现：

```text
1. 不做围墙。
2. 不做弓箭手。
3. 不做流民。
4. 不做工人屋 / 弓箭手营转职。
5. 不做狐嫁女。
6. 不做颠倒森林。
7. 不做小地图。
8. 不做营地损坏。
9. 不做黑影攻击围墙。
10. 不做黑影攻击弓箭手。
11. 不做返程流民目标。
12. 不做 CSV / JSON 配置读取。
13. 不接入正式图片、音乐、字体。
14. 不做存档系统。
15. 不把 GPT_DEMO/index.html 整文件复制到 WEB_DEMO。
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
## v0.6-refactor 代码迁移记录

### 迁移系统

临时辉石拾回 / 矿山 / 采矿派工 / 持续产出 / 矿山占用释放

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
1. 自然辉石仍然靠近自动拾取。
2. 玩家主动放置的临时辉石不会被靠近自动拾回。
3. 玩家可以通过 Space 拾回临时辉石。
4. 拾回临时辉石后，玩家辉石库存增加，地面辉石移除。
5. 黑影仍然可以优先吃临时辉石。
6. 地图中至少存在 1 个矿山。
7. 玩家可以与矿山互动派工采矿。
8. 采矿派工默认 0 辉石成本。
9. 工人能到达矿山并进入采矿状态。
10. 矿山约 30 秒产出 1 个辉石。
11. 矿山 occupied / reserved 防止重复派工。
12. 工人逃跑时，矿山占用被释放。
13. 工人被黑影抓走 lost 时，矿山占用被释放。
14. 不会出现“矿山已有工人”但实际无人采矿的卡死状态。
15. HUD 或提示能反馈矿山产出或采矿状态。
16. 没有迁移围墙、弓箭手、流民、职业系统或特殊事件。
17. GPT_DEMO 未被修改。
18. 审计文档记录 GPT_DEMO 到 WEB_DEMO 的迁移关系。
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
9. 哪些内容留到 v0.7-refactor。
```

---

# 给 Codex 的提醒

本轮最容易出问题的是“临时辉石”和“矿山占用释放”。

尤其关注：

```text
临时辉石不能自动拾回，但必须能主动拾回；
黑影仍要能吃临时辉石；
矿山有工人时不能重复派工；
矿山工人逃跑或 lost 后必须释放占用；
不能再次出现矿山无人但提示已有工人的卡死问题。
```
