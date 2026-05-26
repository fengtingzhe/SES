import { directionLabel } from '../../game/utils/grid.js';
import { GameConfig } from '../../game/config/GameConfig.js';
import { TileType } from '../../game/world/TileMap.js';

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
    const fleeingWorkers = state.workers.filter(worker => !worker.lost && worker.flee).length;
    const miningWorkers = state.workers.filter(worker => !worker.lost && worker.state === 'mining').length;
    const lostWorkers = state.workers.filter(worker => worker.lost).length;
    const returningRefugees = state.refugees.filter(refugee => !refugee.done).length;
    const unassignedPopulation = state.population.unassigned.length;
    const archers = state.archers.filter(archer => !archer.lost).length;
    const refugeeFires = this.countRefugeeFires(state);
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
        <span>采矿：<b>${miningWorkers}</b></span>
        <span>待转职：<b>${unassignedPopulation}</b></span>
        <span>返程流民：<b>${returningRefugees}</b></span>
        <span>弓箭手：<b>${archers}</b></span>
        <span>流民火堆：<b>${refugeeFires.available}</b> 可招募 / <b>${refugeeFires.cooling}</b> 冷却</span>
        <span>撤退：<b>${fleeingWorkers}</b></span>
        <span>失踪：<b>${lostWorkers}</b></span>
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

  countRefugeeFires(state) {
    let available = 0;
    let cooling = 0;

    state.world.map.forEach(tile => {
      if (tile.type !== TileType.REFUGEE_FIRE) return;
      if (tile.refugee?.available) {
        available += 1;
        return;
      }
      if ((tile.refugee?.cooldown ?? 0) > 0) cooling += 1;
    });

    return { available, cooling };
  }
}
