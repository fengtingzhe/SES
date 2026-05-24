# DESIGN_HUB 文档索引

`DESIGN_HUB/` 是策划长期维护的核心目录。

它用于保存项目立项档案、项目方向、核心玩法、目标体验、关键决策、待决策问题、试玩反馈、辅助工具规划和阶段推进规则。

AI 可以读取本目录，但不得擅自修改本目录中的核心决策文件。

---

## 00_PROJECT_CANVAS.md

项目立项档案、想法池和 ChatGPT 立项访谈记录。

每个新项目启动时，ChatGPT 应优先读取本文件，并根据文件中的“立项访谈问题清单”向用户提问。

---

## 01_PROJECT_BRIEF.md

项目定位，说明我们在做什么游戏。

---

## 02_CORE_GAMEPLAY.md

核心玩法，说明游戏玩起来是什么。

---

## 03_PLAYER_EXPERIENCE.md

目标体验，说明玩家应该感受到什么。

---

## 04_SYSTEM_OVERVIEW.md

系统总览，说明项目有哪些主要系统。

---

## 05_ECONOMY_AND_BALANCE.md

数值、经济、成长方向。

---

## 06_CONTENT_PLAN.md

内容规划，例如关卡、角色、敌人、建筑、道具、技能等。

---

## 07_ART_AND_AUDIO_DIRECTION.md

美术和音频方向。

---

## 08_UX_FLOW.md

UI / UX 流程。

---

## 09_DECISIONS.md

已确认决策。AI 不得擅自推翻这里记录的内容。

---

## 10_OPEN_QUESTIONS.md

待决策问题。AI 不确定时必须写入这里，等待人类制作人确认。

---

## 11_PLAYTEST_FEEDBACK.md

试玩反馈。由人类制作人维护，AI 可以协助整理。

---

## 12_DEMO_SCOPE.md

Demo 目标与范围。用于说明当前 Demo 类型、版本号、验证目标、明确不做内容，以及进入下一阶段的条件。

---

## 13_DEBUG_CONSOLE.md

通用开发者工具面板规则。用于说明所有 Demo 默认应该提供的通用 Console / Dev 功能。

---

## 14_DEFAULT_DEV_FEATURES.md

默认开发辅助功能。用于记录所有项目默认应该具备的开发辅助能力，例如 Console / Dev 面板、Web Demo 一键启动 bat、Vite 本地服务、Smoke Test、版本号显示等。

---

## 15_WEB_DEMO_WORKSPACE.md

Web Demo 独立工作区规则。用于定义 `WEB_DEMO/` 目录结构、路径规范、旧路径迁移规则，以及 Web Demo 与后续 Unity 工作区分离的边界。

---

## 16_UNITY_SOURCE_WORKFLOW.md

Unity 源码学习与改造流程。用于定义 Unity 源码筛选、许可证检查、版本兼容、首次运行、AI 修复兼容性、源码结构学习和小步改造规则。

---

## 17_AUXILIARY_TOOLS_PLAN.md

辅助工具规划。用于记录项目可能需要的关卡编辑器、数值模拟器、配置工具、内容批量生成工具、自动测试工具、难度评估工具等。

---

## 18_VERSION_GATE.md

版本推进规则。用于定义 v0.x、v1.x、v2.x 等阶段的进入条件和验收条件，防止 AI 一次性做太多或项目长期停留在模糊状态。

---

## 19_NOT_NOW.md

当前阶段暂不做清单。用于记录当前阶段明确不做的内容，防止 AI 过度发散、过早开发大型系统。

---

## 20_DEMO_PRESENTATION_STANDARD.md

Demo 展示标准。用于确保 Demo 不只是能跑，还能让美术、程序、制作人或外部评审快速看懂。