"use client"

import { useEffect } from "react"
import { Clock } from "lucide-react"

interface TimerProps {
  timeRemaining: number
  setTimeRemaining: (time: number) => void
  onTimeExpired: () => void
  quizCompleted: boolean
}

export default function Timer({ timeRemaining, setTimeRemaining, onTimeExpired, quizCompleted }: TimerProps) {
  useEffect(() => {
    if (timeRemaining <= 0 || quizCompleted) {
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1)
    }, 1000)

    if (timeRemaining === 0) {
      onTimeExpired()
    }

    return () => clearInterval(timer)
  }, [timeRemaining, setTimeRemaining, onTimeExpired, quizCompleted])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Determine color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 60) return "text-red-600" // Last minute
    if (timeRemaining <= 300) return "text-orange-500" // Last 5 minutes
    return "text-gray-700"
  }

  return (
    <div className={`flex items-center gap-2 font-mono text-lg ${getTimerColor()}`}>
      <Clock className="h-5 w-5" />
      <span className="font-bold">{formatTime(timeRemaining)}</span>
    </div>
  )
}
