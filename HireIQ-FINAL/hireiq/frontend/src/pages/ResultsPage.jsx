import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInterviewStore } from '../store'
import ScoreRing from '../components/interview/ScoreRing'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

const READINESS = {
  NOT_READY:      { label: 'Not Ready',      level: 1, color: 'text-brand-red',   bar: 'bg-brand-red' },
  DEVELOPING:     { label: 'Developing',     level: 2, color: 'text-brand-amber', bar: 'bg-brand-amber' },
  ALMOST_READY:   { label: 'Almost Ready',   level: 3, color: 'text-cyan',        bar: 'bg-cyan' },
  INTERVIEW_READY:{ label: 'Interview Ready',level: 4, color: 'text-brand-green', bar: 'bg-brand-green' },
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const { report, session, elapsed, clearSession } = useInterviewStore()

  useEffect(() => {
    if (!report) navigate('/setup')
  }, [report])

  if (!report) return null

  const { overallScore, strongAnswers, averageAnswers, weakAnswers,
          aiSummary, answers, targetRole, difficulty } = report

  const ringColor = overallScore >= 75 ? '#00ff9d' : overallScore >= 50 ? '#00e5ff' : overallScore >= 30 ? '#ffb800' : '#ff4466'
  const readiness = READINESS[aiSummary?.readinessLevel] || READINESS.DEVELOPING
  const formatTime = (s) => s ? `${Math.floor(s / 60)}m ${s % 60}s` : '—'

  // Radar chart data from answer categories
  const categoryMap = {}
  answers?.forEach(a => {
    if (!a.questionCategory) return
    if (!categoryMap[a.questionCategory]) categoryMap[a.questionCategory] = []
    if (a.score != null) categoryMap[a.questionCategory].push(a.score)
  })
  const radarData = Object.entries(categoryMap).map(([cat, scores]) => ({
    subject: cat,
    score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    fullMark: 100,
  }))

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border-subtle">
        <span className="font-display font-bold text-lg text-cyan tracking-tight">HireIQ</span>
        <div className="flex items-center gap-3">
          <button onClick={() => { clearSession(); navigate('/setup') }} className="btn-ghost text-sm">
            Practice Again
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm py-2">
            Dashboard →
          </button>
        </div>
      </nav>

      <motion.div variants={stagger} initial="initial" animate="animate"
        className="max-w-4xl mx-auto px-6 py-12 space-y-6">

        {/* ── Score hero ── */}
        <motion.div variants={fadeUp}
          className="glass p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <ScoreRing score={overallScore} color={ringColor} size={120} strokeWidth={7} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="font-mono text-xs text-text-muted tracking-widest mb-2">
              {targetRole?.toUpperCase()} · {difficulty}
            </div>
            <h1 className="font-display font-extrabold text-4xl tracking-tight mb-1">
              {overallScore >= 75 ? 'Strong Performance 🎯'
               : overallScore >= 50 ? 'Good Progress 📈'
               : 'Keep Practicing 💪'}
            </h1>
            <p className="text-text-secondary text-sm">
              {report.totalQuestions} questions · {formatTime(report.durationSecs || elapsed)}
            </p>
            {/* Readiness badge */}
            <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-border-default bg-bg-elevated`}>
              <span className={`w-2 h-2 rounded-full ${readiness.bar}`} />
              <span className={`font-mono text-xs tracking-widest ${readiness.color}`}>
                {readiness.label.toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Metrics row ── */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
          {[
            { val: strongAnswers, label: 'STRONG', color: 'text-brand-green' },
            { val: averageAnswers, label: 'AVERAGE', color: 'text-brand-amber' },
            { val: (weakAnswers ?? 0) + (report.skippedCount ?? 0), label: 'NEEDS WORK', color: 'text-brand-red' },
          ].map(m => (
            <div key={m.label} className="glass p-5 text-center">
              <div className={`font-display font-bold text-4xl ${m.color} mb-1`}>{m.val}</div>
              <div className="font-mono text-xs text-text-muted tracking-widest">{m.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Readiness bar ── */}
        <motion.div variants={fadeUp} className="glass p-5">
          <div className="font-mono text-xs text-text-muted tracking-widest mb-4">INTERVIEW READINESS</div>
          <div className="flex gap-2 mb-3">
            {[1,2,3,4].map(i => (
              <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-700
                ${i <= readiness.level
                  ? i === 1 ? 'bg-brand-red'
                  : i === 2 ? 'bg-brand-amber'
                  : i === 3 ? 'bg-cyan'
                  : 'bg-brand-green'
                  : 'bg-border-default'}`}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {['Not Ready','Developing','Almost Ready','Interview Ready'].map(l => (
              <span key={l} className="font-mono text-[10px] text-text-muted">{l}</span>
            ))}
          </div>
        </motion.div>

        {/* ── AI Summary ── */}
        {aiSummary?.summary && (
          <motion.div variants={fadeUp} className="glass p-6 space-y-4">
            <div className="font-mono text-xs text-text-muted tracking-widest">AI PERFORMANCE SUMMARY</div>
            <p className="text-text-secondary text-sm leading-relaxed">{aiSummary.summary}</p>

            {aiSummary.strengths?.length > 0 && (
              <div>
                <div className="font-mono text-xs text-brand-green tracking-widest mb-2">STRENGTHS</div>
                <ul className="space-y-1">
                  {aiSummary.strengths.map(s => (
                    <li key={s} className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-brand-green text-xs">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {aiSummary.weaknesses?.length > 0 && (
              <div>
                <div className="font-mono text-xs text-brand-red tracking-widest mb-2">NEEDS IMPROVEMENT</div>
                <ul className="space-y-1">
                  {aiSummary.weaknesses.map(w => (
                    <li key={w} className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-brand-red text-xs">↑</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Skill Radar ── */}
        {radarData.length >= 3 && (
          <motion.div variants={fadeUp} className="glass p-6">
            <div className="font-mono text-xs text-text-muted tracking-widest mb-4">SKILL RADAR</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9898b8', fontSize: 11, fontFamily: 'DM Mono' }} />
                  <Radar dataKey="score" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.08} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ── Study Plan ── */}
        {aiSummary?.improvementPlan && (
          <motion.div variants={fadeUp} className="glass p-6 space-y-4">
            <div className="font-mono text-xs text-text-muted tracking-widest">2-WEEK IMPROVEMENT PLAN</div>
            <p className="text-text-secondary text-sm leading-relaxed">{aiSummary.improvementPlan}</p>
            {(aiSummary.week1Plan || aiSummary.week2Plan) && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                {aiSummary.week1Plan && (
                  <div className="bg-bg-overlay border border-border-subtle rounded-lg p-4">
                    <div className="font-mono text-xs text-cyan tracking-widest mb-2">WEEK 1</div>
                    <p className="text-text-secondary text-xs leading-relaxed">{aiSummary.week1Plan}</p>
                  </div>
                )}
                {aiSummary.week2Plan && (
                  <div className="bg-bg-overlay border border-border-subtle rounded-lg p-4">
                    <div className="font-mono text-xs text-brand-amber tracking-widest mb-2">WEEK 2</div>
                    <p className="text-text-secondary text-xs leading-relaxed">{aiSummary.week2Plan}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Recommended Topics ── */}
        {aiSummary?.recommendedTopics?.length > 0 && (
          <motion.div variants={fadeUp} className="glass p-6">
            <div className="font-mono text-xs text-text-muted tracking-widest mb-4">STUDY THESE NEXT</div>
            <div className="grid grid-cols-2 gap-2">
              {aiSummary.recommendedTopics.map(t => (
                <div key={t}
                  className="flex items-center gap-2 px-4 py-3 bg-bg-overlay border border-border-subtle rounded-lg text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Answer breakdown ── */}
        {answers?.length > 0 && (
          <motion.div variants={fadeUp} className="glass overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle font-mono text-xs text-text-muted tracking-widest">
              ANSWER BREAKDOWN
            </div>
            <div className="divide-y divide-border-subtle">
              {answers.map((a, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-xs border
                    ${a.score >= 70 ? 'border-brand-green/30 bg-brand-green/10 text-brand-green'
                    : a.score >= 40 ? 'border-brand-amber/30 bg-brand-amber/10 text-brand-amber'
                    : 'border-brand-red/30 bg-brand-red/10 text-brand-red'}`}>
                    {a.score ?? '—'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium leading-snug mb-1 line-clamp-2">
                      {a.questionText}
                    </p>
                    {a.aiFeedback && (
                      <p className="text-text-muted text-xs leading-relaxed line-clamp-2">{a.aiFeedback}</p>
                    )}
                    {a.keywordHits?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {a.keywordHits.slice(0,4).map(k => (
                          <span key={k} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20">
                            ✓ {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CTA row ── */}
        <motion.div variants={fadeUp} className="flex gap-3 pb-8">
          <button
            onClick={() => { clearSession(); navigate('/setup') }}
            className="btn-primary flex-1 py-4 text-base">
            Practice Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ghost flex-1 py-4 text-base">
            View Dashboard
          </button>
        </motion.div>

      </motion.div>
    </div>
  )
}
