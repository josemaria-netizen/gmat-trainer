// Authored Quant bank (problem solving), levels 4-10.
// GMAT Focus style: arithmetic, algebra, word problems — no geometry.

export const QUANT = [
  // ---------------------------------------------------------------- level 4
  {
    id: 'q4-01', section: 'quant', type: 'problem-solving', level: 4, topic: 'linear equations',
    prompt: 'If 3x − 7 = 11, what is the value of x + 2?',
    choices: ['6', '8', '9', '11', '13'], answer: 1,
    explanation: '3x = 18, so x = 6 and x + 2 = 8. Watch for the trap of answering x itself (6).',
  },
  {
    id: 'q4-02', section: 'quant', type: 'problem-solving', level: 4, topic: 'ratios',
    prompt: 'Two numbers are in the ratio 3 : 5 and their sum is 64. What is the smaller number?',
    choices: ['18', '21', '24', '30', '40'], answer: 2,
    explanation: '8 ratio parts = 64, so 1 part = 8. Smaller number = 3 × 8 = 24.',
  },
  {
    id: 'q4-03', section: 'quant', type: 'problem-solving', level: 4, topic: 'percentages',
    prompt: 'A diner bill is $60 before tip. After adding a 15% tip, what is the total amount paid?',
    choices: ['$63', '$66', '$69', '$72', '$75'], answer: 2,
    explanation: '15% of 60 = 9, so the total is $69. Shortcut: 60 × 1.15.',
  },
  {
    id: 'q4-04', section: 'quant', type: 'problem-solving', level: 4, topic: 'exponents',
    prompt: 'What is the value of 2⁵ × 2³?',
    choices: ['2⁸ = 256', '2¹⁵ = 32,768', '4⁸ = 65,536', '2² = 4', '64'], answer: 0,
    explanation: 'Same base: add the exponents. 2⁵ × 2³ = 2⁸ = 256. Multiplying exponents (2¹⁵) is the classic trap.',
  },
  {
    id: 'q4-05', section: 'quant', type: 'problem-solving', level: 4, topic: 'averages',
    prompt: 'The average of four numbers is 15. Three of the numbers are 12, 18, and 10. What is the fourth?',
    choices: ['15', '17', '20', '22', '25'], answer: 2,
    explanation: 'The four numbers must sum to 4 × 15 = 60. The three given sum to 40, so the fourth is 20.',
  },
  {
    id: 'q4-06', section: 'quant', type: 'problem-solving', level: 4, topic: 'percentages',
    prompt: 'After a 25% markup, a shirt sells for $40. What was the price before the markup?',
    choices: ['$28', '$30', '$32', '$34', '$36'], answer: 2,
    explanation: 'Original × 1.25 = 40, so original = 40 / 1.25 = $32. Subtracting 25% of 40 ($30) is the trap.',
  },
  {
    id: 'q4-07', section: 'quant', type: 'problem-solving', level: 4, topic: 'sequences',
    prompt: 'In a sequence, each term is 3 greater than the previous term. If the first term is 4, what is the 12th term?',
    choices: ['34', '37', '40', '43', '48'], answer: 1,
    explanation: '12th term = 4 + 11 × 3 = 37. There are 11 steps from term 1 to term 12, not 12.',
  },
  // ---------------------------------------------------------------- level 5
  {
    id: 'q5-01', section: 'quant', type: 'problem-solving', level: 5, topic: 'quadratics',
    prompt: 'If x² − 5x + 6 = 0, what is the sum of all possible values of x?',
    choices: ['−5', '2', '3', '5', '6'], answer: 3,
    explanation: '(x − 2)(x − 3) = 0, so x = 2 or 3; sum = 5. Faster: for x² + bx + c, the roots sum to −b.',
  },
  {
    id: 'q5-02', section: 'quant', type: 'problem-solving', level: 5, topic: 'percentages',
    prompt: 'What is 40% of 25% of 200?',
    choices: ['10', '15', '20', '25', '50'], answer: 2,
    explanation: '25% of 200 = 50; 40% of 50 = 20. Chained percentages multiply: 0.4 × 0.25 × 200.',
  },
  {
    id: 'q5-03', section: 'quant', type: 'problem-solving', level: 5, topic: 'rates',
    prompt: 'A train travels 240 km in 3 hours, then 260 km in 2 hours. What is its average speed for the whole trip, in km/h?',
    choices: ['90', '95', '100', '105', '110'], answer: 2,
    explanation: 'Average speed = total distance / total time = 500 / 5 = 100 km/h. Never average the two speeds directly.',
  },
  {
    id: 'q5-04', section: 'quant', type: 'problem-solving', level: 5, topic: 'rates',
    prompt: 'If 5 machines make 5 widgets in 5 minutes, how many minutes do 100 machines need to make 100 widgets?',
    choices: ['1', '5', '20', '50', '100'], answer: 1,
    explanation: 'Each machine makes 1 widget in 5 minutes. 100 machines make 100 widgets in the same 5 minutes.',
  },
  {
    id: 'q5-05', section: 'quant', type: 'problem-solving', level: 5, topic: 'integers',
    prompt: 'The sum of three consecutive integers is 48. What is the largest of the three?',
    choices: ['15', '16', '17', '18', '19'], answer: 2,
    explanation: 'n + (n+1) + (n+2) = 48 → n = 15, so the integers are 15, 16, 17. Largest = 17.',
  },
  {
    id: 'q5-06', section: 'quant', type: 'problem-solving', level: 5, topic: 'interest',
    prompt: 'How much simple interest does $2,000 earn at 6% per year for 3 years?',
    choices: ['$120', '$180', '$240', '$360', '$382'], answer: 3,
    explanation: 'Simple interest = principal × rate × time = 2000 × 0.06 × 3 = $360.',
  },
  {
    id: 'q5-07', section: 'quant', type: 'problem-solving', level: 5, topic: 'absolute value',
    prompt: 'If |x − 3| = 7, what is the sum of all possible values of x?',
    choices: ['−4', '3', '6', '10', '14'], answer: 2,
    explanation: 'x − 3 = ±7 → x = 10 or x = −4. Sum = 6. (The solutions are symmetric around 3, so the sum is 2 × 3.)',
  },
  // ---------------------------------------------------------------- level 6
  {
    id: 'q6-01', section: 'quant', type: 'problem-solving', level: 6, topic: 'number properties',
    prompt: 'If n is a positive integer and n² is divisible by 12, what is the smallest possible value of n?',
    choices: ['2', '3', '4', '6', '12'], answer: 3,
    explanation: '12 = 2² × 3. For n² to contain 2² × 3, n must contain 2 × 3 (primes in n² come in pairs). n = 6 works: 36/12 = 3.',
  },
  {
    id: 'q6-02', section: 'quant', type: 'problem-solving', level: 6, topic: 'mixtures',
    prompt: '2 liters of a 30% acid solution are mixed with 1 liter of a 60% acid solution. What is the acid concentration of the mixture?',
    choices: ['36%', '40%', '42%', '45%', '48%'], answer: 1,
    explanation: 'Acid: 0.6 + 0.6 = 1.2 L in 3 L total → 40%. Weighted toward the 30% solution since there is more of it.',
  },
  {
    id: 'q6-03', section: 'quant', type: 'problem-solving', level: 6, topic: 'algebra',
    prompt: 'If x + y = 10 and xy = 21, what is the value of x² + y²?',
    choices: ['52', '58', '62', '79', '100'], answer: 1,
    explanation: '(x + y)² = x² + 2xy + y² → 100 = x² + y² + 42 → x² + y² = 58. Know this identity cold.',
  },
  {
    id: 'q6-04', section: 'quant', type: 'problem-solving', level: 6, topic: 'number properties',
    prompt: 'What is the units digit of 7⁴³?',
    choices: ['1', '3', '7', '9', '0'], answer: 1,
    explanation: 'Units digits of powers of 7 cycle 7, 9, 3, 1. 43 = 4 × 10 + 3, so it matches the 3rd position: 3.',
  },
  {
    id: 'q6-05', section: 'quant', type: 'problem-solving', level: 6, topic: 'work & rates',
    prompt: 'Working alone, pump A fills a tank in 6 hours and pump B fills it in 3 hours. Working together, how long do they take?',
    choices: ['1.5 hours', '2 hours', '2.5 hours', '4.5 hours', '9 hours'], answer: 1,
    explanation: 'Rates add: 1/6 + 1/3 = 1/2 tank per hour → 2 hours. Together is always faster than the fastest alone.',
  },
  {
    id: 'q6-06', section: 'quant', type: 'problem-solving', level: 6, topic: 'percentages',
    prompt: 'A stock price rises 20% one month and falls 20% the next. Over the two months, the price has:',
    choices: ['not changed', 'fallen 2%', 'fallen 4%', 'risen 4%', 'fallen 8%'], answer: 2,
    explanation: '1.20 × 0.80 = 0.96 — a net 4% loss. Equal up/down percentages never cancel; the base changes.',
  },
  {
    id: 'q6-07', section: 'quant', type: 'problem-solving', level: 6, topic: 'averages',
    prompt: 'The average of 5 numbers is 20. When one number is removed, the average of the remaining 4 is 18. What number was removed?',
    choices: ['22', '24', '26', '28', '30'], answer: 3,
    explanation: 'Total drops from 100 to 72, so the removed number is 28.',
  },
  // ---------------------------------------------------------------- level 7
  {
    id: 'q7-01', section: 'quant', type: 'problem-solving', level: 7, topic: 'counting',
    prompt: 'How many integers from 1 to 100 inclusive are divisible by 3 or by 5?',
    choices: ['33', '41', '47', '53', '55'], answer: 2,
    explanation: 'Div by 3: 33. Div by 5: 20. Div by 15 (double-counted): 6. So 33 + 20 − 6 = 47.',
  },
  {
    id: 'q7-02', section: 'quant', type: 'problem-solving', level: 7, topic: 'interest',
    prompt: '$1,000 is invested at 10% annual interest, compounded annually. How much interest is earned after 2 years?',
    choices: ['$200', '$210', '$220', '$221', '$300'], answer: 1,
    explanation: '1000 × 1.1² = 1210, so interest = $210. The extra $10 over simple interest is interest on the first year\'s interest.',
  },
  {
    id: 'q7-03', section: 'quant', type: 'problem-solving', level: 7, topic: 'exponents',
    prompt: 'If 2ˣ = 32⁽ˣ⁻⁴⁾, what is the value of x?',
    choices: ['2', '4', '5', '8', '10'], answer: 2,
    explanation: '32 = 2⁵, so 2ˣ = 2⁵ˣ⁻²⁰ → x = 5x − 20 → x = 5.',
  },
  {
    id: 'q7-04', section: 'quant', type: 'problem-solving', level: 7, topic: 'combinatorics',
    prompt: 'A committee of 2 people is to be chosen from 6 candidates. How many different committees are possible?',
    choices: ['12', '15', '20', '30', '36'], answer: 1,
    explanation: 'Order doesn\'t matter: C(6,2) = (6 × 5)/2 = 15. Choosing 30 counts each pair twice.',
  },
  {
    id: 'q7-05', section: 'quant', type: 'problem-solving', level: 7, topic: 'ratios',
    prompt: 'If a : b = 2 : 3 and b : c = 4 : 5, what is a : c?',
    choices: ['2 : 5', '3 : 4', '8 : 15', '6 : 5', '10 : 12'], answer: 2,
    explanation: 'Scale both ratios so b matches: a : b = 8 : 12 and b : c = 12 : 15, so a : c = 8 : 15.',
  },
  {
    id: 'q7-06', section: 'quant', type: 'problem-solving', level: 7, topic: 'remainders',
    prompt: 'When n is divided by 7, the remainder is 3. What is the remainder when 2n is divided by 7?',
    choices: ['1', '3', '5', '6', 'It cannot be determined'], answer: 3,
    explanation: 'n = 7k + 3 → 2n = 14k + 6, and 14k is divisible by 7, so the remainder is 6.',
  },
  {
    id: 'q7-07', section: 'quant', type: 'problem-solving', level: 7, topic: 'percentages',
    prompt: 'A is 40% greater than B, and B is 20% less than C. If C = 100, what is A?',
    choices: ['108', '112', '116', '120', '140'], answer: 1,
    explanation: 'B = 0.8 × 100 = 80; A = 1.4 × 80 = 112.',
  },
  // ---------------------------------------------------------------- level 8
  {
    id: 'q8-01', section: 'quant', type: 'problem-solving', level: 8, topic: 'overlapping sets',
    prompt: 'Of 60 students, 35 study math, 40 study physics, and 10 study neither. How many study both?',
    choices: ['15', '20', '25', '30', '35'], answer: 2,
    explanation: '50 study at least one subject. Both = 35 + 40 − 50 = 25.',
  },
  {
    id: 'q8-02', section: 'quant', type: 'problem-solving', level: 8, topic: 'probability',
    prompt: 'Two fair dice are rolled. What is the probability that the sum is 8?',
    choices: ['1/6', '1/8', '5/36', '1/9', '7/36'], answer: 2,
    explanation: 'Favorable: (2,6),(3,5),(4,4),(5,3),(6,2) = 5 of 36 outcomes → 5/36.',
  },
  {
    id: 'q8-03', section: 'quant', type: 'problem-solving', level: 8, topic: 'inequalities',
    prompt: 'If x² < x, which of the following must be true?',
    choices: ['x < 0', 'x > 1', '0 < x < 1', 'x < −1', '−1 < x < 0'], answer: 2,
    explanation: 'x² < x → x(x − 1) < 0 → the factors have opposite signs → 0 < x < 1. Only fractions between 0 and 1 shrink when squared.',
  },
  {
    id: 'q8-04', section: 'quant', type: 'problem-solving', level: 8, topic: 'weighted average',
    prompt: 'Class A (20 students) averaged 70 on a test; class B (30 students) averaged 80. What is the combined average?',
    choices: ['74', '75', '76', '77', '78'], answer: 2,
    explanation: '(20 × 70 + 30 × 80) / 50 = (1400 + 2400) / 50 = 76. Weighted toward the larger class.',
  },
  {
    id: 'q8-05', section: 'quant', type: 'problem-solving', level: 8, topic: 'work & rates',
    prompt: 'A pipe fills a tank in 4 hours; a drain empties it in 6 hours. With the tank empty and both open, how long until the tank is full?',
    choices: ['8 hours', '10 hours', '12 hours', '15 hours', '24 hours'], answer: 2,
    explanation: 'Net rate = 1/4 − 1/6 = 1/12 tank per hour → 12 hours.',
  },
  {
    id: 'q8-06', section: 'quant', type: 'problem-solving', level: 8, topic: 'sequences',
    prompt: 'What is the sum of the integers from 1 to 50 inclusive?',
    choices: ['1,225', '1,250', '1,275', '1,300', '2,550'], answer: 2,
    explanation: 'Sum = n(n+1)/2 = 50 × 51 / 2 = 1,275.',
  },
  {
    id: 'q8-07', section: 'quant', type: 'problem-solving', level: 8, topic: 'ratios',
    prompt: 'If x/y = 3/4 and x + y = 84, what is y − x?',
    choices: ['8', '10', '12', '14', '21'], answer: 2,
    explanation: '7 ratio parts = 84 → 1 part = 12. x = 36, y = 48, difference = 12.',
  },
  // ---------------------------------------------------------------- level 9
  {
    id: 'q9-01', section: 'quant', type: 'problem-solving', level: 9, topic: 'number properties',
    prompt: 'How many positive divisors does 360 have?',
    choices: ['18', '20', '22', '24', '26'], answer: 3,
    explanation: '360 = 2³ × 3² × 5. Divisor count = (3+1)(2+1)(1+1) = 24.',
  },
  {
    id: 'q9-02', section: 'quant', type: 'problem-solving', level: 9, topic: 'probability',
    prompt: 'A fair coin is flipped 3 times. What is the probability of getting at least one head?',
    choices: ['1/2', '3/4', '5/8', '7/8', '3/8'], answer: 3,
    explanation: 'P(at least one head) = 1 − P(all tails) = 1 − (1/2)³ = 7/8. "At least one" almost always means computing the complement.',
  },
  {
    id: 'q9-03', section: 'quant', type: 'problem-solving', level: 9, topic: 'number properties',
    prompt: 'In how many zeros does 25! (25 factorial) end?',
    choices: ['4', '5', '6', '7', '10'], answer: 2,
    explanation: 'Trailing zeros come from factors of 5 (2s are plentiful): ⌊25/5⌋ + ⌊25/25⌋ = 5 + 1 = 6.',
  },
  {
    id: 'q9-04', section: 'quant', type: 'problem-solving', level: 9, topic: 'algebra',
    prompt: 'If x > 0 and x² + 1/x² = 7, what is the value of x + 1/x?',
    choices: ['√7', '3', '7', '9', '2√2'], answer: 1,
    explanation: '(x + 1/x)² = x² + 2 + 1/x² = 9, and since x > 0 the sum is positive: x + 1/x = 3.',
  },
  {
    id: 'q9-05', section: 'quant', type: 'problem-solving', level: 9, topic: 'sequences',
    prompt: 'What is the sum of all odd integers from 1 to 99 inclusive?',
    choices: ['2,401', '2,450', '2,475', '2,500', '4,950'], answer: 3,
    explanation: 'There are 50 odd integers; the sum of the first n odd numbers is n², so 50² = 2,500.',
  },
  {
    id: 'q9-06', section: 'quant', type: 'problem-solving', level: 9, topic: 'combinatorics',
    prompt: 'How many distinct arrangements are there of the letters in LEVEL?',
    choices: ['20', '24', '30', '60', '120'], answer: 2,
    explanation: '5 letters with L twice and E twice: 5! / (2! × 2!) = 120 / 4 = 30.',
  },
  {
    id: 'q9-07', section: 'quant', type: 'problem-solving', level: 9, topic: 'rates',
    prompt: 'A car drives from A to B at 60 km/h and returns along the same road at 40 km/h. What is its average speed for the round trip, in km/h?',
    choices: ['45', '48', '50', '52', '55'], answer: 1,
    explanation: 'Harmonic mean, not arithmetic: 2 × 60 × 40 / (60 + 40) = 48. More time is spent at the slower speed.',
  },
  // ---------------------------------------------------------------- level 10
  {
    id: 'q10-01', section: 'quant', type: 'problem-solving', level: 10, topic: 'remainders',
    prompt: 'When positive integer k is divided by 12, the remainder is 5. What is the remainder when k² is divided by 8?',
    choices: ['0', '1', '2', '4', '5'], answer: 1,
    explanation: 'k = 12q + 5 → k² = 144q² + 120q + 25. Both 144q² and 120q are divisible by 8, and 25 = 24 + 1, so the remainder is 1.',
  },
  {
    id: 'q10-02', section: 'quant', type: 'problem-solving', level: 10, topic: 'number properties',
    prompt: 'Which of the following fractions is a terminating decimal?',
    choices: ['5/12', '3/40', '7/30', '2/21', '11/14'], answer: 1,
    explanation: 'A fraction terminates only if its reduced denominator has no prime factors other than 2 and 5. 40 = 2³ × 5 → 3/40 = 0.075.',
  },
  {
    id: 'q10-03', section: 'quant', type: 'problem-solving', level: 10, topic: 'probability',
    prompt: 'A bag holds 4 red and 3 blue marbles. Two are drawn at random without replacement. What is the probability both are red?',
    choices: ['16/49', '2/7', '12/49', '4/7', '1/3'], answer: 1,
    explanation: '(4/7) × (3/6) = 12/42 = 2/7. The second draw comes from 6 marbles, 3 of them red.',
  },
  {
    id: 'q10-04', section: 'quant', type: 'problem-solving', level: 10, topic: 'exponents',
    prompt: 'If x and y are positive integers and 2ˣ × 5ʸ = 8,000, what is x + y?',
    choices: ['7', '8', '9', '10', '12'], answer: 2,
    explanation: '8,000 = 8 × 1,000 = 2³ × (2³ × 5³) = 2⁶ × 5³, so x + y = 6 + 3 = 9.',
  },
  {
    id: 'q10-05', section: 'quant', type: 'problem-solving', level: 10, topic: 'functions',
    prompt: 'If f(x) = x² − 2x, what is f(f(1))?',
    choices: ['−1', '0', '1', '3', '8'], answer: 3,
    explanation: 'f(1) = 1 − 2 = −1; f(−1) = 1 + 2 = 3.',
  },
  {
    id: 'q10-06', section: 'quant', type: 'problem-solving', level: 10, topic: 'inequalities',
    prompt: 'How many integer values of x satisfy |2x − 3| < 7?',
    choices: ['4', '5', '6', '7', '8'], answer: 2,
    explanation: '−7 < 2x − 3 < 7 → −2 < x < 5 → x ∈ {−1, 0, 1, 2, 3, 4}: 6 integers.',
  },
  {
    id: 'q10-07', section: 'quant', type: 'problem-solving', level: 10, topic: 'work & rates',
    prompt: 'Pipe A alone fills a pool in 5 hours. A works alone for 2 hours, then pipe B (which alone fills the pool in 10 hours) joins. How many hours in total does the job take?',
    choices: ['3', '3.5', '4', '4.5', '5'], answer: 2,
    explanation: 'After 2 hours, 2/5 is done. Combined rate = 1/5 + 1/10 = 3/10 per hour, so the remaining 3/5 takes 2 hours. Total = 4 hours.',
  },
];
