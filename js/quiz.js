// Practice view: adaptive question flow with per-question timing.

import { SECTIONS } from './bank.js';
import { pickQuestion, nextSection, nextLevel, updateStreak, fmtMs } from './engine.js';
import { load, update } from './store.js';

const $ = sel => document.querySelector(sel);

let mode = 'mixed';          // 'mixed' | 'quant' | 'verbal' | 'di'
let lastSection = 'di';      // so mixed starts on quant
let current = null;          // question on screen
let startedAt = 0;
let timerId = null;
let sessionCount = 0;
let sessionCorrect = 0;

const TYPE_LABELS = {
  'problem-solving': 'Problem solving',
  'critical-reasoning': 'Critical reasoning',
  'reading-comprehension': 'Reading comprehension',
  'data-sufficiency': 'Data sufficiency',
  'two-part': 'Two-part analysis',
  'table-analysis': 'Table analysis',
  'graphics-interpretation': 'Graphics interpretation',
};

export function renderPractice(root) {
  root.innerHTML = `
    <div class="seg" id="mode-seg" role="tablist" aria-label="Section">
      ${['mixed', 'quant', 'verbal', 'di'].map(m =>
        `<button class="seg-btn ${m === mode ? 'on' : ''}" data-mode="${m}">${m === 'mixed' ? 'Mixed' : SECTIONS[m]}</button>`).join('')}
    </div>
    <div id="q-card" class="card"></div>
  `;
  $('#mode-seg').addEventListener('click', e => {
    const btn = e.target.closest('[data-mode]');
    if (!btn) return;
    mode = btn.dataset.mode;
    document.querySelectorAll('#mode-seg .seg-btn').forEach(b => b.classList.toggle('on', b === btn));
    showQuestion();
  });
  showQuestion();
}

function showQuestion() {
  const s = load();
  const section = nextSection(mode, lastSection);
  const level = s.levels[section];
  current = pickQuestion(section, level, s.seenIds);
  if (!current) { $('#q-card').innerHTML = '<p>No questions available.</p>'; return; }
  lastSection = section;
  startedAt = Date.now();

  const card = $('#q-card');
  card.innerHTML = `
    <div class="q-meta">
      <span class="pill pill-${section}">${SECTIONS[section]}</span>
      <span class="pill">Level ${current.level}</span>
      <span class="pill pill-ghost">${TYPE_LABELS[current.type] || current.type}</span>
      <span class="q-timer" id="q-timer">0:00</span>
    </div>
    ${current.passage ? `<div class="passage">${current.passage}</div>` : ''}
    ${current.figure ? `<div class="figure">${current.figure}</div>` : ''}
    <div class="q-prompt">${current.prompt.replace(/\n/g, '<br>')}</div>
    <div class="choices">
      ${current.choices.map((c, i) =>
        `<button class="choice" data-i="${i}"><span class="choice-letter">${'ABCDE'[i]}</span><span>${c}</span></button>`).join('')}
    </div>
    <div class="session-note">${sessionCount ? `This session: ${sessionCorrect}/${sessionCount} correct` : 'New session — good luck.'}</div>
  `;

  clearInterval(timerId);
  timerId = setInterval(() => {
    const el = $('#q-timer');
    if (!el) { clearInterval(timerId); return; }
    const sec = Math.floor((Date.now() - startedAt) / 1000);
    el.textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
    el.classList.toggle('over', sec > 150); // GMAT pace: ~2min/question
  }, 1000);

  card.querySelector('.choices').addEventListener('click', e => {
    const btn = e.target.closest('.choice');
    if (btn && current) answer(parseInt(btn.dataset.i, 10));
  }, { once: false });
}

function answer(i) {
  if (!current) return;
  clearInterval(timerId);
  const ms = Date.now() - startedAt;
  const q = current;
  current = null; // block double answers
  const correct = i === q.answer;
  sessionCount++; if (correct) sessionCorrect++;

  let moved = null;
  update(s => {
    s.attempts.push({ qid: q.id, section: q.section, level: q.level, correct, ms, ts: Date.now() });
    if (!q.generated && !s.seenIds.includes(q.id)) s.seenIds.push(q.id);
    const streak = updateStreak(s.streaks[q.section], correct);
    const adv = nextLevel(s.levels[q.section], streak);
    s.levels[q.section] = adv.level;
    s.streaks[q.section] = adv.streak;
    moved = adv.moved;
  });

  const card = $('#q-card');
  card.querySelectorAll('.choice').forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.answer) btn.classList.add('right');
    else if (idx === i) btn.classList.add('wrong');
  });

  const fb = document.createElement('div');
  fb.className = `feedback ${correct ? 'ok' : 'ko'}`;
  fb.innerHTML = `
    <div class="fb-head">
      <b>${correct ? 'Correct' : `Incorrect — the answer is ${'ABCDE'[q.answer]}`}</b>
      <span>${fmtMs(ms)}</span>
      ${moved === 'up' ? '<span class="level-up">▲ Level up</span>' : ''}
      ${moved === 'down' ? '<span class="level-down">▼ Level down</span>' : ''}
    </div>
    <p class="fb-expl">${q.explanation}</p>
    <button class="btn btn-primary" id="next-q">Next question</button>
  `;
  card.appendChild(fb);
  fb.querySelector('#next-q').addEventListener('click', showQuestion);
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
