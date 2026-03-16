import { motion } from 'framer-motion'
import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'

interface WinScreenProps {
  onPlayAgain: () => void
  givenUp: boolean
}

function getDescriptor(count: number): string {
  if (count === 1) return 'Telepathic!'
  if (count <= 5) return 'Genius!'
  if (count <= 10) return 'Sharp!'
  if (count <= 20) return 'Solid!'
  if (count <= 40) return 'Getting there!'
  if (count <= 75) return 'Explorer!'
  return 'Word Wanderer!'
}

function buildShareCard(
  guesses: ReturnType<typeof useGameStore.getState>['guesses'],
  count: number
): string {
  const emojiMap: Record<string, string> = {
    found: '🟩',
    close: '🟩',
    hot: '🟨',
    warm: '🟨',
    cold: '🟥',
    unknown: '⬜',
  }
  const emojis = guesses
    .slice(0, 10)
    .map(g => emojiMap[g.band] ?? '⬜')
    .join('')
  return `Guessy — ${count} guesses (${getDescriptor(count)}) ${emojis}`
}

function ProximityBar({
  guesses,
}: {
  guesses: ReturnType<typeof useGameStore.getState>['guesses']
}) {
  const bestRank = guesses.reduce((best, g) => {
    if (typeof g.rank !== 'number') return best
    return g.rank < best ? g.rank : best
  }, 5000)

  const percentage = Math.max(2, 100 - ((bestRank - 1) / 4999) * 100)
  const colour =
    bestRank <= 750
      ? '#0FBA68'
      : bestRank <= 2000
      ? '#FFB830'
      : bestRank <= 3750
      ? '#FF6B35'
      : '#FF3D5A'

  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between font-mono text-xs text-[#8A9BB0] mb-2">
        <span>FURTHEST</span>
        <span>CLOSEST — RANK {bestRank}</span>
      </div>
      <div className="h-2 bg-[#1E2A3A] rounded-sm overflow-hidden">
        <motion.div
          className="h-full rounded-sm"
          style={{ backgroundColor: colour }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        />
      </div>
      <div className="flex justify-between font-mono text-xs text-[#8A9BB0] mt-1">
        <span>5000</span>
        <span>1</span>
      </div>
    </div>
  )
}

export default function WinScreen({ onPlayAgain, givenUp }: WinScreenProps) {
  const { secretWord, guessCount, guesses } = useGameStore()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const card = buildShareCard(guesses, guessCount)
    await navigator.clipboard.writeText(card)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center gap-6 bg-[#0A0E1A] px-8"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-mono text-xs tracking-widest"
        style={{ color: givenUp ? '#FF3D5A' : '#00E5B4' }}
      >
        {givenUp ? 'YOU GAVE UP' : 'YOU FOUND IT'}
      </motion.span>

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 80, damping: 10 }}
        className="font-serif text-5xl font-bold text-[#EDF2F7] text-center"
      >
        {secretWord}
      </motion.h1>

      <span className="font-serif text-sm text-[#8A9BB0]">
        {guessCount} {guessCount === 1 ? 'guess' : 'guesses'} — {getDescriptor(guessCount)}
      </span>

      <ProximityBar guesses={guesses} />

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {!givenUp && (
          <button
            onClick={handleShare}
            className="w-full font-mono text-xs text-[#00E5B4] border border-[#00E5B4] py-3 hover:bg-[#00E5B4] hover:text-[#0A0E1A] transition-colors"
          >
            {copied ? 'COPIED!' : '[ SHARE RESULT ]'}
          </button>
        )}
        <button
          onClick={onPlayAgain}
          className="w-full font-mono text-xs text-[#8A9BB0] border border-[#8A9BB0] py-3 hover:text-[#EDF2F7] hover:border-[#EDF2F7] transition-colors"
        >
          [ PLAY AGAIN ]
        </button>
      </div>
    </motion.div>
  )
}