import { create } from 'zustand'
import { getRankBand, RankBand } from '@/utils/rankBand'

export interface Guess {
  word: string
  rank: number | '>5000' | 'NOT_FOUND'
  band: RankBand
  timestamp: number
}

export type GamePhase = 'playing' | 'won' | 'given-up'
export type SortOrder = 'best-first' | 'chronological'

interface GameState {
  secretWord: string
  guesses: Guess[]
  guessCount: number
  phase: GamePhase
  sortOrder: SortOrder
  similarityData: [string, number][] | null
  hint: string | null

  initGame: (word: string, data: [string, number][]) => void
  submitGuess: (word: string) => void
  toggleSortOrder: () => void
  giveUp: () => void
  getHint: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  secretWord: '',
  guesses: [],
  guessCount: 0,
  phase: 'playing',
  sortOrder: 'best-first',
  similarityData: null,
  hint: null,

  initGame: (word, data) => set({
    secretWord: word,
    guesses: [],
    guessCount: 0,
    phase: 'playing',
    similarityData: data,
    hint: null,
  }),

  submitGuess: (input) => {
    const { secretWord, guesses, similarityData } = get()
    const word = input.trim().toLowerCase()

    if (guesses.some(g => g.word === word)) return

    let rank: number | '>5000' | 'NOT_FOUND' = 'NOT_FOUND'

    if (word === secretWord) {
      rank = 1
    } else if (similarityData) {
      const entry = similarityData.find(([w]) => w === word)
      console.log('word:', word, 'first entry:', similarityData?.[0], 'found:', entry)
      if (entry) {
        rank = entry[1]
      } else {
        rank = '>5000'
      }
    }

    const band = getRankBand(rank)
    const guess: Guess = { word, rank, band, timestamp: Date.now() }
    const newGuesses = [...guesses, guess]
    const won = rank === 1

    set({
      guesses: newGuesses,
      guessCount: newGuesses.length,
      phase: won ? 'won' : 'playing',
    })
  },

  toggleSortOrder: () => set(state => ({
    sortOrder: state.sortOrder === 'best-first' ? 'chronological' : 'best-first',
  })),

  giveUp: () => set({ phase: 'given-up' }),

  getHint: () => {
  const { similarityData, guesses, hint, secretWord } = get()
  if (!similarityData || hint) return
  if (guesses.length < 5) return

  const guessedWords = new Set(guesses.map(g => g.word))

  const bestRank = guesses.reduce((best, g) => {
    if (typeof g.rank !== 'number') return best
    return g.rank < best ? g.rank : best
  }, 5000)

  let hintMin = 2
  let hintMax = 50

  const count = guesses.length

  if (count >= 5 && count <= 10) {
    hintMin = Math.floor(bestRank * 0.4)
    hintMax = Math.floor(bestRank * 0.6)
  } else if (count >= 11 && count <= 20) {
    hintMin = Math.floor(bestRank * 0.2)
    hintMax = Math.floor(bestRank * 0.4)
  } else if (count >= 21 && count <= 40) {
    hintMin = Math.floor(bestRank * 0.1)
    hintMax = Math.floor(bestRank * 0.2)
  } else if (count >= 41) {
    hintMin = 2
    hintMax = 50
  }

  // Ensure valid range
  if (hintMin < 2) hintMin = 2
  if (hintMax < hintMin) hintMax = hintMin + 10

  const candidates = similarityData
    .slice(1)
    .filter(([word, rank]) =>
      typeof rank === 'number' &&
      rank >= hintMin &&
      rank <= hintMax &&
      !guessedWords.has(word) &&
      word !== secretWord
    )

  if (candidates.length === 0) return

  const hintWord = candidates[Math.floor(Math.random() * candidates.length)]
  set({ hint: hintWord[0] })
},
}))