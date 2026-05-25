const DAY_LENGTH = 72;

const PHASES = [
  { id: 'day', label: '白天', end: 0.58, overlay: 0 },
  { id: 'dusk', label: '黄昏', end: 0.78, overlay: 0.12 },
  { id: 'night', label: '夜晚', end: 1, overlay: 0.34 }
];

export class DayNightSystem {
  update(state, dt) {
    state.time += dt;
    state.day = Math.floor(state.time / DAY_LENGTH) + 1;
    const progress = (state.time % DAY_LENGTH) / DAY_LENGTH;
    const phase = PHASES.find(candidate => progress <= candidate.end) || PHASES[0];
    state.phase = phase.id;
    state.phaseLabel = phase.label;
    state.phaseProgress = progress;
  }

  drawOverlay(state, ctx, renderer) {
    const phase = PHASES.find(candidate => candidate.id === state.phase);
    if (!phase?.overlay) return;

    ctx.save();
    ctx.fillStyle = `rgba(4, 10, 18, ${phase.overlay})`;
    ctx.fillRect(0, 0, renderer.width, renderer.height);
    ctx.restore();
  }
}
