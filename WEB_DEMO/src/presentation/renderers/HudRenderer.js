export class HudRenderer {
  constructor(renderer) {
    this.renderer = renderer;
  }

  draw(state) {
    const { ctx } = this.renderer;
    const summary = state.getWorkerSummary();
    const lines = [
      `${state.version}`,
      `辉石：${state.player.stones}    工人：idle ${summary.idle} / moving ${summary.moving} / working ${summary.working} / returning ${summary.returning}`,
      `第 ${state.day} 天 · ${state.phaseLabel}`,
      `目标：收集辉石，派工人清路，抵达远方信标`,
      `操作：WASD / 方向键移动，Space 互动或放置辉石，R 重开`
    ];

    this.panel(16, 16, Math.min(760, this.renderer.width - 32), 132);
    ctx.font = '14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    lines.forEach((line, index) => {
      ctx.fillStyle = index === 0 ? '#f5e6aa' : '#eaf3ef';
      ctx.font = index === 0 ? 'bold 18px system-ui, sans-serif' : '14px system-ui, sans-serif';
      ctx.fillText(line, 30, 30 + index * 22);
    });

    const prompt = state.hover
      ? state.hover.prompt
      : '附近无互动目标：Space 放置一枚辉石';
    this.bottomMessage(state, prompt);
  }

  panel(x, y, width, height) {
    const { ctx } = this.renderer;
    ctx.fillStyle = 'rgba(10, 20, 22, 0.78)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = 'rgba(238, 230, 174, 0.32)';
    ctx.strokeRect(x, y, width, height);
  }

  bottomMessage(state, prompt) {
    const { ctx } = this.renderer;
    const message = state.message.timer > 0 ? state.message.text : prompt;
    const width = Math.min(720, this.renderer.width - 32);
    const x = 16;
    const y = this.renderer.height - 72;
    this.panel(x, y, width, 48);
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = state.message.timer > 0 ? '#f5e6aa' : '#d9efe8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, x + 14, y + 24);

    if (state.goalReached) {
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#a7e5ff';
      ctx.fillText('你抵达了阶段终点。', this.renderer.width / 2, this.renderer.height / 2 - 80);
    }
  }
}
