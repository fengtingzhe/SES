# 00_FAST_CONTEXT：AI 快速上下文

## 定位

本文件是每次新会话、上下文重置或开始新任务时的快速入口。

它用于让 ChatGPT、Codex、DeepSeek 在最短时间内理解：

```text
当前项目处于什么阶段；
本轮任务要做什么；
哪些文件可以改；
哪些文件不能改；
需要读取哪些详细规则；
完成后如何验收。
```

本文件不替代：

```text
PROJECT_STATUS.md
AI_TASKS/CURRENT_TASK.md
DESIGN_HUB/09_DECISIONS.md
DESIGN_HUB/10_OPEN_QUESTIONS.md
DESIGN_HUB/18_VERSION_GATE.md
DESIGN_HUB/19_NOT_NOW.md
GPT_DEMO/README.md
```

`PROJECT_STATUS.md` 负责项目状态快照。

`AI_TASKS/CURRENT_TASK.md` 是当前任务的唯一事实来源。

`AI_TASKS/NEXT_CODEX_PROMPT.md` 是从当前任务派生出来的 Codex 执行提示词，不应与 `CURRENT_TASK.md` 冲突。

`GPT_DEMO/` 是 ChatGPT 与用户讨论方案阶段的快速可试玩草图区，不等同于正式 `WEB_DEMO/` 工程。

---

## 1. 每次任务核心必读

每次开始工作前，默认先读以下文件：

```text
1. PROJECT_STATUS.md
2. AI_RULES/00_FAST_CONTEXT.md
3. AI_TASKS/CURRENT_TASK.md
```

如果是方案讨论阶段，且用户希望快速直观看到玩法或界面方向，可以追加读取：

```text
4. GPT_DEMO/README.md
```

如果执行者是 Codex，还必须读取：

```text
4. AI_TASKS/NEXT_CODEX_PROMPT.md
5. AI_RULES/07_AI_ROLE_SPLIT.md
6. AI_RULES/06_VALIDATION_CHECKLIST.md
```

---

## 2. 按任务类型追加读取

不要每次无差别读取全部文档。根据任务类型追加读取对应文件。

### 新项目立项

```text
DESIGN_HUB/00_PROJECT_CANVAS.md
DESIGN_HUB/17_AUXILIARY_TOOLS_PLAN.md
DESIGN_HUB/18_VERSION_GATE.md
DESIGN_HUB/19_NOT_NOW.md
GPT_DEMO/README.md
```

### GPT_DEMO 快速草图

```text
GPT_DEMO/README.md
DESIGN_HUB/00_PROJECT_CANVAS.md，如已有
DESIGN_HUB/12_DEMO_SCOPE.md，如已有
```

规则：

```text
GPT_DEMO 可以先生成可运行 HTML 草图，帮助用户确认方向；
GPT_DEMO 可以少量硬编码；
GPT_DEMO 不等于正式工程；
方向确认后必须沉淀到 DESIGN_HUB/ 与 AI_TASKS/，再进入 WEB_DEMO/。
```

### Web Demo 开发

```text
AI_RULES/03_TECHNICAL_RULES.md
AI_RULES/09_CONFIG_FIRST_RULE.md
DESIGN_HUB/12_DEMO_SCOPE.md
DESIGN_HUB/14_DEFAULT_DEV_FEATURES.md
DESIGN_HUB/15_WEB_DEMO_WORKSPACE.md
DESIGN_HUB/18_VERSION_GATE.md
DESIGN_HUB/20_DEMO_PRESENTATION_STANDARD.md
```

### Unity 源码学习 / 改造

```text
AI_RULES/03_TECHNICAL_RULES.md
DESIGN_HUB/16_UNITY_SOURCE_WORKFLOW.md
UNITY_SOURCE/SOURCE_CANDIDATES.md
```

### 试玩反馈转任务

```text
DESIGN_HUB/11_PLAYTEST_FEEDBACK.md
AI_TASKS/FEEDBACK_TO_TASK.md
```

### 辅助工具规划 / 开发

```text
DESIGN_HUB/17_AUXILIARY_TOOLS_PLAN.md
AI_RULES/09_CONFIG_FIRST_RULE.md
```

### 代码审核 / 合并前检查

```text
AI_RULES/06_VALIDATION_CHECKLIST.md
AI_TASKS/CHANGELOG.md
AI_TASKS/DEV_LOG.md
AI_TASKS/REVIEW_LOG.md
```

---

## 3. 当前任务快速卡片

> 新项目复制本模板后，应由 ChatGPT 或人类制作人根据 `PROJECT_STATUS.md` 与 `AI_TASKS/CURRENT_TASK.md` 更新本区。

### 当前阶段

```text
待填写，例如：gpt.1 / GPT_DEMO 快速玩法草图，或 v0.1 / Web Demo 最小核心操作
```

### 当前核心目标

```text
待填写。
```

### 本轮任务

```text
待填写。
```

### 本轮只做

- 待填写

### 本轮不做

- 待填写

### 允许修改

```text
待填写。
```

### 禁止修改

```text
待填写。
```

### 本轮必须读取的详细文件

```text
待填写。
```

### 验收方式

```text
待填写。
```

---

## 4. 冲突处理

如果文件之间出现冲突，优先级如下：

```text
1. 人类制作人明确确认的最新要求
2. DESIGN_HUB/09_DECISIONS.md
3. AI_TASKS/CURRENT_TASK.md
4. PROJECT_STATUS.md
5. AI_TASKS/NEXT_CODEX_PROMPT.md
6. 本文件
7. GPT_DEMO/README.md
8. 其他历史文档或日志
```

如果仍然无法判断，不要擅自决定，应写入：

```text
DESIGN_HUB/10_OPEN_QUESTIONS.md
```

---

## 5. 输出要求

开始任务后，AI 应先简短说明：

```text
我已读取快速上下文和当前任务卡，当前任务事实来源为 AI_TASKS/CURRENT_TASK.md。
```

如果是新项目立项阶段，AI 应继续说明：

```text
我将先进行立项访谈，暂不进入正式开发，并会同时分析本项目可能需要的辅助工具。
```

如果用户明确要求先看可玩效果，AI 可以继续说明：

```text
本轮可先进入 GPT_DEMO 快速草图阶段，生成可运行网页用于方向验证；确认后再沉淀正式文档和任务卡。
```

如果是 Codex，还必须先输出任务归属判断：

```text
任务归属判断：
- 本轮由 Codex 自己开发 / 拆分给 DeepSeek / Codex + DeepSeek 协作
- 判断理由：
- Codex 负责：
- DeepSeek 负责：
- Codex 审核方式：
```

---

## 6. 维护规则

- 每轮关键任务后，应检查本文件是否需要同步更新。
- 本文件只保留当前最重要的上下文，不记录详细历史。
- 详细历史写入 `AI_TASKS/DEV_LOG.md`、`AI_TASKS/CHANGELOG.md` 或对应设计文档。
- 不要把本文件写成长篇设计文档。
- 如果本文件与 `CURRENT_TASK.md` 不一致，以 `CURRENT_TASK.md` 为准，并更新本文件。
- 如果 GPT_DEMO 中验证出新的方向，确认后应同步到 DESIGN_HUB/ 与 AI_TASKS/，不要只留在 GPT_DEMO。