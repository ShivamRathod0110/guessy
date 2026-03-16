export type RankBand = 'found' | 'close' | 'hot' | 'warm' | 'cold' | 'unknown'

export function getRankBand(rank: number | '>5000' | 'NOT_FOUND'): RankBand {
  if (rank === 'NOT_FOUND') return 'unknown'
  if (rank === '>5000') return 'cold'
  if (rank === 1) return 'found'
  if (rank <= 750) return 'close'
  if (rank <= 2000) return 'hot'
  if (rank <= 3750) return 'warm'
  return 'cold'
}

export const BAND_COLOURS: Record<RankBand, string> = {
  found:   '#00E5B4',
  close:   '#0FBA68',
  hot:     '#FFB830',
  warm:    '#FF6B35',
  cold:    '#FF3D5A',
  unknown: '#8A9BB0',
}