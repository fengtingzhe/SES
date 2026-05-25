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
  WALL_FOUNDATION: 'wall_foundation',
  WALL: 'wall',
  ARCHER_POST: 'archer_post',
  MINE: 'mine',
  REFUGEE_FIRE: 'refugee_fire',
  GOAL: 'goal'
};

const WALKABLE_TYPES = new Set([
  TILE_TYPES.GRASS,
  TILE_TYPES.BRIDGE,
  TILE_TYPES.VILLAGE,
  TILE_TYPES.OLD_CAMP,
  TILE_TYPES.CAMP,
  TILE_TYPES.WALL_FOUNDATION,
  TILE_TYPES.ARCHER_POST,
  TILE_TYPES.MINE,
  TILE_TYPES.REFUGEE_FIRE,
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
    tile.reservedBy = null;
    if (type !== TILE_TYPES.WALL) {
      tile.hp = null;
      tile.maxHp = null;
    }
    if (type !== TILE_TYPES.MINE) tile.mine = null;
    if (type !== TILE_TYPES.REFUGEE_FIRE) tile.refugeeFire = null;
  }

  isWalkable(x, y) {
    const tile = this.get(x, y);
    return Boolean(tile && WALKABLE_TYPES.has(tile.type));
  }
}
