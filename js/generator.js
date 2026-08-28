// Procedural quant generator for levels 1-3: infinite drilling of the basics
// ("what is 6 x 7") before the authored bank takes over at level 4.

function ri(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[ri(0, arr.length - 1)];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build 4 distinct choices around the right answer.
function numChoices(answer, spread) {
  const set = new Set([answer]);
  let guard = 0;
  while (set.size < 4 && guard++ < 200) {
    const delta = ri(1, spread) * (Math.random() < 0.5 ? -1 : 1);
    set.add(answer + delta);
  }
  const choices = shuffle([...set]);
  return { choices: choices.map(String), answer: choices.indexOf(answer) };
}

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

const L1 = [
  () => {
    const a = ri(2, 12), b = ri(2, 12);
    return { prompt: `What is ${a} × ${b}?`, topic: 'multiplication', ...numChoices(a * b, Math.max(3, b)) };
  },
  () => {
    const a = ri(13, 89), b = ri(11, 78);
    return { prompt: `What is ${a} + ${b}?`, topic: 'addition', ...numChoices(a + b, 6) };
  },
  () => {
    const b = ri(11, 55), a = b + ri(7, 44);
    return { prompt: `What is ${a} − ${b}?`, topic: 'subtraction', ...numChoices(a - b, 5) };
  },
  () => {
    const b = ri(2, 12), q = ri(2, 12), a = b * q;
    return { prompt: `What is ${a} ÷ ${b}?`, topic: 'division', ...numChoices(q, 3) };
  },
];

const L2 = [
  () => {
    const a = ri(2, 15), b = ri(2, 9), c = ri(2, 20);
    return { prompt: `What is ${a} × ${b} + ${c}?`, topic: 'order of operations', ...numChoices(a * b + c, 7) };
  },
  () => {
    const pct = pick([10, 20, 25, 50, 75]), base = pick([40, 60, 80, 120, 200, 300, 480]);
    return { prompt: `What is ${pct}% of ${base}?`, topic: 'percentages', ...numChoices((pct * base) / 100, Math.max(4, base / 20)) };
  },
  () => {
    const n = ri(2, 13);
    return { prompt: `What is ${n}²?`, topic: 'exponents', ...numChoices(n * n, Math.max(3, n)) };
  },
  () => {
    const b = ri(2, 9), x = ri(2, 12), c = ri(1, 20);
    return { prompt: `If ${b}x + ${c} = ${b * x + c}, what is x?`, topic: 'linear equations', ...numChoices(x, 3) };
  },
  () => {
    const d = pick([2, 4, 5, 8, 10]), n = ri(1, d - 1), g = gcd(n, d);
    return {
      prompt: `Expressed as a decimal, what is ${n / g}/${d / g}?`,
      topic: 'fractions & decimals',
      ...(() => {
        const ans = n / d;
        const opts = new Set([ans]);
        while (opts.size < 4) opts.add(Math.round((ans + (Math.random() - 0.5)) * 100) / 100);
        const choices = shuffle([...opts]);
        return { choices: choices.map(String), answer: choices.indexOf(ans) };
      })(),
    };
  },
];

const L3 = [
  () => {
    const speed = pick([40, 50, 60, 80]), hours = pick([2, 3, 4, 5, 1.5, 2.5]);
    return {
      prompt: `A car travels at a constant ${speed} km/h for ${hours} hours. How far does it travel, in km?`,
      topic: 'rates', ...numChoices(speed * hours, 15),
    };
  },
  () => {
    const vals = Array.from({ length: 5 }, () => ri(2, 30));
    const sum = vals.reduce((a, b) => a + b, 0);
    const fixed = sum % 5 === 0 ? vals : (vals[0] += 5 - (sum % 5), vals);
    const avg = fixed.reduce((a, b) => a + b, 0) / 5;
    return { prompt: `What is the average (arithmetic mean) of ${fixed.join(', ')}?`, topic: 'statistics', ...numChoices(avg, 4) };
  },
  () => {
    const a = ri(2, 9), b = ri(2, 9);
    return { prompt: `What is ${a}² + ${b}²?`, topic: 'exponents', ...numChoices(a * a + b * b, 8) };
  },
  () => {
    const price = pick([80, 120, 150, 200, 250]), off = pick([10, 15, 20, 25, 30]);
    return {
      prompt: `A jacket priced at $${price} is discounted ${off}%. What is the sale price, in dollars?`,
      topic: 'percentages', ...numChoices(price * (100 - off) / 100, 12),
    };
  },
  () => {
    const x = ri(2, 10), k = ri(2, 6);
    return {
      prompt: `If ${k}(x − ${ri(1, 3)}) = ${k}x − ${k * ri(1, 3)} and ${k}x = ${k * x}, what is x?`,
      topic: 'algebra', ...numChoices(x, 3),
    };
  },
  () => {
    const men = ri(3, 8);
    const men2 = pick([2, 3, 4, 6].filter(m => m !== men));
    const days = men2 * ri(1, 3); // keeps total worker-days divisible by men2
    return {
      prompt: `${men} workers finish a job in ${days} days, all working at the same rate. How many days would ${men2} workers take?`,
      topic: 'work & rates', ...numChoices((men * days) / men2, 4),
    };
  },
];

const LEVELS = { 1: L1, 2: L2, 3: L3 };

export function generateQuant(level) {
  const pool = LEVELS[Math.min(3, Math.max(1, level))];
  const q = pick(pool)();
  return {
    id: 'gen-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    section: 'quant',
    type: 'problem-solving',
    level: Math.min(3, Math.max(1, level)),
    generated: true,
    explanation: q.explanation || 'Straight computation — aim for under 30 seconds on these.',
    ...q,
  };
}
