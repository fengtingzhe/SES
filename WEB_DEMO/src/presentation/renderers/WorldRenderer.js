import { GameConfig } from '../../game/config/GameConfig.js';
import { directionLabel } from '../../game/utils/grid.js';
import { TileType } from '../../game/world/TileMap.js';

const TILE_COLORS = {
  [TileType.FOREST]: '#162a22',
  [TileType.GROUND]: '#355c43',
  [TileType.WATER]: '#244456',
  [TileType.VILLAGE]: '#6a653e',
  [TileType.STONE]: '#74bdb2',
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
    this.drawPlayer(context, state, viewport);
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
      if (tile.type === TileType.VILLAGE) this.label(context, screen.x, screen.y - 24, '部落');
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
