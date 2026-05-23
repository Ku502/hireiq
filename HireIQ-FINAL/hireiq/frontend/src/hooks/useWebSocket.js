import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuthStore } from '../store'

/**
 * useWebSocket
 * Connects to the Spring Boot STOMP WebSocket and subscribes to
 * /user/queue/interview-progress for real-time score pushes.
 *
 * @param {Function} onMessage  - called with each incoming message payload
 * @param {boolean}  enabled    - only connect when an interview is in progress
 */
export function useWebSocket(onMessage, enabled = true) {
  const clientRef = useRef(null)
  const { accessToken } = useAuthStore()
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'

  useEffect(() => {
    if (!enabled || !accessToken) return

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl.replace('ws://', 'http://').replace('wss://', 'https://')),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/user/queue/interview-progress', (msg) => {
          try {
            onMessage(JSON.parse(msg.body))
          } catch {
            // ignore malformed
          }
        })
      },
      onStompError: (frame) => {
        console.warn('STOMP error:', frame.headers?.message)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [enabled, accessToken])

  return clientRef
}
