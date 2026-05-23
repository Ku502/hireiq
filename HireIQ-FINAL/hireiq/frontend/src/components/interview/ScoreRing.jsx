import { useEffect, useRef } from 'react'

export default function ScoreRing({ score = 0, color = '#00e5ff', size = 52, strokeWidth = 4 }) {
  const circleRef = useRef(null)
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  useEffect(() => {
    if (!circleRef.current) return
    // Start from full offset (empty), animate to target
    circleRef.current.style.strokeDashoffset = circumference
    const t = requestAnimationFrame(() => {
      circleRef.current.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)'
      circleRef.current.style.strokeDashoffset = offset
    })
    return () => cancelAnimationFrame(t)
  }, [score, offset, circumference])

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs font-medium" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  )
}
