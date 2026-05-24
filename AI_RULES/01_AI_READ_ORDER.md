# 01_AI_READ_ORDER：AI 阅读顺序

本文件定义 AI 在不同任务场景下的读取顺序。

核心目标：

```text
先读最小必要上下文；
再按任务类型追加读取；
不要每轮无差别读取全部文档。
```

这样可以减少上下文浪费、降低漏读风险，并让 Codex 更快进入可执行任务。

---

## 1. 每次任务核心必读

每次新会话、上下文重置或开始新任务前，默认先读取：

```text
1. PROJECT_STATUS.md
2. AI_RULES/00_FAST_CONTEXT.md
3. AI_TASKS/CURRENT_TASK.md
```

说明：

```text
PROJECT_STATUS.md 是当前项目状态快照；
AI_RULES/00_FAST_CONTEXT.md 是快速入口；
AI_TASKS/CURRENT_TASK.md 是当前任务的唯一事实来源。
```

---

## 2. Codex 执行任务时额外必读

如果执行者是 Codex，还必须读取：

```text
4. AI_TASKS/NEXT_CODEX_PROMPT.md
5. AI_RULES/07_AI_ROLE_SPLIT.md
6. AI_RULES/06_VALIDATION_CHECKLIST.md
```

Codex 必须先输出任务归属判断，再开始开发：

```text
任务归属判断：
- 本轮由 Codex 自己开发 / 拆分给 DeepSeek / Codex + DeepSeek 协作
- 判断理由：
- Codex 负责：
- DeepSeek 负责：
- Codex 审核方式：
```

如果本轮需要 DeepSeek 执行子任务，必须在：

```text
AI_TASKS/DEEPSEEK_TASKS.md
```

中记录任务卡。

---

## 3. 按任务类型追加读取

### 新项目立项

如果当前是新项目立项阶段，追加读取：

```text
DESIGN_HUB/00_PROJECT_CANVAS.md
DESIGN_HUB/17_AUXILIARY_TOOLS_PLAN.md
DESIGN_HUB/18_VERSION_GATE.md
DESIGN_HUB/19_NOT_NOW.md
```

然后根据 `00_PROJECT_CANVAS.md` 中的“ChatGPT 立项访谈问题清单”向用户提问。

在用户确认前，不要直接进入开发，也不要直接生成 Codex 开发任务。

推荐流程：

```text
先提问；
用户回答；
AI 总结立项档案草案；
AI 分析辅助工具需求；
用户确认；
写入 GitHub；
提炼正式设计文档；
提炼辅助工具规划；
更新 PROJECT_STATUS.md；
更新 AI_RULES/00_FAST_CONTEXT.md；
再生成 CURRENT_TASK 和 NEXT_CODEX_PROMPT。
```

---

### Web Demo 开发

如果当前任务涉及 Web Demo，追加读取：

```text
AI_RULES/03_TECHNICAL_RULES.md
AI_RULES/09_CONFIG_FIRST_RULE.md
DESIGN_HUB/12_DEMO_SCOPE.md
DESIGN_HUB/14_DEFAULT_DEV_FEATURES.md
DESIGN_HUB/15_WEB_DEMO_WORKSPACE.md
DESIGN_HUB/18_VERSION_GATE.md
DESIGN_HUB/20_DEMO_PRESENTATION_STANDARD.md
```

默认原则：

```text
Web Demo 源码位于 WEB_DEMO/；
配置优先放 WEB_DEMO/Data/config/；
不要把 Web Demo 源码写入 Builds/；
不要把配置、工具、测试散落到根目录 Data/、Tools/、Tests/。
```

---

### Unity 源码学习 / 改造

如果当前任务涉及 Unity 源码筛选、学习或改造，追加读取：

```text
AI_RULES/03_TECHNICAL_RULES.md
DESIGN_HUB/16_UNITY_SOURCE_WORKFLOW.md
UNITY_SOURCE/SOURCE_CANDIDATES.md
```

默认原则：

```text
先筛选源码；
先跑通；
先记录版本、许可证、依赖、报错；
再做小步改造；
不要在源码未跑通前大规模重构。
```

---

### 试玩反馈转任务

如果当前任务来自试玩反馈，追加读取：

```text
DESIGN_HUB/11_PLAYTEST_FEEDBACK.md
AI_TASKS/FEEDBACK_TO_TASK.md
```

并先把反馈分类、定级，再生成下一轮任务。

---

### 辅助工具规划 / 开发

如果当前任务涉及关卡编辑器、数值模拟器、配置工具、内容批量生成、自动测试或难度评估，追加读取：

```text
DESIGN_HUB/17_AUXILIARY_TOOLS_PLAN.md
AI_RULES/09_CONFIG_FIRST_RULE.md
```

默认原则：

```text
工具必须服务当前验证目标；
先做最小可用版本；
优先 Web 工具；
优先支持导入 / 导出 JSON；
不要让工具开发超过游戏 Demo 本体。
```

---

### 代码审核 / 合并前检查

如果当前任务是代码审核、合并前检查或 DeepSeek 产物审核，追加读取：

```text
AI_RULES/06_VALIDATION_CHECKLIST.md
AI_TASKS/CHANGELOG.md
AI_TASKS/DEV_LOG.md
AI_TASKS/REVIEW_LOG.md
```

---

## 4. 任务文件职责

### CURRENT_TASK.md

```text
AI_TASKS/CURRENT_TASK.md 是当前任务的唯一事实来源。
```

它负责记录：

```text
任务名称；
当前阶段；
背景；
本轮只做；
本轮不做；
允许修改；
禁止修改；
设计约束；
技术约束；
验收标准；
验证方式；
完成后必须更新的文件。
```

---

### NEXT_CODEX_PROMPT.md

```text
AI_TASKS/NEXT_CODEX_PROMPT.md 是从 CURRENT_TASK.md 派生出来的 Codex 执行提示词。
```

它负责把任务卡转换成 Codex 可直接执行的提示词。

它不应与 `CURRENT_TASK.md` 冲突。

如果两者冲突，优先以：

```text
AI_TASKS/CURRENT_TASK.md
```

为准，并更新 `NEXT_CODEX_PROMPT.md`。

---

## 5. 冲突处理优先级

如果文件之间出现冲突，优先级如下：

```text
1. 人类制作人明确确认的最新要求
2. DESIGN_HUB/09_DECISIONS.md
3. AI_TASKS/CURRENT_TASK.md
4. PROJECT_STATUS.md
5. AI_TASKS/NEXT_CODEX_PROMPT.md
6. AI_RULES/00_FAST_CONTEXT.md
7. 其他历史文档或日志
```

如果仍然无法判断，不要擅自决定，应写入：

```text
DESIGN_HUB/10_OPEN_QUESTIONS.md
```

---

## 6. 阅读后必须回复

阅读后，AI 应先回复：

```text
我已读取快速上下文和当前任务卡，当前任务事实来源为 AI_TASKS/CURRENT_TASK.md。
```

如果是新项目立项阶段，AI 应继续说明：

```text
我将先进行立项访谈，暂不进入开发，并会同时分析本项目可能需要的辅助工具。
```

如果是 Codex 执行开发任务，还必须先输出任务归属判断。

---

## 7. 禁止行为

- 不阅读 `PROJECT_STATUS.md` 就直接开发；
- 不阅读 `AI_RULES/00_FAST_CONTEXT.md` 就直接开发；
- 不阅读 `AI_TASKS/CURRENT_TASK.md` 就直接开发；
- 只看 `NEXT_CODEX_PROMPT.md`，不看 `CURRENT_TASK.md`；
- 每轮无差别读取所有文档，导致上下文浪费；
- 新项目未完成立项访谈就直接开发；
- 新项目未进行辅助工具需求分析就直接开发；
- 任务来自试玩反馈时，不分类不定级就直接开发；
- 遇到不明确问题时擅自决定；
- 发现 `CURRENT_TASK.md` 与 `NEXT_CODEX_PROMPT.md` 冲突时继续执行错误提示词。