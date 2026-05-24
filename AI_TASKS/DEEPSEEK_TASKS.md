# DEEPSEEK_TASKS：DeepSeek 任务分配记录

## 定位

本文件用于记录由 Codex 拆分给 DeepSeek 执行的任务。

Codex 是项目主程、架构师和最终审核者；DeepSeek 是模块开发、批量实现和配置生成助手。

DeepSeek 的产物必须经过 Codex 审核后才能合并。

---

## 使用规则

每次 Codex 阅读完 `AI_TASKS/NEXT_CODEX_PROMPT.md` 后，必须先判断本轮任务是否需要拆分给 DeepSeek。

如果需要，应在本文件中记录 DeepSeek 任务卡。

如果不需要，也应在 Codex 输出中说明理由。

---

## DeepSeek 适合处理的任务

```text
普通 UI 小组件；
重复性 HTML / CSS 调整；
配置表补全；
文案整理；
README / 操作说明初稿；
简单工具函数；
简单测试补充；
批量数据生成；
低风险局部模块。
```

---

## DeepSeek 不应处理的任务

```text
核心架构设计；
主循环 / 状态机；
跨系统状态管理；
高风险 Bug 修复；
大型重构；
最终合并；
最终代码审核；
修改核心设计方向；
修改 AI_RULES；
修改 DESIGN_HUB 中的已确认决策。
```

---

## DeepSeek 任务卡模板

```markdown
## [日期] DeepSeek 任务标题

### 任务来源
来自：`AI_TASKS/NEXT_CODEX_PROMPT.md`

### 任务背景
说明为什么要拆给 DeepSeek。

### 任务目标
- 
- 

### 允许修改文件
- 

### 禁止修改文件
- 

### 输入材料
- 

### 输出要求
- 

### Codex 审核重点
- 

### 状态
待执行 / 已提交 / Codex 审核中 / 已合并 / 已拒绝
```

---

## 当前任务

暂无。