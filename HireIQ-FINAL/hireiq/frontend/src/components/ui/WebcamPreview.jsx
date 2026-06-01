import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WebcamPreview({ position = 'bottom-right' }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState(null)
  const [minimized, setMinimized] = useState(false)

  const positionClass = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left':  'bottom-6 left-6',
    'top-right':    'top-20 right-6',
    'top-left':     'top-20 left-6',
  }[position] || 'bottom-6 right-6'

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 280, height: 180, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setActive(true)
      setError(null)
    } catch (err) {
      setError('Camera access denied')
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setActive(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  return (
    <div className={`fixed ${positionClass} z-50 flex flex-col items-end gap-2`}>
      <AnimatePresence>
        {active && !minimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-xl overflow-hidden border border-border-subtle shadow-2xl"
            style={{ width: 200, height: 130 }}
          >
            {/* Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Live indicator */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              <span className="font-mono text-[10px] text-white">LIVE</span>
            </div>

            {/* Minimize button */}
            <button
              onClick={() => setMinimized(true)}
              className="absolute top-2 right-2 w-5 h-5 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14"/>
              </svg>
            </button>

            {/* Stop button */}
            <button
              onClick={stopCamera}
              className="absolute bottom-2 right-2 w-5 h-5 bg-brand-red/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-red transition-colors"
            >
              <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized pill */}
      {active && minimized && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setMinimized(false)}
          className="flex items-center gap-1.5 bg-bg-surface border border-border-subtle px-3 py-1.5 rounded-full shadow-lg hover:border-cyan transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          <span className="font-mono text-xs text-text-muted">CAM</span>
        </motion.button>
      )}

      {/* Start camera button */}
      {!active && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={startCamera}
          className="flex items-center gap-2 bg-bg-surface border border-border-subtle hover:border-cyan px-3 py-2 rounded-xl shadow-lg transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center group-hover:border-cyan transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted group-hover:text-cyan transition-colors">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <span className="font-mono text-xs text-text-muted group-hover:text-cyan transition-colors">
            {error ? 'Retry Cam' : 'Start Cam'}
          </span>
        </motion.button>
      )}

      {/* Error message */}
      {error && (
        <p className="font-mono text-xs text-brand-red bg-bg-surface border border-brand-red/20 px-3 py-1 rounded-lg">
          {error}
        </p>
      )}
    </div>
  )
}
