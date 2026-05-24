# 02_AI_EDIT_PERMISSION：AI 修改权限

本文件定义 AI 可以修改、谨慎修改、不得擅自修改的文件和目录。

---

## AI 可以修改

前提是任务明确允许：

```text
WEB_DEMO/
UNITY_SOURCE/
UNITY_PROJECT/
AI_TASKS/CHANGELOG.md
AI_TASKS/DEV_LOG.md
AI_TASKS/REVIEW_LOG.md
AI_TASKS/CURRENT_TASK.md
AI_TASKS/NEXT_CODEX_PROMPT.md
AI_TASKS/DEEPSEEK_TASKS.md
Docs/
Temp/
```

---

## NEXT_CODEX_PROMPT 修改限制

`AI_TASKS/NEXT_CODEX_PROMPT.md` 可以由 ChatGPT 或人类制作人生成和更新。

Codex 可以在任务完成后：

```text
补充执行结果；
记录下一轮建议；
将已完成提示词归档；
更新下一轮建议草案。
```

但 Codex 不得擅自改变人类已经确认的核心目标。

如 Codex 认为提示词存在冲突，应写入：

```text
DESIGN_HUB/10_OPEN_QUESTIONS.md
```

---

## DEEPSEEK_TASKS 修改限制

`AI_TASKS/DEEPSEEK_TASKS.md` 用于记录 Codex 拆分给 DeepSeek 的任务。

Codex 可以新增、更新 DeepSeek 任务卡，但不得用该文件绕过人类已确认的设计边界。

DeepSeek 产物必须由 Codex 审核后才能合并。

---

## AI 可以谨慎修改

修改前必须说明原因：

```text
Builds/
AI_RULES/03_TECHNICAL_RULES.md
AI_RULES/04_DATA_RULES.md
AI_RULES/05_ASSET_RULES.md
AI_RULES/06_VALIDATION_CHECKLIST.md
```

说明：

```text
根目录不再默认创建 Data/、Assets/、Tools/、Tests/、Scenes/、Scripts/ 等具体工程目录。
Web Demo 阶段应使用 WEB_DEMO/ 内部的 Data、Assets、Tools、Tests。
Unity 源码学习阶段应使用 UNITY_SOURCE/。
Unity 独立原型阶段应使用 UNITY_PROJECT/。
Builds/ 只作为构建输出目录，不作为源码目录。
```

---

## AI 不得擅自创建或使用的根目录

除非任务明确要求并获得人类制作人确认，AI 不得在根目录创建：

```text
Scenes/
Scripts/
Data/
Assets/
Tools/
Tests/
```

这些目录如果需要，应放在对应阶段工作区内部：

```text
WEB_DEMO/Data/
WEB_DEMO/Assets/
WEB_DEMO/Tools/
WEB_DEMO/Tests/
UNITY_SOURCE/...
UNITY_PROJECT/...
```

---

## AI 不得擅自修改

如需修改，必须先获得人类制作人确认：

```text
README.md
DESIGN_HUB/
AI_RULES/00_MASTER_PROMPT.md
AI_RULES/01_AI_READ_ORDER.md
AI_RULES/02_AI_EDIT_PERMISSION.md
AI_RULES/07_AI_ROLE_SPLIT.md
核心技术路线
已确认决策
```

---

## Web Demo 特别提醒

Web Demo 阶段默认版本号为 `v0.x`。

Web Demo 是独立原型工程，默认位于：

```text
WEB_DEMO/
```

Web Demo 内部推荐结构：

```text
WEB_DEMO/
├── README.md
├── run_web_demo.bat
├── package.json
├── index.html
├── styles.css
├── game.js
├── Data/
├── Assets/
├── Tools/
├── Tests/
├── Docs/
└── Temp/
```

Web Demo 阶段优先使用 HTML + CSS + 原生 JavaScript 快速验证核心玩法。

未经明确允许，不要引入 React、Phaser、Three.js 或复杂 npm 依赖。

未经明确允许，不要把 Web Demo 源码写入：

```text
Builds/web-demo/
根目录 Data/config/
根目录 Tools/
根目录 Tests/
```

`Builds/` 应优先作为构建输出目录，而不是 Web Demo 源码目录。

---

## Unity 源码学习特别提醒

Unity 源码学习 / 改造阶段默认版本号为 `v1.x`。

默认工作区：

```text
UNITY_SOURCE/
```

原则：

```text
先跑通，再解释，再小步改造。
```

未经明确允许，不要从 0 创建 Unity 项目。

未经明确允许，不要把 Unity 源码项目散落到根目录。

Unity 源码项目必须先检查：

```text
Unity 版本；
许可证；
依赖插件；
运行说明；
是否缺失资源；
是否需要联网或后端。
```

---

## Unity 独立原型特别提醒

Unity 独立原型阶段默认版本号为 `v2.x`。

默认工作区：

```text
UNITY_PROJECT/
```

进入该阶段前，必须确认：

```text
Web Demo 核心玩法已验证；
Unity 源码学习阶段已跑通至少一个参考项目；
策划确认需要创建自己的 Unity 原型；
任务中明确允许进入 v2.x。
```