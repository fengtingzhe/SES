import './styles.css';
import { GameApp } from './app/GameApp.js';

const app = new GameApp(document.querySelector('#app'));
app.start();
