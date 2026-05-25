# 《看海去》WEB_DEMO

## 当前状态

WEB_DEMO 当前阶段已重置。

此前 WEB_DEMO v0.2～v0.6 的 Codex 开发路线已经废弃。

## 旧路线废弃原因

旧路线是在重新开发一套类似 GPT_DEMO 的功能，而不是理解并重构 GPT_DEMO。

该路线会导致 GPT_DEMO 阶段已经验证过的玩法规则、交互逻辑、系统关系和体验节奏无法被充分继承，削弱 GPT_DEMO 作为验证原型的价值。

## 新阶段目标

**理解并重构 GPT_DEMO。**

- **GPT_DEMO** = 玩法验证原型与规则基线
- **WEB_DEMO** = 工程化重构版本

除非明确标记为"有意重设计"，否则 WEB_DEMO 必须继承 GPT_DEMO 的玩法规则、交互逻辑、体验节奏和系统关系。

## 当前阶段优先事项

当前阶段不写任何玩法代码。优先做：

1. GPT_DEMO 规则基线提取
2. GPT_DEMO 系统拆解
3. WEB_DEMO 重构策略
4. GPT_DEMO 到 WEB_DEMO 的规则继承审计

## 后续开发

后续重新从 v0.1-refactor 开始开发。

在 GPT_DEMO 规则基线和重构策略确认后，再重新创建 WEB_DEMO 可运行工程。
