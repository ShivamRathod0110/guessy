import json
import numpy as np
from pathlib import Path

# ---- CONFIG ----
GLOVE_PATH = r"G:\Utility\GloVe\glove.840B.300d\glove.840B.300d.txt"
WORD_BANK_PATH = Path("src/data/word_bank.json")
OUTPUT_DIR = Path("public/data/words")
TOP_N = 5000
# ----------------

def load_glove(path):
    print("Loading GloVe vectors... (this takes a few minutes)")
    words = []
    vectors = []
    with open(path, encoding="utf-8") as f:
        for i, line in enumerate(f):
            parts = line.rstrip().split(" ")
            word = parts[0]
            try:
                vec = np.array(parts[1:], dtype=np.float32)
                if vec.shape[0] == 300:
                    words.append(word)
                    vectors.append(vec)
            except ValueError:
                continue
            if i % 200000 == 0:
                print(f"  Loaded {i:,} words...")
    print(f"Done. {len(words):,} vectors loaded.")
    return words, np.array(vectors, dtype=np.float32)

def cosine_similarity(target_vec, matrix):
    target_norm = target_vec / np.linalg.norm(target_vec)
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1
    normed = matrix / norms
    return normed @ target_norm

def main():
    with open(WORD_BANK_PATH) as f:
        word_bank = json.load(f)
    print(f"Word bank: {len(word_bank)} words")

    all_words, all_vectors = load_glove(GLOVE_PATH)
    word_to_idx = {w: i for i, w in enumerate(all_words)}

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    skipped = []
    for i, secret_word in enumerate(word_bank):
        secret_word = secret_word.lower()

        # Skip if already processed
        out_file = OUTPUT_DIR / f"{secret_word}.json"
        if out_file.exists():
            print(f"[{i+1}/{len(word_bank)}] {secret_word} already done, skipping")
            continue

        if secret_word not in word_to_idx:
            print(f"  Skipping '{secret_word}' — not in GloVe vocab")
            skipped.append(secret_word)
            continue

        idx = word_to_idx[secret_word]
        target_vec = all_vectors[idx]
        similarities = cosine_similarity(target_vec, all_vectors)

        top_indices = np.argpartition(similarities, -(TOP_N + 1))[-(TOP_N + 1):]
        top_indices = top_indices[np.argsort(similarities[top_indices])[::-1]]

        neighbours = []
        for rank, j in enumerate(top_indices[:TOP_N], start=1):
            neighbours.append([all_words[j], rank])

        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(neighbours, f, ensure_ascii=False)

        print(f"[{i+1}/{len(word_bank)}] {secret_word} ✓")

    print(f"\nDone! Skipped {len(skipped)} words not in GloVe vocab:")
    print(skipped)

if __name__ == "__main__":
    main()