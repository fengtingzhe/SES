# CURRENT_TASK：当前任务卡

## 定位

本文件是当前任务的唯一事实来源。

ChatGPT、Codex、DeepSeek 在执行任务时，应优先以本文件为准。

`AI_TASKS/NEXT_CODEX_PROMPT.md` 应从本文件派生，不应与本文件冲突。

如果两者冲突，优先以本文件为准，并更新 `NEXT_CODEX_PROMPT.md`。

---

## 任务名称

待填写。

---

## 当前项目阶段

- [ ] v0.x / Web Demo 原型
- [ ] v1.x / Unity 源码学习 / 改造
- [ ] v2.x / Unity 独立原型
- [ ] v3.x / 可展示垂直切片
- [ ] v4.x / 商业化验证

当前阶段说明：待填写。

---

## 当前版本

```text
待填写，例如 v0.1
```

---

## 背景

待填写。

说明为什么要执行本轮任务，本轮任务要解决什么问题。

---

## 本任务服务的目标

- [ ] 核心玩法验证
- [ ] UI 流程验证
- [ ] 视觉表现验证
- [ ] 数值验证
- [ ] Web Demo 工程基础
- [ ] Unity 源码学习
- [ ] Unity 兼容性修复
- [ ] Unity 小步改造
- [ ] 辅助工具规划
- [ ] 辅助工具开发
- [ ] 试玩反馈转任务
- [ ] 文档整理
- [ ] 代码审核

---

## 本轮只做

- 待填写

---

## 本轮不做

- 待填写

---

## 允许修改的文件 / 目录

```text
待填写。
```

示例：

```text
WEB_DEMO/
AI_TASKS/CHANGELOG.md
AI_TASKS/DEV_LOG.md
PROJECT_STATUS.md
```

---

## 禁止修改的文件 / 目录

```text
待填写。
```

示例：

```text
DESIGN_HUB/09_DECISIONS.md
AI_RULES/
UNITY_PROJECT/
```

---

## 本轮必须读取的详细文件

除以下核心必读文件外：

```text
PROJECT_STATUS.md
AI_RULES/00_FAST_CONTEXT.md
AI_TASKS/CURRENT_TASK.md
```

本轮还必须读取：

```text
待填写。
```

---

## 设计约束

- 待填写

---

## 技术约束

- 待填写

---

## 配置化要求

- [ ] 本轮不涉及配置化
- [ ] 本轮涉及配置化，必须优先使用当前阶段对应工作区内的配置路径
- [ ] Web Demo 配置优先放入 `WEB_DEMO/Data/config/`
- [ ] Unity 源码学习配置 / 记录优先放入 `UNITY_SOURCE/`
- [ ] Unity 独立原型配置 / 记录优先放入 `UNITY_PROJECT/`

说明：待填写。

---

## 任务归属判断

Codex 阅读本任务后，必须先判断执行归属。

- [ ] Codex 自己开发
- [ ] 拆分给 DeepSeek
- [ ] Codex + DeepSeek 协作

### 判断理由

待填写。

### Codex 负责

- 待填写

### DeepSeek 负责

- 待填写

### Codex 审核方式

- 待填写

如本轮需要 DeepSeek 执行子任务，必须在以下文件记录任务卡：

```text
AI_TASKS/DEEPSEEK_TASKS.md
```

---

## 验收标准

- [ ] 待填写
- [ ] 待填写
- [ ] 待填写

---

## 验证方式

```text
待填写。
```

---

## 完成后必须更新

- [ ] `PROJECT_STATUS.md`
- [ ] `AI_RULES/00_FAST_CONTEXT.md`
- [ ] `AI_TASKS/CHANGELOG.md`
- [ ] `AI_TASKS/DEV_LOG.md`
- [ ] `AI_TASKS/CURRENT_TASK.md`
- [ ] `AI_TASKS/NEXT_CODEX_PROMPT.md`，如需要生成下一轮 Codex 任务
- [ ] `AI_TASKS/DEEPSEEK_TASKS.md`，如涉及任务拆分
- [ ] `AI_TASKS/REVIEW_LOG.md`，如涉及代码审核或 DeepSeek 产物审核
- [ ] `DESIGN_HUB/10_OPEN_QUESTIONS.md`，如有待决策问题
- [ ] `DESIGN_HUB/11_PLAYTEST_FEEDBACK.md`，如本轮来自试玩反馈
- [ ] `DESIGN_HUB/17_AUXILIARY_TOOLS_PLAN.md`，如涉及辅助工具新增、调整或延期
- [ ] `UNITY_SOURCE/COMPATIBILITY_LOG.md`，如涉及 Unity 兼容性修复
- [ ] `UNITY_SOURCE/STRUCTURE_NOTES.md`，如涉及 Unity 源码结构学习

---

## 与 NEXT_CODEX_PROMPT 的关系

`AI_TASKS/NEXT_CODEX_PROMPT.md` 只负责把本任务卡转换成 Codex 可执行提示词。

它可以包含更适合 Codex 执行的语气、步骤和检查清单，但不得改变：

```text
任务目标；
本轮只做；
本轮不做；
允许修改；
禁止修改；
验收标准；
设计约束；
技术约束。
```

如果 Codex 发现 `NEXT_CODEX_PROMPT.md` 与本文件冲突，应停止执行并记录问题。