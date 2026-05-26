# Codex Tasks

---

# 当前任务：WEB_DEMO v0.2-refactor 最小工程骨架与基础交互迁移

## 任务名称

```text
WEB_DEMO v0.2-refactor 最小工程骨架与基础交互迁移
```

---

## 任务背景

此前 WEB_DEMO v0.2～v0.6 路线已经废弃。

新 WEB_DEMO 阶段目标是：

```text
理解并重构 GPT_DEMO。
```

当前已经完成：

```text
WEB_DEMO v0.1-refactor：GPT_DEMO 规则基线提取与 WEB_DEMO 阶段重定义
```

v0.1-refactor 已建立：

```text
WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
WEB_DEMO/design/production/web_demo_refactor_policy.md
```

从 v0.2-refactor 开始，WEB_DEMO 重新进入可运行工程开发阶段，但必须遵循：

```text
规则基线 + GPT_DEMO 定向代码迁移 + 模块化重构 + 规则继承审计
```

也就是说：

```text
WEB_DEMO 不是从零重写；
WEB_DEMO 也不是整文件复制 GPT_DEMO；
WEB_DEMO 是 GPT_DEMO 的受控重构。
```

---

## 本轮目标

建立最小可运行 WEB_DEMO 工程，并从 `GPT_DEMO/index.html` 中定向迁移最基础的玩家探索与辉石交互规则。

本轮重点验证：

```text
1. WEB_DEMO 工程可以重新运行。
2. 玩家移动手感接近 GPT_DEMO。
3. 玩家朝向规则正确。
4. 视野揭示正确。
5. Space 面前优先互动正确。
6. 辉石采集正确。
7. 无目标 Space 放置辉石正确。
8. HUD 能显示基础状态。
9. 审计文档能追踪 GPT_DEMO 规则到 WEB_DEMO 实现的迁移关系。
```

---

# 重要开发原则

本轮必须先定位 `GPT_DEMO/index.html` 中对应的原始代码逻辑，再迁移到 WEB_DEMO 新模块。

Codex 必须在完成输出中说明：

```text
1. GPT_DEMO 中对应代码位置 / 函数 / 变量 / 常量。
2. GPT_DEMO 原始行为是什么。
3. WEB_DEMO 迁移到了哪些模块。
4. 哪些规则保持一致。
5. 哪些属于有意重构。
6. 是否存在与 GPT_DEMO 不一致的地方。
7. 是否存在需要策划确认的问题。
```

禁止只根据需求描述凭空重写。

禁止整文件复制 `GPT_DEMO/index.html`。

---

# 本轮只做

## 一、创建最小可运行 WEB_DEMO 工程

允许重新创建：

```text
WEB_DEMO/package.json
WEB_DEMO/index.html
WEB_DEMO/src/**
```

工程要求：

```text
1. 使用最小 Vite 工程即可。
2. index.html 只负责加载 src/main.js，不写复杂游戏逻辑。
3. src/main.js 只负责启动 GameApp。
4. 不接入正式图片、音乐、字体或外部资源。
5. 不做 CSV / JSON 配置读取。
6. 代码结构保持清晰，不堆回单文件。
```

---

## 二、迁移 GPT_DEMO 基础地图参数

从 `GPT_DEMO/index.html` 中定位并继承基础参数：

```text
地图尺寸：74 x 54
起点：(5, 27)
终点：(68, 27)
初始辉石：6
初始工人数量：2
```

v0.2 暂时不实现工人系统，但可以在状态和 HUD 中预留工人数。

要求：

```text
1. 地图中能看到起点和终点。
2. 地图中有基础地面、阻挡区域和少量可拾取辉石。
3. 地图结构应为后续主路径、断桥、营地、雾门和特殊点预留空间。
4. 不做完整 GPT_DEMO 地图生成迁移，只做基础骨架。
```

---

## 三、迁移玩家移动与朝向

从 `GPT_DEMO/index.html` 中定位玩家输入、移动、朝向逻辑。

必须继承：

```text
1. WASD / 方向键移动。
2. 玩家拥有朝向。
3. 朝向影响 Space 面前格判断。
4. 玩家移动后触发视野揭示。
```

允许重构：

```text
1. 可以将输入拆为 InputManager。
2. 可以将玩家移动拆为 PlayerSystem。
3. 可以将朝向保存到 state.player.facing。
4. 可以使用连续坐标或格子坐标，但必须保证 Space 面前格逻辑可验证。
```

---

## 四、迁移视野揭示

从 `GPT_DEMO/index.html` 中定位视野 / 已探索区域逻辑。

必须继承体验：

```text
1. 玩家移动会揭示周围区域。
2. 未探索区域不显示完整信息。
3. 探索是核心体验的一部分。
```

v0.2 可以简化实现：

```text
1. 用 discovered / visible 标记即可。
2. 不做完整小地图。
3. 不做 F3 小地图。
```

---

## 五、迁移 Space 面前优先互动

这是 v0.2 最重要的系统。

从 `GPT_DEMO/index.html` 中定位 Space 互动逻辑。

必须继承：

```text
1. Space 优先检查玩家面前格。
2. 如果面前格没有目标，再检查附近目标。
3. 如果仍无互动目标，则放置 1 个辉石。
```

v0.2 只需要支持以下互动目标：

```text
1. 可拾取辉石。
2. 终点灯塔 / 目标点提示。
3. 无目标放置辉石。
```

不需要支持：

```text
工人屋、弓箭手营、矿山、流民火堆、狐嫁女、墙基、可砍树、断桥、旧火塘营地。
```

但代码结构需要为后续 InteractionResolver / priority table 预留扩展空间。

---

## 六、迁移辉石采集与放置

从 `GPT_DEMO/index.html` 中定位辉石采集与放置规则。

必须继承：

```text
1. 玩家拥有辉石数量。
2. 地图上有可拾取辉石。
3. 玩家通过 Space 采集辉石。
4. 无目标 Space 会消耗 1 个辉石，在地面放置临时辉石。
5. 放置辉石有生命周期。
```

v0.2 暂不实现：

```text
1. 黑影拾取辉石。
2. 玩家被黑影命中消耗辉石。
3. 辉石耗尽失败。
```

但数据结构应为后续辉石诱敌和失败缓冲预留字段。

---

## 七、基础 HUD

HUD 至少显示：

```text
1. WEB_DEMO v0.2-refactor
2. 玩家辉石数量
3. 玩家位置
4. 玩家朝向
5. 基础工人数预留
6. 当前提示信息
```

不要求美术化。

---

# 建议目录结构

本轮建议创建最小结构：

```text
WEB_DEMO/
  package.json
  index.html
  src/
    main.js
    app/
      GameApp.js
    game/
      config/
        GameConfig.js
      state/
        createInitialState.js
      world/
        TileMap.js
        MapGenerator.js
      systems/
        PlayerSystem.js
        VisionSystem.js
        InteractionSystem.js
        ResourceSystem.js
      rules/
        interactionPriority.js
      utils/
        grid.js
    presentation/
      renderers/
        CanvasRenderer.js
        HudRenderer.js
        WorldRenderer.js
```

可以根据实现需要微调，但不要提前创建大量空目录或空文件。

---

# 允许修改

```text
WEB_DEMO/package.json
WEB_DEMO/index.html
WEB_DEMO/src/**
WEB_DEMO/docs/changelog.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/docs/codex_tasks.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
```

---

# 允许读取

```text
GPT_DEMO/index.html
GPT_DEMO/README.md
WEB_DEMO/README.md
WEB_DEMO/design/production/web_demo_refactor_policy.md
WEB_DEMO/design/systems/gpt_demo_rule_baseline_v1.md
WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md
WEB_DEMO/docs/codex_tasks.md
WEB_DEMO/docs/acceptance_tests.md
WEB_DEMO/docs/known_issues.md
```

---

# 禁止修改

```text
GPT_DEMO/**
AI_RULES/**
DESIGN_HUB/**
AI_TASKS/**
根目录 README.md
PROJECT_STATUS.md
```

---

# 本轮不要做

禁止本轮实现：

```text
1. 不做工人派遣。
2. 不做砍树。
3. 不做修桥。
4. 不做营地建设。
5. 不做昼夜。
6. 不做黑影。
7. 不做黑雾口。
8. 不做围墙。
9. 不做弓箭手。
10. 不做矿山。
11. 不做流民。
12. 不做工人屋 / 弓箭手营。
13. 不做狐嫁女。
14. 不做颠倒森林。
15. 不做小地图。
16. 不做 CSV / JSON 配置读取。
17. 不接入正式图片、音乐、字体。
18. 不做存档系统。
19. 不做移动端虚拟摇杆。
20. 不把 GPT_DEMO/index.html 整文件复制到 WEB_DEMO。
```

---

# 文档更新要求

完成后必须更新：

## 1. WEB_DEMO/docs/changelog.md

新增：

```markdown
## v0.2-refactor

状态：最小工程骨架与基础交互迁移

内容：
- 重新创建最小可运行 WEB_DEMO 工程。
- 从 GPT_DEMO/index.html 定向迁移基础地图参数。
- 从 GPT_DEMO/index.html 定向迁移玩家移动与朝向。
- 从 GPT_DEMO/index.html 定向迁移视野揭示。
- 从 GPT_DEMO/index.html 定向迁移 Space 面前优先互动。
- 从 GPT_DEMO/index.html 定向迁移辉石采集与无目标放置辉石。
- 新增基础 HUD。
- 本轮不迁移工人、黑影、围墙、矿山、流民和奇遇。
```

## 2. WEB_DEMO/docs/acceptance_tests.md

新增 v0.2-refactor 验收项：

```text
测试名称：WEB_DEMO v0.2-refactor 最小工程骨架与基础交互迁移
前置条件：已安装 Node.js
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
5. 使用 WASD / 方向键移动玩家
6. 观察玩家朝向变化
7. 移动到未探索区域，观察视野揭示
8. 面向辉石按 Space，确认拾取辉石
9. 在无互动目标处按 Space，确认放置辉石
10. 等待放置辉石生命周期结束
预期结果：
1. 工程能正常启动
2. 浏览器控制台无 JavaScript 报错
3. 玩家可以移动
4. 玩家朝向可被观察或通过 HUD 判断
5. 玩家移动会揭示视野
6. Space 优先判断面前格
7. Space 可以采集辉石
8. 无互动目标时 Space 会放置 1 个辉石
9. 放置辉石会消耗玩家辉石
10. 放置辉石有生命周期
11. HUD 显示版本、辉石、位置、朝向、提示信息
12. 本轮没有实现工人、黑影、围墙、矿山、流民或奇遇
13. 审计文档记录 GPT_DEMO 到 WEB_DEMO 的迁移关系
```

## 3. WEB_DEMO/docs/known_issues.md

记录：

```text
v0.2-refactor 只迁移最基础交互，不包含工人、昼夜、黑影、围墙、弓箭手、矿山、流民、特殊事件、小地图或正式资源。
当前地图生成只是基础骨架，不是完整 GPT_DEMO 地图生成。
当前辉石放置尚未连接黑影诱敌和失败缓冲。
```

## 4. WEB_DEMO/design/audit/gpt_to_web_rule_audit_v1.md

必须新增 v0.2-refactor 迁移记录。

记录格式至少包含：

```markdown
## v0.2-refactor 代码迁移记录

### 迁移系统

基础地图 / 玩家移动 / 朝向 / 视野 / Space 互动 / 辉石采集与放置 / HUD

### GPT_DEMO 来源

- 文件：GPT_DEMO/index.html
- 相关函数：由 Codex 填写
- 相关状态：由 Codex 填写
- 相关常量：由 Codex 填写

### GPT_DEMO 原始行为

由 Codex 填写。

### WEB_DEMO 迁移位置

由 Codex 填写。

### 保持一致的规则

由 Codex 填写。

### 有意重构的部分

由 Codex 填写。

### 有意重设计的部分

无，除非明确说明并获得策划确认。

### 待确认问题

由 Codex 填写。
```

---

# 验收标准

必须满足：

```text
1. WEB_DEMO/package.json 存在。
2. WEB_DEMO/index.html 存在，且只加载 src/main.js。
3. WEB_DEMO/src/main.js 存在，且只负责启动 GameApp。
4. npm install / npm run dev 可以启动。
5. 玩家可以移动。
6. 玩家朝向可见或可通过 HUD 判断。
7. 地图能显示起点、终点、基础地块和辉石。
8. 玩家移动会揭示视野。
9. Space 优先判断面前格。
10. Space 可以采集辉石。
11. 无互动目标时 Space 会放置辉石。
12. 放置辉石会消耗玩家辉石。
13. 放置辉石有生命周期。
14. HUD 显示版本、辉石、位置、朝向、基础工人数预留和提示信息。
15. 没有迁移工人、黑影、围墙、弓箭手、矿山、流民或奇遇。
16. GPT_DEMO 未被修改。
17. 审计文档记录了 GPT_DEMO 到 WEB_DEMO 的迁移关系。
18. 完成输出说明了 GPT_DEMO 来源代码与 WEB_DEMO 迁移模块。
```

---

# 完成后的输出要求

完成后请输出：

```text
1. 修改 / 新增了哪些文件。
2. GPT_DEMO 中定位了哪些来源函数、变量、常量或逻辑块。
3. WEB_DEMO 中对应迁移到了哪些模块。
4. 哪些 GPT_DEMO 规则保持一致。
5. 哪些属于有意重构。
6. 是否存在有意重设计。
7. 是否存在待确认问题。
8. 如何运行和验证。
9. 哪些内容留到 v0.3-refactor。
```

---

# 给 Codex 的提醒

本轮的成败不在于功能多，而在于：

```text
基础手感是否继承 GPT_DEMO。
```

尤其关注：

```text
Space 面前优先；
无目标放置辉石；
移动后揭示视野；
辉石作为资源和未来诱饵的双重结构。
```
