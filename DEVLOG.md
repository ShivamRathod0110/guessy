# Guessy — Dev Log

---

## 2026-03-16

---

### Section 1 — Project Setup & Tooling

**Scaffold**
- Created Vite + React + TypeScript project called `guessy`
- Had to fix Windows PowerShell execution policy blocking npm — ran `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

**TypeScript**
- Configured `tsconfig.json` with strict mode and `@/` path alias pointing to `src/`
- Fixed `tsconfig.node.json` — needed `composite: true` for project references

**Tailwind CSS v4**
- Installed Tailwind and `@tailwindcss/vite` plugin
- Had to use `--legacy-peer-deps` on every install — Vite v8 not yet supported by Tailwind v4 (supports up to v7)
- Tailwind v4 uses `@import "tailwindcss"` syntax, not the old `@tailwind` directives
- Added all design tokens to `src/index.css` as both `@theme` (Tailwind utilities) and `:root` (raw CSS variables):
  - Core palette: void, slate, mid, signal, offwhite, silver
  - Rank palette: cold, warm, hot, close, found
  - Font families: Georgia (display), Courier New (mono)
  - Spacing: 4px–64px
  - Motion: duration-fast (80ms), duration-base (180ms), duration-slow (500ms), ease-out-expo

**Fontsource — skipped**
Georgia and Courier New are system fonts on every device. No need to self-host.

**Libraries**
- Installed Zustand v4 (game state) and Framer Motion v11 (animations)

**Tooling**
- ESLint + Prettier + `prettier-plugin-tailwindcss` — auto-sorts Tailwind classes
- Vitest v1 with jsdom — had to install jsdom separately with `--legacy-peer-deps`

**vite.config.ts**
- `base: '/guessy/'` — GitHub Pages serves from subdirectory
- Brotli compression plugin — compresses assets ~5x
- `worker: { format: 'es' }` — ES module Web Workers
- `@/` path alias

**CI/CD**
- GitHub Actions: push to main → lint → test → build → deploy to gh-pages
- Lighthouse CI: enforces performance ≥ 90%, accessibility ≥ 90%

**Folder structure**
- `src/components/`, `src/store/`, `src/utils/`, `src/workers/`, `src/data/`

**Utilities written**
- `rankBand.ts` — rank number → colour band. Updated boundaries from 2000 to 5000 when we increased neighbour count:
  - Rank 1 → found, 2–750 → close, 751–2000 → hot, 2001–3750 → warm, 3751+ → cold
- `validateGuess.ts` — input validation: empty (silent), invalid chars (error), duplicate (row flash)

**Git**
- Installed Git, configured name and email, made first local commit

---

### Section 2 — Similarity Engine

**gensim — failed**
- Original plan was gensim 4.x to load GloVe vectors
- Failed to install — requires Microsoft C++ Build Tools, and Python 3.14 is too new for gensim 4.x
- Abandoned gensim entirely

**Switched to numpy**
- GloVe file is plain text — numpy can read it directly, no gensim needed
- Cosine similarity computed via matrix multiplication

**GloVe download**
- Downloaded GloVe 840B 300d from Stanford NLP (~2GB zipped)
- Extracted to `G:\Utility\GloVe\glove.840B.300d\glove.840B.300d.txt`
- Changed from GloVe 100d (original plan) to 300d — better semantic coverage

**Decisions changed from original plan**

| Item | Original plan | Final decision | Reason |
|------|--------------|----------------|--------|
| Embedding library | gensim | numpy | Python 3.14 incompatible |
| Neighbour count | 2000 | 5000 | Better rank granularity |
| Output format | Single JSON | One file per word | Lazy loading — faster page load |

**build_embeddings.py**
- Loads 2.2M GloVe vectors into RAM (~2–3 min)
- For each word in bank: cosine similarity against all vectors → top 5000 → save as `public/data/words/{word}.json`
- Skips already-processed files — safe to restart if it crashes
- Ran for several hours
- Result: 5639 files (1 word skipped — not in GloVe vocab)

---

### Section 3 — Word Bank

**Iterations (many)**

Started with manual list — abandoned immediately.

Switched to `wordfreq` library (frequency-based English word data).

| Attempt | Start | Result | Issue |
|---------|-------|--------|-------|
| Fetch 8500 | 8500 | ~3500 after filters | Not enough, below target |
| Fetch 15000 | 15000 | 7970 after basic filter | Better |
| After POS tagging | 7970 | 6639 | Some proper nouns remain |
| After names corpus | 6639 | 5838 | Still some verb forms |
| Final pass | 5838 | 5640 | Clean |

**Filters applied (in order)**
1. Alpha only, 4–12 chars
2. Proper nouns, names, places, brands blocklist (~500 entries)
3. Offensive words + internet slang
4. Function words (prepositions, conjunctions, pronouns, adverbs)
5. Duplicate plurals (-s, -es, -ies)
6. Verb conjugations (-ing, -ed, -er, -ly) where base exists
7. Additional -s verb forms and -d past tenses
8. NLTK POS tagging — keep only NN (noun) and JJ (adjective)
9. NLTK names corpus — remove first names
10. Manual targeted removal of remaining issues

**Key lesson:** Need to start with 15000+ to land at 5000 after filtering. Each filter pass removes more than expected.

**Final: 5640 words** — common English nouns and adjectives, 5639 with similarity data

---

### Section 4 — Data Layer & State

**Web Worker**
- Written (`src/workers/rankWorker.ts`) but not used in final implementation
- Rank lookup is fast enough inline — Map lookup is O(1), no need for off-thread processing

**Zustand store**
- State: secretWord, guesses, guessCount, phase, sortOrder, similarityData, hint
- Actions: initGame, submitGuess, toggleSortOrder, giveUp, getHint
- Phase: `'playing' | 'won' | 'given-up'`

**loadSimilarity utility**
- `loadWordBank()` — fetches word_bank.json
- `loadSimilarityData(word)` — fetches individual word JSON file
- Uses `import.meta.env.BASE_URL` for GitHub Pages compatibility
- App tries up to 20 random words on load — handles partially-generated similarity data

---

### Section 5 — UI Components

**All components built:**
- `Header` — brand, guess count, hint button, give up, new game
- `InputZone` — text field, submit button, keyboard handlers, auto-focus
- `FeedbackBar` — validation messages, auto-dismiss after 2s, `role="alert"`
- `GuessList` — sorted list, best-first/chronological toggle
- `GuessRow` — colour strip, animated rank count-down, word, heat bar
- `WinScreen` — secret word reveal, proximity bar, share card, play again

**Animations implemented:**
- Rank counts down from 5000 → actual rank (600ms ease-out cubic) — changed from 9999 to 5000 to match our max
- Heat bar animates after count-down completes (delayed 0.6s)
- Row slides in from bottom on enter (180ms spring)
- Win screen scales in (500ms spring)

**Give up feature**
- Added as V1 feature (was V1.1 in original PRD)
- Shows "YOU GAVE UP" in red, reveals secret word, hides share button
- Descriptor hidden on give up screen — only shown on win

**Proximity bar**
- Added to win screen — shows best rank on 1–5000 scale
- Colour matches rank band of best guess

---

### Section 6 — Score & Shareability

- Share card format: `Guessy — N guesses (Descriptor) 🟩🟨🟥...`
- First 10 guesses chronologically mapped to emojis
- Copies to clipboard on button click, shows "COPIED!" for 2s
- Share button hidden on give up

---

### Section 7 — Hint System

*Was V1.1 in original PRD — built in V1*

**Iterations on hint design:**
1. First version: revealed closest unguessed word from top 10 — too easy, gave answer
2. Fixed: excluded secret word from hint candidates
3. Changed: hint halfway to best rank — not useful at rank 3000
4. Changed: 20% of best rank — better scaling
5. Final: tiered by guess count

**Final hint rules:**
| Guesses | Hint range | Notes |
|---------|------------|-------|
| < 5 | Disabled | Too early |
| 5–10 | 40–60% of best rank | Weak nudge |
| 11–20 | 20–40% of best rank | Medium nudge |
| 21–40 | 10–20% of best rank | Strong nudge |
| 41+ | rank 2–50 | Very strong |

- One hint per game
- Random word within target range — not predictable
- Button shows countdown: "HINT (3)" when locked
- Shows hint word in button after use: "HINT: OCEAN"

---

### Section 10 — Testing

- 23 Vitest unit tests — all passing
- `rankBand.test.ts` — 11 tests covering all rank boundaries
- `validateGuess.test.ts` — 12 tests covering all validation cases

---

### Open Questions — Status

| # | Question | Status | Decision |
|---|----------|--------|----------|
| Q1 | Guess history persist? | ❌ Not implemented | V1.1 via localStorage |
| Q2 | Multi-word phrases? | ❌ Not implemented | V2 |
| Q3 | Analytics? | ❌ Not implemented | V2 |

---

### Still Todo

- [ ] Mobile keyboard handling (visualViewport API)
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Lighthouse audit