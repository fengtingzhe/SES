# WEB_DEMO：Web Demo 原型工作区

## 定位

`WEB_DEMO/` 用于保存 Web Demo 原型工程。

这是当前工作流的第一阶段：

```text
v0.x = Web Demo 原型阶段
```

目标是快速验证核心玩法、界面信息、交互反馈和基础数值，而不是完成最终游戏工程。

---

## 推荐结构

```text
WEB_DEMO/
├── README.md
├── run_web_demo.bat
├── package.json
├── index.html
├── styles.css
├── game.js
├── Data/
│   └── config/
├── Assets/
├── Tools/
├── Tests/
├── Docs/
└── Temp/
```

---

## 放什么

- Web Demo 页面；
- Web Demo 脚本；
- Web Demo 样式；
- Web Demo 配置；
- Web Demo 测试；
- Web Demo 启动脚本；
- Web Demo 临时资源。

---

## 不放什么

- 不放 Unity 源码；
- 不放未来 Unity 自建项目；
- 不放最终构建输出；
- 不放与 Web Demo 无关的大型资源。

---

## 运行方式

在 `WEB_DEMO/` 目录下执行：

```bash
npm install
npm run dev
```

浏览器打开后，应能看到：

```text
WEB_DEMO Template Ready
```

---

## 实际目录结构

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
2. 图片、音频、字体等运行时资源放入 `public/assets/`。
3. `index.html` 不写复杂游戏逻辑，只加载入口脚本。
4. `src/` 内代码应模块化，避免把正式玩法继续堆在单文件中。
5. 本模板不包含具体游戏玩法；复制到具体项目后，再在 `WEB_DEMO/` 内实现项目专属系统。

---

## 当前状态

```text
阶段：正式 Web 游戏工程骨架
玩法：未实现
目标：验证工程可运行、目录清晰、资源与 CSV 入口明确
```

---

## 规则来源

详细规则见：

```text
DESIGN_HUB/15_WEB_DEMO_WORKSPACE.md
```