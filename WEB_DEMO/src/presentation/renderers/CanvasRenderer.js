import { WorldRenderer } from './WorldRenderer.js';

export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.worldRenderer = new WorldRenderer();
    this.resize = this.resize.bind(this);
  }

  attach() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  detach() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = Math.floor(width * ratio);
    this.canvas.height = Math.floor(height * ratio);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  render(state) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.context.fillStyle = '#111917';
    this.context.fillRect(0, 0, viewport.width, viewport.height);
    this.worldRenderer.render(this.context, state, viewport);
  }
}
