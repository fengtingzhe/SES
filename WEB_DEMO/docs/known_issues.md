# Known Issues

本文件记录 WEB_DEMO 当前已知问题。

## 问题模板

```text
问题名称：
严重程度：
复现步骤：
预期结果：
实际结果：
相关文件：
当前状态：
备注：
```

## 已修复

### WEB_DEMO/index.html 曾是旧版单文件 Demo

```text
严重程度：高
问题：WEB_DEMO/index.html 内嵌旧版可玩 Demo 的 CSS 与 JS，没有加载 /src/main.js。
影响：npm run dev 打开的不是 Vite + src/main.js 工程骨架，docs/acceptance_tests.md 的验收标准不成立。
修复：已将 WEB_DEMO/index.html 恢复为 Vite 薄入口，只加载 /src/main.js。
备注：旧版单文件 Demo 可从 Git 历史中找回；本次未从截断 diff 中创建 legacy 备份，避免恢复不完整文件。
```

## 当前已知问题

暂无。后续试玩反馈和技术债记录在此。
