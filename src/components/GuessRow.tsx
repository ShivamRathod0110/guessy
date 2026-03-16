import { motion } from 'framer-motion'
import { Guess } from '@/store/gameStore'
import { BAND_COLOURS } from '@/utils/rankBand'

interface GuessRowProps {
  guess: Guess
  index: number
}

export default function GuessRow({ guess, index }: GuessRowProps) {
  const colour = BAND_COLOURS[guess.band]

  const rankDisplay =
    guess.rank === 'NOT_FOUND'
      ? '????'
      : guess.rank === '>5000'
      ? '>5000'
      : String(guess.rank).padStart(4, ' ')

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
        {rankDisplay}
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
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}