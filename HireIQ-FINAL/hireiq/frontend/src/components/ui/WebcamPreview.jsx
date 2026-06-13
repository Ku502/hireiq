import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WebcamPreview({ position = 'bottom-right' }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const canvasRef = useRef(null)
  const detectionRef = useRef(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState(null)
  const [minimized, setMinimized] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [lookAwayCount, setLookAwayCount] = useState(0)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [warning, setWarning] = useState(null)
  const [proctoringLog, setProctoringLog] = useState([])
  const [showLog, setShowLog] = useState(false)
  const lookAwayRef = useRef(false)
  const warningTimeoutRef = useRef(null)

  const positionClass = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left':  'bottom-6 left-6',
    'top-right':    'top-20 right-6',
    'top-left':     'top-20 left-6',
  }[position] || 'bottom-6 right-6'

  const showWarning = useCallback((msg) => {
    setWarning(msg)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    warningTimeoutRef.current = setTimeout(() => setWarning(null), 3000)
  }, [])

  const addLog = useCallback((msg) => {
    const time = new Date().toLocaleTimeString()
    setProctoringLog(prev => [...prev.slice(-9), `${time} — ${msg}`])
  }, [])

  // Tab switch detection
  useEffect(() => {
    if (!active) return
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount(c => c + 1)
        showWarning('⚠️ Tab switch detected!')
        addLog('Tab switched away')
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [active, showWarning, addLog])

  // Face detection using canvas pixel analysis
  const detectFace = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = 64
    canvas.height = 48
    ctx.drawImage(video, 0, 0, 64, 48)
    const imageData = ctx.getImageData(0, 0, 64, 48)
    const data = imageData.data
    let totalBrightness = 0
    let skinTonePixels = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2]
      totalBrightness += (r + g + b) / 3
      if (r > 60 && g > 40 && b > 20 && r > g && r > b && (r - g) > 10) skinTonePixels++
    }
    const avgBrightness = totalBrightness / (data.length / 4)
    const skinRatio = skinTonePixels / (data.length / 4)
    const detected = avgBrightness > 20 && skinRatio > 0.05
    setFaceDetected(detected)
    if (!detected && !lookAwayRef.current) {
      lookAwayRef.current = true
      setLookAwayCount(c => { showWarning('⚠️ Face not detected!'); addLog('Face not detected'); return c + 1 })
    } else if (detected && lookAwayRef.current) {
      lookAwayRef.current = false
    }
  }, [showWarning, addLog])

  useEffect(() => {
    if (!active) return
    detectionRef.current = setInterval(detectFace, 2000)
    return () => clearInterval(detectionRef.current)
  }, [active, detectFace])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 280, height: 180, facingMode: 'user' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setActive(true)
      setError(null)
      setLookAwayCount(0)
      setTabSwitchCount(0)
      setProctoringLog([])
      addLog('Proctoring started')
    } catch (err) {
      setError('Camera access denied')
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    clearInterval(detectionRef.current)
    setActive(false)
    setFaceDetected(false)
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      clearInterval(detectionRef.current)
      clearTimeout(warningTimeoutRef.current)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {warning && (
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-brand-red/10 border border-brand-red/40 text-brand-red font-mono text-xs px-4 py-2 rounded-lg backdrop-blur-sm">
            {warning}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`fixed ${positionClass} z-50 flex flex-col items-end gap-2`}>

        <AnimatePresence>
          {showLog && proctoringLog.length > 0 && (
            <motion.div initial={{ opacity:0, scale:0.9, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.9 }}
              className="bg-bg-surface border border-border-subtle rounded-xl p-3 w-56 shadow-2xl">
              <p className="font-mono text-xs text-text-muted tracking-widest mb-2">PROCTORING LOG</p>
              {proctoringLog.map((log, i) => <p key={i} className="font-mono text-[10px] text-text-muted mb-1">{log}</p>)}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active && !minimized && (
            <motion.div initial={{ opacity:0, scale:0.8, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.8, y:20 }}
              transition={{ duration:0.2 }} className="relative rounded-xl overflow-hidden border border-border-subtle shadow-2xl bg-bg-elevated"
              style={{ width:200, height:150 }}>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-black/60 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${faceDetected ? 'bg-green-400' : 'bg-brand-red animate-pulse'}`} />
                  <span className={`font-mono text-[10px] ${faceDetected ? 'text-green-400' : 'text-brand-red'}`}>{faceDetected ? 'FACE OK' : 'NO FACE'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                  <span className="font-mono text-[10px] text-white">LIVE</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-black/60 backdrop-blur-sm">
                <button onClick={() => setShowLog(s => !s)} className="font-mono text-[10px] text-text-muted hover:text-text-primary transition-colors">
                  LOG {proctoringLog.length > 0 ? `(${proctoringLog.length})` : ''}
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-brand-amber">👁 {lookAwayCount}</span>
                  <span className="font-mono text-[10px] text-brand-purple">⇄ {tabSwitchCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setMinimized(true)} className="w-4 h-4 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14"/></svg>
                  </button>
                  <button onClick={stopCamera} className="w-4 h-4 bg-brand-red/60 hover:bg-brand-red rounded-full flex items-center justify-center transition-colors">
                    <svg width="5" height="5" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {active && minimized && (
          <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} onClick={() => setMinimized(false)}
            className="flex items-center gap-2 bg-bg-surface border border-border-subtle px-3 py-1.5 rounded-full shadow-lg hover:border-cyan transition-colors">
            <div className={`w-1.5 h-1.5 rounded-full ${faceDetected ? 'bg-green-400' : 'bg-brand-red animate-pulse'}`} />
            <span className="font-mono text-xs text-text-muted">CAM</span>
            {(lookAwayCount > 0 || tabSwitchCount > 0) && (
              <span className="font-mono text-[10px] text-brand-amber">⚠️ {lookAwayCount + tabSwitchCount}</span>
            )}
          </motion.button>
        )}

        {!active && (
          <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} onClick={startCamera}
            className="flex items-center gap-2 bg-bg-surface border border-border-subtle hover:border-cyan px-3 py-2 rounded-xl shadow-lg transition-all duration-200 group">
            <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center group-hover:border-cyan transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted group-hover:text-cyan transition-colors">
                <path d="M23 7l-7 5 7 5V7z"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-mono text-xs text-text-muted group-hover:text-cyan transition-colors">Start Proctoring</p>
              <p className="font-mono text-[10px] text-text-muted opacity-60">Face + tab detection</p>
            </div>
          </motion.button>
        )}

        {error && <p className="font-mono text-xs text-brand-red bg-bg-surface border border-brand-red/20 px-3 py-1 rounded-lg">{error}</p>}
      </div>
    </>
  )
}
