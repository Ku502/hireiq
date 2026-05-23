import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { interviewAPI } from '../services/api'
import { useInterviewStore } from '../store'
import toast from 'react-hot-toast'

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

const OPTIONS = {
  type: [
    { value: 'TECHNICAL', label: 'Technical', desc: 'DSA, OOP, Frameworks' },
    { value: 'BEHAVIORAL', label: 'Behavioral', desc: 'STAR method, teamwork' },
    { value: 'HR', label: 'HR Round', desc: 'Goals, culture fit' },
    { value: 'MIXED', label: 'Mixed', desc: 'All types combined' },
    { value: 'SYSTEM_DESIGN', label: 'System Design', desc: 'Architecture, scale' },
  ],
  difficulty: [
    { value: 'EASY', label: 'Easy', sub: 'Fresher-friendly' },
    { value: 'MEDIUM', label: 'Medium', sub: 'Standard interview' },
    { value: 'HARD', label: 'Hard', sub: 'Senior-level' },
    { value: 'EXPERT', label: 'Expert', sub: 'FAANG-level' },
  ],
  company: [
    { value: 'Standard', label: 'Standard' },
    { value: 'FAANG', label: 'FAANG' },
    { value: 'Startup', label: 'Startup' },
    { value: 'Product', label: 'Product-based' },
    { value: 'Service', label: 'Service-based' },
  ],
  count: [
    { value: 3, label: '3 Questions', sub: '~10 min' },
    { value: 5, label: '5 Questions', sub: '~20 min' },
    { value: 8, label: '8 Questions', sub: '~30 min' },
  ],
}

function OptionGroup({ label, options, selected, onSelect, multi }) {
  return (
    <div>
      <div className="font-mono text-xs text-text-muted tracking-widest mb-3 uppercase">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o.value}
            onClick={() => onSelect(o.value)}
            className={`px-4 py-2 rounded-lg border text-sm transition-all duration-200 text-left
              ${selected === o.value
                ? 'border-cyan bg-cyan-dim text-cyan'
                : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
              }`}>
            <span className="font-medium">{o.label}</span>
            {(o.desc || o.sub) && (
              <span className="block text-xs text-text-muted mt-0.5">{o.desc || o.sub}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SetupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useInterviewStore(s => s.setSession)

  const [role, setRole] = useState(location.state?.role || '')
  const [type, setType] = useState('TECHNICAL')
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [company, setCompany] = useState('Standard')
  const [count, setCount] = useState(5)

  const { mutate: start, isPending } = useMutation({
    mutationFn: () => interviewAPI.start({ targetRole: role, interviewType: type, difficulty, companyStyle: company, questionCount: count }),
    onSuccess: (data) => {
      setSession(data)
      navigate('/interview')
    },
    onError: () => toast.error('Failed to generate questions — check your connection.'),
  })

  const canStart = role.trim().length > 1

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border-subtle">
        <button onClick={() => navigate('/')} className="font-display font-bold text-lg tracking-tight text-text-primary">
          ← HireIQ
        </button>
        <div className="font-mono text-xs text-text-muted tracking-widest">CONFIGURE SESSION</div>
      </nav>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <motion.div initial="initial" animate="animate"
          className="w-full max-w-2xl space-y-8">

          <motion.div variants={fadeUp}>
            <h1 className="font-display font-bold text-3xl tracking-tight mb-1">Configure your session</h1>
            <p className="text-text-secondary text-sm">The AI adapts every question to your exact choices.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="glass p-6">
            <div className="font-mono text-xs text-text-muted tracking-widest mb-3 uppercase">Target Role</div>
            <input
              className="input text-base font-medium"
              placeholder="e.g. Java Backend Developer"
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="glass p-6 space-y-6">
            <OptionGroup label="Interview Type" options={OPTIONS.type} selected={type} onSelect={setType} />
            <OptionGroup label="Difficulty" options={OPTIONS.difficulty} selected={difficulty} onSelect={setDifficulty} />
          </motion.div>

          <motion.div variants={fadeUp} className="glass p-6 grid grid-cols-2 gap-6">
            <OptionGroup label="Company Style" options={OPTIONS.company} selected={company} onSelect={setCompany} />
            <OptionGroup label="Question Count" options={OPTIONS.count} selected={count} onSelect={setCount} />
          </motion.div>

          <motion.div variants={fadeUp}
            className="flex items-center justify-between glass p-5">
            <div>
              <div className="text-text-primary font-medium text-sm">
                {count} {type} questions · {difficulty} · {company} style
              </div>
              <div className="text-text-muted text-xs mt-1">
                AI evaluates: depth · keywords · confidence · sentiment · model answer
              </div>
            </div>
            <button
              onClick={() => start()}
              disabled={!canStart || isPending}
              className="btn-primary flex items-center gap-2 min-w-[140px] justify-center">
              {isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Generating…
                </>
              ) : 'Generate →'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
