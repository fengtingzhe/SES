# Changelog

## v0.2-refactor

状态：最小工程骨架与基础交互迁移完成。

内容：
- 重新创建最小可运行 WEB_DEMO 工程。
- 使用 Vite 建立 `package.json`、`index.html` 和 `src/**`。
- 从 `GPT_DEMO/index.html` 定向迁移基础地图参数：74 x 54、起点 `(5,27)`、终点 `(68,27)`、初始辉石 6、基础工人预留 2。
- 从 `GPT_DEMO/index.html` 定向迁移玩家移动、四方向朝向和朝向影响 Space 面前格判断。
- 从 `GPT_DEMO/index.html` 定向迁移视野揭示体验，使用 `discovered / visible` 标记实现最小版本。
- 从 `GPT_DEMO/index.html` 定向迁移 Space 面前优先互动、附近候选排序和无目标放置辉石。
- 迁移辉石资源、地图辉石采集和临时辉石 10 秒生命周期。
- 新增基础 HUD，显示版本、辉石、玩家位置、朝向、基础工人预留和当前提示。
- 本轮没有迁移工人、黑影、围墙、弓箭手、矿山、流民、奇遇、小地图或正式资源。

## v0.1-refactor

状态：WEB_DEMO 阶段重置与 GPT_DEMO 规则基线提取完成。

本轮变更：
- 废弃旧 WEB_DEMO v0.2 - v0.6 路线，不再把它作为后续开发主线。
- 明确 WEB_DEMO 新阶段目标为“理解并重构 GPT_DEMO”。
- 明确 GPT_DEMO 是玩法规则基线，WEB_DEMO 是工程化重构版本。
- 补全 `WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md`。
- 补全 `WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md`。
- 梳理 GPT_DEMO 已验证核心循环、必须继承规则、可工程化重构规则和待策划确认项。
- 建议新的 WEB_DEMO refactor 版本路线。
- 当前阶段仍不包含可运行游戏工程。

## 已废弃路线

以下旧版本路线已经废弃，不再作为主线继续开发：

- WEB_DEMO v0.2 核心循环迁移
- WEB_DEMO v0.3 GameConfig 基础配置集中化
- WEB_DEMO v0.4 夜晚黑影压力系统
- WEB_DEMO v0.5 围墙 / 弓箭手 / 防御系统
- WEB_DEMO v0.6 矿山 / 流民 / 人口补给系统

废弃原因：
- 旧路线更接近重新开发一套类似 GPT_DEMO 的功能。
- 旧路线没有先提取 GPT_DEMO 已验证的玩法规则、交互逻辑和体验节奏。
- 新路线必须先建立规则基线，再按基线工程化重构 WEB_DEMO。
