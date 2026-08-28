// Minimal SVG chart helpers: multi-series line chart and bar chart with
// hover tooltips. Colors and ink come from CSS custom properties.

const NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}

function niceTicks(lo, hi, n = 4) {
  const span = hi - lo || 1;
  const step = Math.pow(10, Math.floor(Math.log10(span / n)));
  const mult = [1, 2, 5, 10].find(m => span / (step * m) <= n + 1) || 10;
  const s = step * mult;
  const start = Math.ceil(lo / s) * s;
  const ticks = [];
  for (let v = start; v <= hi + 1e-9; v += s) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

function makeTooltip(host) {
  const tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.hidden = true;
  host.appendChild(tip);
  return tip;
}

// series: [{name, color, points: [{x: Date|number, y: number, label?}]}]
// opts: {height, yDomain: [lo, hi], target: number|null, yLabel}
export function lineChart(host, series, opts = {}) {
  host.textContent = '';
  const W = Math.max(300, host.clientWidth || 340);
  const H = opts.height || 240;
  const pad = { l: 40, r: 14, t: 12, b: 26 };
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img' });

  const all = series.flatMap(s => s.points);
  if (!all.length) return;
  const xs = all.map(p => +p.x);
  const ys = all.map(p => p.y);
  let [ylo, yhi] = opts.yDomain || [Math.min(...ys), Math.max(...ys)];
  if (opts.target != null) { ylo = Math.min(ylo, opts.target); yhi = Math.max(yhi, opts.target); }
  if (ylo === yhi) { ylo -= 1; yhi += 1; }
  const xlo = Math.min(...xs), xhi = Math.max(...xs);
  const X = v => xlo === xhi ? (pad.l + (W - pad.l - pad.r) / 2) : pad.l + ((v - xlo) / (xhi - xlo)) * (W - pad.l - pad.r);
  const Y = v => H - pad.b - ((v - ylo) / (yhi - ylo)) * (H - pad.t - pad.b);

  for (const t of niceTicks(ylo, yhi)) {
    svg.appendChild(el('line', { x1: pad.l, x2: W - pad.r, y1: Y(t), y2: Y(t), class: 'grid' }));
    const lbl = el('text', { x: pad.l - 6, y: Y(t) + 4, 'text-anchor': 'end', class: 'tick' });
    lbl.textContent = t;
    svg.appendChild(lbl);
  }
  svg.appendChild(el('line', { x1: pad.l, x2: W - pad.r, y1: H - pad.b, y2: H - pad.b, class: 'axis' }));

  // x labels: first and last date
  const fmt = d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  for (const [v, anchor] of [[xlo, 'start'], [xhi, 'end']]) {
    if (xlo === xhi && anchor === 'end') break;
    const lbl = el('text', { x: X(v), y: H - 8, 'text-anchor': anchor, class: 'tick' });
    lbl.textContent = fmt(v);
    svg.appendChild(lbl);
  }

  if (opts.target != null) {
    svg.appendChild(el('line', {
      x1: pad.l, x2: W - pad.r, y1: Y(opts.target), y2: Y(opts.target),
      class: 'target-rule',
    }));
    const lbl = el('text', { x: W - pad.r, y: Y(opts.target) - 5, 'text-anchor': 'end', class: 'tick' });
    lbl.textContent = `target ${opts.target}`;
    svg.appendChild(lbl);
  }

  for (const s of series) {
    const pts = s.points.slice().sort((a, b) => +a.x - +b.x);
    if (pts.length > 1) {
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(+p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
      svg.appendChild(el('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    }
    for (const p of pts) {
      svg.appendChild(el('circle', { cx: X(+p.x), cy: Y(p.y), r: 4.5, fill: s.color, class: 'pt', stroke: 'var(--surface-1)', 'stroke-width': 2 }));
    }
  }

  const tip = makeTooltip(host);
  svg.addEventListener('pointermove', e => {
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const my = ((e.clientY - rect.top) / rect.height) * H;
    let best = null;
    for (const s of series) for (const p of s.points) {
      const d = Math.hypot(X(+p.x) - mx, Y(p.y) - my);
      if (!best || d < best.d) best = { d, s, p };
    }
    if (best && best.d < 40) {
      tip.hidden = false;
      tip.innerHTML = `<span class="tip-swatch" style="background:${best.s.color}"></span>` +
        `${best.s.name} · <b>${best.p.y}</b><br><span class="tip-sub">${best.p.label || fmt(+best.p.x)}</span>`;
      tip.style.left = `${(X(+best.p.x) / W) * 100}%`;
      tip.style.top = `${(Y(best.p.y) / H) * 100}%`;
    } else tip.hidden = true;
  });
  svg.addEventListener('pointerleave', () => { tip.hidden = true; });

  host.appendChild(svg);

  if (series.length > 1) {
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    for (const s of series) {
      const item = document.createElement('span');
      item.className = 'legend-item';
      item.innerHTML = `<span class="tip-swatch" style="background:${s.color}"></span>${s.name}`;
      legend.appendChild(item);
    }
    host.appendChild(legend);
  }
}

// bars: [{label, value, sub?}]
export function barChart(host, bars, opts = {}) {
  host.textContent = '';
  if (!bars.length) return;
  const W = Math.max(300, host.clientWidth || 340);
  const H = opts.height || 200;
  const pad = { l: 34, r: 10, t: 14, b: 26 };
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img' });
  const max = Math.max(...bars.map(b => b.value), opts.minMax || 1);
  const Y = v => H - pad.b - (v / max) * (H - pad.t - pad.b);

  for (const t of niceTicks(0, max, 3)) {
    svg.appendChild(el('line', { x1: pad.l, x2: W - pad.r, y1: Y(t), y2: Y(t), class: 'grid' }));
    const lbl = el('text', { x: pad.l - 6, y: Y(t) + 4, 'text-anchor': 'end', class: 'tick' });
    lbl.textContent = t;
    svg.appendChild(lbl);
  }
  svg.appendChild(el('line', { x1: pad.l, x2: W - pad.r, y1: H - pad.b, y2: H - pad.b, class: 'axis' }));

  const step = (W - pad.l - pad.r) / bars.length;
  const bw = Math.min(26, step - 6);
  const tip = makeTooltip(host);
  bars.forEach((b, i) => {
    const x = pad.l + i * step + (step - bw) / 2;
    const rect = el('rect', {
      x, y: Y(b.value), width: bw, height: Math.max(0, H - pad.b - Y(b.value)),
      rx: 4, fill: 'var(--series-1)', class: 'bar',
    });
    rect.addEventListener('pointerenter', () => {
      tip.hidden = false;
      tip.innerHTML = `<b>${opts.fmt ? opts.fmt(b.value) : b.value}</b><br><span class="tip-sub">${b.sub || b.label}</span>`;
      tip.style.left = `${((x + bw / 2) / W) * 100}%`;
      tip.style.top = `${(Y(b.value) / H) * 100}%`;
    });
    rect.addEventListener('pointerleave', () => { tip.hidden = true; });
    svg.appendChild(rect);
    if (bars.length <= 10 || i % Math.ceil(bars.length / 8) === 0) {
      const lbl = el('text', { x: x + bw / 2, y: H - 8, 'text-anchor': 'middle', class: 'tick' });
      lbl.textContent = b.label;
      svg.appendChild(lbl);
    }
  });
  host.appendChild(svg);
}
