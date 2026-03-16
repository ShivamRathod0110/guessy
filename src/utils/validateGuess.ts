export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: 'EMPTY' | 'INVALID_CHARS' | 'DUPLICATE' }

export function validateGuess(
  input: string,
  previousGuesses: string[]
): ValidationResult {
  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return { valid: false, reason: 'EMPTY' }
  }

  if (!/^[a-zA-Z]+$/.test(trimmed)) {
    return { valid: false, reason: 'INVALID_CHARS' }
  }

  const normalised = trimmed.toLowerCase()

  if (previousGuesses.includes(normalised)) {
    return { valid: false, reason: 'DUPLICATE' }
  }

  return { valid: true }
}

export function normaliseGuess(input: string): string {
  return input.trim().toLowerCase()
}