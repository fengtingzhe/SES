import { GameConfig } from '../config/GameConfig.js';
import { createRandom } from '../utils/random.js';
import { TileType } from '../world/TileMap.js';

export class WeatherEventSystem {
  constructor(showMessage, random = createRandom(GameConfig.weatherEvents.seed)) {
    this.showMessage = showMessage;
    this.random = random;
    this.handlers = {
      rainRefugee: this.triggerRainRefugee.bind(this)
    };
  }

  update(state, dt) {
    if (!state.weather.current) {
      state.weatherEvents.checkTimer = 0;
      return;
    }

    state.weatherEvents.checkTimer += dt;
    if (state.weatherEvents.checkTimer < GameConfig.weatherEvents.checkIntervalSeconds) return;
    state.weatherEvents.checkTimer = 0;

    const regionTags = this.getPlayerRegionTags(state);
    for (const rule of GameConfig.weatherEvents.rules) {
      if (!this.canTriggerRule(state, rule, regionTags)) continue;

      const handler = this.handlers[rule.eventId];
      if (!handler) continue;

      const result = handler(state, rule);
      if (!result) continue;

      const record = {
        id: rule.id,
        eventId: rule.eventId,
        label: result.label,
        weather: state.weather.current,
        day: state.time.day,
        x: result.x,
        y: result.y
      };

      state.weatherEvents.lastTriggeredDay[rule.id] = state.time.day;
      state.weatherEvents.lastEvent = record;
      state.weatherEvents.history.unshift(record);
      state.weatherEvents.history = state.weatherEvents.history.slice(0, GameConfig.weatherEvents.historyLimit);
      this.showMessage(result.message);
      return;
    }
  }

  canTriggerRule(state, rule, regionTags) {
    if (rule.weather !== state.weather.current) return false;
    if (!regionTags.has(rule.regionTag)) return false;

    const lastDay = state.weatherEvents.lastTriggeredDay[rule.id];
    if (lastDay != null && state.time.day - lastDay < rule.cooldownDays) return false;

    return this.random() < rule.chance;
  }

  getPlayerRegionTags(state) {
    const tags = new Set();
    const radius = GameConfig.weatherEvents.regionScanRadius;
    const px = Math.round(state.player.x);
    const py = Math.round(state.player.y);

    for (let y = py - radius; y <= py + radius; y += 1) {
      for (let x = px - radius; x <= px + radius; x += 1) {
        const tile = state.world.map.cell(x, y);
        if (!tile) continue;
        const tag = tile.regionTag ?? this.inferRegionTag(tile);
        if (tag) tags.add(tag);
      }
    }

    return tags;
  }

  inferRegionTag(tile) {
    if (tile.type === TileType.INVERTED_FOREST) return 'invertedForest';
    if (tile.type === TileType.WATER || tile.type === TileType.BROKEN_BRIDGE || tile.type === TileType.BRIDGE) return 'river';
    if (tile.type === TileType.VILLAGE || tile.type === TileType.CAMP) return 'camp';
    if (tile.type === TileType.FOREST || tile.type === TileType.GROUND) return 'forest';
    return null;
  }

  triggerRainRefugee(state, rule) {
    const point = this.findSpawnPoint(state);
    if (!point) return null;

    const tile = state.world.map.cell(point.x, point.y);
    const regionTag = tile.regionTag ?? 'forest';
    state.world.map.setTile(point.x, point.y, TileType.REFUGEE_FIRE, {
      regionTag,
      refugee: { available: true, cooldown: 0 },
      event: {
        type: 'weatherEvent',
        ruleId: rule.id,
        eventId: rule.eventId
      }
    });

    return {
      label: '雨中流民',
      message: '雨中有人靠近，附近出现了流民火堆。',
      x: point.x,
      y: point.y
    };
  }

  findSpawnPoint(state) {
    const map = state.world.map;
    const px = Math.round(state.player.x);
    const py = Math.round(state.player.y);
    const radius = GameConfig.weatherEvents.spawnSearchRadius;

    for (let r = 1; r <= radius; r += 1) {
      for (let y = py - r; y <= py + r; y += 1) {
        for (let x = px - r; x <= px + r; x += 1) {
          if (Math.max(Math.abs(x - px), Math.abs(y - py)) !== r) continue;
          const tile = map.cell(x, y);
          if (!tile || tile.type !== TileType.GROUND || tile.reserved) continue;
          return { x, y };
        }
      }
    }

    return null;
  }
}
