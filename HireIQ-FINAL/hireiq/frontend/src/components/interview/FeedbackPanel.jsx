import { motion } from 'framer-motion'
import ScoreRing from './ScoreRing'

const gradeConfig = {
  EXCELLENT: { label: 'Excellent', className: 'text-brand-green', bar: 'bg-brand-green' },
  GOOD:      { label: 'Good',      className: 'text-cyan',        bar: 'bg-cyan' },
  AVERAGE:   { label: 'Average',   className: 'text-brand-amber', bar: 'bg-brand-amber' },
  POOR:      { label: 'Poor',      className: 'text-brand-red',   bar: 'bg-brand-red' },
  SKIPPED:   { label: 'Skipped',   className: 'text-text-muted',  bar: 'bg-border-default' },
}

export default function FeedbackPanel({ evaluation, question, followUpText, setFollowUpText, isLast, onNext }) {
  const grade = gradeConfig[evaluation?.grade] || gradeConfig.AVERAGE
  const score = evaluation?.score ?? 0
  const ringColor = score >= 75 ? '#00ff9d' : score >= 50 ? '#00e5ff' : score >= 30 ? '#ffb800' : '#ff4466'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass overflow-hidden">

      {/* ── Score header ── */}
      <div className="flex items-center gap-5 px-5 py-5 border-b border-border-subtle">
        <ScoreRing score={score} color={ringColor} size={64} strokeWidth={5} />
        <div className="flex-1 min-w-0">
          <div className={`font-display font-bold text-2xl ${grade.className}`}>
            {score}/100
          </div>
          <div className={`font-mono text-xs tracking-widest mt-1 ${grade.className}`}>
            {grade.label}
          </div>
          {evaluation?.strengthNote && (
            <div className="text-text-secondary text-sm mt-1 truncate">
              ✓ {evaluation.strengthNote}
            </div>
          )}
        </div>
        {/* Confidence meter */}
        {evaluation?.confidenceScore != null && (
          <div className="text-right">
            <div className="font-mono text-xs text-text-muted mb-1">CONFIDENCE</div>
            <div className="font-mono text-lg text-text-secondary">{evaluation.confidenceScore}%</div>
          </div>
        )}
      </div>

      <div className="px-5 py-5 space-y-5">

        {/* ── AI Feedback ── */}
        <div>
          <div className="font-mono text-xs text-text-muted tracking-widest mb-2 uppercase">AI Feedback</div>
          <p className="text-text-secondary text-sm leading-relaxed">{evaluation?.feedback}</p>
          {evaluation?.improvementNote && (
            <div className="mt-2 flex items-start gap-2">
              <span className="text-brand-amber text-xs mt-0.5">↑</span>
              <span className="text-brand-amber text-xs">{evaluation.improvementNote}</span>
            </div>
          )}
        </div>

        {/* ── Keyword analysis ── */}
        {((evaluation?.keywordHits?.length ?? 0) + (evaluation?.keywordMisses?.length ?? 0)) > 0 && (
          <div>
            <div className="font-mono text-xs text-text-muted tracking-widest mb-2 uppercase">Keyword Coverage</div>
            <div className="flex flex-wrap gap-2">
              {(evaluation.keywordHits || []).map(k => (
                <span key={k} className="font-mono text-xs px-2.5 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20">
                  ✓ {k}
                </span>
              ))}
              {(evaluation.keywordMisses || []).map(k => (
                <span key={k} className="font-mono text-xs px-2.5 py-1 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20">
                  ✗ {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Model answer ── */}
        {evaluation?.modelAnswer && (
          <div>
            <div className="font-mono text-xs text-text-muted tracking-widest mb-2 uppercase">Model Answer</div>
            <div className="bg-bg-overlay border border-border-subtle rounded-lg p-4">
              <p className="text-text-secondary text-sm leading-relaxed">{evaluation.modelAnswer}</p>
            </div>
          </div>
        )}

        {/* ── Follow-up question ── */}
        {evaluation?.followUpQuestion && (
          <div>
            <div className="font-mono text-xs text-text-muted tracking-widest mb-2 uppercase">Follow-up</div>
            <div className="bg-bg-overlay border-l-2 border-brand-purple rounded-r-lg p-4">
              <p className="text-text-secondary text-sm italic mb-3">
                ↳ {evaluation.followUpQuestion}
              </p>
              <textarea
                className="input text-sm min-h-[60px] resize-none"
                placeholder="Answer this follow-up (optional)…"
                value={followUpText}
                onChange={e => setFollowUpText(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── Next button ── */}
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
            border border-border-default text-text-secondary hover:border-cyan hover:text-cyan
            transition-all duration-200 text-sm font-medium">
          {isLast ? (
            <>
              View Results
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          ) : (
            <>
              Next Question
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
