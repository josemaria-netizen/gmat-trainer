// Authored Data Insights bank: data sufficiency, table analysis,
// two-part analysis, graphics interpretation.

const DS = [
  'Statement (1) ALONE is sufficient, but statement (2) alone is not.',
  'Statement (2) ALONE is sufficient, but statement (1) alone is not.',
  'BOTH statements TOGETHER are sufficient, but neither alone is.',
  'EACH statement ALONE is sufficient.',
  'Statements (1) and (2) TOGETHER are NOT sufficient.',
];

// Small labeled bar chart for graphics-interpretation items. Values are
// direct-labeled so every question is answerable from the figure alone.
function barFig(title, labels, values, unit = '') {
  const max = Math.max(...values);
  const w = 320, h = 190, pad = 28, baseY = h - 34;
  const bw = Math.min(44, (w - pad * 2) / labels.length - 10);
  const step = (w - pad * 2) / labels.length;
  let bars = '';
  values.forEach((v, i) => {
    const bh = Math.round((v / max) * (baseY - 44));
    const x = pad + i * step + (step - bw) / 2;
    bars += `<rect x="${x}" y="${baseY - bh}" width="${bw}" height="${bh}" rx="4" fill="var(--series-1)"/>` +
      `<text x="${x + bw / 2}" y="${baseY - bh - 6}" text-anchor="middle" class="fig-val">${v}${unit}</text>` +
      `<text x="${x + bw / 2}" y="${baseY + 16}" text-anchor="middle" class="fig-lab">${labels[i]}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">` +
    `<text x="${pad}" y="18" class="fig-title">${title}</text>` +
    `<line x1="${pad}" y1="${baseY}" x2="${w - pad}" y2="${baseY}" class="fig-axis"/>` +
    bars + `</svg>`;
}

function table(headers, rows) {
  return '<table class="di-table"><thead><tr>' +
    headers.map(h => `<th>${h}</th>`).join('') +
    '</tr></thead><tbody>' +
    rows.map(r => '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') +
    '</tbody></table>';
}

export const DI = [
  // ------------------------------------------------------- data sufficiency
  {
    id: 'ds-01', section: 'di', type: 'data-sufficiency', level: 2, topic: 'inequalities',
    prompt: 'Is x > 5?\n\n(1) x = 7\n(2) x > 3',
    choices: DS, answer: 0,
    explanation: '(1) gives x = 7 → definite yes. (2) allows x = 4 (no) or x = 9 (yes) → insufficient. Answer A.',
  },
  {
    id: 'ds-02', section: 'di', type: 'data-sufficiency', level: 3, topic: 'equations',
    prompt: 'What is the value of n?\n\n(1) n + 3 = 8\n(2) 2n = 10',
    choices: DS, answer: 3,
    explanation: 'Each is a one-variable linear equation giving n = 5 on its own. Answer D.',
  },
  {
    id: 'ds-03', section: 'di', type: 'data-sufficiency', level: 4, topic: 'number properties',
    prompt: 'If n is an integer, is n even?\n\n(1) n² is even\n(2) n + 1 is odd',
    choices: DS, answer: 3,
    explanation: '(1) For integers, n² even forces n even. (2) n + 1 odd forces n even. Each alone suffices — D.',
  },
  {
    id: 'ds-04', section: 'di', type: 'data-sufficiency', level: 4, topic: 'averages',
    prompt: 'What is the average (arithmetic mean) of x and y?\n\n(1) x + y = 20\n(2) x = 3y',
    choices: DS, answer: 0,
    explanation: '(1) average = 20/2 = 10 — sufficient. (2) fixes only the ratio; x = 3, y = 1 vs x = 30, y = 10 give different averages. Answer A.',
  },
  {
    id: 'ds-05', section: 'di', type: 'data-sufficiency', level: 5, topic: 'number properties',
    prompt: 'Is x positive?\n\n(1) x² = 9\n(2) x³ = 27',
    choices: DS, answer: 1,
    explanation: '(1) x = 3 or −3 — insufficient. (2) cubes preserve sign: x = 3 only — sufficient. Answer B.',
  },
  {
    id: 'ds-06', section: 'di', type: 'data-sufficiency', level: 5, topic: 'word problems',
    prompt: 'What is the total cost of 5 pens and 3 pencils?\n\n(1) 5 pens cost $10\n(2) 3 pencils cost $2.40',
    choices: DS, answer: 2,
    explanation: 'Each statement prices only one item type; together they give $12.40. Answer C.',
  },
  {
    id: 'ds-07', section: 'di', type: 'data-sufficiency', level: 6, topic: 'divisibility',
    prompt: 'If n is a positive integer, is n divisible by 6?\n\n(1) n is divisible by 3\n(2) n is divisible by 4',
    choices: DS, answer: 2,
    explanation: 'Alone: 3 (e.g. n = 9, no) and 4 (e.g. n = 8, no) are insufficient. Together n is divisible by lcm(3,4) = 12, hence by 6 — C.',
  },
  {
    id: 'ds-08', section: 'di', type: 'data-sufficiency', level: 6, topic: 'equations',
    prompt: 'What is the value of x + y?\n\n(1) 2x + 2y = 14\n(2) x − y = 3',
    choices: DS, answer: 0,
    explanation: '(1) divides straight to x + y = 7 — sufficient without solving for x and y separately. (2) fixes the difference, not the sum. Answer A.',
  },
  {
    id: 'ds-09', section: 'di', type: 'data-sufficiency', level: 7, topic: 'inequalities',
    prompt: 'Is xy > 0?\n\n(1) x + y > 0\n(2) x − y > 0',
    choices: DS, answer: 4,
    explanation: 'Together, try x = 3, y = 1 (xy > 0, yes) and x = 5, y = −1 (both conditions hold, xy < 0, no). Still ambiguous — E.',
  },
  {
    id: 'ds-10', section: 'di', type: 'data-sufficiency', level: 7, topic: 'remainders',
    prompt: 'What is the remainder when positive integer n is divided by 5?\n\n(1) The units digit of n is 7\n(2) n = 5k + 2 for some positive integer k',
    choices: DS, answer: 3,
    explanation: '(1) units digit 7 → remainder 2 (e.g. 7, 17, 27…). (2) states the remainder is 2 directly. Each alone — D.',
  },
  {
    id: 'ds-11', section: 'di', type: 'data-sufficiency', level: 8, topic: 'inequalities',
    prompt: 'Is x > y?\n\n(1) x² > y²\n(2) x and y are both positive',
    choices: DS, answer: 2,
    explanation: '(1) alone fails (x = −3, y = 1). (2) alone says nothing about order. Together, for positives, x² > y² ⇔ x > y — C.',
  },
  {
    id: 'ds-12', section: 'di', type: 'data-sufficiency', level: 8, topic: 'statistics',
    prompt: 'S is a set of 5 consecutive even integers. What is the median of S?\n\n(1) The smallest integer in S is 4\n(2) The mean of S is 8',
    choices: DS, answer: 3,
    explanation: '(1) S = {4,6,8,10,12} → median 8. (2) For consecutive (evenly spaced) integers, mean = median = 8. Each alone — D.',
  },
  {
    id: 'ds-13', section: 'di', type: 'data-sufficiency', level: 9, topic: 'divisibility',
    prompt: 'If n is a positive integer, is n(n + 1) divisible by 4?\n\n(1) n is odd\n(2) n + 1 is divisible by 4',
    choices: DS, answer: 1,
    explanation: '(1) n = 1 → 2 (no); n = 3 → 12 (yes) — insufficient. (2) makes the factor n + 1 itself a multiple of 4 — sufficient. Answer B.',
  },
  {
    id: 'ds-14', section: 'di', type: 'data-sufficiency', level: 9, topic: 'percentages',
    prompt: 'Did company X\'s revenue increase by more than 10% this year?\n\n(1) Revenue increased by $2 million\n(2) Last year\'s revenue was $25 million',
    choices: DS, answer: 2,
    explanation: 'A dollar change needs a base, and a base needs a change. Together: 2/25 = 8% → definite "no," which IS sufficient. Answer C.',
  },
  {
    id: 'ds-15', section: 'di', type: 'data-sufficiency', level: 10, topic: 'absolute value',
    prompt: 'If x and y are nonzero, is |x| + |y| > |x + y|?\n\n(1) xy < 0\n(2) x > 0 > y',
    choices: DS, answer: 3,
    explanation: 'Strict inequality holds exactly when x and y have opposite signs. (1) says exactly that; (2) is a specific case of it. Each alone — D.',
  },
  {
    id: 'ds-16', section: 'di', type: 'data-sufficiency', level: 10, topic: 'number properties',
    prompt: 'If m and n are positive integers and mn = 36, what is the value of m?\n\n(1) m > n\n(2) m is a multiple of 9',
    choices: DS, answer: 4,
    explanation: '(1) allows m = 36, 18, 12, 9. (2) allows m = 9, 18, 36. Together: 9, 18, and 36 all satisfy both (n = 4, 2, 1). Still not unique — E.',
  },
  // ------------------------------------------------------- two-part analysis
  {
    id: 'tp-01', section: 'di', type: 'two-part', level: 5, topic: 'linear models',
    prompt: 'A courier charges a fixed fee F plus r dollars per kilometer. A 10 km delivery costs $70 and a 15 km delivery costs $95.\n\nSelect the values of r and F.',
    choices: ['r = $5, F = $20', 'r = $5, F = $25', 'r = $7, F = $0', 'r = $4, F = $30', 'r = $6, F = $10'],
    answer: 0,
    explanation: '5 extra km cost $25 → r = 5. Then F = 70 − 50 = 20.',
  },
  {
    id: 'tp-02', section: 'di', type: 'two-part', level: 6, topic: 'mixtures',
    prompt: 'A blend of 10 kg is made from coffee A ($12/kg) and coffee B ($18/kg) and costs $150 total.\n\nSelect the kilograms of A and B in the blend.',
    choices: ['A = 5, B = 5', 'A = 6, B = 4', 'A = 4, B = 6', 'A = 7, B = 3', 'A = 3, B = 7'],
    answer: 0,
    explanation: '12a + 18(10 − a) = 150 → 180 − 6a = 150 → a = 5. So 5 kg of each.',
  },
  {
    id: 'tp-03', section: 'di', type: 'two-part', level: 7, topic: 'ages',
    prompt: 'Today, Ana is twice as old as Ben. Six years ago, Ana was three times as old as Ben.\n\nSelect Ana\'s and Ben\'s current ages.',
    choices: ['Ana = 24, Ben = 12', 'Ana = 20, Ben = 10', 'Ana = 30, Ben = 15', 'Ana = 18, Ben = 9', 'Ana = 36, Ben = 18'],
    answer: 0,
    explanation: 'A = 2B and A − 6 = 3(B − 6) → 2B − 6 = 3B − 18 → B = 12, A = 24. Check: 18 = 3 × 6. ✓',
  },
  {
    id: 'tp-04', section: 'di', type: 'two-part', level: 8, topic: 'interest',
    prompt: '$10,000 is split between account P earning 4% and account Q earning 7% (simple annual interest). The first year\'s combined interest is $580.\n\nSelect the amounts placed in P and Q.',
    choices: ['P = $4,000, Q = $6,000', 'P = $6,000, Q = $4,000', 'P = $5,000, Q = $5,000', 'P = $3,000, Q = $7,000', 'P = $7,000, Q = $3,000'],
    answer: 0,
    explanation: '0.04p + 0.07(10000 − p) = 580 → 700 − 0.03p = 580 → p = 4,000.',
  },
  {
    id: 'tp-05', section: 'di', type: 'two-part', level: 9, topic: 'work & rates',
    prompt: 'Working together, machines X and Y finish a batch in 4 hours. Machine X alone is twice as fast as machine Y alone.\n\nSelect the time each machine would need alone.',
    choices: ['X = 6 h, Y = 12 h', 'X = 5 h, Y = 10 h', 'X = 8 h, Y = 16 h', 'X = 4 h, Y = 8 h', 'X = 12 h, Y = 6 h'],
    answer: 0,
    explanation: 'If Y\'s rate is r, X\'s is 2r: 3r = 1/4 batch per hour → r = 1/12. Y takes 12 h, X takes 6 h.',
  },
  {
    id: 'tp-06', section: 'di', type: 'two-part', level: 10, topic: 'number properties',
    prompt: 'Two positive integers have a sum of 37, and one is 5 more than twice the other.\n\nSelect the smaller and larger integer.',
    choices: ['smaller = 10⅔ — impossible; no valid pair', 'smaller = 11, larger = 26', 'smaller = 12, larger = 25', 'smaller = 10, larger = 27', 'smaller = 13, larger = 24'],
    answer: 0,
    explanation: 'x + (2x + 5) = 37 → 3x = 32 → x is not an integer, so no such pair of positive integers exists. GMAT DI sometimes tests recognizing infeasibility.',
  },
  // -------------------------------------------------------- table analysis
  {
    id: 'ta-01', section: 'di', type: 'table-analysis', level: 3, topic: 'reading tables',
    figure: table(['Region', 'Q1 sales', 'Q2 sales'], [
      ['North', '$120K', '$150K'], ['South', '$95K', '$140K'],
      ['East', '$160K', '$135K'], ['West', '$110K', '$155K'],
    ]),
    prompt: 'Based on the table, which region had the highest Q2 sales?',
    choices: ['North', 'South', 'East', 'West', 'Cannot be determined'],
    answer: 3,
    explanation: 'Q2 column: West leads at $155K. East led in Q1 but declined — the columns invite exactly that mix-up.',
  },
  {
    id: 'ta-02', section: 'di', type: 'table-analysis', level: 5, topic: 'statistics',
    figure: table(['Salesperson', 'Deals closed'], [
      ['Ana', '14'], ['Bruno', '9'], ['Carla', '22'], ['Diego', '11'], ['Elena', '17'],
    ]),
    prompt: 'What is the median number of deals closed?',
    choices: ['11', '14', '14.6', '17', '22'],
    answer: 1,
    explanation: 'Sorted: 9, 11, 14, 17, 22 → the middle value is 14. (14.6 is the mean — a planted trap.)',
  },
  {
    id: 'ta-03', section: 'di', type: 'table-analysis', level: 6, topic: 'percent change',
    figure: table(['Product', '2024 units', '2025 units'], [
      ['Alpha', '800', '1,000'], ['Beta', '500', '650'], ['Gamma', '1,200', '1,380'], ['Delta', '400', '460'],
    ]),
    prompt: 'Which product had the greatest percent increase in units from 2024 to 2025?',
    choices: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Alpha and Beta tied'],
    answer: 1,
    explanation: 'Alpha +25%, Beta +30%, Gamma +15%, Delta +15%. Beta wins despite the smallest absolute base.',
  },
  {
    id: 'ta-04', section: 'di', type: 'table-analysis', level: 7, topic: 'ratios',
    figure: table(['Department', 'Employees', 'Laptops'], [
      ['Ops', '48', '36'], ['Sales', '30', '30'], ['Tech', '24', '48'], ['Finance', '18', '12'],
    ]),
    prompt: 'In which department is the ratio of laptops to employees exactly 2 : 1?',
    choices: ['Ops', 'Sales', 'Tech', 'Finance', 'None of the departments'],
    answer: 2,
    explanation: 'Tech: 48 laptops for 24 employees = 2 : 1. Sales is 1 : 1; Ops and Finance are below 1 : 1.',
  },
  {
    id: 'ta-05', section: 'di', type: 'table-analysis', level: 8, topic: 'multi-condition',
    figure: table(['City', 'Rent index', 'Salary index', 'Remote jobs %'], [
      ['Avalon', '85', '92', '38%'], ['Brixton', '110', '105', '45%'],
      ['Corda', '70', '78', '30%'], ['Duna', '95', '112', '52%'],
    ]),
    prompt: 'Consider the statement: "Every city whose salary index exceeds its rent index also has a remote-jobs share above 40%." Based on the table, the statement is:',
    choices: [
      'True — both qualifying cities are above 40%',
      'False — exactly one qualifying city is at or below 40%',
      'False — two qualifying cities are at or below 40%',
      'True — only one city qualifies and it is above 40%',
      'Cannot be evaluated from the table',
    ],
    answer: 2,
    explanation: 'Salary index exceeds rent index in Avalon (92 > 85), Corda (78 > 70), and Duna (112 > 95). Of those, Avalon (38%) and Corda (30%) are at or below 40% — two failures, so the statement is false. Missing Corda leads to the "exactly one" trap.',
  },
  {
    id: 'ta-06', section: 'di', type: 'table-analysis', level: 9, topic: 'weighted average',
    figure: table(['Fund', 'Assets ($M)', 'Return'], [
      ['Growth', '200', '+12%'], ['Income', '300', '+4%'], ['Global', '500', '+6%'],
    ]),
    prompt: 'What was the asset-weighted average return across the three funds?',
    choices: ['+6.0%', '+6.6%', '+7.0%', '+7.3%', '+8.0%'],
    answer: 1,
    explanation: '(200×12 + 300×4 + 500×6) / 1000 = (2400 + 1200 + 3000)/1000 = 6.6%. The unweighted mean (7.3%) is the trap.',
  },
  // -------------------------------------------- graphics interpretation
  {
    id: 'gi-01', section: 'di', type: 'graphics-interpretation', level: 4, topic: 'reading charts',
    figure: barFig('Monthly signups', ['Jan', 'Feb', 'Mar', 'Apr'], [120, 90, 180, 240]),
    prompt: 'Based on the chart, signups in March were how many times the signups in February?',
    choices: ['1.5', '2', '2.5', '3', '4'],
    answer: 1,
    explanation: 'March = 180 and February = 90, so 180 / 90 = 2. Read the bar labels before estimating from bar heights.',
  },
  {
    id: 'gi-02', section: 'di', type: 'graphics-interpretation', level: 6, topic: 'percent of total',
    figure: barFig('Revenue by product line ($M)', ['Core', 'Add-ons', 'Services'], [60, 25, 15]),
    prompt: 'Services revenue is what percent of total revenue?',
    choices: ['10%', '15%', '20%', '25%', '30%'],
    answer: 1,
    explanation: 'Total = 60 + 25 + 15 = 100, so Services = 15/100 = 15%. The round total is the gift — spot it before reaching for the calculator.',
  },
  {
    id: 'gi-03', section: 'di', type: 'graphics-interpretation', level: 8, topic: 'rate of change',
    figure: barFig('Active users (thousands)', ['2022', '2023', '2024', '2025'], [50, 75, 90, 108]),
    prompt: 'Between which two consecutive years was the percent growth in active users greatest?',
    choices: ['2022→2023', '2023→2024', '2024→2025', 'Growth was equal in all periods', 'Cannot be determined'],
    answer: 0,
    explanation: '2022→23: +50%. 2023→24: +20%. 2024→25: +20%. The largest absolute jump is not needed — the earliest period wins on percent.',
  },
  {
    id: 'gi-04', section: 'di', type: 'graphics-interpretation', level: 10, topic: 'combined reading',
    figure: barFig('Orders by channel (thousands)', ['Web', 'App', 'Phone', 'Partner'], [84, 126, 30, 60]),
    prompt: 'If the App channel grows 50% next year while all other channels stay flat, App orders will represent approximately what share of total orders?',
    choices: ['42%', '47%', '52%', '56%', '63%'],
    answer: 2,
    explanation: 'App grows to 189; new total = 84 + 189 + 30 + 60 = 363. Share = 189/363 ≈ 52%. Using the old total (300) gives the 63% trap.',
  },
];
