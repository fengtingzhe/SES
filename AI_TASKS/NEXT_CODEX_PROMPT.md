# NEXT_CODEX_PROMPT：下一轮 Codex 执行提示词

## 定位

本文件用于保存下一轮交给 Codex 执行的完整提示词。

它不是当前任务的事实来源。

当前任务的唯一事实来源是：

```text
AI_TASKS/CURRENT_TASK.md
```

本文件应从 `CURRENT_TASK.md` 派生，用于把任务卡转换成 Codex 更容易执行的提示词。

如果本文件与 `CURRENT_TASK.md` 冲突，必须以 `CURRENT_TASK.md` 为准，并更新本文件。

---

## 任务名称

待填写。

---

## 给 Codex 的提示词

你正在继续开发一个基于本模板创建的 AI 游戏 Demo 项目。

请先读取核心上下文：

```text
1. PROJECT_STATUS.md
2. AI_RULES/00_FAST_CONTEXT.md
3. AI_TASKS/CURRENT_TASK.md
4. AI_TASKS/NEXT_CODEX_PROMPT.md
5. AI_RULES/07_AI_ROLE_SPLIT.md
6. AI_RULES/06_VALIDATION_CHECKLIST.md
```

读取后，必须先确认：

```text
我已读取快速上下文和当前任务卡，当前任务事实来源为 AI_TASKS/CURRENT_TASK.md。
```

然后根据 `AI_TASKS/CURRENT_TASK.md` 中的任务类型，追加读取对应规则文件。

---

## 按任务类型追加读取

### 如果本轮是 Web Demo 开发

追加读取：

```text
AI_RULES/03_TECHNICAL_RULES.md
AI_RULES/09_CONFIG_FIRST_RULE.md
DESIGN_HUB/12_DEMO_SCOPE.md
DESIGN_HUB/14_DEFAULT_DEV_FEATURES.md
DESIGN_HUB/15_WEB_DEMO_WORKSPACE.md
DESIGN_HUB/18_VERSION_GATE.md
DESIGN_HUB/20_DEMO_PRESENTATION_STANDARD.md
```

### 如果本轮是 Unity 源码学习 / 改造

追加读取：

```text
AI_RULES/03_TECHNICAL_RULES.md
DESIGN_HUB/16_UNITY_SOURCE_WORKFLOW.md
UNITY_SOURCE/SOURCE_CANDIDATES.md
```

### 如果本轮来自试玩反馈

追加读取：

```text
DESIGN_HUB/11_PLAYTEST_FEEDBACK.md
AI_TASKS/FEEDBACK_TO_TASK.md
```

### 如果本轮涉及辅助工具

追加读取：

```text
DESIGN_HUB/17_AUXILIARY_TOOLS_PLAN.md
AI_RULES/09_CONFIG_FIRST_RULE.md
```

---

## 开发前置条件

在正式开发前，必须确认：

```text
1. AI_TASKS/CURRENT_TASK.md 已填写当前任务；
2. PROJECT_STATUS.md 能说明当前阶段和当前目标；
3. AI_RULES/00_FAST_CONTEXT.md 没有与 CURRENT_TASK 冲突；
4. 本轮允许修改和禁止修改范围清楚；
5. 本轮验收标准清楚；
6. 本轮没有违反 DESIGN_HUB/19_NOT_NOW.md；
7. 本轮版本推进符合 DESIGN_HUB/18_VERSION_GATE.md。
```

如果上述条件不满足，Codex 不应直接开发，应把问题记录到：

```text
DESIGN_HUB/10_OPEN_QUESTIONS.md
```

或在任务完成报告中明确说明阻塞点。

---

## 任务归属判断

正式开发前，Codex 必须先输出任务归属判断：

```text
任务归属判断：
- 本轮由 Codex 自己开发 / 拆分给 DeepSeek / Codex + DeepSeek 协作
- 判断理由：
- Codex 负责：
- DeepSeek 负责：
- Codex 审核方式：
```

判断原则：

```text
核心架构、跨文件整合、状态管理、复杂 Bug 修复、最终合并，优先由 Codex 执行；
普通 UI 组件、重复性代码、配置表、文案、简单工具函数，可以拆给 DeepSeek；
DeepSeek 不负责最终合并，不负责核心架构，不负责高风险重构；
DeepSeek 产物必须由 Codex 审核后才能合并。
```

如果本轮需要 DeepSeek 执行子任务，必须在：

```text
AI_TASKS/DEEPSEEK_TASKS.md
```

中记录任务卡。

---

## 本轮任务摘要

> 本区应由 ChatGPT 根据 `AI_TASKS/CURRENT_TASK.md` 生成。不要在这里写入与任务卡冲突的内容。

### 当前阶段

```text
待填写。
```

### 当前版本

```text
待填写。
```

### 本轮目标

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

### 验收标准

- [ ] 待填写
- [ ] 待填写
- [ ] 待填写

---

## 通用禁止事项

默认禁止：

- 不要擅自修改 `DESIGN_HUB/09_DECISIONS.md`；
- 不要擅自修改 `AI_RULES/`；
- 不要违反 `DESIGN_HUB/19_NOT_NOW.md`；
- 不要新增与本轮目标无关的大型系统；
- 不要把 Demo 宣称为最终游戏；
- 不要引入复杂依赖，除非任务明确允许；
- 不要擅自改变核心玩法方向；
- 不要把策划可能频繁调整的内容硬编码；
- 不要把 Web Demo 源码写入 `Builds/`；
- 不要把 Web Demo 配置、工具、测试散落到根目录 `Data/`、`Tools/`、`Tests/`；
- 不要默认创建其他引擎工程；
- 不要在没有明确进入 v2.x 前从 0 创建 Unity 项目；
- 不要绕过 Unity 源码许可证或授权限制；
- 不要在项目尚未完成立项访谈时开始开发；
- 不要在未分析辅助工具需求时直接开发大量关卡、数值或内容；
- 不要让辅助工具开发规模超过当前 Demo 本体。

---

## Web Demo 默认要求

如果本轮涉及 Web Demo，默认要求：

```text
源码位于 WEB_DEMO/；
入口优先为 WEB_DEMO/index.html；
主逻辑优先为 WEB_DEMO/game.js；
样式优先为 WEB_DEMO/styles.css；
配置优先位于 WEB_DEMO/Data/config/；
工具优先位于 WEB_DEMO/Tools/；
测试优先位于 WEB_DEMO/Tests/；
启动入口优先为 WEB_DEMO/run_web_demo.bat。
```

---

## 配置优先要求

如果本轮涉及数值、关卡、目标、奖励、难度、UI 文案或策划可能频繁调整的内容，默认应配置化。

Web Demo 配置优先路径：

```text
WEB_DEMO/Data/config/
```

除 v0.1 最小验证外，不应把关键数值硬编码在逻辑代码中。

---

## Unity 源码学习 / 改造默认要求

如果本轮涉及 Unity 源码学习 / 改造，默认要求：

```text
先做候选源码评分；
Unity 源码项目放在 UNITY_SOURCE/；
先做源码体检，再做改造；
检查 Unity 版本、许可证、依赖插件、缺失资源、后端依赖；
首次运行报错必须记录；
兼容性修复记录到 UNITY_SOURCE/COMPATIBILITY_LOG.md；
源码结构分析记录到 UNITY_SOURCE/STRUCTURE_NOTES.md 或 Docs/UnitySourceAnalysis/；
源码未跑通前不做大规模改造；
不绕过许可证或授权限制。
```

---

## 完成后必须输出

任务完成后，Codex 必须输出：

```text
1. 修改文件列表；
2. 实现内容；
3. 验证方式；
4. 验证结果；
5. 是否有未解决问题；
6. 是否有需要策划决策的问题；
7. 是否已更新 PROJECT_STATUS.md；
8. 是否已更新 AI_RULES/00_FAST_CONTEXT.md；
9. 是否已更新 AI_TASKS/CHANGELOG.md；
10. 是否已更新 AI_TASKS/DEV_LOG.md；
11. 是否已更新 AI_TASKS/CURRENT_TASK.md；
12. 是否涉及 DeepSeek 任务拆分；
13. 如涉及 DeepSeek，是否已更新 AI_TASKS/DEEPSEEK_TASKS.md；
14. 如审核 DeepSeek 产物，是否已更新 AI_TASKS/REVIEW_LOG.md。
```

---

## 完成后建议更新

根据本轮任务类型，必要时更新：

```text
PROJECT_STATUS.md
AI_RULES/00_FAST_CONTEXT.md
AI_TASKS/CHANGELOG.md
AI_TASKS/DEV_LOG.md
AI_TASKS/CURRENT_TASK.md
AI_TASKS/NEXT_CODEX_PROMPT.md
AI_TASKS/DEEPSEEK_TASKS.md
AI_TASKS/REVIEW_LOG.md
DESIGN_HUB/10_OPEN_QUESTIONS.md
DESIGN_HUB/11_PLAYTEST_FEEDBACK.md
DESIGN_HUB/17_AUXILIARY_TOOLS_PLAN.md
UNITY_SOURCE/SOURCE_CANDIDATES.md
UNITY_SOURCE/COMPATIBILITY_LOG.md
UNITY_SOURCE/STRUCTURE_NOTES.md
```

必要时，将下一轮建议写入本文件。