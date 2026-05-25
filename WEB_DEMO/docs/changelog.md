# Changelog

本文件记录 WEB_DEMO 的版本更新。

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
