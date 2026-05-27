import { directionLabel } from '../../game/utils/grid.js';
import { GameConfig } from '../../game/config/GameConfig.js';
import { TileType } from '../../game/world/TileMap.js';

export class HudRenderer {
  constructor(hudElement, toastElement, phaseBannerElement = null) {
    this.hudElement = hudElement;
    this.toastElement = toastElement;
    this.phaseBannerElement = phaseBannerElement;
  }

  render(state) {
    const position = `${state.player.x.toFixed(GameConfig.ui.positionDecimals)}, ${state.player.y.toFixed(GameConfig.ui.positionDecimals)}`;
    const facing = directionLabel(state.player.facing);
    const hint = state.hover?.label ?? '面前/附近无可互动目标；Space 可放置辉石';
    const totalWorkers = state.workers.filter(worker => !worker.lost).length;
    const idleWorkers = state.workers.filter(worker => !worker.lost && worker.state === 'idle').length;
    const fleeingWorkers = state.workers.filter(worker => !worker.lost && worker.flee).length;
    const waitingResumeWorkers = state.workers.filter(worker => !worker.lost && worker.state === 'waitingResume').length;
    const miningWorkers = state.workers.filter(worker => !worker.lost && worker.state === 'mining').length;
    const lostWorkers = state.workers.filter(worker => worker.lost).length;
    const returningRefugees = state.refugees.filter(refugee => !refugee.done).length;
    const unassignedPopulation = state.population.unassigned.length;
    const archers = state.archers.filter(archer => !archer.lost).length;
    const aimingArchers = state.archers.filter(archer => !archer.lost && archer.state === 'aim').length;
    const coolingArchers = state.archers.filter(archer => !archer.lost && archer.state === 'cooldown').length;
    const refugeeFires = this.countRefugeeFires(state);
    const walls = this.countWalls(state);
    const foxWedding = this.foxWeddingStatus(state);
    const assistHint = this.assistHint(state);
    const weatherText = this.weatherText(state);
    const weatherEventText = state.weatherEvents.lastEvent?.label ?? '无';
    const busyWorkers = totalWorkers - idleWorkers;
    const statusText = this.statusText(state.status);
    const phaseText = state.time.phase === 'night'
      ? '黑夜'
      : state.time.phase === 'dusk'
        ? '黄昏'
        : '白天';
    const phaseClass = `phase-status--${state.time.phase}`;
    const weatherClass = `weather-status--${state.weather.current ?? 'clear'}`;
    this.renderPhaseBanner(phaseText, phaseClass, weatherText, weatherClass);

    this.hudElement.innerHTML = `
      <h1>${state.version}</h1>
      <div class="hud-row">
        <span>第 <b>${state.time.day}</b> 天</span>
        <span>阶段：<b>${phaseText}</b></span>
        <span>天气：<b>${weatherText}</b></span>
        <span>状态：<b>${statusText}</b></span>
        <span>辉石：<b>${state.resources.stone}</b></span>
        <span>位置：<b>${position}</b></span>
        <span>朝向：<b>${facing}</b></span>
        <span>颠倒森林：<b>${state.player.controlInverted ? '方向反转' : '正常'}</b></span>
        <span>工人：<b>${idleWorkers}/${totalWorkers}</b> 空闲</span>
        <span>采矿：<b>${miningWorkers}</b></span>
        <span>待转职：<b>${unassignedPopulation}</b></span>
        <span>返程流民：<b>${returningRefugees}</b></span>
        <span>弓箭手：<b>${archers}</b>（瞄准 <b>${aimingArchers}</b> / 冷却 <b>${coolingArchers}</b>）</span>
        <span>围墙：<b>${walls.total}</b>（受损 <b>${walls.damaged}</b>）</span>
        <span>流民火堆：<b>${refugeeFires.available}</b> 可招募 / <b>${refugeeFires.cooling}</b> 冷却</span>
        <span>撤退：<b>${fleeingWorkers}</b></span>
        <span>待复工：<b>${waitingResumeWorkers}</b></span>
        <span>失踪：<b>${lostWorkers}</b></span>
        <span>任务中：<b>${busyWorkers}</b></span>
        <span>家园：<b>${state.homes.length}</b></span>
        <span>黑影：<b>${state.monsters.length}</b>（本夜 <b>${state.monsterSpawn.spawnedThisNight}/${GameConfig.monster.perNight}</b>）</span>
        <span>狐狸婚仪：<b>${foxWedding}</b></span>
        <span>天气事件：<b>${weatherEventText}</b></span>
        <span>小地图：<b>${state.ui?.showMiniMap ? '显示' : '隐藏'}</b></span>
      </div>
      <div class="hint">当前提示：<b>${hint}</b></div>
      <div class="hint">辅助信息：<b>${assistHint}</b></div>
      <div class="hint">快捷键：<b>Space 互动 / 放置辉石 · R 重置 · F3 或 M 小地图</b></div>
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

  renderPhaseBanner(phaseText, phaseClass, weatherText, weatherClass) {
    if (!this.phaseBannerElement) return;

    this.phaseBannerElement.className = `phase-banner ${phaseClass}`;
    this.phaseBannerElement.innerHTML = `
      <span class="phase-banner__row">
        <span class="phase-icon" aria-hidden="true"></span>
        <span class="phase-banner__text">阶段：<b>${phaseText}</b></span>
      </span>
      <span class="phase-banner__row phase-banner__row--weather ${weatherClass}">
        <span class="weather-icon" aria-hidden="true"></span>
        <span class="phase-banner__text">天气：<b>${weatherText}</b></span>
      </span>
    `;
  }

  countWalls(state) {
    let total = 0;
    let damaged = 0;

    state.world.map.forEach(tile => {
      if (tile.type !== TileType.WALL) return;
      total += 1;
      if ((tile.hp || 0) < GameConfig.wall.maxHp) damaged += 1;
    });

    return { total, damaged };
  }

  statusText(status) {
    if (status === 'completed') return '已看见海';
    if (status === 'failed') return '旅程中断';
    return '进行中';
  }

  weatherText(state) {
    if (!state.weather.current) return '晴 / 无天气';

    const config = GameConfig.weather.types[state.weather.current];
    const label = config?.name ?? state.weather.current;
    return `${label} ${Math.ceil(state.weather.remaining)}s`;
  }

  assistHint(state) {
    if (state.status === 'completed') return '阶段目标完成，按 R 可重新开始。';
    if (state.status === 'failed') return '辉石耗尽或旅程中断，按 R 重新开始。';

    const event = state.events.foxWedding;
    if (event.active) {
      const moving = event.timer % GameConfig.events.foxWedding.moveCycleSeconds < GameConfig.events.foxWedding.moveSeconds;
      return moving ? '狐狸队伍移动中，保持跟随。' : '狐狸队伍停下了，停住不要乱动。';
    }

    if (state.player.controlInverted) return '颠倒森林中，玩家移动输入方向反转。';

    const waitingResumeWorkers = state.workers.filter(worker => !worker.lost && worker.state === 'waitingResume').length;
    if (waitingResumeWorkers > 0) return '采矿工人正等待原矿山附近安全后自动复工。';

    const hintDistances = GameConfig.ui.assistHintDistances;
    const nearbyStone = this.nearestTile(state, tile => tile.type === TileType.STONE && !tile.placed, hintDistances.naturalStone);
    if (nearbyStone) return '靠近自然辉石会自动拾取。';

    const nearbyPlacedStone = this.nearestTile(state, tile => tile.type === TileType.STONE && tile.placed, hintDistances.placedStone);
    if (nearbyPlacedStone) return '临时辉石不会自动拾回，需要 Space 主动拾回。';

    const nearbyFog = this.nearestTile(state, tile => tile.type === TileType.FOG, hintDistances.fogGate);
    if (nearbyFog) return '雾门是夜晚黑影来源，靠近营地时需提前防守。';

    const nearbyGoal = this.nearestTile(state, tile => tile.type === TileType.GOAL, hintDistances.goal);
    if (nearbyGoal) return '远方灯塔是看海目标，靠近后按 Space 完成阶段目标。';

    if (state.time.phase === 'night') return '夜晚黑影会从雾门出现，辉石可诱导黑影。';
    return '探索、收集辉石、派工建设，并向远方灯塔推进。';
  }

  nearestTile(state, predicate, maxDistance) {
    let best = null;
    state.world.map.forEach((tile, x, y) => {
      if (!tile.discovered || !predicate(tile)) return;
      const d = Math.hypot(state.player.x - x, state.player.y - y);
      if (d <= maxDistance && (!best || d < best.distance)) {
        best = { tile, x, y, distance: d };
      }
    });
    return best;
  }

  foxWeddingStatus(state) {
    const event = state.events.foxWedding;
    if (event.active) return `进行中 ${Math.ceil(event.timer)}s`;
    if (event.lastResult === 'success') return '成功 +4';
    if (event.lastResult === 'failed') return '失败';

    let pending = 0;
    state.world.map.forEach(tile => {
      if (tile.type === TileType.FOX_WEDDING) pending += 1;
    });
    return pending > 0 ? '可触发' : '未触发/已结束';
  }
}
