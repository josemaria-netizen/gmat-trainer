// localStorage-backed store. All app state lives under one key so
// export/import is a single JSON blob.

const KEY = 'gmat-trainer:v1';

const DEFAULTS = {
  attempts: [],            // {qid, section, level, correct, ms, ts}
  levels: { quant: 1, verbal: 1, di: 1 },
  streaks: { quant: 0, verbal: 0, di: 0 },   // + = correct run, - = wrong run
  tests: [],               // {id, date, source, quant, verbal, di, total, notes}
  study: [],               // {id, date, minutes, section, topic, notes}
  settings: { target: 705 },
  seenIds: [],             // bank questions already answered (avoid repeats until exhausted)
};

let cache = null;

function coerce(raw) {
  const s = { ...structuredClone(DEFAULTS), ...raw };
  s.levels = { ...DEFAULTS.levels, ...(raw?.levels || {}) };
  s.streaks = { ...DEFAULTS.streaks, ...(raw?.streaks || {}) };
  s.settings = { ...DEFAULTS.settings, ...(raw?.settings || {}) };
  return s;
}

export function load() {
  if (cache) return cache;
  try {
    cache = coerce(JSON.parse(localStorage.getItem(KEY)) || {});
  } catch {
    cache = structuredClone(DEFAULTS);
  }
  return cache;
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache ?? load()));
  } catch (e) {
    console.warn('save failed', e);
  }
}

export function update(fn) {
  const s = load();
  fn(s);
  save();
  return s;
}

export function exportJSON() {
  return JSON.stringify(load(), null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text); // throws on bad input
  cache = coerce(parsed);
  save();
  return cache;
}

export function resetAll() {
  cache = structuredClone(DEFAULTS);
  save();
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
