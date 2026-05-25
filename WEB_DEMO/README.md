# WEB_DEMO：看海去正式 Web Demo 工程

## 定位

`WEB_DEMO/` 是《看海去》的正式 Web Demo 工程工作区，不是 `GPT_DEMO/` 的临时草图。

当前阶段目标：先建立干净、可运行、可维护的 Vite + Canvas 工程骨架，再逐步从 `GPT_DEMO gpt.11.7` 迁移核心玩法。

---

## 运行方式

在 `WEB_DEMO/` 目录下执行：

```bash
npm install
npm run dev
```

浏览器打开后，应能看到可操作的 `WEB_DEMO v0.2` Canvas Demo：

```text
WASD / 方向键移动，Space 互动或放置辉石，R 重开。
```

---

## 当前实际目录结构

```text
WEB_DEMO/
  index.html                 # Web 入口，只负责加载 src/main.js
  package.json               # Web Demo 独立工程依赖与脚本
  vite.config.js             # Vite 配置

  public/
    assets/
      art/                   # 美术资源：角色、地块、UI、特效、占位图
      audio/                 # 音乐音效：BGM、环境音、SFX
      data/
        csv/                 # 策划数值表、本地化文本、配置表
        json/                # 结构化配置、资源清单、调试配置
      fonts/                 # 字体资源

  src/                       # 代码，由 Codex / AI 主要维护
    main.js                  # 当前最小入口
    app/                     # 应用启动与生命周期
    engine/                  # 通用游戏底层：循环、输入、渲染、资源、数据、调试
    game/                    # 项目玩法代码：状态、世界、实体、系统、规则
    presentation/            # 表现层：渲染器、UI、镜头

  design/                    # 项目内设计说明，由策划主导维护
  docs/                      # 开发记录、任务、验收、问题记录
  saves/samples/             # 调试存档与测试场景
  tests/                     # 自动测试
```

---

## 人工维护分工

| 目录 | 主要维护者 | 用途 |
|---|---|---|
| `public/assets/art/` | 美术 / 策划 | 图片、UI、占位图、特效图 |
| `public/assets/audio/` | 音乐音效 / 策划 | BGM、环境音、音效 |
| `public/assets/data/csv/` | 策划 | 数值表、配置表、本地化文本 |
| `public/assets/data/json/` | 策划 + AI | 结构化配置、资源清单、调试配置 |
| `design/` | 策划 | GDD、系统说明、美术需求、音频需求、版本计划 |
| `docs/` | 策划 + AI | 开发任务、验收标准、已知问题、更新记录 |
| `saves/samples/` | 策划定义，AI 生成 | 调试存档、测试场景 |
| `src/` | Codex / AI | 代码实现 |
| `tests/` | Codex / AI | 自动测试 |

---

## 资源与数值原则

1. 策划频繁调整的内容优先放入 `public/assets/data/csv/`。
2. 结构化运行时配置、资源清单、调试预设优先放入 `public/assets/data/json/`。
3. 图片、音频、字体等运行时资源放入 `public/assets/`。
4. `index.html` 不写复杂游戏逻辑，只加载入口脚本。
5. `src/` 内代码应模块化，避免把正式玩法继续堆在单文件中。

---

## 与 GPT_DEMO 的关系

```text
GPT_DEMO gpt.11.7 = 玩法验证基线
WEB_DEMO v0.x = 正式 Web 原型线
```

WEB_DEMO 后续应逐步复现 GPT_DEMO gpt.11.7 的核心循环，但不要直接把 GPT_DEMO 的单文件结构搬进 `index.html`。

---

## 当前状态

```text
阶段：WEB_DEMO v0.2 核心循环迁移阶段
玩法：已迁移最小核心循环
目标：验证探索、辉石、工人派遣、砍树、修桥、点亮营地、日夜循环和阶段目标
当前入口：index.html -> /src/main.js
```

当前 v0.2 只实现最小核心循环，不包含黑影、围墙、弓箭手、矿山、流民火堆、狐狸奇遇、特殊地形、移动端虚拟摇杆、正式图片资源、音乐音效、CSV 读取或存档系统。

---

## 规则说明

部分旧项目文档仍可能提到 `WEB_DEMO/Data/config/`、`game.js`、`styles.css` 等历史结构。当前 WEB_DEMO 以本文件记录的 Vite + `src/` + `public/assets/` 结构为准，旧路径后续再统一清理。
