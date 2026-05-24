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

## 规则来源

详细规则见：

```text
DESIGN_HUB/15_WEB_DEMO_WORKSPACE.md
```