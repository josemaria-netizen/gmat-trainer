import { renderPractice } from './quiz.js';
import { renderStats } from './stats.js';
import { renderTracker } from './tracker.js';

const VIEWS = { practice: renderPractice, stats: renderStats, tracker: renderTracker };

function show(view) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('on', b.dataset.view === view));
  const root = document.getElementById('view');
  root.scrollTop = 0;
  VIEWS[view](root);
  try { localStorage.setItem('gmat-trainer:view', view); } catch { /* ignore */ }
}

document.getElementById('nav').addEventListener('click', e => {
  const btn = e.target.closest('.nav-btn');
  if (btn) show(btn.dataset.view);
});

let initial = 'practice';
try { initial = localStorage.getItem('gmat-trainer:view') || 'practice'; } catch { /* ignore */ }
show(VIEWS[initial] ? initial : 'practice');

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
