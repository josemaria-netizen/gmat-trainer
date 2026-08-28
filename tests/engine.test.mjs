// DOM-free logic tests: bank integrity, generator, adaptive engine, stats.
import assert from 'node:assert/strict';
import { BANK } from '../js/bank.js';
import { generateQuant } from '../js/generator.js';
import {
  nextLevel, updateStreak, pickQuestion, nextSection,
  summarize, byLevel, byDay, currentStreakDays, fmtMs,
} from '../js/engine.js';

let n = 0;
function test(name, fn) {
  try { fn(); n++; console.log(`ok  ${name}`); }
  catch (e) { console.error(`FAIL ${name}\n  ${e.message}`); process.exitCode = 1; }
}

// ------------------------------------------------------------ bank integrity

test('bank ids are unique', () => {
  const ids = BANK.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every bank question is well-formed', () => {
  for (const q of BANK) {
    assert.ok(['quant', 'verbal', 'di'].includes(q.section), q.id);
    assert.ok(q.level >= 1 && q.level <= 10, `${q.id} level`);
    assert.ok(Array.isArray(q.choices) && q.choices.length >= 4, `${q.id} choices`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, `${q.id} answer`);
    assert.ok(q.prompt && q.explanation, `${q.id} text`);
    assert.equal(new Set(q.choices).size, q.choices.length, `${q.id} duplicate choices`);
  }
});

test('every section covers a broad level range', () => {
  for (const s of ['quant', 'verbal', 'di']) {
    const levels = new Set(BANK.filter(q => q.section === s).map(q => q.level));
    assert.ok(Math.max(...levels) === 10, `${s} reaches level 10`);
    assert.ok(levels.size >= 5, `${s} spans levels (has ${levels.size})`);
  }
});

// --------------------------------------------------------------- generator

test('generator produces valid questions at levels 1-3', () => {
  for (let level = 1; level <= 3; level++) {
    for (let i = 0; i < 50; i++) {
      const q = generateQuant(level);
      assert.equal(q.section, 'quant');
      assert.equal(q.choices.length, 4, q.prompt);
      assert.ok(q.answer >= 0 && q.answer < 4, q.prompt);
      assert.equal(new Set(q.choices).size, 4, `dup choices: ${q.prompt} [${q.choices}]`);
    }
  }
});

test('generator answers are arithmetically correct (spot check ×)', () => {
  for (let i = 0; i < 30; i++) {
    const q = generateQuant(1);
    const m = q.prompt.match(/What is (\d+) × (\d+)\?/);
    if (m) assert.equal(Number(q.choices[q.answer]), Number(m[1]) * Number(m[2]), q.prompt);
  }
});

// ----------------------------------------------------------- adaptive logic

test('streaks accumulate and flip', () => {
  assert.equal(updateStreak(0, true), 1);
  assert.equal(updateStreak(2, true), 3);
  assert.equal(updateStreak(2, false), -1);
  assert.equal(updateStreak(-1, false), -2);
  assert.equal(updateStreak(-2, true), 1);
});

test('level steps up after 3 straight correct, down after 2 straight wrong', () => {
  assert.deepEqual(nextLevel(4, 3), { level: 5, streak: 0, moved: 'up' });
  assert.deepEqual(nextLevel(4, -2), { level: 3, streak: 0, moved: 'down' });
  assert.deepEqual(nextLevel(4, 2), { level: 4, streak: 2, moved: null });
  assert.deepEqual(nextLevel(10, 3), { level: 10, streak: 0, moved: null });
  assert.deepEqual(nextLevel(1, -2), { level: 1, streak: 0, moved: null });
});

test('pickQuestion generates for quant levels 1-3, uses bank above', () => {
  assert.ok(pickQuestion('quant', 1, []).generated);
  assert.ok(pickQuestion('quant', 3, []).generated);
  const q = pickQuestion('quant', 7, []);
  assert.ok(!q.generated && q.section === 'quant');
});

test('pickQuestion avoids seen questions until pool exhausted, then recycles', () => {
  const pool = BANK.filter(q => q.section === 'verbal').map(q => q.id);
  const seen = [];
  for (let i = 0; i < pool.length; i++) {
    const q = pickQuestion('verbal', 5, seen);
    assert.ok(!seen.includes(q.id), `repeat before exhaustion: ${q.id}`);
    seen.push(q.id);
  }
  assert.ok(pickQuestion('verbal', 5, seen), 'recycles once all seen');
});

test('pickQuestion widens level window when a level is empty', () => {
  const q = pickQuestion('di', 1, []); // di has no level-1 items
  assert.ok(q && q.section === 'di');
});

test('mixed mode cycles sections', () => {
  assert.equal(nextSection('mixed', 'quant'), 'verbal');
  assert.equal(nextSection('mixed', 'verbal'), 'di');
  assert.equal(nextSection('mixed', 'di'), 'quant');
  assert.equal(nextSection('quant', 'di'), 'quant');
});

// ------------------------------------------------------------------- stats

const A = (over = {}) => ({ qid: 'x', section: 'quant', level: 3, correct: true, ms: 30000, ts: Date.now(), ...over });

test('summarize counts and averages', () => {
  const s = summarize([A(), A({ correct: false, ms: 60000 })]);
  assert.equal(s.total, 2);
  assert.equal(s.correct, 1);
  assert.equal(s.wrong, 1);
  assert.equal(s.accuracy, 0.5);
  assert.equal(s.avgMs, 45000);
});

test('byLevel groups only levels with attempts', () => {
  const rows = byLevel([A({ level: 2 }), A({ level: 2 }), A({ level: 9 })]);
  assert.deepEqual(rows.map(r => r.level), [2, 9]);
});

test('byDay buckets by ISO day and sorts', () => {
  const d1 = new Date('2026-08-27T10:00:00Z').getTime();
  const d2 = new Date('2026-08-28T10:00:00Z').getTime();
  const rows = byDay([A({ ts: d2 }), A({ ts: d1 }), A({ ts: d1 })]);
  assert.deepEqual(rows.map(r => [r.day, r.total]), [['2026-08-27', 2], ['2026-08-28', 1]]);
});

test('currentStreakDays counts consecutive practice days', () => {
  const day = ms => Date.now() - ms * 86400000;
  const attempts = [A({ ts: day(0) }), A({ ts: day(1) }), A({ ts: day(2) }), A({ ts: day(4) })];
  assert.equal(currentStreakDays(attempts), 3);
  assert.equal(currentStreakDays([A({ ts: day(1) }), A({ ts: day(2) })]), 2); // today not yet practiced
  assert.equal(currentStreakDays([]), 0);
});

test('fmtMs renders human times', () => {
  assert.equal(fmtMs(42000), '42s');
  assert.equal(fmtMs(95000), '1m 35s');
  assert.equal(fmtMs(3720000), '1h 2m');
});

console.log(`\n${n} tests passed${process.exitCode ? ' (with failures)' : ''}`);
