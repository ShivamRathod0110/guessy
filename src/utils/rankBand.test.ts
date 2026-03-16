import { describe, it, expect } from 'vitest'
import { getRankBand } from './rankBand'

describe('getRankBand', () => {
  it('returns found for rank 1', () => {
    expect(getRankBand(1)).toBe('found')
  })

  it('returns close for rank 2', () => {
    expect(getRankBand(2)).toBe('close')
  })

  it('returns close for rank 750', () => {
    expect(getRankBand(750)).toBe('close')
  })

  it('returns hot for rank 751', () => {
    expect(getRankBand(751)).toBe('hot')
  })

  it('returns hot for rank 2000', () => {
    expect(getRankBand(2000)).toBe('hot')
  })

  it('returns warm for rank 2001', () => {
    expect(getRankBand(2001)).toBe('warm')
  })

  it('returns warm for rank 3750', () => {
    expect(getRankBand(3750)).toBe('warm')
  })

  it('returns cold for rank 3751', () => {
    expect(getRankBand(3751)).toBe('cold')
  })

  it('returns cold for rank 5000', () => {
    expect(getRankBand(5000)).toBe('cold')
  })

  it('returns cold for >5000', () => {
    expect(getRankBand('>5000')).toBe('cold')
  })

  it('returns unknown for NOT_FOUND', () => {
    expect(getRankBand('NOT_FOUND')).toBe('unknown')
  })
})