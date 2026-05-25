const root = document.getElementById('game-root');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

root.appendChild(canvas);

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.background = '#0b1416';

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

function draw() {
  ctx.fillStyle = '#0b1416';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#eaf3ef';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 28px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('WEB_DEMO Template Ready', canvas.width / 2, canvas.height / 2);

  ctx.font = '14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(234, 243, 239, 0.72)';
  ctx.fillText('Vite + Canvas game project skeleton', canvas.width / 2, canvas.height / 2 + 42);
}

window.addEventListener('resize', resize);
resize();
