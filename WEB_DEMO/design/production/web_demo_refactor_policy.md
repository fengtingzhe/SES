# WEB_DEMO 重构策略

## 1. 阶段定位

WEB_DEMO 不是重新开发一套相似 Demo。
WEB_DEMO 是在理解 GPT_DEMO 的基础上，对 GPT_DEMO 进行工程化重构。

## 2. GPT_DEMO 与 WEB_DEMO 的关系

GPT_DEMO：
- 用于快速验证玩法
- 用于沉淀交互规则
- 用于验证系统之间的关系
- 是 WEB_DEMO 的规则基线

WEB_DEMO：
- 用于工程化重构
- 用于模块化拆分
- 用于提升稳定性
- 用于支持未来正式项目扩展
- 不允许随意偏离 GPT_DEMO 规则

## 3. 偏离规则的分类

如果 WEB_DEMO 与 GPT_DEMO 不一致，必须标记为以下三类之一：

1. **无意偏差**：需要修复
2. **有意重构**：实现方式改变，但体验规则保持一致
3. **有意重设计**：玩法规则改变，必须由主控对话 / 策划确认

## 4. Codex 开发前必须读取

Codex 在重新开发 WEB_DEMO 之前必须先读取：

- `GPT_DEMO/**`
- `WEB_DEMO/README.md`
- `WEB_DEMO/design/production/web_demo_refactor_policy.md`
- `WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md`
- `WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md`
- `WEB_DEMO/docs/codex_tasks.md`

## 5. 当前禁止事项

当前禁止：

- 不新增玩法代码
- 不重新创建 Vite 工程
- 不重新写 index.html
- 不重新写 src/
- 不迁移黑影、围墙、弓箭手、矿山、流民等功能
- 不做 CSV / JSON 配置化
- 不接入资源
- 不进入 v0.7 或旧版本路线
