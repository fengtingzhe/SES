# Changelog

本文件记录 WEB_DEMO 的版本更新。

## v0.4.0

状态：夜晚黑影压力系统

内容：
- 新增黑雾口与黑影实体。
- 夜晚从黑雾口生成黑影。
- 黑影默认朝最近已点亮营地或起点部落行进。
- 黑影只在 4 格局部范围内感知玩家放置的辉石、外出工人和玩家。
- 放置辉石可以吸引并驱散黑影。
- 黑影可以抓走外出工人。
- 工人被抓后释放任务目标的 reserved 状态，并预留未来占用字段清理。
- 黑影相关静态配置集中在 GameConfig.monster，并配有中文注释。

## v0.3.0

状态：GameConfig 基础配置集中化

内容：
- 新增 `WEB_DEMO/src/game/config/GameConfig.js`。
- 将 v0.2.1 中散落在系统代码中的主要静态数值集中到 GameConfig。
- 玩家、工人、任务、辉石、昼夜、地图生成和基础文案开始从 GameConfig 读取。
- 为 GameConfig 的关键字段补充中文注释，说明字段用途、单位、影响范围和调参风险。
- 不做 CSV / JSON 读取，GameConfig 作为未来拆分配置文件前的中间层。

## v0.2.1

状态：地图轻随机修正

内容：
- 为 MapGenerator.generate() 加入轻随机。
- 树障、河流 / 断桥、旧营地、辉石和森林簇位置不再完全固定。
- 保留起点在左侧、终点在右侧、主路径可推进的结构。
- 修正 v0.2 中“地图可以随机生成”验收项未完全满足的问题。

## v0.2.0

状态：核心循环迁移

内容：
- 实现主角移动
- 实现小型随机地图
- 实现辉石拾取与放置
- 实现工人派遣
- 实现砍树
- 实现修桥
- 实现点亮营地
- 实现日夜循环
- 实现阶段目标

说明：
- `WEB_DEMO/index.html` 保持薄入口，只加载 `/src/main.js`。
- `src/main.js` 只负责启动 `GameApp`，玩法逻辑拆分到 `src/app`、`src/engine`、`src/game` 和 `src/presentation`。
- 本版本不迁移黑影、围墙、弓箭手、矿山、流民火堆、狐狸奇遇、颠倒森林、移动端操作、正式资源、音频、CSV 读取或存档系统。

## v0.1.1

状态：工程入口修正

内容：
- 修复 `WEB_DEMO/index.html` 仍是旧版单文件 Demo 的问题。
- 恢复 `WEB_DEMO/index.html` 为 Vite 薄入口，只加载 `/src/main.js`。
- 明确当前运行入口为 `index.html -> src/main.js`。
- 更新 `WEB_DEMO/README.md`，删除旧的 `game.js` / `styles.css` / `Data/config` 推荐结构。

说明：
- 旧版单文件 Demo 的完整内容可从 Git 历史中找回。
- 本次未强行创建 `WEB_DEMO/legacy/single_file_v0.1.html`，避免从截断 diff 中恢复出不完整文件。

## v0.1.0

状态：工程骨架阶段

内容：
- 创建 Vite + Canvas 最小工程
- 创建 public/assets 资源目录
- 创建 CSV 示例目录
- 创建 src 模块目录
- 创建 docs / design / saves / tests 目录
