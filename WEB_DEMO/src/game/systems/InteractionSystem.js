import { distance, roundedGridPoint } from '../utils/grid.js';
import { TileType } from '../world/TileMap.js';
import { InteractionAction, InteractionPriority } from '../rules/interactionPriority.js';

export class InteractionSystem {
  constructor(resourceSystem, showMessage) {
    this.resourceSystem = resourceSystem;
    this.showMessage = showMessage;
  }

  getInfoAt(state, x, y) {
    const tile = state.world.map.cell(x, y);
    if (!tile || !tile.discovered) return null;

    if (tile.type === TileType.GOAL) {
      return this.createInfo(state, x, y, InteractionAction.GOAL, '抵达远方信标');
    }

    if (tile.type === TileType.STONE) {
      return this.createInfo(state, x, y, InteractionAction.COLLECT_STONE, `拾取辉石 +${tile.value || 1}`);
    }

    return null;
  }

  createInfo(state, x, y, action, label) {
    return {
      x,
      y,
      action,
      label,
      priority: InteractionPriority[action],
      distance: distance(state.player, { x, y })
    };
  }

  findInteract(state, verbose = false) {
    const playerGrid = roundedGridPoint(state.player);
    const front = this.getInfoAt(
      state,
      playerGrid.x + state.player.facing.x,
      playerGrid.y + state.player.facing.y
    );

    if (front) return front;

    const candidates = [];
    for (let y = playerGrid.y - 2; y <= playerGrid.y + 2; y += 1) {
      for (let x = playerGrid.x - 2; x <= playerGrid.x + 2; x += 1) {
        const info = this.getInfoAt(state, x, y);
        if (info && info.distance <= 1.7) {
          candidates.push(info);
        }
      }
    }

    candidates.sort((a, b) => a.priority - b.priority || a.distance - b.distance);

    if (!candidates[0] && verbose) {
      this.showMessage('附近没有可互动目标。');
    }

    return candidates[0] ?? null;
  }

  interact(state) {
    const target = this.findInteract(state, false);

    if (!target) {
      this.resourceSystem.placeStone(state);
      return;
    }

    if (target.action === InteractionAction.GOAL) {
      this.showMessage('你听见了远处像海一样的风。阶段目标完成。');
      return;
    }

    if (target.action === InteractionAction.COLLECT_STONE) {
      this.resourceSystem.collectStone(state, target);
    }
  }
}
