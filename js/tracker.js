// Tracker view — port of the MBA-tracker GMAT page: practice tests,
// study log, and progress vs target. GMAT Focus scales: sections 60-90,
// total 205-805.

import { load, update, uid } from './store.js';
import { lineChart, barChart } from './charts.js';

const TEST_SOURCES = ['official mock', 'third-party mock', 'sectional drill', 'real exam'];
const STUDY_SECTIONS = ['Quant', 'Verbal', 'Data Insights', 'Mixed'];
const SECTION_MIN = 60, SECTION_MAX = 90, TOTAL_MIN = 205, TOTAL_MAX = 805;
const COLORS = { Quant: 'var(--series-1)', Verbal: 'var(--series-2)', 'Data Insights': 'var(--series-3)' };

let sub = 'tests'; // 'tests' | 'study' | 'progress'

const today = () => new Date().toISOString().slice(0, 10);

export function renderTracker(root) {
  root.innerHTML = `
    <div class="seg" id="trk-seg">
      ${[['tests', 'Tests'], ['study', 'Study log'], ['progress', 'Progress']].map(([k, l]) =>
        `<button class="seg-btn ${k === sub ? 'on' : ''}" data-sub="${k}">${l}</button>`).join('')}
    </div>
    <div id="trk-body"></div>
  `;
  root.querySelector('#trk-seg').addEventListener('click', e => {
    const btn = e.target.closest('[data-sub]');
    if (!btn) return;
    sub = btn.dataset.sub;
    renderTracker(root);
  });
  const body = root.querySelector('#trk-body');
  if (sub === 'tests') renderTests(body);
  else if (sub === 'study') renderStudy(body);
  else renderProgress(body);
}

// ------------------------------------------------------------------ tests

function renderTests(root) {
  const s = load();
  const tests = [...s.tests].sort((a, b) => b.date.localeCompare(a.date));
  root.innerHTML = `
    <div class="card">
      <h3>Log a practice test</h3>
      <p class="hint">GMAT Focus scoring: sections ${SECTION_MIN}–${SECTION_MAX}, total ${TOTAL_MIN}–${TOTAL_MAX}.</p>
      <form id="test-form" class="form-grid">
        <label>Date<input type="date" name="date" value="${today()}" required></label>
        <label>Source<select name="source">${TEST_SOURCES.map(x => `<option>${x}</option>`).join('')}</select></label>
        <label>Quant<input type="number" name="quant" min="${SECTION_MIN}" max="${SECTION_MAX}" value="75" required></label>
        <label>Verbal<input type="number" name="verbal" min="${SECTION_MIN}" max="${SECTION_MAX}" value="75" required></label>
        <label>Data Insights<input type="number" name="di" min="${SECTION_MIN}" max="${SECTION_MAX}" value="75" required></label>
        <label>Total<input type="number" name="total" min="${TOTAL_MIN}" max="${TOTAL_MAX}" step="10" value="555" required></label>
        <label class="span2">Notes<input type="text" name="notes" placeholder="conditions, pacing, error themes"></label>
        <button class="btn btn-primary span2" type="submit">Save test</button>
      </form>
    </div>
    <div class="card">
      <h3>History</h3>
      ${tests.length ? `<div class="tbl-wrap"><table class="data-tbl">
        <thead><tr><th>Date</th><th>Source</th><th>Q</th><th>V</th><th>DI</th><th>Total</th><th></th></tr></thead>
        <tbody>${tests.map(t => `<tr>
          <td>${t.date}</td><td>${t.source}</td><td>${t.quant}</td><td>${t.verbal}</td><td>${t.di}</td>
          <td><b>${t.total}</b></td>
          <td><button class="btn-x" data-del="${t.id}" aria-label="delete">✕</button></td>
        </tr>${t.notes ? `<tr class="note-row"><td colspan="7">${t.notes}</td></tr>` : ''}`).join('')}</tbody>
      </table></div>` : '<p class="hint">No tests logged yet.</p>'}
    </div>
  `;
  root.querySelector('#test-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    update(st => st.tests.push({
      id: uid(), date: f.get('date'), source: f.get('source'),
      quant: +f.get('quant'), verbal: +f.get('verbal'), di: +f.get('di'),
      total: +f.get('total'), notes: f.get('notes') || '',
    }));
    renderTests(root);
  });
  root.querySelector('.tbl-wrap')?.addEventListener('click', e => {
    const del = e.target.closest('[data-del]');
    if (del) {
      update(st => { st.tests = st.tests.filter(t => t.id !== del.dataset.del); });
      renderTests(root);
    }
  });
}

// ------------------------------------------------------------------ study

function renderStudy(root) {
  const s = load();
  const rows = [...s.study].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  root.innerHTML = `
    <div class="card">
      <h3>Log a study session</h3>
      <form id="study-form" class="form-grid">
        <label>Date<input type="date" name="date" value="${today()}" required></label>
        <label>Minutes<input type="number" name="minutes" min="5" max="600" step="5" value="60" required></label>
        <label>Section<select name="section">${STUDY_SECTIONS.map(x => `<option>${x}</option>`).join('')}</select></label>
        <label>Topic<input type="text" name="topic" placeholder="e.g. rates & work, CR assumption"></label>
        <label class="span2">Error notes / takeaways<input type="text" name="notes"></label>
        <button class="btn btn-primary span2" type="submit">Log session</button>
      </form>
    </div>
    <div class="card">
      <h3>Recent sessions</h3>
      ${rows.length ? `<div class="tbl-wrap"><table class="data-tbl">
        <thead><tr><th>Date</th><th>Min</th><th>Section</th><th>Topic</th><th></th></tr></thead>
        <tbody>${rows.map(r => `<tr>
          <td>${r.date}</td><td>${r.minutes}</td><td>${r.section}</td><td>${r.topic || ''}</td>
          <td><button class="btn-x" data-del="${r.id}" aria-label="delete">✕</button></td>
        </tr>${r.notes ? `<tr class="note-row"><td colspan="5">${r.notes}</td></tr>` : ''}`).join('')}</tbody>
      </table></div>` : '<p class="hint">No sessions logged yet.</p>'}
    </div>
  `;
  root.querySelector('#study-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    update(st => st.study.push({
      id: uid(), date: f.get('date'), minutes: +f.get('minutes'),
      section: f.get('section'), topic: f.get('topic') || '', notes: f.get('notes') || '',
    }));
    renderStudy(root);
  });
  root.querySelector('.tbl-wrap')?.addEventListener('click', e => {
    const del = e.target.closest('[data-del]');
    if (del) {
      update(st => { st.study = st.study.filter(r => r.id !== del.dataset.del); });
      renderStudy(root);
    }
  });
}

// ---------------------------------------------------------------- progress

function renderProgress(root) {
  const s = load();
  root.innerHTML = `
    <div class="card">
      <div class="target-row">
        <h3>Target score</h3>
        <input type="number" id="target-input" min="${TOTAL_MIN}" max="${TOTAL_MAX}" step="10" value="${s.settings.target}">
      </div>
    </div>
    <div class="card"><h3>Total score vs target</h3><div id="total-chart" class="chart-host"></div></div>
    <div class="card"><h3>Section scores</h3><div id="section-chart" class="chart-host"></div></div>
    <div class="card"><h3>Study hours per week</h3><div id="week-chart" class="chart-host"></div></div>
  `;
  root.querySelector('#target-input').addEventListener('change', e => {
    const v = Math.max(TOTAL_MIN, Math.min(TOTAL_MAX, +e.target.value || 705));
    update(st => { st.settings.target = v; });
    renderProgress(root);
  });

  const tests = [...s.tests].sort((a, b) => a.date.localeCompare(b.date));
  if (tests.length) {
    lineChart(document.getElementById('total-chart'), [{
      name: 'Total', color: 'var(--series-1)',
      points: tests.map(t => ({ x: new Date(t.date), y: t.total, label: `${t.date} · ${t.source}` })),
    }], { target: s.settings.target, height: 230 });

    lineChart(document.getElementById('section-chart'), [
      { name: 'Quant', color: COLORS.Quant, points: tests.map(t => ({ x: new Date(t.date), y: t.quant, label: t.date })) },
      { name: 'Verbal', color: COLORS.Verbal, points: tests.map(t => ({ x: new Date(t.date), y: t.verbal, label: t.date })) },
      { name: 'Data Insights', color: COLORS['Data Insights'], points: tests.map(t => ({ x: new Date(t.date), y: t.di, label: t.date })) },
    ], { yDomain: [SECTION_MIN, SECTION_MAX], height: 230 });
  } else {
    document.getElementById('total-chart').innerHTML = '<p class="hint">Log a practice test to see your trajectory.</p>';
    document.getElementById('section-chart').innerHTML = '<p class="hint">—</p>';
  }

  if (s.study.length) {
    const weeks = new Map();
    for (const r of s.study) {
      const d = new Date(r.date + 'T00:00:00');
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday of that week
      const k = d.toISOString().slice(0, 10);
      weeks.set(k, (weeks.get(k) || 0) + r.minutes);
    }
    const bars = [...weeks.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-12)
      .map(([wk, min]) => ({ label: wk.slice(5), value: Math.round(min / 6) / 10, sub: `week of ${wk}` }));
    barChart(document.getElementById('week-chart'), bars, { fmt: v => v + ' h' });
  } else {
    document.getElementById('week-chart').innerHTML = '<p class="hint">Log study sessions to see weekly hours.</p>';
  }
}
