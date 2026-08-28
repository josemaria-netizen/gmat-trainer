// Stats view: practice totals, accuracy by section & level, activity.

import { SECTIONS } from './bank.js';
import { summarize, bySection, byLevel, byDay, currentStreakDays, fmtMs } from './engine.js';
import { load, exportJSON, importJSON, resetAll } from './store.js';
import { barChart } from './charts.js';

const COLORS = { quant: 'var(--series-1)', verbal: 'var(--series-2)', di: 'var(--series-3)' };

export function renderStats(root) {
  const s = load();
  const all = summarize(s.attempts);
  const sec = bySection(s.attempts);
  const streak = currentStreakDays(s.attempts);

  root.innerHTML = `
    <div class="tiles">
      <div class="tile"><div class="tile-v">${all.total}</div><div class="tile-l">answered</div></div>
      <div class="tile"><div class="tile-v">${all.total ? Math.round(all.accuracy * 100) + '%' : '—'}</div><div class="tile-l">accuracy</div></div>
      <div class="tile"><div class="tile-v">${all.total ? fmtMs(all.avgMs) : '—'}</div><div class="tile-l">avg / question</div></div>
      <div class="tile"><div class="tile-v">${streak}</div><div class="tile-l">day streak</div></div>
    </div>

    <div class="card">
      <h3>Sections</h3>
      ${['quant', 'verbal', 'di'].map(k => {
        const d = sec[k];
        const pct = d.total ? Math.round(d.accuracy * 100) : 0;
        return `
        <div class="sec-row">
          <div class="sec-head">
            <span><span class="dot" style="background:${COLORS[k]}"></span>${SECTIONS[k]}</span>
            <span class="sec-nums">Level ${s.levels[k]} · ${d.correct}/${d.total} right${d.total ? ` · ${fmtMs(d.avgMs)}/q` : ''}</span>
          </div>
          <div class="meter"><div class="meter-fill" style="width:${pct}%;background:${COLORS[k]}"></div></div>
        </div>`;
      }).join('')}
    </div>

    <div class="card">
      <h3>Accuracy by level</h3>
      <div id="level-chart" class="chart-host"></div>
      <p class="hint" id="level-hint"></p>
    </div>

    <div class="card">
      <h3>Questions per day (last 14 days)</h3>
      <div id="day-chart" class="chart-host"></div>
    </div>

    <div class="card">
      <h3>Data</h3>
      <div class="btn-row">
        <button class="btn" id="btn-export">Export backup</button>
        <button class="btn" id="btn-import">Import backup</button>
        <button class="btn btn-danger" id="btn-reset">Reset everything</button>
      </div>
      <input type="file" id="import-file" accept="application/json" hidden>
      <p class="hint">Data lives only in this browser. Export a JSON backup before switching devices.</p>
    </div>
  `;

  const levels = byLevel(s.attempts);
  if (levels.length) {
    barChart(document.getElementById('level-chart'),
      levels.map(r => ({ label: `L${r.level}`, value: Math.round(r.accuracy * 100), sub: `Level ${r.level} — ${r.correct}/${r.total} right` })),
      { minMax: 100, fmt: v => v + '%' });
    document.getElementById('level-hint').textContent = 'All sections combined; hover a bar for the tally.';
  } else {
    document.getElementById('level-chart').innerHTML = '<p class="hint">Answer some questions to see this.</p>';
  }

  const days = byDay(s.attempts).slice(-14);
  if (days.length) {
    barChart(document.getElementById('day-chart'),
      days.map(d => ({ label: d.day.slice(5), value: d.total, sub: `${d.day} — ${d.correct}/${d.total} right` })));
  } else {
    document.getElementById('day-chart').innerHTML = '<p class="hint">No activity yet.</p>';
  }

  document.getElementById('btn-export').addEventListener('click', () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gmat-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  const fileInput = document.getElementById('import-file');
  document.getElementById('btn-import').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files[0];
    if (!f) return;
    try {
      importJSON(await f.text());
      renderStats(root);
    } catch {
      alert('Could not read that file — is it a gmat-trainer backup?');
    }
  });
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('Delete all practice history, tests, and study logs on this device?')) {
      resetAll();
      renderStats(root);
    }
  });
}
