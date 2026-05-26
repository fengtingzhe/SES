import { directionLabel } from '../../game/utils/grid.js';

export class HudRenderer {
  constructor(hudElement, toastElement) {
    this.hudElement = hudElement;
    this.toastElement = toastElement;
  }

  render(state) {
    const position = `${state.player.x.toFixed(1)}, ${state.player.y.toFixed(1)}`;
    const facing = directionLabel(state.player.facing);
    const hint = state.hover?.label ?? '面前/附近无可互动目标；Space 可放置辉石';

    this.hudElement.innerHTML = `
      <h1>${state.version}</h1>
      <div class="hud-row">
        <span>辉石：<b>${state.resources.stone}</b></span>
        <span>位置：<b>${position}</b></span>
        <span>朝向：<b>${facing}</b></span>
        <span>基础工人预留：<b>${state.population.reservedWorkers}</b></span>
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
