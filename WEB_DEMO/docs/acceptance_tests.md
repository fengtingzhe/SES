# Acceptance Tests

## v0.2-refactor 最小工程骨架与基础交互迁移验收

测试名称：WEB_DEMO v0.2-refactor 最小工程骨架与基础交互迁移

前置条件：
- 已安装 Node.js。
- 当前任务只迁移基础地图、玩家移动、朝向、视野、Space 互动、辉石采集与放置。

操作步骤：
1. 进入 `WEB_DEMO` 目录。
2. 执行 `npm install`。
3. 执行 `npm run dev`。
4. 打开浏览器访问 Vite 输出的本地地址。
5. 使用 WASD / 方向键移动玩家。
6. 观察 HUD 中玩家位置和朝向变化。
7. 移动到未探索区域，观察视野揭示。
8. 面向辉石按 Space，确认可拾取辉石。
9. 在无互动目标处按 Space，确认放置 1 个临时辉石。
10. 等待放置辉石生命周期结束。

预期结果：
1. 工程能正常启动。
2. 浏览器控制台无 JavaScript 报错。
3. 玩家可以移动。
4. 玩家朝向可通过画面箭头和 HUD 判断。
5. 玩家移动会揭示视野，未探索区域不显示完整信息。
6. Space 优先判断玩家面前格。
7. Space 可以拾取辉石。
8. 无互动目标时 Space 会放置 1 个辉石。
9. 放置辉石会消耗玩家辉石。
10. 放置辉石有 10 秒生命周期。
11. HUD 显示版本、辉石、位置、朝向、基础工人预留和提示信息。
12. 本轮没有实现工人、黑影、围墙、弓箭手、矿山、流民或奇遇。
13. 审计文档记录 GPT_DEMO 到 WEB_DEMO 的迁移关系。

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
