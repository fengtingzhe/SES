# design/inbox：专题对话同步草稿区

本目录用于接收《看海去》各专题对话产出的阶段性方案草稿。

这里不是 Codex 的默认读取目录，也不是正式设计文档目录。

---

## 定位

```text
专题对话负责：深入讨论某个领域，并把结论写成草稿文件。
主控对话负责：读取草稿、判断冲突、整理归档、写入正式文件。
Codex 负责：只读取当前任务卡和明确指定的设计文件，不默认读取 inbox。
```

也就是说：

```text
WEB_DEMO/design/inbox/ = 临时同步草稿区
WEB_DEMO/design/systems/ = 正式系统设计文档区
WEB_DEMO/design/production/ = 正式版本规划 / 制作管理文档区
WEB_DEMO/docs/codex_tasks.md = 当前 Codex 执行任务卡
```

---

## 使用流程

1. 在专题对话中完成某个领域的讨论，例如数据结构、地图设计、黑影系统、工人系统、奇遇设计。
2. 让专题对话按照本文件下方模板生成一份 Markdown 草稿。
3. 将草稿保存到本目录，例如：

```text
WEB_DEMO/design/inbox/data_structure_v1_draft.md
WEB_DEMO/design/inbox/map_generation_v1_draft.md
WEB_DEMO/design/inbox/monster_system_v1_draft.md
WEB_DEMO/design/inbox/worker_system_v1_draft.md
WEB_DEMO/design/inbox/event_system_v1_draft.md
```

4. 告诉主控对话草稿文件路径。
5. 主控对话读取草稿，判断是否与当前版本、任务卡、已有文档冲突。
6. 主控对话将通过审核的内容整理写入正式文件，例如：

```text
WEB_DEMO/design/systems/data_structure_v1.md
WEB_DEMO/design/systems/map_generation_v1.md
WEB_DEMO/design/systems/monster_system_v1.md
WEB_DEMO/design/production/roadmap.md
WEB_DEMO/docs/codex_tasks.md
```

---

## 重要规则

```text
1. inbox 中的内容是草稿，不是最终事实来源。
2. Codex 不应默认读取 inbox 文件。
3. inbox 文件中的方案必须经过主控对话审核后，才可以进入正式设计文档或任务卡。
4. 草稿可以保留讨论结论，但不要保留完整聊天记录。
5. 草稿必须写清楚方案版本、适用范围、是否影响当前 Codex 任务。
6. 如果草稿内容与当前任务卡冲突，优先以当前任务卡为准，除非主控对话明确更新任务卡。
7. 专题对话可以生成草稿，但不应直接改正式设计文件。
```

---

# 专题对话同步草稿模板

请专题对话按以下格式输出 Markdown 文件。

文件名建议：

```text
主题名_版本_draft.md
```

例如：

```text
data_structure_v1_draft.md
map_generation_v1_draft.md
monster_system_v1_draft.md
```

---

```markdown
# 看海去｜专题同步草稿

## 方案名称

例如：数据结构方案 / 地图生成方案 / 黑影系统方案

## 方案版本

例如：v1.0 / v1.1 / draft-2026-xx-xx

## 来源对话

例如：看海去｜数据结构

## 适用范围

说明本方案影响哪些系统，例如：

- WEB_DEMO GameConfig
- 地图生成
- 黑影 AI
- 工人派遣
- 营地系统
- 后续 CSV / JSON 拆分

---

## 一、核心结论

用 3～10 条写清楚本次讨论最终达成的结论。

1.
2.
3.

---

## 二、详细设计

展开说明具体设计。

建议结构：

### 2.1 当前阶段做什么

### 2.2 当前阶段不做什么

### 2.3 关键规则

### 2.4 字段 / 参数 / 状态设计

### 2.5 与现有版本的关系

---

## 三、建议写入的 GitHub 正式文件

列出建议由主控对话整理后写入的正式文件。

例如：

```text
WEB_DEMO/design/systems/data_structure_v1.md
WEB_DEMO/design/systems/map_generation_v1.md
WEB_DEMO/docs/codex_tasks.md
WEB_DEMO/docs/known_issues.md
WEB_DEMO/docs/acceptance_tests.md
```

---

## 四、是否影响当前 Codex 任务

填写：是 / 否

如果是，请说明：

1. 影响哪个当前任务。
2. 需要新增哪些约束。
3. 是否需要修改验收标准。
4. 是否需要暂停或调整当前开发方向。

---

## 五、对 Codex 的约束

写成可执行规则。

例如：

1. 所有静态数值必须写入 GameConfig。
2. 不允许在系统文件中新增散落常量。
3. GameConfig 字段必须有中文注释。
4. 当前版本不做 CSV / JSON 拆分。

---

## 六、与现有版本规划是否冲突

填写：

```text
不冲突
```

或：

```text
有冲突，冲突点如下：
1.
2.
3.
```

---

## 七、建议由主控对话执行的操作

例如：

1. 创建或更新某个正式设计文档。
2. 更新当前 Codex 任务卡。
3. 更新 known_issues。
4. 更新 acceptance_tests。
5. 暂不入库，仅作为后续参考。

---

## 八、暂不执行 / 后续再做

记录本次讨论中明确不进入当前版本的内容。

1.
2.
3.

---

## 九、需要主控对话重点判断的问题

列出专题对话无法自行决定、需要主控对话统一判断的问题。

1.
2.
3.
```

---

## 草稿进入正式文件后的处理

草稿被主控对话整理入正式文件后，可以保留在 inbox 中作为历史记录。

如果草稿已经完全过期，可以由主控对话后续移动到：

```text
WEB_DEMO/design/inbox/archive/
```

当前阶段不强制归档。
