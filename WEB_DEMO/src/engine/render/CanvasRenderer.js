export class CanvasRenderer {
  constructor(root) {
    this.root = root;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.tileSize = 32;
    this.width = 0;
    this.height = 0;
    this.root.replaceChildren(this.canvas);
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const scale = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * scale);
    this.canvas.height = Math.floor(this.height * scale);
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  clear(color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  worldToScreen(x, y, camera) {
    return {
      x: (x - camera.x) * this.tileSize + this.width / 2,
      y: (y - camera.y) * this.tileSize + this.height / 2
    };
  }

  rectForTile(x, y, camera) {
    const topLeft = this.worldToScreen(x - 0.5, y - 0.5, camera);
    return {
      x: topLeft.x,
      y: topLeft.y,
      size: this.tileSize
    };
  }
}
