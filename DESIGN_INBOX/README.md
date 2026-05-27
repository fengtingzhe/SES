# DESIGN_INBOX：看海去子对话设计工作区

`DESIGN_INBOX/` 是《看海去》项目的系统子对话设计工作区。

本文件根据 `fengtingzhe/game-template` 当前规则整理，用于 SES 仓库内部执行，不反向修改 `game-template`。

---

## 1. 使用目的

同一项目下可以创建多个系统子对话，例如：

```text
地图设计
数据结构
数值设计
UI/UX
剧情与世界观
技术调研
系统架构
经济与平衡
```

这些子对话可以从专业角度讨论《看海去》的方案，但默认不能直接修改正式项目文件。

子对话的职责是：

```text
沉淀方案
整理版本计划
提交总控审核
```

不是：

```text
直接拍板
直接改正式代码
直接改 TASK / PROJECT / RULES
```

---

## 2. 推荐目录结构

```text
DESIGN_INBOX/
├── README.md
├── map_design/
│   ├── README.md
│   ├── schemes/
│   └── version_plans/
├── data_structure/
│   ├── README.md
│   ├── schemes/
│   └── version_plans/
├── system_architecture/
│   ├── README.md
│   ├── schemes/
│   └── version_plans/
├── economy_balance/
│   ├── README.md
│   ├── schemes/
│   └── version_plans/
├── ui_ux/
│   ├── README.md
│   ├── schemes/
│   └── version_plans/
└── narrative_world/
    ├── README.md
    ├── schemes/
    └── version_plans/
```

---

## 3. 子对话工作区规则

每个系统子对话只写入自己的工作区：

```text
DESIGN_INBOX/<system_name>/
```

示例：

```text
DESIGN_INBOX/map_design/
DESIGN_INBOX/data_structure/
DESIGN_INBOX/system_architecture/
DESIGN_INBOX/economy_balance/
DESIGN_INBOX/ui_ux/
DESIGN_INBOX/narrative_world/
```

子对话默认不能直接修改正式文件。

正式文件包括但不限于：

```text
PROJECT.md
TASK.md
RULES.md
WEB_DEMO/design/rule_baseline.md
WEB_DEMO/design/migration_audit.md
WEB_DEMO/src/
UNITY_PROJECT/
```

除非 `TASK.md` 明确授权，否则子对话只能投递，不拍板。

---

## 4. schemes/：方案记录区

`schemes/` 用于保存子对话中出现的好方案、备选方案、设计思路。

适合写入：

```text
有价值但尚未形成版本方案的设计点
备选方案
需要以后比较的设计思路
暂时不确定但值得保留的方案
```

不适合写入：

```text
普通问答
完整聊天记录
重复解释
临时推测
明显无效的想法
```

`schemes/` 中的内容只是方案记录，不自动进入总控审核。

命名建议：

```text
DESIGN_INBOX/<system_name>/schemes/YYYY-MM-DD_scheme_XXX_topic.md
```

示例：

```text
DESIGN_INBOX/map_design/schemes/2026-05-27_scheme_001_region_weather_event.md
```

---

## 5. version_plans/：版本方案区

`version_plans/` 用于保存已经整理成版本方案包的内容。

版本方案包应满足：

```text
可命名
可评审
有明确目标
有明确范围
有明确不做内容
有关键取舍
有待总控确认问题
能判断是否进入 TASK.md 或正式设计文档
```

只有 `version_plans/` 中的内容，才默认提交给总控审核。

命名建议：

```text
DESIGN_INBOX/<system_name>/version_plans/YYYY-MM-DD_vXX_topic.md
```

示例：

```text
DESIGN_INBOX/system_architecture/version_plans/2026-05-27_v01_web_demo_architecture_review.md
```

---

## 6. 总控审核与晋升规则

总控默认只审核：

```text
DESIGN_INBOX/<system_name>/version_plans/
```

总控不默认审核 `schemes/` 中的全部内容，除非：

```text
1. 某个 version_plan 引用了对应 scheme
2. 用户明确要求总控查看
3. 总控判断该 scheme 对项目方向有重大影响
```

总控审核时应输出：

```text
审核对象
方案摘要
采纳结论：采纳 / 部分采纳 / 暂缓 / 废弃 / 需要继续讨论
采纳理由
不采纳或暂缓理由
需要用户确认的问题
是否建议晋升正式文件
是否建议写入 TASK.md
```

晋升必须经过用户确认。

可以晋升的目标通常是：

```text
PROJECT.md
TASK.md
WEB_DEMO/design/rule_baseline.md
WEB_DEMO/design/migration_audit.md
WEB_DEMO/public/assets/data/csv/
WEB_DEMO/public/assets/data/json/
WEB_DEMO/docs/
```

如果方案涉及以下工程实现目录，不得由子对话直接修改：

```text
WEB_DEMO/src/
UNITY_PROJECT/
```

必须先晋升为 `TASK.md` 中的新工程任务，再由 Codex 按任务归属闸门执行。

---

## 7. 推荐工作流

```text
子对话讨论
↓
子对话把好想法写入 schemes/
↓
子对话把成熟方案整理成 version_plans/
↓
用户通知总控审核 version_plans/
↓
总控输出采纳 / 部分采纳 / 暂缓 / 废弃 / 继续讨论
↓
用户确认
↓
总控晋升到 PROJECT.md / TASK.md / 正式设计文档
↓
如涉及工程实现，Codex 按 TASK.md 执行
```

---

## 8. 模板 A：子对话工作区 README

```markdown
# 子对话工作区说明

## 子对话名称

待填写，例如：地图设计 / 数据结构 / 数值设计 / UI/UX / 系统架构 / 经济与平衡。

## 子对话职责

待填写。

## 可写入内容

### schemes/

用于保存讨论中出现的好方案、备选方案、设计思路。

### version_plans/

用于保存已经整理成版本方案包的内容。

只有 `version_plans/` 中的文件，才默认提交给总控审核。

## 禁止事项

```text
不得直接修改 PROJECT.md
不得直接修改 TASK.md
不得直接修改 RULES.md
不得直接修改 WEB_DEMO/design/rule_baseline.md
不得直接修改 WEB_DEMO/src/
不得直接修改 UNITY_PROJECT/
不得把普通聊天记录原样写入本目录
```
```

---

## 9. 模板 B：schemes 方案记录

```markdown
# 子对话方案记录

## 来源对话角色

待填写。

## 方案编号

待填写，例如：map-scheme-001。

## 方案主题

待填写。

## 适用系统

待填写。

## 方案内容

待填写。

## 为什么值得保留

待填写。

## 适用场景

待填写。

## 可能问题

待填写。

## 与已有方案的关系

```text
新方案 / 替代旧方案 / 补充旧方案 / 待比较
```

## 是否建议进入版本规划

```text
是 / 否 / 待观察
```

## 当前状态

```text
方案记录，未进入总控审核
```
```

---

## 10. 模板 C：version_plans 版本方案

```markdown
# 系统子对话版本方案

## 来源对话角色

待填写。

## 方案版本

待填写，例如：map-v01 / data-v01 / ui-v01 / arch-v01。

## 方案主题

待填写。

## 适用系统

待填写。

## 本方案目标

待填写。

## 本方案范围

- 待填写

## 不包含内容

- 待填写

## 设计结论

待填写。

## 关键取舍

- 待填写

## 待总控确认

- 待填写

## 可能影响的正式文件或后续任务

```text
PROJECT.md
TASK.md
WEB_DEMO/design/rule_baseline.md
WEB_DEMO/design/migration_audit.md
WEB_DEMO/public/assets/data/csv/
WEB_DEMO/public/assets/data/json/
WEB_DEMO/docs/
需要新建的工程任务
```

## 风险与冲突

待填写。

## 建议下一步

待填写。

## 当前状态

```text
待总控审核
```
```

---

## 11. 一句话原则

```text
每个子对话有自己的工作区。
schemes 保存好想法。
version_plans 提交可评审版本方案。
子对话只投递，不拍板。
总控负责分配、合并和晋升。
涉及源码实现时，先生成 TASK.md 工程任务，再由 Codex 执行。
```
