# Acceptance Tests

## v0.1-refactor 阶段重置验收

测试名称：
WEB_DEMO v0.1-refactor 阶段重置

前置条件：
已完成旧 WEB_DEMO 运行工程删除。

操作步骤：
1. 检查 WEB_DEMO/package.json 是否不存在。
2. 检查 WEB_DEMO/index.html 是否不存在。
3. 检查 WEB_DEMO/src 是否不存在。
4. 检查 WEB_DEMO/README.md 是否存在。
5. 检查 WEB_DEMO/design/production/web_demo_refactor_policy.md 是否存在。
6. 检查 WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md 是否存在。
7. 检查 WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md 是否存在。
8. 检查 WEB_DEMO/docs/codex_tasks.md 是否存在。
9. 检查 codex_tasks.md 当前任务是否为 v0.1-refactor。
10. 检查 GPT_DEMO 是否未被修改。

预期结果：
1. 旧 WEB_DEMO 可运行工程已删除。
2. 当前 WEB_DEMO 不再是可运行 Demo，而是重构准备阶段。
3. README 明确写出"理解并重构 GPT_DEMO"。
4. GPT_DEMO 被定义为玩法规则基线。
5. WEB_DEMO 被定义为工程化重构版本。
6. 当前阶段不包含 package.json、index.html 或 src。
7. 后续 Codex 必须先提取 GPT_DEMO 规则，再开始重构开发。
