# 15_WEB_DEMO_WORKSPACE：Web Demo 独立工作区

## 定位

Web Demo 是后续引擎 Demo 之前的快速玩法验证工程。

Web Demo 不应与后续引擎工程文件混放。

Web Demo 不是 `Builds/` 中的临时构建产物，而是一个独立的原型工程。

---

## 默认目录

Web Demo 默认放在项目根目录下的独立文件夹：

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
│       └── web_demo_balance.json
├── Assets/
│   └── .gitkeep
├── Tools/
│   └── web-demo-server.mjs
├── Tests/
│   └── web-demo-smoke.mjs
├── Docs/
│   └── .gitkeep
└── Temp/
    └── .gitkeep
```

---

## 为什么不用 Builds/web-demo

`Builds/` 更适合放构建输出，而不是源码型 Web Demo。

Web Demo 的 `index.html`、`styles.css`、`game.js`、配置和测试脚本属于原型工程源文件。

如果放在 `Builds/web-demo/`，AI 容易误以为它是可删除、可覆盖的导出结果。

因此：

```text
WEB_DEMO/ = Web 原型工程
Builds/ = 构建输出
```

---

## 路径规则

Web Demo 阶段默认只修改：

```text
WEB_DEMO/
AI_TASKS/
DESIGN_HUB/11_PLAYTEST_FEEDBACK.md
DESIGN_HUB/12_DEMO_SCOPE.md
```

未经明确允许，不要修改：

```text
Scenes/
Scripts/
project.godot
后续引擎相关资源
```

---

## Web Demo 默认文件

### 入口文件

```text
WEB_DEMO/index.html
```

### 样式文件

```text
WEB_DEMO/styles.css
```

### 主逻辑文件

```text
WEB_DEMO/game.js
```

### 配置文件

```text
WEB_DEMO/Data/config/web_demo_balance.json
```

### 启动脚本

```text
WEB_DEMO/run_web_demo.bat
```

### 工具脚本

```text
WEB_DEMO/Tools/web-demo-server.mjs
```

### 测试脚本

```text
WEB_DEMO/Tests/web-demo-smoke.mjs
```

---

## 旧路径迁移规则

旧路径：

```text
Builds/web-demo/
Data/config/
Tools/
Tests/
```

应逐步迁移到：

```text
WEB_DEMO/
```

迁移后，Codex 必须更新：

```text
README.md
DESIGN_HUB/12_DEMO_SCOPE.md
AI_RULES/02_AI_EDIT_PERMISSION.md
AI_RULES/06_VALIDATION_CHECKLIST.md
AI_TASKS/NEXT_CODEX_PROMPT.md
AI_TASKS/CURRENT_TASK.md
```

---

## Web Demo 开发原则

- Web Demo 优先验证核心玩法和界面信息，不追求最终工程架构；
- Web Demo 不应污染后续引擎工程目录；
- Web Demo 的配置、测试、工具脚本都应优先放在 `WEB_DEMO/` 内；
- Web Demo 可以有自己的 `README.md`、`package.json` 和启动脚本；
- Web Demo 进入后续引擎阶段后，可以保留为参考原型，不应直接删除。

---

## 禁止事项

```text
不要把 Web Demo 源码继续放在 Builds/；
不要把 Web Demo 配置混进根目录 Data/；
不要把 Web Demo 工具脚本混进根目录 Tools/；
不要把 Web Demo 测试混进根目录 Tests/；
不要在 Web Demo 阶段修改后续引擎工程文件；
不要把 WEB_DEMO/ 误当作最终上线构建目录。
```