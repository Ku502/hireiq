export default function QuestionDots({ total, current, answers, skipped }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: total }, (_, i) => {
        const isDone = answers[i] != null
        const isSkipped = skipped.includes(i)
        const isCurrent = i === current
        const score = answers[i]?.score

        let className = 'w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs transition-all duration-300 '
        if (isCurrent) className += 'border-cyan bg-cyan/10 text-cyan shadow-glow-cyan'
        else if (isSkipped) className += 'border-border-subtle text-text-muted opacity-40'
        else if (isDone && score >= 70) className += 'border-brand-green/40 bg-brand-green/10 text-brand-green'
        else if (isDone && score >= 40) className += 'border-brand-amber/40 bg-brand-amber/10 text-brand-amber'
        else if (isDone) className += 'border-brand-red/40 bg-brand-red/10 text-brand-red'
        else className += 'border-border-default text-text-muted'

        return (
          <div key={i} className={className}>
            {isDone && !isCurrent ? (score >= 70 ? '✓' : score >= 40 ? '~' : '✗') : i + 1}
          </div>
        )
      })}
    </div>
  )
}
