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
      if (distance < 0.65) {
        gained += stone.value;
      } else {
        remaining.push(stone);
      }
    }

    if (gained > 0) {
      state.player.stones += gained;
      state.addMessage(`拾取辉石 +${gained}`, 2);
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
      state.addMessage('没有辉石可放置。', 2);
      return false;
    }

    const target = findDropPoint(state);
    if (!target) {
      state.addMessage('附近没有可放置辉石的位置。', 2);
      return false;
    }

    state.player.stones -= 1;
    this.dropStone(state, target.x, target.y, 1, 10, 'placed');
    state.addMessage('放置了一枚辉石。', 2);
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
