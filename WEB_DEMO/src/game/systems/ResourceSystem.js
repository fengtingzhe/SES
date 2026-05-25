import { GameConfig } from '../config/GameConfig.js';

export class ResourceSystem {
  update(state, dt) {
    this.pickupNearbyStones(state);
    this.updatePlacedStones(state, dt);
  }

  pickupNearbyStones(state) {
    const remaining = [];
    let gained = 0;

    for (const stone of state.looseStones) {
      const distance = Math.hypot(state.player.x - stone.x, state.player.y - stone.y);
      if (distance < GameConfig.player.pickupRadius) {
        gained += stone.value;
      } else {
        remaining.push(stone);
      }
    }

    if (gained > 0) {
      state.player.stones += gained;
      state.addMessage(GameConfig.text.pickupStone(gained), GameConfig.text.messageDuration.short);
    }

    state.looseStones = remaining;
  }

  updatePlacedStones(state, dt) {
    state.looseStones = state.looseStones.filter(stone => {
      if (stone.ttl === null) return true;
      stone.ttl -= dt;
      return stone.ttl > 0;
    });
  }

  placeStone(state) {
    if (state.player.stones <= 0) {
      state.addMessage(GameConfig.text.noStoneToPlace, GameConfig.text.messageDuration.short);
      return false;
    }

    const target = findDropPoint(state);
    if (!target) {
      state.addMessage(GameConfig.text.noPlaceForStone, GameConfig.text.messageDuration.short);
      return false;
    }

    state.player.stones -= 1;
    this.dropStone(state, target.x, target.y, GameConfig.stone.placedValue, GameConfig.stone.placedTtl, 'placed');
    state.addMessage(GameConfig.text.placedStone, GameConfig.text.messageDuration.short);
    return true;
  }

  dropStone(state, x, y, value = 1, ttl = null, source = 'reward') {
    state.looseStones.push({
      id: `stone-${state.nextStoneId++}`,
      x,
      y,
      value,
      ttl,
      source
    });
  }
}

function findDropPoint(state) {
  const px = Math.round(state.player.x);
  const py = Math.round(state.player.y);
  const preferred = [
    { x: px + state.player.dir.x, y: py + state.player.dir.y },
    { x: px, y: py },
    { x: px + 1, y: py },
    { x: px - 1, y: py },
    { x: px, y: py + 1 },
    { x: px, y: py - 1 }
  ];

  return preferred.find(point => state.map.isWalkable(point.x, point.y));
}
