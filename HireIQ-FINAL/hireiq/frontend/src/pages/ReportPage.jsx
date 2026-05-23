import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { interviewAPI } from '../services/api'
import ScoreRing from '../components/interview/ScoreRing'
import dayjs from 'dayjs'

const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.06 } } }

const READINESS = {
  NOT_READY:       { label: 'Not Ready',       color: 'text-brand-red',   bar: 'bg-brand-red',   level: 1 },
  DEVELOPING:      { label: 'Developing',       color: 'text-brand-amber', bar: 'bg-brand-amber', level: 2 },
  ALMOST_READY:    { label: 'Almost Ready',     color: 'text-cyan',        bar: 'bg-cyan',        level: 3 },
  INTERVIEW_READY: { label: 'Interview Ready',  color: 'text-brand-green', bar: 'bg-brand-green', level: 4 },
}

export default function ReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['report', id],
    queryFn: () => interviewAPI.getReport(id),
    retry: 1,
  })

  if (isLoading) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin w-8 h-8 text-cyan" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <span className="font-mono text-xs text-text-muted tracking-widest">LOADING REPORT</span>
      </div>
    </div>
  )

  if (isError || !report) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center text-text-secondary">
      Report not found. <button onClick={() => navigate('/dashboard')} className="text-cyan ml-2 hover:underline">Go to dashboard</button>
    </div>
  )

  const { overallScore, targetRole, difficulty, interviewType, answers,
          aiSummary, strongAnswers, averageAnswers, weakAnswers,
          skippedCount, durationSecs, startedAt, completedAt } = report

  const ringColor = overallScore >= 75 ? '#00ff9d' : overallScore >= 50 ? '#00e5ff' : overallScore >= 30 ? '#ffb800' : '#ff4466'
  const readiness = READINESS[aiSummary?.readinessLevel] || READINESS.DEVELOPING
  const duration = durationSecs ? `${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s` : '—'

  return (
    <div className="min-h-screen bg-bg-base">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border-subtle">
        <button onClick={() => navigate('/dashboard')} className="font-display font-bold text-lg text-cyan tracking-tight">
          ← HireIQ
        </button>
        <div className="font-mono text-xs text-text-muted">
          {dayjs(startedAt).format('MMM D, YYYY · HH:mm')}
        </div>
      </nav>

      <motion.div variants={stagger} initial="initial" animate="animate"
        className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Hero */}
        <motion.div variants={fadeUp} className="glass p-8 flex items-center gap-8">
          <ScoreRing score={overallScore} color={ringColor} size={100} strokeWidth={6} />
          <div>
            <div className="font-mono text-xs text-text-muted tracking-widest mb-2">
              {interviewType} · {difficulty}
            </div>
            <h1 className="font-display font-bold text-3xl tracking-tight mb-1">{targetRole}</h1>
            <p className="text-text-secondary text-sm">{duration} · {report.totalQuestions} questions</p>
            <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full border border-border-default bg-bg-elevated`}>
              <span className={`w-1.5 h-1.5 rounded-full ${readiness.bar}`} />
              <span className={`font-mono text-xs tracking-widest ${readiness.color}`}>
                {readiness.label.toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div variants={fadeUp} className="grid grid-cols-4 gap-3">
          {[
            { val: strongAnswers,  label: 'STRONG',  color: 'text-brand-green' },
            { val: averageAnswers, label: 'AVERAGE', color: 'text-brand-amber' },
            { val: weakAnswers,    label: 'WEAK',    color: 'text-brand-red' },
            { val: skippedCount,   label: 'SKIPPED', color: 'text-text-muted' },
          ].map(m => (
            <div key={m.label} className="glass p-4 text-center">
              <div className={`font-display font-bold text-3xl ${m.color} mb-1`}>{m.val ?? 0}</div>
              <div className="font-mono text-xs text-text-muted tracking-widest">{m.label}</div>
            </div>
          ))}
        </motion.div>

        {/* AI Summary */}
        {aiSummary?.summary && (
          <motion.div variants={fadeUp} className="glass p-6 space-y-4">
            <div className="font-mono text-xs text-text-muted tracking-widest">AI SUMMARY</div>
            <p className="text-text-secondary text-sm leading-relaxed">{aiSummary.summary}</p>
            <div className="grid grid-cols-2 gap-4">
              {aiSummary.strengths?.length > 0 && (
                <div>
                  <div className="font-mono text-xs text-brand-green tracking-widest mb-2">STRENGTHS</div>
                  <ul className="space-y-1">
                    {aiSummary.strengths.map(s => (
                      <li key={s} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-brand-green mt-0.5">✓</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSummary.weaknesses?.length > 0 && (
                <div>
                  <div className="font-mono text-xs text-brand-red tracking-widest mb-2">IMPROVE</div>
                  <ul className="space-y-1">
                    {aiSummary.weaknesses.map(w => (
                      <li key={w} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-brand-red mt-0.5">↑</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Improvement Plan */}
        {aiSummary?.improvementPlan && (
          <motion.div variants={fadeUp} className="glass p-6">
            <div className="font-mono text-xs text-text-muted tracking-widest mb-3">2-WEEK PLAN</div>
            <p className="text-text-secondary text-sm leading-relaxed">{aiSummary.improvementPlan}</p>
            {aiSummary.recommendedTopics?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {aiSummary.recommendedTopics.map(t => (
                  <span key={t}
                    className="font-mono text-xs px-3 py-1 rounded-full bg-cyan-dim text-cyan border border-cyan/20">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Answer breakdown */}
        {answers?.length > 0 && (
          <motion.div variants={fadeUp} className="glass overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle font-mono text-xs text-text-muted tracking-widest">
              ANSWER BREAKDOWN
            </div>
            <div className="divide-y divide-border-subtle">
              {answers.map((a, i) => {
                const scoreColor = !a.score || a.grade === 'SKIPPED' ? 'border-border-subtle text-text-muted bg-transparent'
                  : a.score >= 70 ? 'border-brand-green/30 bg-brand-green/10 text-brand-green'
                  : a.score >= 40 ? 'border-brand-amber/30 bg-brand-amber/10 text-brand-amber'
                  : 'border-brand-red/30 bg-brand-red/10 text-brand-red'
                return (
                  <div key={i} className="px-6 py-5">
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-xs border ${scoreColor}`}>
                        {a.grade === 'SKIPPED' ? '—' : (a.score ?? '?')}
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary text-sm font-medium leading-snug mb-1">
                          {a.questionText}
                        </p>
                        {a.questionCategory && (
                          <span className="font-mono text-xs text-text-muted">{a.questionCategory}</span>
                        )}
                      </div>
                    </div>
                    {a.answerText && (
                      <div className="ml-13 pl-13">
                        <div className="bg-bg-overlay border border-border-subtle rounded-lg p-3 mb-3 ml-[52px]">
                          <p className="text-text-secondary text-xs leading-relaxed">{a.answerText}</p>
                        </div>
                      </div>
                    )}
                    {a.aiFeedback && (
                      <div className="ml-[52px]">
                        <p className="text-text-muted text-xs leading-relaxed mb-2">{a.aiFeedback}</p>
                        {/* Keywords */}
                        {((a.keywordHits?.length ?? 0) + (a.keywordMisses?.length ?? 0)) > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(a.keywordHits || []).map(k => (
                              <span key={k} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20">✓ {k}</span>
                            ))}
                            {(a.keywordMisses || []).map(k => (
                              <span key={k} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20">✗ {k}</span>
                            ))}
                          </div>
                        )}
                        {a.modelAnswer && (
                          <div className="mt-3 p-3 bg-bg-overlay border border-border-subtle rounded-lg">
                            <div className="font-mono text-[10px] text-text-muted tracking-widest mb-1">MODEL ANSWER</div>
                            <p className="text-text-secondary text-xs leading-relaxed">{a.modelAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div variants={fadeUp} className="flex gap-3 pb-8">
          <button onClick={() => navigate('/setup')} className="btn-primary flex-1 py-4">
            Practice Again
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost flex-1 py-4">
            Dashboard
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
