import json
import numpy as np
from pathlib import Path

# ---- CONFIG ----
GLOVE_PATH = r"G:/Utility/GloVe/glove.840B.300d/glove.840B.300d.txt"  # update this path
WORD_BANK_PATH = Path("src/data/word_bank.json")
OUTPUT_PATH = Path("public/data/similarity_map.json")
TOP_N = 5000  # neighbours per word
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
            if i % 100000 == 0:
                print(f"  Loaded {i:,} words...")
    print(f"Done. {len(words):,} vectors loaded.")
    return words, np.array(vectors, dtype=np.float32)

def cosine_similarity_matrix(target_vec, matrix):
    # Normalise
    target_norm = target_vec / np.linalg.norm(target_vec)
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1
    normed = matrix / norms
    return normed @ target_norm

def main():
    # Load word bank
    with open(WORD_BANK_PATH) as f:
        word_bank = json.load(f)
    print(f"Word bank: {len(word_bank)} words")

    # Load GloVe
    all_words, all_vectors = load_glove(GLOVE_PATH)
    word_to_idx = {w: i for i, w in enumerate(all_words)}

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    similarity_map = {}

    for i, secret_word in enumerate(word_bank):
        secret_word = secret_word.lower()
        if secret_word not in word_to_idx:
            print(f"  Skipping '{secret_word}' — not in GloVe vocab")
            continue

        idx = word_to_idx[secret_word]
        target_vec = all_vectors[idx]
        similarities = cosine_similarity_matrix(target_vec, all_vectors)

        # Get top N+1 (includes the word itself at rank 1)
        top_indices = np.argpartition(similarities, -(TOP_N + 1))[-(TOP_N + 1):]
        top_indices = top_indices[np.argsort(similarities[top_indices])[::-1]]

        neighbours = []
        for rank, j in enumerate(top_indices[:TOP_N], start=1):
            neighbours.append([all_words[j], rank])

        similarity_map[secret_word] = neighbours
        print(f"[{i+1}/{len(word_bank)}] {secret_word} ✓")

    print("Writing output...")
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(similarity_map, f, ensure_ascii=False)

    print(f"Done! Saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()