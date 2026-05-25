export class GameLoop {
  constructor() {
    this.running = false;
    this.lastTime = 0;
    this.frameId = null;
  }

  start(update, render) {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();

    const tick = now => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.lastTime) / 1000);
      this.lastTime = now;
      update(dt);
      render();
      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }
}
