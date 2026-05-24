# UNITY_PROJECT：Unity 独立原型工作区

## 定位

`UNITY_PROJECT/` 用于未来保存自建 Unity 原型项目。

这是当前工作流的第三阶段：

```text
v2.x = Unity 独立原型阶段
```

只有在 Web Demo 已验证玩法、Unity 源码学习阶段已跑通至少一个参考项目，并且策划确认需要自建 Unity 原型后，才建议使用本目录。

---

## 推荐结构

```text
UNITY_PROJECT/
├── README.md
└── YourUnityPrototype/
    ├── Assets/
    ├── Packages/
    └── ProjectSettings/
```

---

## 放什么

- 未来自建 Unity 原型项目；
- 核心场景；
- 核心 UI；
- 核心玩法系统；
- 正式工程配置；
- 自建项目相关资源。

---

## 不放什么

- 不放 Web Demo 源码；
- 不放外部 Unity 源码候选项目；
- 不在未进入 v2.x 前创建复杂 Unity 工程；
- 不把外部源码和自建项目混在一起。

---

## 进入条件

进入本阶段前，应满足：

- Web Demo 核心玩法已验证；
- 至少一个 Unity 源码项目已经跑通；
- 已完成源码结构分析；
- 已完成若干小步改造；
- 策划确认需要创建自己的 Unity 原型；
- 已明确最小可运行范围。