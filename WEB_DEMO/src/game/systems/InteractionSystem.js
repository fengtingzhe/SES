import { distance, roundedGridPoint } from '../utils/grid.js';
import { TileType } from '../world/TileMap.js';
import { InteractionAction, InteractionPriority } from '../rules/interactionPriority.js';

export class InteractionSystem {
  constructor(resourceSystem, workerSystem, populationSystem, showMessage) {
    this.resourceSystem = resourceSystem;
    this.workerSystem = workerSystem;
    this.populationSystem = populationSystem;
    this.showMessage = showMessage;
  }

  getInfoAt(state, x, y) {
    const tile = state.world.map.cell(x, y);
    if (!tile || !tile.discovered) return null;

    if (tile.type === TileType.GOAL) {
      return this.createInfo(state, x, y, InteractionAction.GOAL, '抵达远方信标');
    }

    if (tile.type === TileType.STONE && tile.placed) {
      return this.createInfo(state, x, y, InteractionAction.PICK_PLACED_STONE, `拾回辉石 +${tile.value || 1}`);
    }

    if (tile.type === TileType.REFUGEE_FIRE) {
      const refugee = tile.refugee ?? { available: false, cooldown: 0 };
      if (refugee.available) {
        return this.createInfo(state, x, y, InteractionAction.RECRUIT_REFUGEE, '招募流民 1');
      }
      const cooldown = Math.ceil(refugee.cooldown || 0);
      return this.createInfo(state, x, y, InteractionAction.REFUGEE_COOLDOWN, cooldown > 0 ? `冷却 ${cooldown}s` : '空火堆');
    }

    if (tile.type === TileType.WORKER_HUT) {
      return this.createInfo(state, x, y, InteractionAction.CONVERT_WORKER, '流民转工人 1');
    }

    if (tile.type === TileType.ARCHER_CAMP) {
      return this.createInfo(state, x, y, InteractionAction.CONVERT_ARCHER, '流民转弓箭手 1');
    }

    if (tile.type === TileType.MINE) {
      const label = tile.mine?.workerId || tile.reserved ? '矿山已有工人' : '派工采矿';
      return this.createInfo(state, x, y, InteractionAction.MINE, label);
    }

    if (tile.reserved) {
      return this.createInfo(state, x, y, InteractionAction.RESERVED, '已有工人正在处理');
    }

    if (tile.job === InteractionAction.CHOP) {
      return this.createInfo(state, x, y, InteractionAction.CHOP, '砍树 1');
    }

    if (tile.job === InteractionAction.REPAIR) {
      return this.createInfo(state, x, y, InteractionAction.REPAIR, '修桥 2');
    }

    if (tile.job === InteractionAction.CAMP) {
      return this.createInfo(state, x, y, InteractionAction.CAMP, '点亮旧火塘 2');
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
    if (state.status === 'failed') {
      this.showMessage('旅程中断，按 R 重新开始。');
      return;
    }

    const target = this.findInteract(state, false);

    if (!target) {
      this.resourceSystem.placeStone(state);
      return;
    }

    if (target.action === InteractionAction.GOAL) {
      this.showMessage('你听见了远处像海一样的风。阶段目标完成。');
      return;
    }

    if (target.action === InteractionAction.PICK_PLACED_STONE) {
      this.resourceSystem.pickPlacedStone(state, target.x, target.y);
      return;
    }

    if (target.action === InteractionAction.RECRUIT_REFUGEE) {
      this.populationSystem.recruit(state, target);
      return;
    }

    if (target.action === InteractionAction.REFUGEE_COOLDOWN) {
      this.showMessage(target.label);
      return;
    }

    if (target.action === InteractionAction.CONVERT_WORKER) {
      this.populationSystem.convert(state, 'worker', target);
      return;
    }

    if (target.action === InteractionAction.CONVERT_ARCHER) {
      this.populationSystem.convert(state, 'archer', target);
      return;
    }

    if (target.action === InteractionAction.RESERVED) {
      this.showMessage('已有工人正在处理。');
      return;
    }

    if (
      target.action === InteractionAction.CHOP ||
      target.action === InteractionAction.REPAIR ||
      target.action === InteractionAction.CAMP ||
      target.action === InteractionAction.MINE
    ) {
      this.workerSystem.assignJob(state, target);
    }
  }
}
