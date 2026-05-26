import { directionLabel } from '../../game/utils/grid.js';
import { GameConfig } from '../../game/config/GameConfig.js';

export class HudRenderer {
  constructor(hudElement, toastElement) {
    this.hudElement = hudElement;
    this.toastElement = toastElement;
  }

  render(state) {
    const position = `${state.player.x.toFixed(1)}, ${state.player.y.toFixed(1)}`;
    const facing = directionLabel(state.player.facing);
    const hint = state.hover?.label ?? '面前/附近无可互动目标；Space 可放置辉石';
    const totalWorkers = state.workers.filter(worker => !worker.lost).length;
    const idleWorkers = state.workers.filter(worker => !worker.lost && worker.state === 'idle').length;
    const busyWorkers = totalWorkers - idleWorkers;
    const phaseText = state.time.phase === 'night'
      ? '夜晚'
      : state.time.phase === 'dusk'
        ? '黄昏'
        : '白天';

    this.hudElement.innerHTML = `
      <h1>${state.version}</h1>
      <div class="hud-row">
        <span>第 <b>${state.time.day}</b> 天</span>
        <span>阶段：<b>${phaseText}</b></span>
        <span>辉石：<b>${state.resources.stone}</b></span>
        <span>位置：<b>${position}</b></span>
        <span>朝向：<b>${facing}</b></span>
        <span>工人：<b>${idleWorkers}/${totalWorkers}</b> 空闲</span>
        <span>任务中：<b>${busyWorkers}</b></span>
        <span>家园：<b>${state.homes.length}</b></span>
        <span>黑影：<b>${state.monsters.length}</b>（本夜 <b>${state.monsterSpawn.spawnedThisNight}/${GameConfig.monster.perNight}</b>）</span>
      </div>
      <div class="hint">当前提示：<b>${hint}</b></div>
    `;

    if (state.message.ttl > 0 && state.message.text) {
      this.toastElement.textContent = state.message.text;
      this.toastElement.classList.add('is-visible');
    } else {
      this.toastElement.classList.remove('is-visible');
    }
  }
}
