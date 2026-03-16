import { useGameStore } from '@/store/gameStore'
import GuessRow from '@/components/GuessRow'

export default function GuessList() {
  const { guesses, sortOrder, toggleSortOrder } = useGameStore()

  const sorted = [...guesses].sort((a, b) => {
    if (sortOrder === 'best-first') {
      const aRank = typeof a.rank === 'number' ? a.rank : 9999
      const bRank = typeof b.rank === 'number' ? b.rank : 9999
      return aRank - bRank
    }
    return a.timestamp - b.timestamp
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {guesses.length > 0 && (
        <div className="flex justify-between items-center px-4 py-2 border-b border-[#1E2A3A]">
          <span className="font-mono text-xs text-[#8A9BB0]">RANK</span>
          <button
            onClick={toggleSortOrder}
            className="font-mono text-xs text-[#8A9BB0] hover:text-[#EDF2F7] transition-colors"
          >
            {sortOrder === 'best-first' ? 'BEST FIRST' : 'CHRONOLOGICAL'}
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {guesses.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <span className="font-mono text-xs text-[#8A9BB0]">
              START GUESSING
            </span>
          </div>
        ) : (
          sorted.map((guess, i) => (
            <GuessRow key={guess.word} guess={guess} index={i} />
          ))
        )}
      </div>
    </div>
  )
}