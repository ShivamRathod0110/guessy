/* eslint-disable no-restricted-globals */
import { useEffect } from 'react'

interface FeedbackBarProps {
  message: string | null
  onClear: () => void
}

export default function FeedbackBar({ message, onClear }: FeedbackBarProps) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClear, 2000)
    return () => clearTimeout(timer)
  }, [message])

  if (!message) return <div className="h-6" />

  return (
    <div
      role="alert"
      className="h-6 flex items-center px-4"
    >
      <span className="font-mono text-xs text-[#FF3D5A]">{message}</span>
    </div>
  )
}