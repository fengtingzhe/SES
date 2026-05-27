import { GameConfig } from '../config/GameConfig.js';
import { createRandom } from '../utils/random.js';

export class WeatherSystem {
  constructor(showMessage, random = createRandom(GameConfig.weather.seed)) {
    this.showMessage = showMessage;
    this.random = random;
  }

  update(state, dt) {
    this.updateActiveWeather(state, dt);

    if (state.weather.current) return;
    if (state.time.phase !== GameConfig.weather.rollPhase) return;
    if (state.weather.dayRolled === state.time.day) return;

    state.weather.dayRolled = state.time.day;
    if (this.random() >= GameConfig.weather.dailyChance) return;

    this.startWeather(state, this.pickWeatherType());
  }

  updateActiveWeather(state, dt) {
    if (!state.weather.current) return;

    state.weather.remaining = Math.max(0, state.weather.remaining - dt);
    if (state.weather.remaining > 0) return;

    const finishedType = state.weather.current;
    Object.assign(state.weather, {
      current: null,
      remaining: 0,
      duration: 0
    });

    const label = GameConfig.weather.types[finishedType]?.name ?? '天气';
    this.showMessage(`${label}停了。`);
  }

  startWeather(state, type) {
    const config = GameConfig.weather.types[type];
    if (!config) return;

    const duration = this.randomDuration(config.durationSeconds);
    Object.assign(state.weather, {
      current: type,
      remaining: duration,
      duration
    });

    state.weather.history.unshift({
      day: state.time.day,
      type,
      duration
    });
    state.weather.history = state.weather.history.slice(0, GameConfig.weather.historyLimit);

    this.showMessage(`天气变化：${config.name}。`);
  }

  pickWeatherType() {
    const entries = Object.entries(GameConfig.weather.types);
    const totalWeight = entries.reduce((sum, [, config]) => sum + config.weight, 0);
    let roll = this.random() * totalWeight;

    for (const [type, config] of entries) {
      roll -= config.weight;
      if (roll <= 0) return type;
    }

    return entries[entries.length - 1][0];
  }

  randomDuration([min, max]) {
    return min + this.random() * (max - min);
  }
}
