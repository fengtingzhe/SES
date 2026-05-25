import { TILE_TYPES } from '../world/TileMap.js';

const TARGETS = {
  [TILE_TYPES.TREE_BLOCK]: {
    type: 'chop',
    cost: 1,
    label: '砍树障'
  },
  [TILE_TYPES.BROKEN_BRIDGE]: {
    type: 'repair',
    cost: 1,
    label: '修桥'
  },
  [TILE_TYPES.OLD_CAMP]: {
    type: 'lightCamp',
    cost: 1,
    label: '点亮营地'
  }
};

export class InteractionSystem {
  constructor(workerSystem, resourceSystem) {
    this.workerSystem = workerSystem;
    this.resourceSystem = resourceSystem;
  }

  update(state) {
    state.hover = this.findTarget(state);
  }

  handleAction(state) {
    const target = this.findTarget(state);
    if (target) {
      this.workerSystem.requestJob(state, target);
      state.hover = this.findTarget(state);
      return;
    }

    this.resourceSystem.placeStone(state);
  }

  findTarget(state) {
    const px = Math.round(state.player.x);
    const py = Math.round(state.player.y);
    const front = this.getTargetAt(state, px + state.player.dir.x, py + state.player.dir.y);
    if (front) return front;

    let best = null;
    for (let y = py - 2; y <= py + 2; y += 1) {
      for (let x = px - 2; x <= px + 2; x += 1) {
        const target = this.getTargetAt(state, x, y);
        if (!target) continue;
        const distance = Math.hypot(state.player.x - x, state.player.y - y);
        if (distance > 1.7) continue;
        if (!best || distance < best.distance) {
          best = { ...target, distance };
        }
      }
    }

    return best;
  }

  getTargetAt(state, x, y) {
    const tile = state.map.get(x, y);
    if (!tile || tile.reserved) return null;
    const target = TARGETS[tile.type];
    if (!target) return null;

    return {
      ...target,
      x,
      y,
      prompt: `${target.label}：Space 派遣工人，消耗 ${target.cost} 辉石`
    };
  }
}
