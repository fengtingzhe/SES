export const TILE_TYPES = {
  GRASS: 'grass',
  FOREST: 'forest',
  TREE_BLOCK: 'tree_block',
  RIVER: 'river',
  BROKEN_BRIDGE: 'broken_bridge',
  BRIDGE: 'bridge',
  VILLAGE: 'village',
  OLD_CAMP: 'old_camp',
  CAMP: 'camp',
  GOAL: 'goal'
};

const WALKABLE_TYPES = new Set([
  TILE_TYPES.GRASS,
  TILE_TYPES.BRIDGE,
  TILE_TYPES.VILLAGE,
  TILE_TYPES.OLD_CAMP,
  TILE_TYPES.CAMP,
  TILE_TYPES.GOAL
]);

export class TileMap {
  constructor(width, height, defaultType = TILE_TYPES.FOREST) {
    this.width = width;
    this.height = height;
    this.tiles = Array.from({ length: width * height }, () => ({
      type: defaultType,
      reserved: false
    }));
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  index(x, y) {
    return y * this.width + x;
  }

  get(x, y) {
    if (!this.inBounds(x, y)) return null;
    return this.tiles[this.index(x, y)];
  }

  setType(x, y, type) {
    const tile = this.get(x, y);
    if (!tile) return;
    tile.type = type;
    tile.reserved = false;
  }

  isWalkable(x, y) {
    const tile = this.get(x, y);
    return Boolean(tile && WALKABLE_TYPES.has(tile.type));
  }
}
