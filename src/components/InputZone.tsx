import { useRef, useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { validateGuess, normaliseGuess } from '@/utils/validateGuess'
import React from 'react'

interface InputZoneProps {
  setFeedback: (msg: string | null) => void
}

export default function InputZone({ setFeedback }: InputZoneProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { guesses, submitGuess, phase } = useGameStore()

  useEffect(() => {
    inputRef.current?.focus()
  }, [guesses.length])

  const handleSubmit = async () => {
    if (phase === 'won' || phase === 'given-up') return

    const validation = validateGuess(input, guesses.map(g => g.word))

    if (validation.valid === false) {
      if (validation.reason === 'EMPTY') return
      if (validation.reason === 'INVALID_CHARS') {
        setFeedback('Letters only — no numbers or symbols')
        return
      }
      if (validation.reason === 'DUPLICATE') {
        setFeedback('Already guessed!')
        return
      }
    }

    const normalised = normaliseGuess(input)
    setLoading(true)
    setInput('')
    submitGuess(normalised)

    const state = useGameStore.getState()
    const latest = state.guesses[state.guesses.length - 1]
    if (latest?.rank === 'NOT_FOUND') {
      setFeedback('Word not in dictionary')
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') setInput('')
  }

  const isDisabled = phase === 'won' || phase === 'given-up'

  return (
    <div className="h-18 flex items-center gap-2 px-4 py-3 border-b border-[#1E2A3A] shrink-0">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a word..."
        aria-label="Enter your guess"
        disabled={isDisabled}
        className="flex-1 h-14 bg-[#1E2A3A] text-[#EDF2F7] font-serif text-sm px-4 rounded-sm border border-transparent focus:border-[#00E5B4] outline-none placeholder:text-[#8A9BB0] disabled:opacity-50 transition-colors"
      />
      <button
        onClick={handleSubmit}
        disabled={isDisabled || loading}
        aria-label="Submit guess"
        className="w-12 h-14 flex items-center justify-center bg-[#1E2A3A] text-[#8A9BB0] rounded-sm hover:text-[#00E5B4] active:scale-95 transition-all disabled:opacity-50 font-mono text-lg"
      >
        →
      </button>
    </div>
  )
}