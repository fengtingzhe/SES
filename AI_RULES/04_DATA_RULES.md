# 04_DATA_RULES：数据配置规则

## 原则

- 数值优先来自 `Data/`；
- 不要把核心数值硬编码在脚本里；
- 配置字段要有清楚含义；
- 修改字段结构前必须确认；
- 配置变更要记录在 `AI_TASKS/CHANGELOG.md`；
- 不确定字段含义时，写入 `DESIGN_HUB/10_OPEN_QUESTIONS.md`。

---

## 推荐数据目录

```text
Data/
├── config/
├── levels/
├── characters/
├── enemies/
├── items/
├── skills/
├── rewards/
├── economy/
├── localization/
└── mock/
```

---

## 应优先配置化的内容

```text
关卡参数；
角色属性；
敌人属性；
建筑参数；
资源产出；
技能参数；
道具参数；
奖励数量；
掉落概率；
成长曲线；
经济参数；
UI 文案；
多语言文本。
```

---

## 禁止行为

- 不要随意删除配置字段；
- 不要擅自改字段含义；
- 不要在代码里重复维护另一套数值；
- 不要在脚本中写死核心经济参数。