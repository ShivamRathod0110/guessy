import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { loadWordBank, loadSimilarityData } from '@/utils/loadSimilarity'
import Header from '@/components/Header'
import InputZone from '@/components/InputZone'
import FeedbackBar from '@/components/FeedbackBar'
import GuessList from '@/components/GuessList'
import WinScreen from '@/components/WinScreen'

export default function App() {
  const { phase, initGame, giveUp } = useGameStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const startNewGame = async () => {
    try {
      setLoading(true)
      setError(null)
      const wordBank = await loadWordBank()

      let word = ''
      let data = null
      let attempts = 0

      while (!data && attempts < 20) {
        word = wordBank[Math.floor(Math.random() * wordBank.length)]
        data = await loadSimilarityData(word)
        attempts++
      }

      if (!data) {
        setError('Similarity data not ready yet — embeddings script still running.')
        setLoading(false)
        return
      }

      initGame(word, data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load game data. Please refresh.')
      setLoading(false)
    }
  }

  useEffect(() => {
    startNewGame()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <span className="text-[#00E5B4] font-mono text-sm tracking-widest animate-pulse">
          LOADING...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center flex-col gap-4">
        <span className="text-[#FF3D5A] font-mono text-sm text-center px-8">{error}</span>
        <button
          onClick={startNewGame}
          className="font-mono text-xs text-[#8A9BB0] border border-[#8A9BB0] px-4 py-2 hover:text-[#EDF2F7] hover:border-[#EDF2F7] transition-colors"
        >
          TRY AGAIN
        </button>
      </div>
    )
  }

  console.log('phase:', phase)
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex justify-center">
      <div className="w-full max-w-[480px] flex flex-col border-x border-[#1E2A3A]">
        <Header onNewGame={startNewGame} onGiveUp={giveUp} />
        <InputZone setFeedback={setFeedback} />
        <FeedbackBar message={feedback} onClear={() => setFeedback(null)} />
        {phase === 'won' || phase === 'given-up'
          ? <WinScreen onPlayAgain={startNewGame} givenUp={phase === 'given-up'} />
          : <GuessList />}
      </div>
    </div>
  )
}