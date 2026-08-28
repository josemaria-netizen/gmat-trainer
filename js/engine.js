// Adaptive engine: pure logic, no DOM. Levels run 1-10 per section.
// Step up after 3 consecutive correct at the current level; step down
// after 2 consecutive misses — a gentler echo of the real CAT.

import { BANK } from './bank.js';
import { generateQuant } from './generator.js';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 10;
export const UP_STREAK = 3;
export const DOWN_STREAK = 2;

export function nextLevel(level, streak) {
  if (streak >= UP_STREAK) return { level: Math.min(MAX_LEVEL, level + 1), streak: 0, moved: level < MAX_LEVEL ? 'up' : null };
  if (streak <= -DOWN_STREAK) return { level: Math.max(MIN_LEVEL, level - 1), streak: 0, moved: level > MIN_LEVEL ? 'down' : null };
  return { level, streak, moved: null };
}

export function updateStreak(streak, correct) {
  if (correct) return streak >= 0 ? streak + 1 : 1;
  return streak <= 0 ? streak - 1 : -1;
}

// Pick the next question for a section at a level. Quant levels 1-3 are
// procedurally generated (infinite). Bank questions avoid repeats via
// seenIds until the pool at that level is exhausted, then recycle.
export function pickQuestion(section, level, seenIds, rand = Math.random) {
  if (section === 'quant' && level <= 3) return generateQuant(level);

  const pool = BANK.filter(q => q.section === section);
  // Nearest-level pools: exact level first, then widen the window.
  for (let spread = 0; spread <= MAX_LEVEL; spread++) {
    const near = pool.filter(q => Math.abs(q.level - level) <= spread);
    if (!near.length) continue;
    const fresh = near.filter(q => !seenIds.includes(q.id));
    const candidates = fresh.length ? fresh : (spread === MAX_LEVEL ? near : null);
    if (candidates && candidates.length) {
      return candidates[Math.floor(rand() * candidates.length)];
    }
  }
  return null; // section has no questions at all (shouldn't happen)
}

// Sections cycle in Mixed mode: quant → verbal → di → quant …
export function nextSection(mode, lastSection) {
  if (mode !== 'mixed') return mode;
  const order = ['quant', 'verbal', 'di'];
  const i = order.indexOf(lastSection);
  return order[(i + 1) % order.length];
}

// ------------------------------------------------------------------ stats

export function summarize(attempts) {
  const total = attempts.length;
  const correct = attempts.filter(a => a.correct).length;
  const ms = attempts.reduce((s, a) => s + (a.ms || 0), 0);
  return {
    total,
    correct,
    wrong: total - correct,
    accuracy: total ? correct / total : 0,
    totalMs: ms,
    avgMs: total ? ms / total : 0,
  };
}

export function bySection(attempts) {
  const out = {};
  for (const s of ['quant', 'verbal', 'di']) {
    out[s] = summarize(attempts.filter(a => a.section === s));
  }
  return out;
}

export function byLevel(attempts, section = null) {
  const rows = [];
  for (let l = MIN_LEVEL; l <= MAX_LEVEL; l++) {
    const subset = attempts.filter(a => a.level === l && (!section || a.section === section));
    if (subset.length) rows.push({ level: l, ...summarize(subset) });
  }
  return rows;
}

export function byDay(attempts) {
  const map = new Map();
  for (const a of attempts) {
    const day = new Date(a.ts).toISOString().slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day).push(a);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, list]) => ({ day, ...summarize(list) }));
}

export function currentStreakDays(attempts, today = new Date()) {
  const days = new Set(attempts.map(a => new Date(a.ts).toISOString().slice(0, 10)));
  let streak = 0;
  const d = new Date(today);
  // Today counts if practiced; otherwise start from yesterday.
  if (!days.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function fmtMs(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
