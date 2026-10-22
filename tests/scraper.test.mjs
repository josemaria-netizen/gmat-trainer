// Parser tests for scripts/scrape-gmatclub.mjs — run: node tests/scraper.test.mjs
import assert from 'node:assert/strict';
import { htmlToText, splitChoices, findOA, voteOA, parseThread, threadLinks, levelFromTags, FORUMS } from '../scripts/scrape-gmatclub.mjs';

let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok', name); };

t('htmlToText keeps line breaks and decodes entities', () => {
  assert.equal(htmlToText('<p>If x &gt; 2,<br>then x&sup2; &ge; 4</p><div>(A) 1</div>'), 'If x > 2,\nthen x² ≥ 4\n(A) 1');
});

t('splitChoices handles (A) and A. styles', () => {
  const s = splitChoices('What is 2+2?\n(A) 3\n(B) 4\n(C) 5\n(D) 6\n(E) 7');
  assert.deepEqual(s, { stem: 'What is 2+2?', choices: ['3', '4', '5', '6', '7'] });
  const s2 = splitChoices('Pick one.\nA. one\nB. two\nC. three\nD. four\nE. five\n');
  assert.deepEqual(s2.choices, ['one', 'two', 'three', 'four', 'five']);
  assert.equal(splitChoices('no choices here'), null);
});

t('findOA reads OA / Answer forms', () => {
  assert.equal(findOA('OA is C'), 2);
  assert.equal(findOA('Official Answer: (E)'), 4);
  assert.equal(findOA('Answer: B.'), 1);
  assert.equal(findOA('I think the answer should be 12'), null);
});

t('voteOA takes the majority', () => {
  const v = voteOA(['Answer: C', 'OA is C', 'ans D']);
  assert.equal(v.answer, 2); assert.ok(v.confidence > 0.6);
});

t('levelFromTags maps GMAT Club difficulty tags', () => {
  assert.equal(levelFromTags(['705-755 Level', 'Algebra']), 8);
  assert.equal(levelFromTags(['Sub 505 Level']), 3);
});

t('threadLinks skips pagination and forum links', () => {
  const html = '<a href="/forum/problem-solving-ps-140/index-50.html">next</a><a href="/forum/if-x-is-an-integer-123456.html">q</a><a href="https://gmatclub.com/forum/if-x-is-an-integer-123456.html">dup</a>';
  assert.deepEqual(threadLinks(html, FORUMS.ps), ['https://gmatclub.com/forum/if-x-is-an-integer-123456.html']);
});

t('parseThread builds a bank entry from phpBB-style posts', () => {
  const html = `<html><body>
  <a href="/forum/search.php?tag_id=5">705-755 Level</a><a href="/forum/search.php?tag_id=9">Remainders</a>
  <div id="p100" class="post"><div class="postbody">When 10 is divided by n, the remainder is n − 4. What is n?<br>(A) 5<br>(B) 6<br>(C) 7<br>(D) 8<br>(E) 9</div></div>
  <div id="p101" class="post"><div class="postbody">10 = 7·1 + 3 and 7 − 4 = 3. Answer: C</div></div>
  <div id="p102" class="post"><div class="postbody">OA is C</div></div>
  </body></html>`;
  const q = parseThread(html, 'https://gmatclub.com/forum/when-10-is-divided-168775.html', FORUMS.ps);
  assert.equal(q.id, 'gc-ps-168775');
  assert.equal(q.prompt, 'When 10 is divided by n, the remainder is n − 4. What is n?');
  assert.deepEqual(q.choices, ['5', '6', '7', '8', '9']);
  assert.equal(q.answer, 2);
  assert.equal(q.level, 8);
  assert.equal(q.topic, 'remainders');
  assert.equal(q.needsReview, undefined);
});

console.log(`${n} scraper tests passed`);
