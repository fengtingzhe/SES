import { GameConfig } from '../config/GameConfig.js';

export class DayNightSystem {
  update(state, dt) {
    state.time += dt;
    state.day = Math.floor(state.time / GameConfig.dayNight.dayLength) + 1;
    const progress = (state.time % GameConfig.dayNight.dayLength) / GameConfig.dayNight.dayLength;
    const phase = GameConfig.dayNight.phases.find(candidate => progress <= candidate.end)
      || GameConfig.dayNight.phases[0];
    state.phase = phase.id;
    state.phaseLabel = phase.label;
    state.phaseProgress = progress;
  }

  drawOverlay(state, ctx, renderer) {
    const phase = GameConfig.dayNight.phases.find(candidate => candidate.id === state.phase);
    if (!phase?.overlay) return;

    ctx.save();
    ctx.fillStyle = `rgba(4, 10, 18, ${phase.overlay})`;
    ctx.fillRect(0, 0, renderer.width, renderer.height);
    ctx.restore();
  }
}
