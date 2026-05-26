import { GameConfig } from '../config/GameConfig.js';
import { distance } from '../utils/grid.js';
import { TileType } from '../world/TileMap.js';

export class SpecialEventSystem {
  constructor(showMessage) {
    this.showMessage = showMessage;
  }

  startFoxWedding(state, target) {
    const event = state.events.foxWedding;
    if (event.active) {
      this.showMessage('婚仪正在进行。');
      return false;
    }

    const tile = state.world.map.cell(target.x, target.y);
    if (tile?.type !== TileType.FOX_WEDDING) return false;

    const config = GameConfig.events.foxWedding;
    event.active = true;
    event.timer = 0;
    event.origin = { x: target.x, y: target.y };
    event.failed = false;
    event.lastResult = null;
    event.foxes = Array.from({ length: config.foxCount }, (_, index) => ({
      x: target.x - index * config.spacing,
      y: target.y
    }));

    tile.event = { type: 'foxWedding', completed: false };
    this.showMessage('狐狸婚仪开始：跟随队伍，队伍停下时也要停下。');
    return true;
  }

  update(state, dt, movementVector) {
    const event = state.events.foxWedding;
    if (!event.active) return;

    const config = GameConfig.events.foxWedding;
    event.timer += dt;

    const moving = event.timer % config.moveCycleSeconds < config.moveSeconds;
    for (let i = 0; i < event.foxes.length; i += 1) {
      const fox = event.foxes[i];
      if (moving) fox.x += dt * config.speed;
      fox.y = event.origin.y + Math.sin((event.timer + i) * 2) * 0.08;
    }

    const lead = event.foxes[0];
    const playerDistance = distance(state.player, lead);
    const movingPlayer = Math.hypot(movementVector.x, movementVector.y) > 0;

    if (playerDistance > config.maxDistance) event.failed = true;
    if (!moving && movingPlayer && playerDistance < config.stopDistance) event.failed = true;

    if (event.failed) {
      this.endFoxWedding(state, false);
      return;
    }

    if (event.timer > config.durationSeconds) {
      this.endFoxWedding(state, true);
    }
  }

  endFoxWedding(state, success) {
    const event = state.events.foxWedding;
    if (!event.active) return;

    const origin = event.origin;
    const tile = origin ? state.world.map.cell(Math.round(origin.x), Math.round(origin.y)) : null;
    if (tile?.type === TileType.FOX_WEDDING) {
      state.world.map.blank(Math.round(origin.x), Math.round(origin.y));
    }

    if (success) {
      state.resources.stone += GameConfig.events.foxWedding.rewardStone;
      event.lastResult = 'success';
      this.showMessage(`你完成了狐狸婚仪，获得辉石 +${GameConfig.events.foxWedding.rewardStone}。`);
    } else {
      event.lastResult = 'failed';
      this.showMessage('你扰乱了婚仪，狐狸队伍消失了。');
    }

    event.active = false;
    event.failed = false;
    event.foxes = [];
  }
}
