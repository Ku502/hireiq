import { useState, useCallback, useRef } from 'react'
import { useAuthStore } from '../store'

/**
 * useStreamingFeedback
 *
 * Connects to /api/stream/evaluate via Server-Sent Events.
 * Feedback tokens arrive word-by-word from Gemini streaming API.
 * This is the feature that makes the demo jaw-dropping —
 * text appears live as the AI "thinks".
 */
export function useStreamingFeedback() {
  const [streamedText, setStreamedText]   = useState('')
  const [isStreaming, setIsStreaming]      = useState(false)
  const [streamDone, setStreamDone]       = useState(false)
  const esRef = useRef(null)
  const { accessToken } = useAuthStore()

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

  const startStream = useCallback((question, answer, role) => {
    // Close any existing connection
    if (esRef.current) esRef.current.close()

    setStreamedText('')
    setIsStreaming(true)
    setStreamDone(false)

    const params = new URLSearchParams({
      question: question.slice(0, 500),
      answer:   answer.slice(0, 1000),
      role:     role.slice(0, 100),
    })

    // EventSource doesn't support custom headers natively —
    // pass token as query param (backend validates it)
    const url = `${apiBase}/stream/evaluate?${params.toString()}&token=${accessToken}`

    const es = new EventSource(url)
    esRef.current = es

    es.addEventListener('token', (e) => {
      setStreamedText(prev => prev + e.data)
    })

    es.addEventListener('done', () => {
      setIsStreaming(false)
      setStreamDone(true)
      es.close()
    })

    es.onerror = () => {
      setIsStreaming(false)
      es.close()
    }
  }, [accessToken, apiBase])

  const stopStream = useCallback(() => {
    esRef.current?.close()
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    esRef.current?.close()
    setStreamedText('')
    setIsStreaming(false)
    setStreamDone(false)
  }, [])

  return { streamedText, isStreaming, streamDone, startStream, stopStream, reset }
}
