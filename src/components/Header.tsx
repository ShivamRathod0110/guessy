import { useGameStore } from '@/store/gameStore'

interface HeaderProps {
  onNewGame: () => void
  onGiveUp: () => void
}

export default function Header({ onNewGame, onGiveUp }: HeaderProps) {
  const { guessCount, phase } = useGameStore()

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-[#1E2A3A] shrink-0">
      <span className="font-mono text-sm font-bold tracking-widest text-[#00E5B4]">
        GUESSY
      </span>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-[#EDF2F7]">
          {guessCount} GUESSES
        </span>
        {phase === 'playing' && guessCount > 0 && (
          <button
            onClick={onGiveUp}
            className="font-mono text-xs text-[#FF3D5A] border border-[#FF3D5A] px-2 py-1 hover:bg-[#FF3D5A] hover:text-[#0A0E1A] transition-colors"
          >
            GIVE UP
          </button>
        )}
        <button
          onClick={onNewGame}
          className="font-mono text-xs text-[#8A9BB0] border border-[#8A9BB0] px-2 py-1 hover:text-[#EDF2F7] hover:border-[#EDF2F7] transition-colors"
        >
          NEW GAME
        </button>
      </div>
    </header>
  )
}