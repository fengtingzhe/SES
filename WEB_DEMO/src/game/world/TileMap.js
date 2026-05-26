export const TileType = {
  FOREST: 'forest',
  GROUND: 'ground',
  WATER: 'water',
  VILLAGE: 'village',
  STONE: 'stone',
  GOAL: 'goal'
};

const PASSABLE_TYPES = new Set([
  TileType.GROUND,
  TileType.VILLAGE,
  TileType.STONE,
  TileType.GOAL
]);

export function createTile(type = TileType.FOREST, extra = {}) {
  return {
    type,
    discovered: false,
    visible: false,
    value: 0,
    life: null,
    placed: false,
    ...extra
  };
}

export class TileMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => createTile())
    );
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  cell(x, y) {
    return this.inBounds(x, y) ? this.tiles[y][x] : null;
  }

  setTile(x, y, type, extra = {}) {
    const previous = this.cell(x, y);
    if (!previous) return null;
    const next = createTile(type, {
      discovered: previous.discovered,
      visible: previous.visible,
      ...extra
    });
    this.tiles[y][x] = next;
    return next;
  }

  blank(x, y) {
    return this.setTile(x, y, TileType.GROUND);
  }

  setStone(x, y, value = 1, life = null, placed = false) {
    return this.setTile(x, y, TileType.STONE, { value, life, placed });
  }

  isPassable(x, y) {
    const tile = this.cell(x, y);
    return Boolean(tile && PASSABLE_TYPES.has(tile.type));
  }

  forEach(callback) {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        callback(this.tiles[y][x], x, y);
      }
    }
  }
}
