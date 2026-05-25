import { GameApp } from './app/GameApp.js';

const app = new GameApp({
  root: document.getElementById('game-root')
});

app.start();
