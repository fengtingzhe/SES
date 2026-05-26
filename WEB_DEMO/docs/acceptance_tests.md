# Acceptance Tests

## v0.1-refactor 规则基线提取验收

测试名称：WEB_DEMO v0.1-refactor GPT_DEMO 规则基线提取与阶段重定义

前置条件：
- 当前任务为 `WEB_DEMO v0.1-refactor GPT_DEMO 规则基线提取与 WEB_DEMO 阶段重定义`。
- 本轮只允许读取 GPT_DEMO 代码和文档，并只补全 WEB_DEMO 文档。

操作步骤：
1. 检查 `WEB_DEMO/package.json` 是否不存在。
2. 检查 `WEB_DEMO/index.html` 是否不存在。
3. 检查 `WEB_DEMO/src` 是否不存在。
4. 检查 `GPT_DEMO/**` 是否未被修改。
5. 检查 `WEB_DEMO/README.md` 是否明确当前目标为“理解并重构 GPT_DEMO”。
6. 检查 `WEB_DEMO/design/production/web_demo_refactor_policy.md` 是否存在。
7. 检查 `WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md` 是否已从模板补全为规则基线。
8. 检查 `WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md` 是否已从模板补全为初始审计。
9. 检查 `WEB_DEMO/docs/codex_tasks.md` 当前任务是否为 v0.1-refactor。
10. 检查本轮是否没有写入任何可运行游戏代码。

预期结果：
1. WEB_DEMO 仍处于重构准备阶段，不包含 `package.json`、`index.html` 或 `src`。
2. GPT_DEMO 没有被修改。
3. 规则基线文档列出 GPT_DEMO 已验证核心玩法规则。
4. 审计文档列出 WEB_DEMO 必须继承、可工程化重构和需要策划确认的规则。
5. 审计文档明确 v0.2-refactor 的最小迁移范围。
6. 新 refactor 路线不再沿用旧 v0.2 - v0.6 主线。

## v0.2-refactor 建议验收范围

说明：本节不是当前任务验收项，只用于约束下一阶段任务卡。

v0.2-refactor 建议只验收：
- 最小可运行工程骨架。
- GPT_DEMO 默认基础数据：地图尺寸、起点、终点、初始辉石、初始工人数量。
- 基础地图、玩家移动、朝向、视野。
- Space 面前优先互动。
- 辉石采集。
- 无目标 Space 放置 1 个临时辉石。
- 基础 HUD。

v0.2-refactor 不建议验收：
- 黑影完整 AI。
- 围墙、弓箭手、矿山、流民。
- 颠倒森林、狐嫁女。
- CSV / JSON 读取。
- 完整职业系统。
