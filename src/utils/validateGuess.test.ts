import { describe, it, expect } from 'vitest'
import { validateGuess, normaliseGuess } from './validateGuess'

describe('validateGuess', () => {
  it('rejects empty string', () => {
    const result = validateGuess('', [])
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('EMPTY')
  })

  it('rejects whitespace only', () => {
    const result = validateGuess('   ', [])
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('EMPTY')
  })

  it('rejects numbers', () => {
    const result = validateGuess('word123', [])
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('INVALID_CHARS')
  })

  it('rejects punctuation', () => {
    const result = validateGuess('word!', [])
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('INVALID_CHARS')
  })

  it('rejects non-latin characters', () => {
    const result = validateGuess('wörld', [])
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('INVALID_CHARS')
  })

  it('rejects duplicate guess', () => {
    const result = validateGuess('ocean', ['ocean', 'fire'])
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('DUPLICATE')
  })

  it('rejects duplicate case insensitive', () => {
    const result = validateGuess('Ocean', ['ocean'])
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('DUPLICATE')
  })

  it('accepts valid word', () => {
    const result = validateGuess('ocean', [])
    expect(result.valid).toBe(true)
  })

  it('accepts valid word with mixed case', () => {
    const result = validateGuess('Ocean', [])
    expect(result.valid).toBe(true)
  })
})

describe('normaliseGuess', () => {
  it('lowercases input', () => {
    expect(normaliseGuess('OCEAN')).toBe('ocean')
  })

  it('trims whitespace', () => {
    expect(normaliseGuess('  ocean  ')).toBe('ocean')
  })

  it('lowercases and trims', () => {
    expect(normaliseGuess('  OCEAN  ')).toBe('ocean')
  })
})