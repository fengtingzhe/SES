# 任务名称

## 背景

说明为什么要做这个任务。

---

## 本任务服务的 Demo 目标

本任务是为了展示：

- [ ] 核心玩法
- [ ] UI 流程
- [ ] 视觉表现
- [ ] 数值验证
- [ ] 商业演示
- [ ] 工程基础
- [ ] Unity 源码学习
- [ ] Unity 小步改造

---

## 当前项目阶段

- [ ] v0.x / Web Demo 原型
- [ ] v1.x / Unity 源码学习 / 改造
- [ ] v2.x / Unity 独立原型
- [ ] v3.x / 可展示垂直切片
- [ ] v4.x / 商业化验证

---

## 任务归属判断

Codex 阅读完本任务后，必须先判断本轮任务由谁执行。

- [ ] Codex 自己开发
- [ ] 拆分给 DeepSeek
- [ ] Codex + DeepSeek 协作

### 判断理由

待填写。

### Codex 负责

- 

### DeepSeek 负责

- 

### Codex 审核方式

- 

如本轮需要 DeepSeek 执行子任务，必须在以下文件记录任务卡：

```text
AI_TASKS/DEEPSEEK_TASKS.md
```

---

## 是否需要写入 NEXT_CODEX_PROMPT

- [ ] 是
- [ ] 否

给 Codex 的最终提示词位置：

```text
AI_TASKS/NEXT_CODEX_PROMPT.md
```

---

## 目标

本任务完成后，玩家或开发者能看到什么变化。

---

## 范围

本轮只做：

- 
- 
- 

---

## 不做

本轮明确不做：

- 
- 
- 

---

## 允许修改的文件

- 

---

## 禁止修改的文件

- 

---

## 设计约束

- 

---

## 技术约束

- 

---

## Web Demo 独立工作区要求

如果本任务涉及 Web Demo，默认应参考：

```text
DESIGN_HUB/15_WEB_DEMO_WORKSPACE.md
```

默认要求：

- [ ] Web Demo 源码放在 `WEB_DEMO/`；
- [ ] Web Demo 入口为 `WEB_DEMO/index.html`；
- [ ] Web Demo 主逻辑为 `WEB_DEMO/game.js`；
- [ ] Web Demo 样式为 `WEB_DEMO/styles.css`；
- [ ] Web Demo 配置放在 `WEB_DEMO/Data/config/`；
- [ ] Web Demo 工具脚本放在 `WEB_DEMO/Tools/`；
- [ ] Web Demo 测试脚本放在 `WEB_DEMO/Tests/`；
- [ ] 不把 Web Demo 源码放入 `Builds/`；
- [ ] 不把 Web Demo 配置、工具、测试散落到根目录 `Data/`、`Tools/`、`Tests/`。

---

## Unity 源码学习 / 改造要求

如果本任务涉及 Unity 源码学习 / 改造，默认应参考：

```text
DESIGN_HUB/16_UNITY_SOURCE_WORKFLOW.md
```

默认要求：

- [ ] Unity 源码项目位于 `UNITY_SOURCE/`；
- [ ] 先做源码体检，再做改造；
- [ ] 已检查 Unity 版本；
- [ ] 已检查许可证；
- [ ] 已检查依赖插件；
- [ ] 已检查是否缺失资源；
- [ ] 已检查是否依赖后端或联网服务；
- [ ] 首次运行报错已记录，如有；
- [ ] 兼容性修复记录到 `UNITY_SOURCE/COMPATIBILITY_LOG.md`，如适用；
- [ ] 源码结构分析记录到 `UNITY_SOURCE/STRUCTURE_NOTES.md` 或 `Docs/UnitySourceAnalysis/`，如适用；
- [ ] 源码未跑通前不做大规模改造；
- [ ] 不绕过许可证或授权限制。

---

## 默认开发辅助功能要求

如果本任务涉及 Web Demo，默认应参考：

```text
DESIGN_HUB/14_DEFAULT_DEV_FEATURES.md
```

默认要求：

- [ ] 提供 `WEB_DEMO/run_web_demo.bat`，或明确说明本轮暂不需要；
- [ ] `WEB_DEMO/run_web_demo.bat` 用于启动 Vite 或等价本地 Web 服务；
- [ ] `WEB_DEMO/run_web_demo.bat` 启动后应自动打开 Demo 网页；
- [ ] `WEB_DEMO/run_web_demo.bat` 不得依赖个人电脑绝对路径；
- [ ] 不要求用户直接双击 `WEB_DEMO/index.html` 运行 Demo；
- [ ] 如本轮包含测试，应提供或更新 Smoke Test。

---

## 通用 Console 要求

如果本任务涉及可运行 Demo 界面，默认应包含通用 `Console` / `Dev` 按钮。

通用功能只包括：

- [ ] 音乐开关
- [ ] 音效开关
- [ ] 暂停 / 继续
- [ ] 重置场景 / 重置 Demo
- [ ] 显示 FPS

当开启 FPS 显示后，FPS 数值应显示在游戏画面的右下角。

特定游戏功能不应默认加入 Console，除非本任务明确要求。

---

## 验收标准

完成后必须满足：

- [ ] 
- [ ] 
- [ ] 

---

## 完成后必须输出

1. 修改了哪些文件；
2. 实现了什么；
3. 如何验证；
4. 有哪些风险；
5. 是否写入了 `DESIGN_HUB/10_OPEN_QUESTIONS.md`；
6. 是否更新了 `AI_TASKS/CHANGELOG.md`；
7. 是否更新了 `AI_TASKS/NEXT_CODEX_PROMPT.md`，如需要；
8. 是否进行了任务归属判断；
9. 如拆分给 DeepSeek，是否更新了 `AI_TASKS/DEEPSEEK_TASKS.md`；
10. 如合并 DeepSeek 产物，是否更新了 `AI_TASKS/REVIEW_LOG.md`；
11. 如涉及 Unity 源码学习，是否更新了 `UNITY_SOURCE/` 下的体检、兼容或结构记录。