# 06_VALIDATION_CHECKLIST：验收清单

每次 AI 完成任务后，都应按照本清单进行检查。

---

## 基础运行检查

- [ ] 项目可以正常启动；
- [ ] 没有明显报错；
- [ ] 主流程可以进入；
- [ ] 可以退出或返回；
- [ ] 没有卡死。

---

## 功能检查

- [ ] 本轮新增功能可以触发；
- [ ] 本轮新增功能可以重复使用；
- [ ] 异常情况有处理；
- [ ] 不影响旧功能；
- [ ] 不引入重复系统。

---

## UI 检查

- [ ] 文案显示完整；
- [ ] 按钮可点击；
- [ ] 状态反馈清楚；
- [ ] 目标分辨率下不遮挡；
- [ ] 重要信息足够醒目。

---

## 数据检查

- [ ] 数值来自对应阶段工作区内的配置文件；
- [ ] Web Demo 数值优先来自 `WEB_DEMO/Data/config/`；
- [ ] Unity 源码学习阶段的配置和记录优先来自 `UNITY_SOURCE/`；
- [ ] Unity 独立原型阶段的配置和记录优先来自 `UNITY_PROJECT/`；
- [ ] 没有大量硬编码；
- [ ] 修改配置后功能能生效；
- [ ] 字段含义清楚。

---

## Demo 表达检查

- [ ] 能展示核心体验；
- [ ] 能展示主要界面；
- [ ] 能展示关键反馈；
- [ ] 玩家能理解下一步要做什么；
- [ ] 未过早实现超出 Demo 目标的大型系统。

---

## Web Demo 独立工作区检查

如果本轮涉及 Web Demo，必须参考：

```text
DESIGN_HUB/15_WEB_DEMO_WORKSPACE.md
```

默认检查：

- [ ] Web Demo 源码位于 `WEB_DEMO/`；
- [ ] Web Demo 入口位于 `WEB_DEMO/index.html`；
- [ ] Web Demo 主逻辑位于 `WEB_DEMO/game.js`；
- [ ] Web Demo 样式位于 `WEB_DEMO/styles.css`；
- [ ] Web Demo 配置位于 `WEB_DEMO/Data/config/`；
- [ ] Web Demo 工具脚本位于 `WEB_DEMO/Tools/`；
- [ ] Web Demo 测试脚本位于 `WEB_DEMO/Tests/`；
- [ ] 没有把 Web Demo 源码写入 `Builds/`；
- [ ] 没有把 Web Demo 配置、工具和测试散落到根目录 `Data/`、`Tools/`、`Tests/`。

---

## Unity 源码学习 / 改造检查

如果本轮涉及 Unity 源码学习 / 改造，必须参考：

```text
DESIGN_HUB/16_UNITY_SOURCE_WORKFLOW.md
```

默认检查：

- [ ] Unity 源码项目位于 `UNITY_SOURCE/`；
- [ ] 已记录 Unity 版本；
- [ ] 已检查许可证；
- [ ] 已检查依赖插件；
- [ ] 已检查是否缺失资源；
- [ ] 已检查是否依赖后端或联网服务；
- [ ] 已记录首次运行报错，如有；
- [ ] 兼容性修复已记录到 `UNITY_SOURCE/COMPATIBILITY_LOG.md`，如适用；
- [ ] 源码结构分析已记录到 `UNITY_SOURCE/STRUCTURE_NOTES.md` 或 `Docs/UnitySourceAnalysis/`，如适用；
- [ ] 未在源码未跑通前进行大规模改造；
- [ ] 未绕过许可证或授权限制。

---

## 默认开发辅助功能检查

所有 Demo 应参考：

```text
DESIGN_HUB/14_DEFAULT_DEV_FEATURES.md
```

如果本轮涉及 Web Demo，默认检查：

- [ ] 存在 `WEB_DEMO/run_web_demo.bat`，或任务明确说明本轮暂不需要；
- [ ] `WEB_DEMO/run_web_demo.bat` 不依赖个人电脑绝对路径；
- [ ] Web Demo 可以通过 Vite 或等价本地 Web 服务启动；
- [ ] 不要求用户直接双击 `WEB_DEMO/index.html` 运行 Demo；
- [ ] 如存在 Smoke Test，脚本可以用于快速确认 Demo 是否能打开；
- [ ] Demo 版本号或当前版本状态可以被开发者识别。

---

## 通用 Debug Console 检查

所有 Demo 默认应提供一个 `Console` / `Dev` 按钮，作为开发者工具入口。

通用功能只检查跨游戏类型也常用的功能：

- [ ] 界面中存在 Console / Dev 按钮；
- [ ] Console 可以打开和关闭；
- [ ] 音乐开关可用；
- [ ] 音效开关可用；
- [ ] 暂停 / 继续可用；
- [ ] 重置场景 / 重置 Demo 可用；
- [ ] 显示 FPS 可用；
- [ ] 开启 FPS 后，FPS 数值显示在游戏画面的右下角；
- [ ] Console 不遮挡核心玩法；
- [ ] Console 不被当作正式玩家功能。

特定游戏相关功能，例如加资源、跳转时间、生成敌人、解锁节点等，不属于通用 Console 检查项。如项目需要，必须在任务卡中单独确认。

---

## AI 工作检查

- [ ] 没有擅自改核心设计；
- [ ] 没有擅自新增大系统；
- [ ] 没有大规模重构；
- [ ] 已说明修改文件；
- [ ] 已说明验证方式；
- [ ] 已更新 `AI_TASKS/CHANGELOG.md`；
- [ ] 已读取或更新 `AI_TASKS/NEXT_CODEX_PROMPT.md`，如本轮任务涉及 Codex；
- [ ] Codex 已进行任务归属判断；
- [ ] 如任务拆给 DeepSeek，已更新 `AI_TASKS/DEEPSEEK_TASKS.md`；
- [ ] 如合并 DeepSeek 产物，已更新 `AI_TASKS/REVIEW_LOG.md`；
- [ ] 不确定问题已写入 `DESIGN_HUB/10_OPEN_QUESTIONS.md`。