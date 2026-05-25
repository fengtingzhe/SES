import { TILE_TYPES } from '../../game/world/TileMap.js';

const COLORS = {
  [TILE_TYPES.GRASS]: '#496948',
  [TILE_TYPES.FOREST]: '#173924',
  [TILE_TYPES.TREE_BLOCK]: '#24502b',
  [TILE_TYPES.RIVER]: '#244c70',
  [TILE_TYPES.BROKEN_BRIDGE]: '#6d4a2b',
  [TILE_TYPES.BRIDGE]: '#9f7446',
  [TILE_TYPES.VILLAGE]: '#7d6538',
  [TILE_TYPES.OLD_CAMP]: '#4f4a40',
  [TILE_TYPES.CAMP]: '#8b5832',
  [TILE_TYPES.WALL_FOUNDATION]: '#6b7168',
  [TILE_TYPES.WALL]: '#4e3b2d',
  [TILE_TYPES.ARCHER_POST]: '#5f5a3a',
  [TILE_TYPES.GOAL]: '#245d80'
};

export class TileRenderer {
  constructor(renderer) {
    this.renderer = renderer;
  }

  draw(state) {
    const { ctx } = this.renderer;
    const visible = getVisibleBounds(state, this.renderer);

    for (let y = visible.minY; y <= visible.maxY; y += 1) {
      for (let x = visible.minX; x <= visible.maxX; x += 1) {
        const tile = state.map.get(x, y);
        if (!tile) continue;
        this.drawTile(ctx, state, x, y, tile);
      }
    }

    if (state.hover) this.drawHover(ctx, state);
  }

  drawTile(ctx, state, x, y, tile) {
    const rect = this.renderer.rectForTile(x, y, state.camera);
    ctx.fillStyle = COLORS[tile.type] || '#394b3b';
    ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
    ctx.strokeStyle = 'rgba(5, 12, 12, 0.28)';
    ctx.strokeRect(rect.x, rect.y, rect.size, rect.size);

    if (tile.type === TILE_TYPES.FOREST) this.drawTree(ctx, rect, '#245c34');
    if (tile.type === TILE_TYPES.TREE_BLOCK) this.drawTreeBlock(ctx, rect, tile.reserved);
    if (tile.type === TILE_TYPES.BROKEN_BRIDGE) this.drawBridge(ctx, rect, false);
    if (tile.type === TILE_TYPES.BRIDGE) this.drawBridge(ctx, rect, true);
    if (tile.type === TILE_TYPES.VILLAGE) this.drawVillage(ctx, rect);
    if (tile.type === TILE_TYPES.OLD_CAMP) this.drawOldCamp(ctx, rect);
    if (tile.type === TILE_TYPES.CAMP) this.drawCamp(ctx, rect);
    if (tile.type === TILE_TYPES.WALL_FOUNDATION) this.drawWallFoundation(ctx, rect, tile.reserved);
    if (tile.type === TILE_TYPES.WALL) this.drawWall(ctx, rect, tile);
    if (tile.type === TILE_TYPES.ARCHER_POST) this.drawArcherPost(ctx, rect);
    if (tile.type === TILE_TYPES.GOAL) this.drawGoal(ctx, rect);
  }

  drawTree(ctx, rect, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(rect.x + rect.size / 2, rect.y + rect.size / 2, rect.size * 0.24, 0, Math.PI * 2);
    ctx.fill();
  }

  drawTreeBlock(ctx, rect, reserved) {
    ctx.fillStyle = reserved ? '#9d8345' : '#86a04a';
    ctx.fillRect(rect.x + 7, rect.y + 6, rect.size - 14, rect.size - 12);
    ctx.fillStyle = '#2e1d13';
    ctx.fillRect(rect.x + 13, rect.y + 18, rect.size - 26, 9);
  }

  drawBridge(ctx, rect, repaired) {
    ctx.fillStyle = repaired ? '#d2ad72' : '#9d7047';
    ctx.fillRect(rect.x + 3, rect.y + 11, rect.size - 6, 10);
    ctx.strokeStyle = repaired ? '#6c492d' : '#3b2417';
    ctx.beginPath();
    ctx.moveTo(rect.x + 8, rect.y + 9);
    ctx.lineTo(rect.x + 8, rect.y + 24);
    ctx.moveTo(rect.x + 19, rect.y + 9);
    ctx.lineTo(rect.x + 19, rect.y + 24);
    ctx.stroke();
  }

  drawVillage(ctx, rect) {
    ctx.fillStyle = '#f0cf76';
    ctx.beginPath();
    ctx.arc(rect.x + rect.size / 2, rect.y + rect.size / 2, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#59331d';
    ctx.fillRect(rect.x + 10, rect.y + 19, 12, 7);
  }

  drawOldCamp(ctx, rect) {
    ctx.strokeStyle = '#b4aaa0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rect.x + rect.size / 2, rect.y + rect.size / 2, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  drawCamp(ctx, rect) {
    ctx.fillStyle = '#f09a43';
    ctx.beginPath();
    ctx.arc(rect.x + rect.size / 2, rect.y + rect.size / 2, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe6a1';
    ctx.beginPath();
    ctx.arc(rect.x + rect.size / 2, rect.y + rect.size / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawWallFoundation(ctx, rect, reserved) {
    ctx.fillStyle = reserved ? '#b9ad82' : '#a9afa6';
    ctx.fillRect(rect.x + 8, rect.y + 10, 4, rect.size - 18);
    ctx.fillRect(rect.x + rect.size - 12, rect.y + 10, 4, rect.size - 18);
    ctx.strokeStyle = '#3f453f';
    ctx.beginPath();
    ctx.moveTo(rect.x + 7, rect.y + 13);
    ctx.lineTo(rect.x + rect.size - 7, rect.y + 19);
    ctx.moveTo(rect.x + 7, rect.y + 24);
    ctx.lineTo(rect.x + rect.size - 7, rect.y + 18);
    ctx.stroke();
  }

  drawWall(ctx, rect, tile) {
    const hpRatio = Math.max(0, Math.min(1, (tile.hp ?? tile.maxHp ?? 1) / (tile.maxHp || 1)));
    ctx.fillStyle = hpRatio > 0.5 ? '#6f4b35' : '#3f302b';
    ctx.fillRect(rect.x + 5, rect.y + 8, rect.size - 10, rect.size - 14);
    ctx.strokeStyle = '#211815';
    ctx.strokeRect(rect.x + 5, rect.y + 8, rect.size - 10, rect.size - 14);
    ctx.fillStyle = '#c8b58c';
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${tile.hp ?? tile.maxHp}`, rect.x + rect.size / 2, rect.y + rect.size / 2);
  }

  drawArcherPost(ctx, rect) {
    ctx.fillStyle = '#d5c27a';
    ctx.beginPath();
    ctx.arc(rect.x + rect.size / 2, rect.y + rect.size / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3d3421';
    ctx.beginPath();
    ctx.moveTo(rect.x + 10, rect.y + 22);
    ctx.quadraticCurveTo(rect.x + rect.size / 2, rect.y + 7, rect.x + rect.size - 10, rect.y + 22);
    ctx.stroke();
  }

  drawGoal(ctx, rect) {
    ctx.fillStyle = '#85d7ff';
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.size / 2, rect.y + 5);
    ctx.lineTo(rect.x + rect.size - 8, rect.y + rect.size - 8);
    ctx.lineTo(rect.x + 8, rect.y + rect.size - 8);
    ctx.closePath();
    ctx.fill();
  }

  drawHover(ctx, state) {
    const rect = this.renderer.rectForTile(state.hover.x, state.hover.y, state.camera);
    ctx.strokeStyle = '#f4e38a';
    ctx.lineWidth = 3;
    ctx.strokeRect(rect.x + 2, rect.y + 2, rect.size - 4, rect.size - 4);
    ctx.lineWidth = 1;
  }
}

function getVisibleBounds(state, renderer) {
  const halfW = renderer.width / renderer.tileSize / 2 + 2;
  const halfH = renderer.height / renderer.tileSize / 2 + 2;
  return {
    minX: Math.max(0, Math.floor(state.camera.x - halfW)),
    maxX: Math.min(state.map.width - 1, Math.ceil(state.camera.x + halfW)),
    minY: Math.max(0, Math.floor(state.camera.y - halfH)),
    maxY: Math.min(state.map.height - 1, Math.ceil(state.camera.y + halfH))
  };
}
