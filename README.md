# GMAT Trainer

Adaptive GMAT **Focus Edition** practice as an installable PWA — no build step,
no backend, no accounts. Everything runs and is stored on your device.

## What it does

- **Practice** — adaptive question drilling across the three GMAT Focus sections:
  - **Quant** (problem solving: arithmetic, algebra, word problems)
  - **Verbal** (critical reasoning + reading comprehension)
  - **Data Insights** (data sufficiency, table analysis, two-part analysis,
    graphics interpretation)

  Questions are tagged **level 1–10**. Level 1 is literally "what is 6 × 7";
  level 10 is 700+-style multi-step reasoning. Three consecutive correct answers
  step you up a level; two consecutive misses step you down — a gentle echo of
  the real computer-adaptive exam. Quant levels 1–3 are procedurally generated,
  so the basics never run out. Every question is timed (the timer turns red past
  the ~2 min/question GMAT pace) and ends with an explanation.

- **Stats** — questions answered, right/wrong, accuracy by section and by level,
  average time per question, day streak, and daily volume. Export/import a JSON
  backup to move devices.

- **Tracker** — log full practice tests on the GMAT Focus scales (sections
  60–90, total 205–805) with a target score line, per-section score trends, and
  a weekly study-hours chart, plus a study log with topics and error notes.

## Question sources

All questions in the bank are **original**, written to replicate the GMAT Focus
format, topic distribution, and difficulty ladder. Official GMAT questions are
copyrighted and are not included. For the real thing, use GMAC's free resources:

- [GMAT Official Starter Kit + Practice Exams 1 & 2](https://www.mba.com/exam-prep/gmat-official-starter-kit-practice-exams-1-and-2) (free)
- [GMAT Focus format overview](https://www.mba.com/exams/gmat-exam)

## Install on your phone

Open the site, then:

- **iOS Safari** — Share → *Add to Home Screen*
- **Android Chrome** — menu → *Install app*

Once installed it works offline (service worker cache). All progress lives in
`localStorage` on the device — use **Stats → Export backup** before switching
phones or clearing the browser.

## Development

Static ES modules — any file server works:

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

Logic tests (adaptive engine, generator, stats — no DOM needed):

```sh
node tests/engine.test.mjs
```

### Adding questions

Add entries to `js/bank-quant.js`, `js/bank-verbal.js`, or `js/bank-di.js`:

```js
{
  id: 'q7-08',            // unique
  section: 'quant',       // quant | verbal | di
  type: 'problem-solving',
  level: 7,               // 1-10
  topic: 'ratios',
  prompt: '…',
  choices: ['…', '…', '…', '…', '…'],
  answer: 2,              // index into choices
  explanation: '…',
  // optional: passage (RC), figure (HTML/SVG for DI)
}
```

Bump `VERSION` in `sw.js` whenever assets change so installed clients refresh.

### Importing GMAT Club questions

`scripts/scrape-gmatclub.mjs` walks the GMAT Club forum index pages (PS, DS,
CR, RC), reads the first post of each thread, and writes bank-format entries
to `data/gmatclub.json` with a `source` link per question:

```sh
npm run scrape -- --forum ps,ds,cr --pages 3 --limit 150
# logged-in cookie reveals the hidden OA box on most threads:
GMATCLUB_COOKIE='phpbb3_...=...' npm run scrape -- --forum ps
```

Entries whose stem, choices, or official answer could not be read confidently
are flagged `needsReview: true`. Raw HTML is cached in `.cache/gmatclub/`.
Scraped questions belong to GMAT Club and their authors; keep them for
personal practice.
