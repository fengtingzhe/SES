export class PlayerSystem {
  update(state, input, dt) {
    const move = input.getMoveVector();
    if (move.x === 0 && move.y === 0) {
      this.checkGoal(state);
      return;
    }

    state.player.dir = chooseFacing(move);
    const step = state.player.speed * dt;
    const nextX = state.player.x + move.x * step;
    const nextY = state.player.y + move.y * step;

    if (canStandAt(state, nextX, state.player.y)) state.player.x = nextX;
    if (canStandAt(state, state.player.x, nextY)) state.player.y = nextY;

    this.checkGoal(state);
  }

  checkGoal(state) {
    if (state.goalReached) return;
    const dx = state.player.x - state.goal.x;
    const dy = state.player.y - state.goal.y;
    if (Math.hypot(dx, dy) < 0.75) {
      state.goalReached = true;
      state.addMessage('你抵达了阶段终点。', 8);
    }
  }
}

function canStandAt(state, x, y) {
  return state.map.isWalkable(Math.round(x), Math.round(y));
}

function chooseFacing(move) {
  if (Math.abs(move.x) > Math.abs(move.y)) {
    return { x: Math.sign(move.x), y: 0 };
  }
  return { x: 0, y: Math.sign(move.y) };
}
