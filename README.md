# Catty

一个像素风「找猫猫」网页小游戏，用你家猫的照片做发现奖励。

## 本地运行

```bash
npm start
```

然后打开：

```text
http://localhost:3000
```

页面会调用 Node API 记录服务器启动后的全站找猫次数。

## 项目结构

- `index.html`：游戏页面
- `styles.css`：像素风界面
- `game.js`：关卡、点击判定、计时和音效
- `server.js`：Render Web Service 入口和动态 API
- `package.json`：Node 启动配置
- `assets/`：猫猫照片素材
