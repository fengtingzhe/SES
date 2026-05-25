import { GameConfig } from '../config/GameConfig.js';
import { TILE_TYPES } from '../world/TileMap.js';

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
  constructor(workerSystem, resourceSystem, archerSystem, mineSystem, refugeeSystem) {
    this.workerSystem = workerSystem;
    this.resourceSystem = resourceSystem;
    this.archerSystem = archerSystem;
    this.mineSystem = mineSystem;
    this.refugeeSystem = refugeeSystem;
  }

  update(state) {
    state.hover = this.findTarget(state);
  }

  handleAction(state) {
    const target = this.findTarget(state);
    if (target) {
      if (target.action === 'recruitArcher') {
        this.archerSystem.recruitArcher(state, target);
      } else if (target.action === 'recruitRefugee') {
        this.refugeeSystem.recruitRefugee(state, target);
      } else if (target.action === 'mineOccupied') {
        state.addMessage(GameConfig.text.mineOccupied, GameConfig.text.messageDuration.short);
      } else if (target.action === 'refugeeFireEmpty') {
        state.addMessage(GameConfig.text.refugeeFireEmpty, GameConfig.text.messageDuration.short);
      } else {
        this.workerSystem.requestJob(state, target);
      }
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
    if (!tile) return null;

    if (tile.type === TILE_TYPES.ARCHER_POST && this.archerSystem.isPostActive(state, x, y)) {
      return {
        action: 'recruitArcher',
        type: 'recruitArcher',
        cost: GameConfig.archer.recruitCost,
        label: '招募弓箭手',
        x,
        y,
        prompt: `招募弓箭手：Space 消耗 ${GameConfig.archer.recruitCost} 辉石`
      };
    }

    if (tile.type === TILE_TYPES.MINE) {
      const mine = this.mineSystem.getMineAt(state, x, y);
      if (!mine) return null;
      if (mine.workerId) {
        return {
          action: 'mineOccupied',
          type: 'mineOccupied',
          x,
          y,
          prompt: '这座矿山已有工人'
        };
      }

      return {
        action: 'workerJob',
        type: 'mine',
        mineId: mine.id,
        cost: GameConfig.mine.assignCost,
        label: '采矿',
        needStoneText: GameConfig.text.needMoreStoneForMine,
        x,
        y,
        prompt: `采矿：Space 派遣工人，消耗 ${GameConfig.mine.assignCost} 辉石`
      };
    }

    if (tile.type === TILE_TYPES.REFUGEE_FIRE) {
      const fire = this.refugeeSystem.getFireAt(state, x, y);
      if (!fire) return null;
      if (fire.count <= 0) {
        return {
          action: 'refugeeFireEmpty',
          type: 'refugeeFireEmpty',
          x,
          y,
          prompt: GameConfig.text.refugeeFireEmpty
        };
      }

      return {
        action: 'recruitRefugee',
        type: 'recruitRefugee',
        fireId: fire.id,
        cost: GameConfig.refugee.recruitCost,
        label: '招募流民',
        x,
        y,
        prompt: `招募流民：Space 消耗 ${GameConfig.refugee.recruitCost} 辉石，剩余 ${fire.count}`
      };
    }

    if (tile.reserved) return null;

    if (tile.type === TILE_TYPES.WALL_FOUNDATION) {
      return {
        action: 'workerJob',
        type: 'buildWall',
        cost: GameConfig.wall.buildCost,
        label: '建造围墙',
        needStoneText: GameConfig.text.needMoreStoneForWall,
        x,
        y,
        prompt: `建造围墙：Space 派遣工人，消耗 ${GameConfig.wall.buildCost} 辉石`
      };
    }

    const target = TARGETS[tile.type];
    if (!target) return null;

    return {
      ...target,
      action: 'workerJob',
      x,
      y,
      prompt: GameConfig.text.interactionPrompt(target.label, target.cost)
    };
  }
}
