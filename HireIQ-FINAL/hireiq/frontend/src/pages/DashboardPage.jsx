import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useAuthStore } from '../store'
import { dashboardAPI, interviewAPI } from '../services/api'
import { DashboardSkeleton } from '../components/ui/Skeletons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } }

const levelColor = { NOVICE:'text-text-muted', BEGINNER:'text-brand-amber', INTERMEDIATE:'text-cyan', ADVANCED:'text-brand-green', EXPERT:'text-brand-purple' }
const levelBar   = { NOVICE:'bg-text-muted', BEGINNER:'bg-brand-amber', INTERMEDIATE:'bg-cyan', ADVANCED:'bg-brand-green', EXPERT:'bg-brand-purple' }
const levelPct   = { NOVICE:10, BEGINNER:30, INTERMEDIATE:55, ADVANCED:78, EXPERT:97 }

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const { data: stats, isLoading: sl } = useQuery({ queryKey: ["stats"], queryFn: dashboardAPI.getStats, staleTime: 0 })
  const { data: skills, isLoading: kl } = useQuery({ queryKey: ["skills"], queryFn: dashboardAPI.getSkills, staleTime: 0 })
  const { data: history, isLoading: hl } = useQuery({ queryKey: ['history'], queryFn: () => interviewAPI.list(0, 8), staleTime: 0 })
  const isLoading = sl || kl || hl

  const handleLogout = () => { clearAuth(); navigate('/') }

  const scoreHistory = history?.content?.filter(i => i.overallScore != null).slice().reverse().map((i, idx) => ({
    name: `#${idx + 1}`, score: i.overallScore, date: dayjs(i.startedAt).format('MMM D'),
  })) || []

  if (isLoading) return (
    <div className="min-h-screen bg-bg-base">
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-border-subtle">
        <span className="font-display font-bold text-lg text-cyan">HireIQ</span>
      </nav>
      <DashboardSkeleton />
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Nav */}
      <nav className="border-b border-border-subtle px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-lg text-cyan tracking-tight flex-shrink-0">HireIQ</span>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-text-secondary text-sm hidden sm:block">{user?.fullName}</span>
            <button onClick={() => navigate('/practice')}
              className="btn-ghost text-xs sm:text-sm py-1.5 sm:py-2 px-3">
              Practice
            </button>
            <button onClick={() => navigate('/setup')}
              className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-3">
              New Interview →
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1 text-text-muted hover:text-brand-red border border-border-subtle hover:border-brand-red/40 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-200">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <motion.div variants={stagger} initial="initial" animate="animate"
        className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4 sm:space-y-6">

        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-1">
            Good {new Date().getHours() < 12 ? 'morning' : 'evening'}, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-text-secondary text-sm">Here's your interview performance overview.</p>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { val: stats?.totalInterviews ?? 0,              label: 'INTERVIEWS', color: 'text-text-primary' },
            { val: `${Math.round(stats?.avgScore ?? 0)}%`,   label: 'AVG SCORE',  color: 'text-cyan' },
            { val: `${Math.round(stats?.bestScore ?? 0)}%`,  label: 'BEST SCORE', color: 'text-brand-green' },
            { val: `${stats?.streakDays ?? 0}d`,             label: 'STREAK',     color: 'text-brand-amber' },
          ].map(m => (
            <div key={m.label} className="glass p-4 sm:p-5 text-center">
              <div className={`font-display font-bold text-2xl sm:text-3xl ${m.color} mb-1`}>{m.val}</div>
              <div className="font-mono text-[10px] sm:text-xs text-text-muted tracking-widest">{m.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Score history chart */}
        {scoreHistory.length > 1 && (
          <motion.div variants={fadeUp} className="glass p-4 sm:p-6">
            <div className="font-mono text-xs text-text-muted tracking-widest mb-4 sm:mb-5">SCORE HISTORY</div>
            <div className="h-36 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreHistory}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.12}/>
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#5a5a7a', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#5a5a7a', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontFamily: 'DM Mono', fontSize: 11 }}
                    labelStyle={{ color: '#9898b8' }} itemStyle={{ color: '#00e5ff' }} />
                  <Area type="monotone" dataKey="score" stroke="#00e5ff" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#00e5ff', r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Skill scores */}
          {skills?.length > 0 && (
            <motion.div variants={fadeUp} className="glass p-4 sm:p-6">
              <div className="font-mono text-xs text-text-muted tracking-widest mb-4 sm:mb-5">SKILL BREAKDOWN</div>
              <div className="space-y-3 sm:space-y-4">
                {skills.slice(0, 6).map(s => (
                  <div key={s.domain}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs sm:text-sm text-text-secondary">{s.domain}</span>
                      <span className={`font-mono text-xs ${levelColor[s.level] || 'text-text-muted'}`}>{s.level}</span>
                    </div>
                    <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${levelPct[s.level] || s.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${levelBar[s.level] || 'bg-cyan'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent interviews */}
          <motion.div variants={fadeUp} className="glass overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border-subtle font-mono text-xs text-text-muted tracking-widest">
              RECENT SESSIONS
            </div>
            <div className="divide-y divide-border-subtle">
              {history?.content?.slice(0, 5).map(i => (
                <button key={i.id}
                  onClick={() => i.status === 'COMPLETED' ? navigate(`/report/${i.id}`) : null}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 hover:bg-bg-elevated transition-colors text-left">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0
                    ${i.overallScore >= 70 ? 'bg-brand-green/10 text-brand-green'
                    : i.overallScore >= 40 ? 'bg-brand-amber/10 text-brand-amber'
                    : i.status === 'IN_PROGRESS' ? 'bg-cyan/10 text-cyan'
                    : 'bg-brand-red/10 text-brand-red'}`}>
                    {i.overallScore != null ? `${i.overallScore}` : '…'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-text-primary text-sm font-medium truncate">{i.targetRole}</div>
                    <div className="text-text-muted text-xs">{i.interviewType} · {dayjs(i.startedAt).fromNow()}</div>
                  </div>
                  <div className={`font-mono text-[10px] sm:text-xs px-2 py-1 rounded-full border flex-shrink-0
                    ${i.status === 'COMPLETED' ? 'border-brand-green/20 text-brand-green bg-brand-green/5'
                    : i.status === 'IN_PROGRESS' ? 'border-cyan/20 text-cyan bg-cyan/5'
                    : 'border-border-subtle text-text-muted'}`}>
                    {i.status.replace('_', ' ')}
                  </div>
                </button>
              ))}
              {(!history?.content?.length) && (
                <div className="px-6 py-10 text-center text-text-muted text-sm">
                  No interviews yet — <button onClick={() => navigate('/setup')} className="text-cyan hover:underline">start your first one</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
