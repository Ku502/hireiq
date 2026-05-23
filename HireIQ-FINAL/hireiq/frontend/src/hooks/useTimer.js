import { useEffect, useCallback } from 'react'
import { useInterviewStore } from '../store'

/**
 * useTimer
 * Increments elapsed seconds in the interview store every second.
 * Returns formatted time string and a reset function.
 */
export function useTimer(running = true) {
  const { elapsed, tickElapsed } = useInterviewStore()

  useEffect(() => {
    if (!running) return
    const id = setInterval(tickElapsed, 1000)
    return () => clearInterval(id)
  }, [running])

  const format = useCallback((s = elapsed) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }, [elapsed])

  return { elapsed, format }
}
