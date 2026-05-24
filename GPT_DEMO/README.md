# GPT_DEMO：ChatGPT 快速可试玩草图阶段

## 定位

`GPT_DEMO/` 是正式 `WEB_DEMO/` 之前的快速验证区。

它用于支持制作人与 ChatGPT 在方案讨论阶段，快速生成可运行网页草图，让用户先直观看到方向是否一致。

核心目标不是工程质量，而是：

```text
快速看见；
快速试玩；
快速暴露偏差；
快速修正方向。
```

---

## 什么时候使用

当项目还处于以下状态时，可以使用 `GPT_DEMO/`：

- 玩法方向还在头脑风暴；
- 文档尚未完全定稿；
- 用户希望先看到一个直观效果；
- 需要验证“我们理解的玩法是否一致”；
- 不适合马上进入 Codex 正式开发。

---

## 工作流

推荐流程：

```text
ChatGPT 与用户讨论方案
↓
形成一个足够小的可试玩点
↓
ChatGPT 直接在 GPT_DEMO/ 生成可运行 HTML 原型
↓
用户本地打开试玩 / 通过页面预览体验
↓
用户反馈：方向对 / 不对 / 哪里偏了
↓
ChatGPT 继续快速修改 GPT_DEMO/
↓
用户确认方向
↓
再把确认后的内容写入 DESIGN_HUB/、AI_TASKS/
↓
Codex 根据正式任务卡重构为 WEB_DEMO/
```

---

## 与 WEB_DEMO 的区别

| 目录 | 作用 | 质量要求 |
|---|---|---|
| `GPT_DEMO/` | 方案讨论阶段的快速可试玩草图 | 可以粗糙，可以硬编码，重点是直观 |
| `WEB_DEMO/` | 正式 Web Demo 原型工作区 | 需要任务卡、结构清晰、可维护、可配置 |

---

## 允许内容

`GPT_DEMO/` 可以包含：

```text
GPT_DEMO/index.html
GPT_DEMO/*.html
GPT_DEMO/assets/
GPT_DEMO/notes.md
```

推荐优先使用单文件 HTML：

```text
GPT_DEMO/index.html
```

这样用户可以直接双击打开。

---

## 允许的临时做法

在 `GPT_DEMO/` 阶段允许：

- 少量硬编码；
- 简化美术；
- 简化数值；
- 单文件 HTML；
- 用 Canvas 快速画图；
- 先做感觉，再补结构；
- 快速覆盖式迭代。

---

## 禁止误用

`GPT_DEMO/` 不应被当作正式工程。

禁止：

- 把 GPT_DEMO 直接当作最终 Demo；
- 在 GPT_DEMO 中长期堆功能；
- 不经整理就把 GPT_DEMO 复制成 WEB_DEMO；
- 用 GPT_DEMO 替代正式任务卡；
- 跳过用户确认直接进入正式开发。

---

## 进入 WEB_DEMO 的条件

当满足以下条件后，应停止继续扩大 `GPT_DEMO/`，转入正式流程：

- 用户确认大方向基本正确；
- 已明确当前 Demo 要验证的核心循环；
- 已明确本轮只做和不做；
- 已整理 `DESIGN_HUB/12_DEMO_SCOPE.md`；
- 已生成 `AI_TASKS/CURRENT_TASK.md`；
- 已生成 `AI_TASKS/NEXT_CODEX_PROMPT.md`。

---

## 版本命名建议

```text
GPT_DEMO/gpt_sketch_001.html
GPT_DEMO/gpt_sketch_002.html
GPT_DEMO/index.html
```

`index.html` 始终指向当前推荐体验版本。

---

## 一句话原则

```text
GPT_DEMO 负责让用户先看见方向；WEB_DEMO 负责把确认后的方向工程化。
```
