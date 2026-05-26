import { GameConfig } from '../../game/config/GameConfig.js';
import { directionLabel } from '../../game/utils/grid.js';
import { TileType } from '../../game/world/TileMap.js';

const TILE_COLORS = {
  [TileType.FOREST]: '#162a22',
  [TileType.GROUND]: '#355c43',
  [TileType.WATER]: '#244456',
  [TileType.BROKEN_BRIDGE]: '#67462e',
  [TileType.BRIDGE]: '#785535',
  [TileType.VILLAGE]: '#6a653e',
  [TileType.CAMP]: '#4d653d',
  [TileType.OLD_FIREPIT]: '#4b4b3e',
  [TileType.STONE]: '#74bdb2',
  [TileType.MINE]: '#47545c',
  [TileType.REFUGEE_FIRE]: '#66513d',
  [TileType.WORKER_HUT]: '#806642',
  [TileType.ARCHER_CAMP]: '#5d774f',
  [TileType.WALL_BASE]: '#8f815d',
  [TileType.WALL]: '#a8aaa3',
  [TileType.FOG]: '#271b32',
  [TileType.GOAL]: '#35627c'
};

export class WorldRenderer {
  toScreen(x, y, state, viewport) {
    const size = GameConfig.camera.tileSize * GameConfig.camera.zoom;
    return {
      x: (x - y) * size + viewport.width / 2 + state.camera.x,
      y: (x + y) * size * 0.5 + 54 + state.camera.y
    };
  }

  updateCamera(state, viewport) {
    const playerScreen = this.toScreen(state.player.x, state.player.y, state, viewport);
    state.camera.x += (viewport.width / 2 - playerScreen.x) * GameConfig.camera.follow;
    state.camera.y += (viewport.height / 2 - playerScreen.y) * GameConfig.camera.follow;
  }

  render(context, state, viewport) {
    this.updateCamera(state, viewport);
    this.drawTiles(context, state, viewport);
    this.drawWorkerPaths(context, state, viewport);
    state.workers
      .filter(worker => !worker.lost)
      .forEach(worker => this.drawWorker(context, state, worker, viewport));
    state.refugees.forEach(refugee => this.drawRefugee(context, state, refugee, viewport));
    state.archers
      .filter(archer => !archer.lost)
      .forEach(archer => this.drawArcher(context, state, archer, viewport));
    state.monsters.forEach(monster => this.drawMonster(context, state, monster, viewport));
    this.drawPlayer(context, state, viewport);
    this.drawOverlay(context, state, viewport);
  }

  drawTiles(context, state, viewport) {
    const list = [];
    const { map } = state.world;

    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        const screen = this.toScreen(x, y, state, viewport);
        if (screen.x > -80 && screen.x < viewport.width + 80 && screen.y > -80 && screen.y < viewport.height + 80) {
          list.push({ x, y, order: x + y });
        }
      }
    }

    list.sort((a, b) => a.order - b.order);
    list.forEach(point => this.drawTile(context, state, point.x, point.y, viewport));
  }

  drawTile(context, state, x, y, viewport) {
    const tile = state.world.map.cell(x, y);
    const screen = this.toScreen(x, y, state, viewport);
    const hovered = state.hover && state.hover.x === x && state.hover.y === y;

    if (!tile.discovered) {
      this.diamond(context, screen, '#071010', 'rgba(255,255,255,.025)');
      return;
    }

    context.save();
    if (!tile.visible) context.globalAlpha = 0.42;
    this.diamond(
      context,
      screen,
      TILE_COLORS[tile.type] ?? '#355c43',
      hovered ? '#fff1b8' : 'rgba(255,255,255,.06)'
    );

    if (tile.type === TileType.STONE) {
      this.drawStone(context, screen, tile.value || 1);
    }

    if (tile.visible) {
      if (tile.type === TileType.FOREST && tile.job === 'chop') {
        this.label(context, screen.x, screen.y - 24, tile.reserved ? '砍树中' : '可砍树');
      }
      if (tile.type === TileType.BROKEN_BRIDGE) {
        this.label(context, screen.x, screen.y - 24, tile.reserved ? '修桥中' : '断桥');
      }
      if (tile.type === TileType.OLD_FIREPIT) {
        this.label(context, screen.x, screen.y - 24, tile.reserved ? '点亮中' : '旧火塘');
      }
      if (tile.type === TileType.BRIDGE) this.label(context, screen.x, screen.y - 24, '桥');
      if (tile.type === TileType.VILLAGE) this.label(context, screen.x, screen.y - 24, '部落');
      if (tile.type === TileType.CAMP) this.label(context, screen.x, screen.y - 24, '营地');
      if (tile.type === TileType.MINE) {
        const label = tile.mine?.workerId ? '采矿中' : tile.reserved ? '前往矿山' : '矿山';
        this.label(context, screen.x, screen.y - 24, label);
      }
      if (tile.type === TileType.REFUGEE_FIRE) {
        const refugee = tile.refugee ?? { available: false, cooldown: 0 };
        const label = refugee.available
          ? '流民火堆'
          : refugee.cooldown > 0
            ? `冷却 ${Math.ceil(refugee.cooldown)}s`
            : '空火堆';
        this.label(context, screen.x, screen.y - 24, label);
      }
      if (tile.type === TileType.WORKER_HUT) this.label(context, screen.x, screen.y - 24, '工人屋');
      if (tile.type === TileType.ARCHER_CAMP) this.label(context, screen.x, screen.y - 24, '弓箭手营');
      if (tile.type === TileType.WALL_BASE) {
        this.label(context, screen.x, screen.y - 24, tile.reserved ? '建墙中' : '墙基');
      }
      if (tile.type === TileType.WALL) {
        this.label(context, screen.x, screen.y - 24, `围墙 ${tile.hp || 0}/${GameConfig.wall.maxHp}`);
      }
      if (tile.type === TileType.FOG) this.label(context, screen.x, screen.y - 24, '雾门');
      if (tile.type === TileType.GOAL) this.label(context, screen.x, screen.y - 24, '远方信标');
      if (hovered) this.label(context, screen.x, screen.y - 44, state.hover.label);
    }

    context.restore();
  }

  diamond(context, point, fill, stroke) {
    const size = GameConfig.camera.tileSize * GameConfig.camera.zoom;
    context.beginPath();
    context.moveTo(point.x, point.y - size * 0.45);
    context.lineTo(point.x + size, point.y);
    context.lineTo(point.x, point.y + size * 0.45);
    context.lineTo(point.x - size, point.y);
    context.closePath();
    context.fillStyle = fill;
    context.fill();
    context.strokeStyle = stroke;
    context.stroke();
  }

  drawStone(context, point, value) {
    context.fillStyle = '#a7e8dd';
    context.beginPath();
    context.arc(point.x, point.y - 8, 6, 0, Math.PI * 2);
    context.fill();

    if (value > 1) {
      context.beginPath();
      context.arc(point.x + 8, point.y - 4, 5, 0, Math.PI * 2);
      context.fill();
    }
  }

  drawPlayer(context, state, viewport) {
    const point = this.toScreen(state.player.x, state.player.y, state, viewport);
    const arrow = this.toScreen(
      state.player.x + state.player.facing.x * 0.55,
      state.player.y + state.player.facing.y * 0.55,
      state,
      viewport
    );

    context.strokeStyle = '#fff1b8';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(point.x, point.y - 4);
    context.lineTo(arrow.x, arrow.y - 4);
    context.stroke();

    context.fillStyle = '#f0cfa3';
    context.beginPath();
    context.arc(point.x, point.y - 18, 7, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#b66f48';
    context.fillRect(point.x - 7, point.y - 11, 14, 18);

    this.label(context, point.x, point.y - 42, directionLabel(state.player.facing));
  }

  drawWorkerPaths(context, state, viewport) {
    context.save();
    context.strokeStyle = 'rgba(255,241,184,.22)';
    context.lineWidth = 2;

    for (const worker of state.workers) {
      if (!worker.path || worker.pathIndex >= worker.path.length) continue;
      this.drawPath(context, state, worker, viewport);
    }

    for (const refugee of state.refugees) {
      if (!refugee.path || refugee.pathIndex >= refugee.path.length) continue;
      this.drawPath(context, state, refugee, viewport);
    }

    context.restore();
  }

  drawPath(context, state, unit, viewport) {
    let point = this.toScreen(unit.x, unit.y, state, viewport);
    context.beginPath();
    context.moveTo(point.x, point.y);

    for (let i = unit.pathIndex; i < unit.path.length; i += 1) {
      point = this.toScreen(unit.path[i].x, unit.path[i].y, state, viewport);
      context.lineTo(point.x, point.y);
    }

    context.stroke();
  }

  drawWorker(context, state, worker, viewport) {
    const point = this.toScreen(worker.x, worker.y, state, viewport);
    context.save();
    context.fillStyle = worker.state === 'idle' ? '#f0d28b' : '#d9a65f';
    context.beginPath();
    context.arc(point.x, point.y - 14, 6, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#6f4a2f';
    context.fillRect(point.x - 5, point.y - 8, 10, 13);

    const labelText = worker.state === 'work'
      ? this.workerWorkLabel(worker)
      : {
      idle: '工人',
      moving: '前往',
      mining: `采矿 ${Math.max(1, Math.ceil(GameConfig.mine.productionSeconds - worker.progress))}`,
      return: '返回',
      flee: '撤退'
    }[worker.state] ?? '工人';
    this.label(context, point.x, point.y - 34, labelText);
    context.restore();
  }

  workerWorkLabel(worker) {
    const remaining = Math.max(1, Math.ceil(GameConfig.worker.workDuration - worker.progress));
    const labels = {
      chop: '砍树',
      repair: '修桥',
      camp: '点火',
      wall: '建墙'
    };
    return `${labels[worker.job?.type] ?? '工作'} ${remaining}`;
  }

  drawRefugee(context, state, refugee, viewport) {
    const point = this.toScreen(refugee.x, refugee.y, state, viewport);
    context.save();
    context.fillStyle = '#f0d3aa';
    context.beginPath();
    context.arc(point.x, point.y - 14, 5, 0, Math.PI * 2);
    context.fill();
    context.fillRect(point.x - 4, point.y - 8, 8, 12);
    this.label(context, point.x, point.y - 34, '流民返回');
    context.restore();
  }

  drawArcher(context, state, archer, viewport) {
    const point = this.toScreen(archer.x, archer.y, state, viewport);
    context.save();
    if (archer.state === 'aim' && archer.aimingTargetId) {
      const target = state.monsters.find(monster => monster.id === archer.aimingTargetId && !monster.dead);
      if (target) {
        const targetPoint = this.toScreen(target.x, target.y, state, viewport);
        context.strokeStyle = 'rgba(255,241,184,.55)';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(point.x, point.y - 14);
        context.lineTo(targetPoint.x, targetPoint.y - 16);
        context.stroke();
      }
    }

    context.fillStyle = '#b8d7a4';
    context.beginPath();
    context.arc(point.x, point.y - 14, 6, 0, Math.PI * 2);
    context.fill();
    context.fillRect(point.x - 5, point.y - 8, 10, 13);
    const labelText = archer.state === 'aim'
      ? '瞄准'
      : archer.state === 'cooldown'
        ? `冷却 ${Math.ceil(archer.cooldown || 0)}`
        : '弓箭手';
    this.label(context, point.x, point.y - 34, labelText);
    context.restore();
  }

  drawMonster(context, state, monster, viewport) {
    const point = this.toScreen(monster.x, monster.y, state, viewport);
    context.save();
    context.fillStyle = monster.returning ? '#21142a' : '#111111';
    context.beginPath();
    context.arc(point.x, point.y - 16, 8, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#32203f';
    context.fillRect(point.x - 7, point.y - 8, 14, 16);
    const labelText = monster.returning ? '返回雾门' : monster.attacking ? '攻墙' : '黑林影';
    this.label(context, point.x, point.y - 38, labelText);
    context.restore();
  }

  drawOverlay(context, state, viewport) {
    const alpha = state.time.phase === 'night'
      ? 0.42
      : state.time.phase === 'dusk'
        ? 0.18
        : 0.04;

    context.fillStyle = `rgba(2,8,18,${alpha})`;
    context.fillRect(0, 0, viewport.width, viewport.height);

    if (state.status === 'failed') {
      context.fillStyle = 'rgba(0,0,0,.62)';
      context.fillRect(0, 0, viewport.width, viewport.height);
      context.fillStyle = '#fff1b8';
      context.textAlign = 'center';
      context.font = 'bold 34px system-ui, sans-serif';
      context.fillText('旅程中断', viewport.width / 2, viewport.height / 2);
      context.font = '16px system-ui, sans-serif';
      context.fillText('按 R 重新开始', viewport.width / 2, viewport.height / 2 + 36);
    }
  }

  label(context, x, y, text) {
    context.font = '12px system-ui, sans-serif';
    const width = context.measureText(text).width + 12;
    context.fillStyle = 'rgba(7,15,17,.78)';
    context.beginPath();
    context.roundRect(x - width / 2, y - 14, width, 22, 8);
    context.fill();
    context.fillStyle = '#eaf3ef';
    context.textAlign = 'center';
    context.fillText(text, x, y + 2);
  }
}
