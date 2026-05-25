import { MapGenerator } from '../world/MapGenerator.js';
import { GameConfig } from '../config/GameConfig.js';

export class GameState {
  static createNew() {
    return new GameState(MapGenerator.generate());
  }

  constructor(world) {
    this.version = GameConfig.version;
    this.map = world.map;
    this.start = world.start;
    this.goal = world.goal;
    this.fogGates = world.fogGates || [];
    this.camps = world.camps;
    this.workers = world.workers;
    this.looseStones = world.looseStones;
    this.player = {
      x: world.start.x,
      y: world.start.y,
      dir: { x: 1, y: 0 },
      speed: GameConfig.player.moveSpeed,
      stones: 0
    };
    this.camera = { x: this.player.x, y: this.player.y };
    this.time = 0;
    this.day = 1;
    this.phase = 'day';
    this.phaseLabel = '白天';
    this.hover = null;
    this.message = {
      text: GameConfig.text.startMessage,
      timer: GameConfig.text.messageDuration.start
    };
    this.goalReached = false;
    this.nextStoneId = 100;
    this.monsters = [];
    this.nextMonsterId = 1;
    this.monsterSpawnedTonight = 0;
    this.monsterSpawnTimer = 0;
    this.monsterWasNight = false;
    this.monsterTouchMessageTimer = 0;
    this.archers = [];
    this.nextArcherId = 1;
    this.arrowShots = [];
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
    const states = GameConfig.worker.states;
    const summary = {
      [states.idle]: 0,
      [states.moving]: 0,
      [states.working]: 0,
      [states.returning]: 0
    };

    for (const worker of this.workers) {
      summary[worker.state] += 1;
    }

    return summary;
  }
}
