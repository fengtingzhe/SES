# UNITY_SOURCE：Unity 源码学习 / 改造工作区

## 定位

`UNITY_SOURCE/` 用于保存从外部找到的 Unity 源码项目，以及围绕这些源码进行的体检、兼容性修复、结构学习和小步改造记录。

这是当前工作流的第二阶段：

```text
v1.x = Unity 源码学习 / 改造阶段
```

目标不是从 0 创建 Unity 项目，而是先跑通已有源码，学习真实 Unity 工程结构。

---

## 推荐结构

```text
UNITY_SOURCE/
├── README.md
├── SOURCE_AUDIT.md
├── COMPATIBILITY_LOG.md
├── STRUCTURE_NOTES.md
├── MODIFY_PLAN.md
├── OriginalSource/
├── ModifiedSource/
├── Docs/
├── Tests/
└── Temp/
```

---

## 放什么

- Unity 源码候选项目；
- 原始源码快照或导入说明；
- AI 修复后的源码版本；
- Unity 版本检查；
- 许可证检查；
- 兼容性修复记录；
- 项目结构分析；
- 小步改造计划。

---

## 不放什么

- 不放 Web Demo 源码；
- 不放最终自建 Unity 项目；
- 不放许可证不清的资源；
- 不在源码未跑通前做大规模改造。

---

## 规则来源

详细规则见：

```text
DESIGN_HUB/16_UNITY_SOURCE_WORKFLOW.md
```