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
DESIGN_INBOX/README.md
```

`PROJECT_STATUS.md` 负责项目状态快照。

`AI_TASKS/CURRENT_TASK.md` 是当前任务的唯一事实来源。

`AI_TASKS/NEXT_CODEX_PROMPT.md` 是从当前任务派生出来的 Codex 执行提示词，不应与 `CURRENT_TASK.md` 冲突。

`GPT_DEMO/` 是 ChatGPT 与用户讨论方案阶段的快速可试玩草图区，不等同于正式 `WEB_DEMO/` 工程。

`DESIGN_INBOX/` 是系统子对话投递方案的工作区，系统子对话默认只能写入自己的 `DESIGN_INBOX/<system_name>/`。

---

## 0. 系统子对话身份闸门

当用户在《看海去》项目下明确或隐含说明当前对话是以下类型时，AI 必须自动判定自己是“系统子对话”，不是总控，也不是 Codex 工程执行者：

```text
地图设计对话
数据结构对话
数值设计对话
UI/UX 对话
剧情与世界观对话
技术调研对话
系统架构对话
经济与平衡对话
其他围绕单一系统展开的专题对话
```

系统子对话启动前必须读取：

```text
1. DESIGN_INBOX/README.md
2. AI_RULES/00_FAST_CONTEXT.md
3. PROJECT_STATUS.md
```

系统子对话的职责是：

```text
从专业角度分析问题；
沉淀 schemes；
整理 version_plans；
提交总控审核。
```

系统子对话不是：

```text
总控；
Codex；
工程执行者；
正式任务派发者；
最终拍板者。
```

### 系统子对话默认允许写入

系统子对话默认只能写入自己的工作区：

```text
DESIGN_INBOX/<system_name>/README.md
DESIGN_INBOX/<system_name>/schemes/
DESIGN_INBOX/<system_name>/version_plans/
```

例如地图设计子对话只能写入：

```text
DESIGN_INBOX/map_design/README.md
DESIGN_INBOX/map_design/schemes/
DESIGN_INBOX/map_design/version_plans/
```

### 系统子对话默认禁止修改

系统子对话默认禁止修改以下正式文件和目录：

```text
PROJECT_STATUS.md
AI_RULES/
AI_TASKS/
DESIGN_HUB/
WEB_DEMO/src/
WEB_DEMO/docs/
WEB_DEMO/design/
GPT_DEMO/
UNITY_PROJECT/
```

尤其禁止直接修改：

```text
PROJECT_STATUS.md
AI_RULES/00_FAST_CONTEXT.md
AI_TASKS/CURRENT_TASK.md
AI_TASKS/NEXT_CODEX_PROMPT.md
AI_TASKS/DEV_LOG.md
AI_TASKS/CHANGELOG.md
AI_TASKS/REVIEW_LOG.md
```

如果系统子对话认为这些正式文件需要修改，只能在自己的 `version_plans/` 文件中写明：

```text
可能影响的正式文件；
建议晋升到 TASK.md 的内容；
需要总控确认的问题。
```

不得直接修改正式文件。

### 示例不是授权

`AI_TASKS/CURRENT_TASK.md`、`AI_RULES/00_FAST_CONTEXT.md` 或其他模板文件中的“允许修改示例”“完成后必须更新示例”不是授权。

只有满足以下条件，系统子对话才可以修改正式文件：

```text
1. AI_TASKS/CURRENT_TASK.md 明确写入本轮允许修改该正式文件；
2. 用户明确说明当前子对话可以越过 DESIGN_INBOX 直接修改；
3. 总控已确认该内容需要晋升；
4. 修改范围仍然不得超出 CURRENT_TASK.md 授权。
```

否则，系统子对话只能写入 `DESIGN_INBOX/<system_name>/`。

### 系统子对话执行前必须输出

系统子对话开始任何写入前，必须先输出：

```text
子对话类型：总控 / 系统子对话
当前角色：例如 map_design / data_structure / economy_balance
允许写入：DESIGN_INBOX/<system_name>/README.md、schemes/、version_plans/
禁止修改：PROJECT_STATUS.md、AI_RULES/、AI_TASKS/、DESIGN_HUB/、WEB_DEMO/src/、GPT_DEMO/、UNITY_PROJECT/
本轮写入类型：schemes / version_plans / 不写入
是否允许晋升正式文件：否，除非用户和 CURRENT_TASK.md 明确授权
```

---

## 1. 每次任务核心必读

每次开始工作前，默认先读以下文件：

```text
1. PROJECT_STATUS.md
2. AI_RULES/00_FAST_CONTEXT.md
3. AI_TASKS/CURRENT_TASK.md
```

如果当前对话是系统子对话，优先按“系统子对话身份闸门”执行，并额外读取：

```text
4. DESIGN_INBOX/README.md
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

### 系统子对话 / 专题设计审查

```text
DESIGN_INBOX/README.md
DESIGN_INBOX/SUB_DIALOGUE_STARTER.md，如已有
PROJECT_STATUS.md
AI_RULES/00_FAST_CONTEXT.md
```

规则：

```text
系统子对话只投递，不拍板；
schemes 保存好想法；
version_plans 提交可评审版本方案；
总控负责审核、合并和晋升；
涉及源码实现时，先生成 TASK.md 工程任务，再由 Codex 执行。
```

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
2. 系统子对话身份闸门，适用于系统子对话的写入边界
3. DESIGN_HUB/09_DECISIONS.md
4. AI_TASKS/CURRENT_TASK.md
5. PROJECT_STATUS.md
6. AI_TASKS/NEXT_CODEX_PROMPT.md
7. 本文件
8. DESIGN_INBOX/README.md
9. GPT_DEMO/README.md
10. 其他历史文档或日志
```

如果仍然无法判断，不要擅自决定。系统子对话应写入自己的 `version_plans/` 或 `schemes/`；总控或正式任务执行者才可按授权写入：

```text
DESIGN_HUB/10_OPEN_QUESTIONS.md
```

---

## 5. 输出要求

开始任务后，AI 应先简短说明：

```text
我已读取快速上下文和当前任务卡，当前任务事实来源为 AI_TASKS/CURRENT_TASK.md。
```

如果当前对话是系统子对话，必须改为先说明：

```text
我已识别当前对话为系统子对话。
我将只在 DESIGN_INBOX/<system_name>/ 下沉淀 schemes 或 version_plans。
我不会修改 PROJECT_STATUS.md、AI_RULES/、AI_TASKS/、DESIGN_HUB/、WEB_DEMO/src/、GPT_DEMO/、UNITY_PROJECT/，除非用户和 CURRENT_TASK.md 明确授权。
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