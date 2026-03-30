function drawScribble(canvas, progress = 1) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const baseY = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#111';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const points = [];
  const step = 18;

  for (let x = 0; x <= width; x += step) {
    const y =
      baseY +
      Math.sin(x * 0.02) * 3 +
      Math.sin(x * 0.065) * 2 +
      (Math.random() * 3 - 1.5);
    points.push({ x, y });
  }

  const visibleCount = Math.max(2, Math.floor(points.length * progress));

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < visibleCount; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
  }

  ctx.stroke();

  /* second imperfect pass for more scribble feel */
  ctx.beginPath();
  ctx.lineWidth = 1.1;
  ctx.moveTo(points[0].x, points[0].y + 2);

  for (let i = 1; i < visibleCount; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = ((prev.y + curr.y) / 2) + 1.5;
    ctx.quadraticCurveTo(prev.x, prev.y + 1.5, midX, midY);
  }

  ctx.stroke();
}

function animateScribble(wrapper) {
  wrapper.innerHTML = '';
  const canvas = document.createElement('canvas');
  const width = wrapper.offsetWidth || 300;
  const height = 42;

  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);

  wrapper.appendChild(canvas);

  let start = null;
  const duration = 900;

  function frame(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    drawScribble(canvas, progress);

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function initScribbles() {
  document.querySelectorAll('.scribble').forEach(animateScribble);
}

window.addEventListener('load', initScribbles);
window.addEventListener('resize', () => {
  clearTimeout(window.__scribbleResizeTimer);
  window.__scribbleResizeTimer = setTimeout(initScribbles, 150);
});
