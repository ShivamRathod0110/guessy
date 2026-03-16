/* eslint-disable no-restricted-globals */
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Guess } from '@/store/gameStore'
import { BAND_COLOURS } from '@/utils/rankBand'

interface GuessRowProps {
  guess: Guess
  index: number
}

function AnimatedRank({ rank }: { rank: number | '>5000' | 'NOT_FOUND' }) {
  const [display, setDisplay] = useState('5000')

  useEffect(() => {
    if (typeof rank !== 'number') {
      setDisplay(rank === '>5000' ? '>5000' : '????')
      return
    }

    let start = 5000
    const end = rank
    const duration = 600
    const startTime = performance.now()

    const update = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = Math.round(start - (start - end) * eased)
      setDisplay(String(current).padStart(4, ' '))
      if (progress < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [rank])

  return <>{display}</>
}

export default function GuessRow({ guess, index }: GuessRowProps) {
  const colour = BAND_COLOURS[guess.band]

  const heatWidth =
    typeof guess.rank === 'number'
      ? `${Math.max(2, 100 - (guess.rank / 5000) * 100)}%`
      : '2%'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center h-11 border-b border-[#2E3E52]"
      style={{
        background: index % 2 === 0 ? '#1E2A3A' : '#2E3E52',
      }}
      aria-label={`${guess.word}, rank ${guess.rank}, ${guess.band}`}
    >
      {/* Colour strip */}
      <div
        className="w-2 self-stretch shrink-0"
        style={{ backgroundColor: colour }}
      />

      {/* Rank number */}
      <span
        className="font-mono text-xs font-bold w-16 text-right pr-3 tabular-nums"
        style={{ color: colour }}
      >
        <AnimatedRank rank={guess.rank} />
      </span>

      {/* Word */}
      <span className="font-serif text-xs text-[#EDF2F7] flex-1 px-2">
        {guess.word}
      </span>

      {/* Heat bar */}
      <div className="absolute bottom-0 left-2 right-0 h-px bg-[#2E3E52]">
        <motion.div
          className="h-full"
          style={{ backgroundColor: colour }}
          initial={{ width: 0 }}
          animate={{ width: heatWidth }}
          transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.6 }}
        />
      </div>
    </motion.div>
  )
}