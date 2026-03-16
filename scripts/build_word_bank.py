import json
from pathlib import Path
from wordfreq import top_n_list

# ---- CONFIG ----
TARGET_COUNT = 5000
OUTPUT_PATH = Path("src/data/word_bank.json")
# ----------------

# Words to explicitly exclude
BLOCKLIST = {
    # slurs, offensive words would go here
    "ass", "sex", "die", "kill", "hate", "drug", "porn", "rape",
}

def is_valid(word):
    # Must be all lowercase letters only
    if not word.isalpha():
        return False
    # No shorter than 3 characters
    if len(word) < 3:
        return False
    # No longer than 12 characters (too obscure)
    if len(word) > 12:
        return False
    # Not in blocklist
    if word.lower() in BLOCKLIST:
        return False
    return True

def main():
    print("Fetching top English words by frequency...")
    # Get top 15000 to have enough after filtering
    candidates = top_n_list('en', 15000)
    
    filtered = [w for w in candidates if is_valid(w)]
    final = filtered[:TARGET_COUNT]
    
    print(f"Got {len(final)} words after filtering")
    
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(final, f, ensure_ascii=False, indent=2)
    
    print(f"Saved to {OUTPUT_PATH}")
    print(f"Sample: {final[:20]}")

if __name__ == "__main__":
    main()