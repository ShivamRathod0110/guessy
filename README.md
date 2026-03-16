# Guessy

A word similarity guessing game. Guess the secret word by submitting words and receiving feedback on how semantically close each guess is — based on GloVe word embeddings trained on 840 billion words.

## How to Play

1. Type any English word and press Enter
2. You'll receive a rank (1–5000) showing how close your guess is to the secret word
3. Rank 1 = you found it. Rank 5000 = very far away
4. Use the colour bands as a guide:
   - 🟩 Green (rank 2–750) — very close
   - 🟨 Amber (rank 751–2000) — getting warm
   - 🟧 Orange (rank 2001–3750) — nearby
   - 🟥 Red (rank 3751+) — far away
5. A hint unlocks after 5 guesses

## Tech Stack

- **Vite + React + TypeScript** — frontend
- **Tailwind CSS v4** — styling
- **Zustand** — game state
- **Framer Motion** — animations
- **GloVe 840B 300d** — word embeddings (Stanford NLP)

## Running Locally
```bash
npm install --legacy-peer-deps
npm run dev
```

## Regenerating the Similarity Data (One-Time Step)

The word similarity data was pre-computed using GloVe vectors. To regenerate:

1. Download GloVe 840B 300d vectors from https://nlp.stanford.edu/projects/glove/
2. Extract to a local folder
3. Update `GLOVE_PATH` in `scripts/build_embeddings.py`
4. Run:
```bash
python scripts/build_embeddings.py
```

This will generate one JSON file per word in `public/data/words/`. It takes several hours to complete. The output is already committed to this repo so you don't need to run this again unless you change the word bank.

## Word Bank

5639 common English nouns and adjectives, sourced from SUBTLEX-US frequency data and filtered to remove proper nouns, offensive words, and grammatical function words.

## License

MIT