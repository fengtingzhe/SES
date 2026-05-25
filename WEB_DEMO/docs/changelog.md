# Changelog

本文件记录 WEB_DEMO 的版本更新。

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
