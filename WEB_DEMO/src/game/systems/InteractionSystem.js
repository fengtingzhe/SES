import { GameConfig } from '../config/GameConfig.js';

const TARGETS = Object.fromEntries(
  Object.entries(GameConfig.jobs).map(([type, job]) => [
    job.targetTile,
    {
      type,
      cost: job.cost,
      label: job.label
    }
  ])
);

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
        if (distance > GameConfig.interaction.searchRadius) continue;
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
      prompt: GameConfig.text.interactionPrompt(target.label, target.cost)
    };
  }
}
