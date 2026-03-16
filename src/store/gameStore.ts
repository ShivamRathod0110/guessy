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

  initGame: (word: string, data: [string, number][]) => void
  submitGuess: (word: string) => void
  toggleSortOrder: () => void
  giveUp: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  secretWord: '',
  guesses: [],
  guessCount: 0,
  phase: 'playing',
  sortOrder: 'best-first',
  similarityData: null,

  initGame: (word, data) => set({
    secretWord: word,
    guesses: [],
    guessCount: 0,
    phase: 'playing',
    similarityData: data,
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
}))