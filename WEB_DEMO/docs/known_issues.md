# Known Issues

## 旧 WEB_DEMO v0.2～v0.6 路线已废弃

严重程度：高

问题：
旧 WEB_DEMO 路线是在重新开发一套类似 GPT_DEMO 的功能，而不是理解并重构 GPT_DEMO。

影响：
如果继续沿用旧路线，GPT_DEMO 阶段已经验证过的玩法规则、交互逻辑和体验节奏可能无法被继承，导致 GPT_DEMO 的开发价值被削弱。

当前状态：
已决定废弃旧路线，并从 v0.1-refactor 重新开始 WEB_DEMO 阶段。

处理方式：
1. 删除旧 WEB_DEMO 运行代码。
2. 重新定义 WEB_DEMO 阶段目标。
3. 先提取 GPT_DEMO 规则基线。
4. 再基于规则基线重构 WEB_DEMO。

## 当前 WEB_DEMO 暂不可运行

严重程度：中

问题：
v0.1-refactor 阶段不包含可运行游戏工程。

影响：
当前不能执行 npm run dev，也不能试玩 WEB_DEMO。

当前状态：
这是有意设计。当前目标是重新建立正确的阶段目标和规则基线。

后续处理：
在 GPT_DEMO 规则基线和重构策略确认后，再重新创建 WEB_DEMO 可运行工程。
