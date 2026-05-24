# 12_DEMO_SCOPE：Demo 目标与范围

本文件用于定义当前 Demo 的类型、版本、目标、范围和进入下一阶段的条件。

---

## 当前 Demo 类型

- [x] Web Demo 原型
- [ ] Unity 源码学习 / 改造
- [ ] Unity 独立原型
- [ ] UI 流程 Demo
- [ ] 表现方向 Demo
- [ ] 商业展示 Demo

---

## 当前版本规则

```text
v0.x = Web Demo 原型阶段
v1.x = Unity 源码学习 / 改造阶段
v2.x = Unity 独立原型阶段
v3.x = 可展示垂直切片阶段
v4.x = 商业化验证阶段
```

当前版本：

```text
v0.x / Web Demo 原型
```

---

## 当前 Demo 目标

本 Demo 主要用于验证：

- 核心玩法是否成立；
- 玩家是否理解主要操作；
- 资源循环是否清楚；
- 界面信息是否足够明确；
- 关键反馈是否明显；
- 是否值得进入 Unity 源码学习 / 改造阶段。

---

## 当前 Demo 明确不做

- 不做最终美术；
- 不做正式引擎工程；
- 不做正式广告 SDK；
- 不做正式支付；
- 不做完整存档；
- 不做完整关卡；
- 不做复杂技术架构；
- 不做复杂商业化系统；
- 不从 0 创建 Unity 项目。

---

## Web Demo 技术约束

- Web Demo 是独立原型工程，默认放在 `WEB_DEMO/`；
- 优先使用 HTML + CSS + 原生 JavaScript；
- 不引入 React、Phaser、Three.js 或复杂 npm 依赖，除非明确允许；
- Web Demo 配置优先放入 `WEB_DEMO/Data/config/`；
- Web Demo 工具脚本放入 `WEB_DEMO/Tools/`；
- Web Demo 测试脚本放入 `WEB_DEMO/Tests/`；
- Web Demo 启动脚本放入 `WEB_DEMO/run_web_demo.bat`；
- 不要把 Web Demo 源码放入 `Builds/`；
- `Builds/` 只作为构建输出目录。

默认结构见：

```text
DESIGN_HUB/15_WEB_DEMO_WORKSPACE.md
```

---

## 进入 Unity 源码学习 / 改造阶段的条件

- [ ] Web Demo 核心玩法已跑通；
- [ ] 玩家能理解核心操作；
- [ ] UI 信息层级清楚；
- [ ] 核心反馈足够明确；
- [ ] 数值压力初步合理；
- [ ] 策划确认玩法方向值得继续；
- [ ] 已明确需要寻找 Unity 源码项目进行学习或改造；
- [ ] 已准备按 `DESIGN_HUB/16_UNITY_SOURCE_WORKFLOW.md` 筛选源码。

---

## 进入 Unity 独立原型阶段的条件

- [ ] 已跑通至少一个 Unity 源码项目；
- [ ] 已理解参考源码的基本工程结构；
- [ ] 已记录源码结构分析文档；
- [ ] 已完成若干小步改造；
- [ ] 策划确认需要创建自己的 Unity 原型；
- [ ] 已明确 v2.x 的最小可运行范围。

---

## Demo 验收标准

- [ ] 能在浏览器中运行；
- [ ] 能完成一次核心玩法循环；
- [ ] 能展示主要 UI 信息；
- [ ] 能展示关键反馈；
- [ ] 能通过 smoke test；
- [ ] 能让策划判断下一轮迭代方向；
- [ ] Web Demo 文件位于 `WEB_DEMO/` 独立工作区；
- [ ] 未创建与当前阶段无关的引擎工程。