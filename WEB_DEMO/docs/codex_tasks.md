# Codex Tasks

# 当前任务：WEB_DEMO v0.1-refactor GPT_DEMO 规则基线提取与 WEB_DEMO 阶段重定义

## 任务背景

此前 WEB_DEMO v0.2～v0.6 路线已经废弃。
原因是该路线相当于重新开发一套类似 GPT_DEMO 的功能，没有充分继承 GPT_DEMO 已验证的玩法规则。
从现在开始，WEB_DEMO 阶段改为"理解并重构 GPT_DEMO"。

## 当前任务目标

本轮不写玩法代码。
本轮只做规则提取、阶段重定义和重构计划。

## 本轮只做

1. 读取 GPT_DEMO 现有代码和文档。
2. 提炼 GPT_DEMO 的玩法规则。
3. 补全 WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md。
4. 补全 WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md 的初始审计项。
5. 根据 GPT_DEMO 规则，重新规划 WEB_DEMO refactor 版本路线。
6. 确认后续 v0.2-refactor 应该迁移哪些最小规则。

## 本轮不要做

1. 不创建 WEB_DEMO/package.json。
2. 不创建 WEB_DEMO/index.html。
3. 不创建 WEB_DEMO/src/。
4. 不写可运行游戏代码。
5. 不迁移具体玩法功能。
6. 不做 CSV / JSON。
7. 不接入图片、音乐、资源。
8. 不参考旧 WEB_DEMO v0.2～v0.6 的实现作为主线。
9. 不修改 GPT_DEMO。

## 允许读取

- `GPT_DEMO/**`
- `WEB_DEMO/README.md`
- `WEB_DEMO/design/production/web_demo_refactor_policy.md`
- `WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md`
- `WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md`

## 允许修改

- `WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md`
- `WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md`
- `WEB_DEMO/docs/changelog.md`
- `WEB_DEMO/docs/acceptance_tests.md`
- `WEB_DEMO/docs/known_issues.md`
- `WEB_DEMO/docs/codex_tasks.md`

## 禁止修改

- `GPT_DEMO/**`
- `WEB_DEMO/package.json`
- `WEB_DEMO/index.html`
- `WEB_DEMO/src/**`
- `AI_RULES/**`
- `DESIGN_HUB/**`
- `AI_TASKS/**`
- 根目录 `README.md`
- `PROJECT_STATUS.md`

## 验收标准

1. WEB_DEMO 旧运行代码不存在。
2. WEB_DEMO/README.md 明确写出新阶段目标：理解并重构 GPT_DEMO。
3. web_demo_refactor_policy.md 存在。
4. gpt_demo_rule_baseline_v1.md 存在。
5. gpt_to_web_rule_audit_v1.md 存在。
6. codex_tasks.md 当前任务为 v0.1-refactor。
7. 当前任务不要求可运行游戏。
8. 没有重新创建 package.json、index.html 或 src 运行代码。
9. GPT_DEMO 未被修改。
