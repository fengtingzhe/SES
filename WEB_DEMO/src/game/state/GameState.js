import { MapGenerator } from '../world/MapGenerator.js';

export class GameState {
  static createNew() {
    return new GameState(MapGenerator.generate());
  }

  constructor(world) {
    this.version = 'WEB_DEMO v0.2';
    this.map = world.map;
    this.start = world.start;
    this.goal = world.goal;
    this.camps = world.camps;
    this.workers = world.workers;
    this.looseStones = world.looseStones;
    this.player = {
      x: world.start.x,
      y: world.start.y,
      dir: { x: 1, y: 0 },
      speed: 4.2,
      stones: 0
    };
    this.camera = { x: this.player.x, y: this.player.y };
    this.time = 0;
    this.day = 1;
    this.phase = 'day';
    this.phaseLabel = '白天';
    this.hover = null;
    this.message = {
      text: '收集辉石，按 Space 派遣工人开路，向远方信标前进。',
      timer: 5
    };
    this.goalReached = false;
    this.nextStoneId = 100;
  }

  addMessage(text, duration = 3) {
    this.message = { text, timer: duration };
  }

  updateMessage(dt) {
    if (this.message.timer > 0) {
      this.message.timer = Math.max(0, this.message.timer - dt);
    }
  }

  getWorkerSummary() {
    const summary = {
      idle: 0,
      moving: 0,
      working: 0,
      returning: 0
    };

    for (const worker of this.workers) {
      summary[worker.state] += 1;
    }

    return summary;
  }
}
