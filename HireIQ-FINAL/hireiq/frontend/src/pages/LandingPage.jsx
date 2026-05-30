import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store'

const API_URL = import.meta.env.VITE_API_URL || 'https://hireiq-hu7b.onrender.com/api'

const ROLES = ['Java Backend Developer', 'Full Stack Developer', 'Frontend Developer', 'DevOps Engineer', 'Data Analyst', 'Android Developer']

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

const TAGLINES = [
  'Trust the process.',
  'Check your potential.',
  'Prepare like a pro.',
  'Your dream job awaits.',
  'Practice makes perfect.',
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [role, setRole] = useState('')
  const [tagline, setTagline] = useState(TAGLINES[0])
  const [stats, setStats] = useState({ interviews: '—', avgScore: '—', evalLayers: 8 })

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % TAGLINES.length
      setTagline(TAGLINES[i])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      fetch(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setStats({
            interviews: data.totalInterviews ?? 0,
            avgScore: data.avgScore ? Math.round(data.avgScore) + '%' : '0%',
            evalLayers: 8
          })
        })
        .catch(() => {
          setStats({ interviews: 0, avgScore: '0%', evalLayers: 8 })
        })
    }
  }, [user])

  const handleStart = () => {
    if (user) navigate('/setup', { state: { role } })
    else navigate('/register')
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
            <span className="text-cyan text-xs font-mono font-semibold">IQ</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">HireIQ</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/login" className="btn-ghost text-sm">Log in</Link>
              <Link to="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
              <button onClick={() => navigate('/setup')} className="btn-primary text-sm py-2">
                Start Interview →
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary text-sm py-2 px-5">
                Log in →
              </Link>
              <Link to="/register" className="btn-ghost text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <motion.main
        variants={stagger} initial="initial" animate="animate"
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center"
      >
        <motion.div variants={fadeUp} className="mb-4">
          <div className="inline-flex items-center gap-2 bg-bg-elevated border border-border-default rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" />
            <span className="font-mono text-xs text-cyan tracking-widest">AI INTERVIEW INTELLIGENCE</span>
          </div>
        </motion.div>

        {/* Rotating tagline */}
        <motion.div variants={fadeUp} className="mb-4">
          <motion.p
            key={tagline}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm text-cyan/70 tracking-widest uppercase"
          >
            {tagline}
          </motion.p>
        </motion.div>

        <motion.h1 variants={fadeUp}
          className="font-display font-extrabold text-7xl md:text-9xl tracking-tighter leading-[0.9] mb-6 max-w-4xl">
          Ace your<br />
          <span className="bg-gradient-to-r from-cyan to-purple-400 bg-clip-text text-transparent">
            next interview.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-text-secondary text-xl max-w-lg mx-auto mb-4 leading-relaxed font-light">
          The AI thinks like your interviewer. Real questions. Instant feedback. Eight layers of evaluation — per answer.
        </motion.p>

        <motion.p variants={fadeUp} className="text-text-muted text-sm max-w-md mx-auto mb-10 italic">
          "Every expert was once a beginner. Start your journey today."
        </motion.p>

        {/* Role selector */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-6 max-w-2xl">
          {ROLES.map(r => (
            <button key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-full border text-sm transition-all duration-200
                ${role === r
                  ? 'border-cyan bg-cyan-dim text-cyan'
                  : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
                }`}>
              {r}
            </button>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3 max-w-md w-full mx-auto mb-16">
          <input
            className="input flex-1"
            placeholder="Or type your target role…"
            value={role}
            onChange={e => setRole(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
          />
          <button onClick={handleStart} className="btn-primary whitespace-nowrap">
            Start prep →
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-8 max-w-sm mx-auto">
          {[
            [stats.interviews, user ? 'MY INTERVIEWS' : 'INTERVIEWS'],
            [stats.avgScore, 'AVG SCORE'],
            [stats.evalLayers + ' AI', 'EVAL LAYERS']
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display font-bold text-3xl text-text-primary mb-1">{n}</div>
              <div className="font-mono text-xs text-text-muted tracking-widest">{l}</div>
            </div>
          ))}
        </motion.div>

        {!user && (
          <motion.div variants={fadeUp} className="mt-4">
            <p className="text-text-muted text-sm">
              <Link to="/login" className="text-cyan underline underline-offset-4">Log in</Link>
              {' '}to see your personal stats
            </p>
          </motion.div>
        )}

        {/* Feature strips */}
        <motion.div variants={fadeUp} className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mx-auto">
          {[
            { icon: '⚡', title: 'AI Question Engine', desc: 'Groq LLaMA generates role-specific questions. No recycled lists. Every session is unique.' },
            { icon: '🔬', title: '8-Layer Evaluation', desc: 'Score, keywords, confidence, sentiment, model answer — every response evaluated deeply.' },
            { icon: '📈', title: 'Adaptive Difficulty', desc: 'Gets harder as you improve. Your skill radar updates in real time after every interview.' },
          ].map(f => (
            <div key={f.title} className="glass p-6 text-left hover:border-border-strong transition-colors duration-300">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-display font-semibold text-base mb-2">{f.title}</div>
              <div className="text-text-secondary text-sm leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Bottom motivational strip */}
        <motion.div variants={fadeUp} className="mt-16 flex flex-wrap justify-center gap-6 text-text-muted text-sm font-mono">
          {['✦ Check your potential', '✦ Trust the process', '✦ Outperform your limits', '✦ Land your dream job'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </motion.div>

      </motion.main>
    </div>
  )
}
