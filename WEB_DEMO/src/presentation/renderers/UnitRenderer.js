export class UnitRenderer {
  constructor(renderer) {
    this.renderer = renderer;
  }

  draw(state) {
    this.drawStones(state);
    for (const worker of state.workers) this.drawWorker(state, worker);
    this.drawPlayer(state);
  }

  drawStones(state) {
    const { ctx } = this.renderer;
    for (const stone of state.looseStones) {
      const point = this.renderer.worldToScreen(stone.x, stone.y, state.camera);
      const alpha = stone.ttl === null ? 1 : Math.max(0.25, stone.ttl / 10);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = stone.source === 'placed' ? '#a9fff0' : '#b8edff';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e9ffff';
      ctx.stroke();
      ctx.restore();
    }
  }

  drawWorker(state, worker) {
    const { ctx } = this.renderer;
    const point = this.renderer.worldToScreen(worker.x, worker.y, state.camera);
    ctx.fillStyle = worker.state === 'idle' ? '#e5c28b' : '#d88963';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a2419';
    ctx.stroke();

    if (worker.state === 'working') {
      this.drawProgress(point.x, point.y - 14, worker.progress);
    }

    this.drawLabel(point.x, point.y + 18, worker.state);
  }

  drawPlayer(state) {
    const { ctx } = this.renderer;
    const point = this.renderer.worldToScreen(state.player.x, state.player.y, state.camera);
    ctx.fillStyle = '#f3efe0';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1d2a2c';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;

    const dir = state.player.dir;
    ctx.fillStyle = '#98d8ff';
    ctx.beginPath();
    ctx.moveTo(point.x + dir.x * 15, point.y + dir.y * 15);
    ctx.lineTo(point.x + dir.y * 5, point.y - dir.x * 5);
    ctx.lineTo(point.x - dir.y * 5, point.y + dir.x * 5);
    ctx.closePath();
    ctx.fill();
  }

  drawProgress(x, y, value) {
    const { ctx } = this.renderer;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x - 15, y, 30, 5);
    ctx.fillStyle = '#ffe38a';
    ctx.fillRect(x - 15, y, 30 * Math.min(1, value), 5);
  }

  drawLabel(x, y, text) {
    const { ctx } = this.renderer;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 250, 232, 0.85)';
    ctx.fillText(text, x, y);
  }
}
