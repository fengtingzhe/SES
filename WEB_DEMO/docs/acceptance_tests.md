# Acceptance Tests

本文件记录 WEB_DEMO 的人工验收标准。

## 通用验收模板

```text
测试名称：
前置条件：
操作步骤：
预期结果：
实际结果：
是否通过：
备注：
```

## 工程骨架验收

```text
测试名称：WEB_DEMO 工程启动
前置条件：已安装 Node.js
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
预期结果：页面显示 WEB_DEMO Template Ready，无控制台报错
```

## v0.2 核心循环验收

```text
测试名称：WEB_DEMO v0.2 核心循环
前置条件：已安装 Node.js
操作步骤：
1. 进入 WEB_DEMO 目录
2. 执行 npm install
3. 执行 npm run dev
4. 打开浏览器
5. 使用 WASD / 方向键移动主角
6. 靠近辉石并确认 HUD 辉石数量增加
7. 在无互动目标时按 Space 放置辉石，确认地面出现辉石光点并会随时间消失
8. 靠近树障按 Space 派遣工人，等待砍树完成
9. 靠近断桥按 Space 派遣工人，等待修桥完成
10. 靠近旧营地按 Space 派遣工人，等待营地点亮
11. 观察 HUD 中第几天和昼夜阶段变化，夜晚画面变暗
12. 抵达远方信标
预期结果：
1. 浏览器控制台无 JavaScript 报错
2. 玩家可以移动
3. 小型地图可生成并包含部落、树障、河流、断桥、旧营地、目标点
4. 辉石拾取、放置和限时消失可用
5. 工人可执行 idle / moving / working / returning 状态流转
6. 砍树后树障变为可通行地面，并掉落 1 个辉石
7. 修桥后断桥变为可通行桥
8. 点亮营地后地图上有明显营火表现
9. 工人完成任务后返回部落或已激活营地
10. 抵达目标后显示“你抵达了阶段终点。”
11. WEB_DEMO/index.html 仍只加载 /src/main.js
12. WEB_DEMO/src/main.js 未堆积大量游戏逻辑
```
