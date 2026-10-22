#!/usr/bin/env node
// Scrape GMAT Club forum threads into the trainer's bank format.
//
// Usage:
//   node scripts/scrape-gmatclub.mjs [--forum ps,ds,cr,rc] [--pages 3] [--limit 200]
//                                    [--out data/gmatclub.json] [--cookie "phpbb3_...=..."]
//                                    [--delay 1500] [--cache .cache/gmatclub]
//
// What it does:
//   1. Walks forum index pages (e.g. /forum/problem-solving-ps-140/index-50.html)
//      and collects thread URLs.
//   2. Fetches each thread, takes the first post as the question, splits the
//      answer choices (A)–(E), and looks for the official answer (OA) in the
//      spoiler block or in replies ("OA is C", "Answer: C").
//   3. Writes a JSON array of bank entries plus a `source` URL, a `topicTags`
//      list from the thread's tags, and `needsReview: true` whenever the stem,
//      choices or OA could not be read with confidence.
//
// Notes:
//   * GMAT Club hides the OA/timer stats from logged-out visitors on many
//     threads. Pass your browser's session cookie via --cookie to see them;
//     otherwise the OA is recovered from replies by majority vote.
//   * Raw HTML is cached under --cache so re-runs don't re-download.
//   * Only the public forum pages are read, at a polite rate (--delay ms).
//     Respect GMAT Club's terms of use; questions remain their/their
//     original authors' property. Keep the output for personal practice.

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

export const FORUMS = {
  ps: { id: 140, slug: 'problem-solving-ps',           section: 'quant',  type: 'problem-solving' },
  ds: { id: 141, slug: 'data-sufficiency-ds',           section: 'di',     type: 'data-sufficiency' },
  cr: { id: 139, slug: 'critical-reasoning-cr',         section: 'verbal', type: 'critical-reasoning' },
  rc: { id: 137, slug: 'reading-comprehension-rc',      section: 'verbal', type: 'reading-comprehension' },
};

const BASE = 'https://gmatclub.com';
const UA = 'Mozilla/5.0 (compatible; gmat-trainer-scraper/1.0; personal study use)';

// ------------------------------------------------------------------ helpers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', times: '×', minus: '−', deg: '°', frac12: '½', frac14: '¼', frac34: '¾', le: '≤', ge: '≥', ne: '≠', radic: '√', pi: 'π', sup2: '²', sup3: '³' };
export function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z0-9]+);/gi, (m, n) => ENTITIES[n] ?? m);
}

// HTML fragment → plain text with line breaks preserved for block elements.
export function htmlToText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|tr|h\d|blockquote|pre)>/gi, '\n')
      .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, ' $1 ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Split a post's text into stem + choices. Accepts "(A) …", "A. …", "A) …".
const CHOICE_RE = /(?:^|\n)\s*\(?([A-E])[\).:]\s*/g;
export function splitChoices(text) {
  const marks = [...text.matchAll(CHOICE_RE)];
  // Use the LAST run of A,B,C,D,E in order (the stem may mention "(A)" itself).
  let run = null;
  for (let i = 0; i + 4 < marks.length; i++) {
    const letters = marks.slice(i, i + 5).map((m) => m[1]).join('');
    if (letters === 'ABCDE') run = marks.slice(i, i + 5);
  }
  if (!run) return null;
  const stem = text.slice(0, run[0].index).trim();
  const choices = run.map((m, i) => {
    const start = m.index + m[0].length;
    const end = i < 4 ? run[i + 1].index : text.length;
    return text.slice(start, end).trim().split('\n')[0].trim();
  });
  if (choices.some((c) => !c)) return null;
  return { stem, choices };
}

// Find the OA in text. Returns 0-4 or null.
const OA_PATTERNS = [
  /official answer[^A-Za-z]{0,20}\(?([A-E])\)?(?![A-Za-z])/i,
  /\bOA\b[^A-Za-z]{0,10}(?:is|=|:)?[^A-Za-z]{0,10}\(?([A-E])\)?(?![A-Za-z])/,
  /\banswer\b[^A-Za-z]{0,6}(?:is|=|:)?[^A-Za-z]{0,6}\(?([A-E])\)?(?![A-Za-z])/i,
  /\bans\b[^A-Za-z]{0,6}\(?([A-E])\)?(?![A-Za-z])/i,
];
export function findOA(text) {
  for (const re of OA_PATTERNS) {
    const m = text.match(re);
    if (m) return 'ABCDE'.indexOf(m[1].toUpperCase());
  }
  return null;
}

// Majority vote of OA mentions across reply texts.
export function voteOA(replies) {
  const tally = [0, 0, 0, 0, 0];
  for (const r of replies) {
    const idx = findOA(r);
    if (idx !== null) tally[idx]++;
  }
  const max = Math.max(...tally);
  if (max === 0) return { answer: null, confidence: 0 };
  const total = tally.reduce((a, b) => a + b, 0);
  return { answer: tally.indexOf(max), confidence: max / total, votes: tally };
}

// Pull the thread page apart into posts. phpBB (GMAT Club) wraps each post in
// a container with id="p<number>"; the first such block is the question.
export function splitPosts(html) {
  const parts = html.split(/(?=<div[^>]+id="p\d+")/);
  const posts = parts.filter((p) => /^<div[^>]+id="p\d+"/.test(p));
  if (posts.length) return posts;
  // Fallback: split on common post-body markers.
  const alt = html.split(/(?=<div[^>]+class="[^"]*\b(?:postbody|post-content|item text)\b)/);
  return alt.length > 1 ? alt.slice(1) : [html];
}

// Spoiler/OA box inside the first post, when visible (logged-in).
export function spoilerText(postHtml) {
  const m = postHtml.match(/<div[^>]+class="[^"]*\b(?:spoiler|oa|timer-oa|showAnswer)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  return m ? htmlToText(m[1]) : '';
}

export function threadTags(html) {
  const tags = new Set();
  for (const m of html.matchAll(/\/forum\/search\.php\?[^"]*tag_id=\d+[^"]*"[^>]*>([^<]+)</gi)) tags.add(htmlToText(m[1]).trim());
  for (const m of html.matchAll(/class="[^"]*\btag\b[^"]*"[^>]*>([^<]{2,40})</gi)) tags.add(htmlToText(m[1]).trim());
  return [...tags].filter(Boolean);
}

// Difficulty: GMAT Club tags threads "Sub 505 Level", "505-555 Level", … "805+ Level"
// (and historically "Sub 600 Level", "600-700 Level", "700 Level").
export function levelFromTags(tags) {
  const t = tags.join(' ').toLowerCase();
  if (/805\+|800\+/.test(t)) return 10;
  if (/755-805|750\+|700\s*level|700-?800/.test(t)) return 9;
  if (/705-755|700\+/.test(t)) return 8;
  if (/655-705|650-?700/.test(t)) return 7;
  if (/605-655|600-?700/.test(t)) return 6;
  if (/555-605/.test(t)) return 5;
  if (/505-555|sub 600/.test(t)) return 4;
  if (/sub 505/.test(t)) return 3;
  return 6;
}

export function parseThread(html, url, forum) {
  const posts = splitPosts(html);
  const firstHtml = posts[0];
  const firstText = htmlToText(firstHtml);
  const tags = threadTags(html);
  const split = splitChoices(firstText);
  let needsReview = false;
  let stem = split ? split.stem : firstText;
  let choices = split ? split.choices : [];

  // Trim the stem: drop any leading "Tags:" / author lines and the OA spoiler
  // text that phpBB prints after the question.
  stem = stem
    .replace(/^(?:[^\n]*(?:wrote|posted|joined|posts:|kudos)[^\n]*\n)+/i, '')
    .replace(/\n*(?:show spoiler|spoiler|official answer)[\s\S]*$/i, '')
    .replace(/\n*(?:the timer is|most helpful|attachment)[\s\S]*$/i, '')
    .trim();

  // Reading comprehension: passage and question are usually separated by a
  // blank line and the question starts with a number ("1.") or "Question".
  let passage;
  if (forum.type === 'reading-comprehension') {
    const idx = stem.search(/\n\s*(?:question\s*)?1[\).]\s/i);
    if (idx > 0) { passage = stem.slice(0, idx).trim(); stem = stem.slice(idx).trim(); }
    else needsReview = true;
  }

  if (forum.type === 'data-sufficiency' && !choices.length) {
    choices = [
      'Statement (1) ALONE is sufficient, but statement (2) alone is not sufficient.',
      'Statement (2) ALONE is sufficient, but statement (1) alone is not sufficient.',
      'BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.',
      'EACH statement ALONE is sufficient.',
      'Statements (1) and (2) TOGETHER are NOT sufficient.',
    ];
  }
  if (choices.length !== 5) needsReview = true;

  // OA: spoiler in the first post → explicit OA line in the first post → vote across replies.
  let answer = findOA(spoilerText(firstHtml));
  let confidence = answer !== null ? 1 : 0;
  if (answer === null) {
    const oaLine = firstText.match(/(?:official answer|\bOA\b)[^\n]*/i);
    if (oaLine) { answer = findOA(oaLine[0]); confidence = answer !== null ? 1 : 0; }
  }
  if (answer === null) {
    const vote = voteOA(posts.slice(1).map(htmlToText));
    answer = vote.answer; confidence = vote.confidence;
  }
  if (answer === null || confidence < 0.6) needsReview = true;

  const id = (url.match(/-(\d+)\.html/) || [])[1] || url;
  return {
    id: `gc-${forum.type.split('-').map((w) => w[0]).join('')}-${id}`,
    section: forum.section,
    type: forum.type,
    level: levelFromTags(tags),
    topic: (tags.find((t) => !/level|source|difficulty|gmat/i.test(t)) || forum.type).toLowerCase(),
    ...(passage ? { passage } : {}),
    prompt: stem,
    choices,
    answer,
    explanation: 'See the GMAT Club discussion for solutions.',
    source: url,
    topicTags: tags,
    oaConfidence: +confidence.toFixed(2),
    ...(needsReview ? { needsReview: true } : {}),
  };
}

// Thread links on a forum index page.
export function threadLinks(html, forum) {
  const seen = new Set();
  const out = [];
  for (const m of html.matchAll(/href="(?:https?:\/\/gmatclub\.com)?(\/forum\/([a-z0-9-]+)-(\d+)\.html)"/gi)) {
    const [, path, slug, id] = m;
    if (seen.has(id)) continue;
    if (/^(index|topic|post|p)\d*$/.test(slug)) continue;
    if (slug === `${forum.slug}-${forum.id}` || /^[a-z-]+-\d+-\d+$/.test(path.slice(7))) continue; // forum/page links
    seen.add(id);
    out.push(BASE + path);
  }
  return out;
}

// ------------------------------------------------------------------ fetching
async function fetchCached(url, { cacheDir, cookie, delay }) {
  const key = url.replace(/[^a-z0-9]+/gi, '_').slice(-150);
  const file = join(cacheDir, key + '.html');
  try { await access(file); return readFile(file, 'utf8'); } catch {}
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html', ...(cookie ? { cookie } : {}) } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const html = await res.text();
  await writeFile(file, html);
  await sleep(delay);
  return html;
}

function parseArgs(argv) {
  const o = { forum: 'ps,ds,cr', pages: 2, limit: 150, out: 'data/gmatclub.json', cookie: process.env.GMATCLUB_COOKIE || '', delay: 1500, cache: '.cache/gmatclub' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const k = a.slice(2); o[k] = argv[i + 1] !== undefined && !argv[i + 1].startsWith('--') ? argv[++i] : true; }
  }
  o.pages = +o.pages; o.limit = +o.limit; o.delay = +o.delay;
  return o;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  await mkdir(opts.cache, { recursive: true });
  const results = [];
  for (const key of opts.forum.split(',')) {
    const forum = FORUMS[key.trim()];
    if (!forum) { console.error(`unknown forum "${key}" (use ${Object.keys(FORUMS).join(', ')})`); continue; }
    const urls = [];
    for (let p = 0; p < opts.pages; p++) {
      const index = `${BASE}/forum/${forum.slug}-${forum.id}/${p ? `index-${p * 50}.html` : ''}`;
      try {
        const html = await fetchCached(index, { cacheDir: opts.cache, cookie: opts.cookie, delay: opts.delay });
        urls.push(...threadLinks(html, forum));
      } catch (e) { console.error(`index failed: ${e.message}`); }
    }
    console.error(`${key}: ${urls.length} threads found`);
    for (const url of urls.slice(0, opts.limit)) {
      try {
        const html = await fetchCached(url, { cacheDir: opts.cache, cookie: opts.cookie, delay: opts.delay });
        const q = parseThread(html, url, forum);
        results.push(q);
        console.error(`${q.needsReview ? '?' : '+'} ${q.id} OA=${q.answer === null ? '-' : 'ABCDE'[q.answer]} ${url}`);
      } catch (e) { console.error(`thread failed: ${e.message}`); }
    }
  }
  await mkdir(join(opts.out, '..'), { recursive: true });
  await writeFile(opts.out, JSON.stringify(results, null, 2));
  const ok = results.filter((r) => !r.needsReview).length;
  console.error(`wrote ${results.length} questions to ${opts.out} (${ok} clean, ${results.length - ok} need review)`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
