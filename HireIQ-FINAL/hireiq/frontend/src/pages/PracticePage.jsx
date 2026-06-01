import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROBLEMS, MCQ_QUESTIONS } from '../data/problems'
import toast from 'react-hot-toast'

// ── Constants ──────────────────────────────────────────────────────────────
const LANGUAGES = [
  { label: 'Java',       value: 'java',       version: '15.0.2',  ext: 'Main.java' },
  { label: 'Python',     value: 'python',     version: '3.10.0',  ext: 'main.py' },
  { label: 'JavaScript', value: 'javascript', version: '18.15.0', ext: 'main.js' },
  { label: 'C++',        value: 'c++',        version: '10.2.0',  ext: 'main.cpp' },
]

const CATEGORIES = ['All', ...new Set(PROBLEMS.map(p => p.category))]
const DIFFICULTIES = ['All', 'EASY', 'MEDIUM', 'HARD']
const ROLES = ['Java Developer', 'Python Developer', 'Full Stack Developer', 'default']

// ── Helpers ────────────────────────────────────────────────────────────────
const diffColor = { EASY: 'text-green-400', MEDIUM: 'text-brand-amber', HARD: 'text-brand-red' }
const diffBg    = { EASY: 'bg-green-400/10 border-green-400/30', MEDIUM: 'bg-brand-amber/10 border-brand-amber/30', HARD: 'bg-brand-red/10 border-brand-red/30' }

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

// ── MCQ Section ────────────────────────────────────────────────────────────
function MCQSection() {
  const [role, setRole] = useState('Java Developer')
  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState([])
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef(null)

  const questions = MCQ_QUESTIONS[role] || MCQ_QUESTIONS['default']
  const current = questions[idx]
  const score = answered.filter(a => a.correct).length

  const startQuiz = () => {
    setStarted(true)
    setIdx(0)
    setSelected(null)
    setAnswered([])
    setFinished(false)
    setTimeLeft(questions.length * 30)
  }

  useEffect(() => {
    if (!started || finished) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setFinished(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [started, finished])

  const handleSelect = (i) => {
    if (selected !== null) return
    setSelected(i)
    setAnswered(prev => [...prev, { questionId: current.id, selected: i, correct: i === current.answer }])
  }

  const handleNext = () => {
    if (idx + 1 >= questions.length) {
      clearInterval(timerRef.current)
      setFinished(true)
    } else {
      setIdx(i => i + 1)
      setSelected(null)
    }
  }

  // Results screen
  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="flex flex-col items-center gap-8 py-12">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#1e2a3a" strokeWidth="12"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke={pct>=70?'#22d3ee':pct>=40?'#f59e0b':'#ef4444'}
              strokeWidth="12" strokeDasharray={`${2*Math.PI*52}`}
              strokeDashoffset={`${2*Math.PI*52*(1-pct/100)}`} strokeLinecap="round"/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-text-primary">{pct}%</span>
            <span className="font-mono text-xs text-text-muted">{score}/{questions.length}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary mb-1">
            {pct >= 80 ? '🔥 Excellent!' : pct >= 60 ? '👍 Good Job!' : pct >= 40 ? '📚 Keep Practicing' : '💪 Don\'t Give Up'}
          </p>
          <p className="text-text-muted">You scored {score} out of {questions.length} questions</p>
        </div>

        {/* Review */}
        <div className="w-full max-w-2xl flex flex-col gap-3">
          <p className="font-mono text-xs text-text-muted tracking-widest">REVIEW</p>
          {questions.map((q, i) => {
            const a = answered.find(x => x.questionId === q.id)
            return (
              <div key={q.id} className={`glass p-4 border ${a?.correct ? 'border-green-400/30' : 'border-brand-red/30'}`}>
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 text-lg ${a?.correct ? 'text-green-400' : 'text-brand-red'}`}>
                    {a?.correct ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="text-text-primary text-sm font-medium mb-2">{q.question}</p>
                    <p className="text-green-400 text-xs font-mono">Correct: {q.options[q.answer]}</p>
                    {a && !a.correct && <p className="text-brand-red text-xs font-mono">Your answer: {q.options[a.selected]}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={startQuiz} className="btn-primary px-8">Try Again</button>
      </motion.div>
    )
  }

  // Start screen
  if (!started) {
    return (
      <div className="flex flex-col items-center gap-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Technical MCQ</h2>
          <p className="text-text-muted">Role-specific multiple choice questions with a time limit</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <label className="font-mono text-xs text-text-muted tracking-widest">SELECT ROLE</label>
          <div className="flex flex-col gap-2">
            {ROLES.filter(r => r !== 'default').map(r => (
              <button key={r}
                onClick={() => setRole(r)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${
                  role === r ? 'bg-cyan/10 border-cyan/40 text-cyan' : 'border-border-subtle text-text-muted hover:border-border-default hover:text-text-primary'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="glass p-4 rounded-xl w-full max-w-sm">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Questions</span>
            <span className="text-text-primary font-mono">{(MCQ_QUESTIONS[role]||MCQ_QUESTIONS['default']).length}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-text-muted">Time limit</span>
            <span className="text-text-primary font-mono">{(MCQ_QUESTIONS[role]||MCQ_QUESTIONS['default']).length * 30}s</span>
          </div>
        </div>
        <button onClick={startQuiz} className="btn-primary px-10 text-base">Start Quiz →</button>
      </div>
    )
  }

  // Quiz screen
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-text-muted">Q{idx+1} / {questions.length}</span>
        <span className={`font-mono text-sm font-bold ${timeLeft <= 30 ? 'text-brand-red' : 'text-brand-amber'}`}>
          ⏱ {formatTime(timeLeft)}
        </span>
        <div className="flex gap-1">
          {questions.map((_,i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${
              i < idx ? (answered[i]?.correct ? 'bg-green-400' : 'bg-brand-red') :
              i === idx ? 'bg-cyan' : 'bg-border-subtle'
            }`}/>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
        <motion.div className="h-full bg-cyan" animate={{ width: `${((idx)/ questions.length)*100}%` }} transition={{ duration: 0.3 }}/>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
          transition={{ duration: 0.2 }} className="glass p-6 flex flex-col gap-6">
          <p className="text-lg font-medium text-text-primary leading-relaxed">{current.question}</p>
          <div className="flex flex-col gap-3">
            {current.options.map((opt, i) => {
              let cls = 'border-border-subtle text-text-primary hover:border-border-default'
              if (selected !== null) {
                if (i === current.answer) cls = 'border-green-400 bg-green-400/10 text-green-400'
                else if (i === selected && i !== current.answer) cls = 'border-brand-red bg-brand-red/10 text-brand-red'
                else cls = 'border-border-subtle text-text-muted opacity-60'
              }
              return (
                <button key={i} onClick={() => handleSelect(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 ${cls} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}>
                  <span className="font-mono text-xs mr-3 opacity-60">{String.fromCharCode(65+i)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>
          {selected !== null && (
            <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} onClick={handleNext}
              className="btn-primary self-end px-6">
              {idx + 1 >= questions.length ? 'See Results →' : 'Next →'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Coding Section ─────────────────────────────────────────────────────────
function CodingSection() {
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [language, setLanguage] = useState('java')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [solved, setSolved] = useState(new Set())
  const timerRef = useRef(null)

  const filtered = PROBLEMS.filter(p =>
    (category === 'All' || p.category === category) &&
    (difficulty === 'All' || p.difficulty === difficulty)
  )

  const openProblem = (problem) => {
    setSelectedProblem(problem)
    setCode(problem.starterCode[language] || problem.starterCode['java'])
    setOutput(null)
    setTestResults([])
    setTimeLeft(problem.timeLimit * 60)
    setTimerActive(true)
  }

  const changeLang = (lang) => {
    setLanguage(lang)
    if (selectedProblem) {
      setCode(selectedProblem.starterCode[lang] || selectedProblem.starterCode['java'])
      setOutput(null)
      setTestResults([])
    }
  }

  useEffect(() => {
    if (!timerActive) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerActive(false); toast.error("⏰ Time's up!"); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [timerActive, selectedProblem])

  const runCode = async (testCase) => {
    const lang = LANGUAGES.find(l => l.value === language)
    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang.value,
          version: lang.version,
          files: [{ name: lang.ext, content: code }],
          stdin: testCase.input,
        }),
      })
      const data = await res.json()
      return {
        stdout: (data.run?.stdout || '').trim(),
        stderr: (data.run?.stderr || '').trim(),
      }
    } catch {
      return { stdout: '', stderr: 'Connection error' }
    }
  }

  const handleRun = async () => {
    if (!selectedProblem || !code.trim()) return
    setIsRunning(true)
    setOutput(null)
    setTestResults([])

    // Run only first 2 test cases for "Run"
    const casesToRun = selectedProblem.testCases.slice(0, 2)
    const results = []
    for (const tc of casesToRun) {
      const res = await runCode(tc)
      const actual = res.stdout.trim()
      const expected = tc.expected.trim()
      results.push({
        input: tc.input,
        expected,
        actual,
        passed: actual === expected,
        error: res.stderr,
      })
    }
    setTestResults(results)
    setIsRunning(false)
  }

  const handleSubmit = async () => {
    if (!selectedProblem || !code.trim()) return
    setIsRunning(true)
    setTestResults([])

    // Run ALL test cases
    const results = []
    for (const tc of selectedProblem.testCases) {
      const res = await runCode(tc)
      const actual = res.stdout.trim()
      results.push({
        input: tc.input,
        expected: tc.expected.trim(),
        actual,
        passed: actual === tc.expected.trim(),
        error: res.stderr,
      })
    }
    setTestResults(results)
    setIsRunning(false)

    const allPassed = results.every(r => r.passed)
    if (allPassed) {
      setSolved(prev => new Set([...prev, selectedProblem.id]))
      clearInterval(timerRef.current)
      setTimerActive(false)
      toast.success('🎉 All test cases passed!')
    } else {
      const failed = results.filter(r => !r.passed).length
      toast.error(`${failed} test case(s) failed`)
    }
  }

  // Problem list view
  if (!selectedProblem) {
    return (
      <div className="flex flex-col gap-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all duration-200 ${
                  category === c ? 'bg-cyan/10 border-cyan/40 text-cyan' : 'border-border-subtle text-text-muted hover:border-border-default'
                }`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all duration-200 ${
                  difficulty === d
                    ? d === 'All' ? 'bg-cyan/10 border-cyan/40 text-cyan'
                      : `${diffBg[d]} ${diffColor[d]}`
                    : 'border-border-subtle text-text-muted hover:border-border-default'
                }`}>{d}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <span className="font-mono text-xs text-text-muted">{filtered.length} problems</span>
          <span className="font-mono text-xs text-green-400">{solved.size} solved</span>
        </div>

        {/* Problem list */}
        <div className="flex flex-col gap-2">
          {filtered.map((p, i) => (
            <motion.button key={p.id}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.03 }}
              onClick={() => openProblem(p)}
              className="glass px-5 py-4 flex items-center gap-4 hover:border-border-default transition-all duration-200 text-left group">
              <span className={`font-mono text-xs w-4 ${solved.has(p.id) ? 'text-green-400' : 'text-text-muted'}`}>
                {solved.has(p.id) ? '✓' : p.id}
              </span>
              <span className="flex-1 text-text-primary text-sm font-medium group-hover:text-cyan transition-colors">{p.title}</span>
              <span className="font-mono text-xs text-text-muted">{p.category}</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded border ${diffBg[p.difficulty]} ${diffColor[p.difficulty]}`}>
                {p.difficulty}
              </span>
              <span className="font-mono text-xs text-text-muted">⏱ {p.timeLimit}m</span>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // Problem solve view
  const allPassed = testResults.length > 0 && testResults.every(r => r.passed)

  return (
    <div className="flex flex-col gap-0 -mx-4">
      <div className="flex h-[calc(100vh-180px)] min-h-[600px]">

        {/* Left panel — problem */}
        <div className="w-[42%] flex flex-col border-r border-border-subtle overflow-y-auto">
          {/* Problem header */}
          <div className="sticky top-0 z-10 bg-bg-surface border-b border-border-subtle px-5 py-3 flex items-center justify-between">
            <button onClick={() => { setSelectedProblem(null); clearInterval(timerRef.current); setTimerActive(false) }}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Problems
            </button>
            <span className={`font-mono text-sm font-bold ${timeLeft <= 60 ? 'text-brand-red animate-pulse' : timeLeft <= 120 ? 'text-brand-amber' : 'text-cyan'}`}>
              ⏱ {formatTime(timeLeft)}
            </span>
          </div>

          <div className="px-5 py-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-bold text-text-primary">{selectedProblem.title}</h2>
              <span className={`font-mono text-xs px-2 py-0.5 rounded border ${diffBg[selectedProblem.difficulty]} ${diffColor[selectedProblem.difficulty]}`}>
                {selectedProblem.difficulty}
              </span>
              <span className="font-mono text-xs text-text-muted px-2 py-0.5 rounded border border-border-subtle">{selectedProblem.category}</span>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{selectedProblem.description}</p>

            <div className="flex flex-col gap-3">
              {selectedProblem.examples.map((ex, i) => (
                <div key={i} className="bg-bg-elevated rounded-lg p-4 border border-border-subtle">
                  <p className="font-mono text-xs text-text-muted mb-2">EXAMPLE {i+1}</p>
                  <p className="font-mono text-xs text-text-secondary"><span className="text-text-muted">Input:</span> {ex.input}</p>
                  <p className="font-mono text-xs text-text-secondary mt-1"><span className="text-text-muted">Output:</span> {ex.output}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="bg-bg-surface border-b border-border-subtle px-4 py-2 flex items-center gap-3">
            <select value={language} onChange={e => changeLang(e.target.value)}
              className="bg-bg-elevated border border-border-subtle text-text-primary font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan">
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <div className="flex-1"/>
            <button onClick={handleRun} disabled={isRunning}
              className="flex items-center gap-2 bg-bg-elevated hover:bg-border-subtle border border-border-subtle text-text-primary font-mono text-xs px-4 py-1.5 rounded-lg transition-all disabled:opacity-50">
              {isRunning ? (
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg>
              )}
              Run
            </button>
            <button onClick={handleSubmit} disabled={isRunning}
              className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/40 text-green-400 font-mono text-xs px-4 py-1.5 rounded-lg transition-all disabled:opacity-50">
              Submit
            </button>
          </div>

          {/* Code editor */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-bg-base font-mono text-sm text-text-primary p-4 resize-none focus:outline-none leading-relaxed"
              style={{ tabSize: 2 }}
              onKeyDown={e => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  const start = e.target.selectionStart
                  const end = e.target.selectionEnd
                  const newCode = code.substring(0, start) + '  ' + code.substring(end)
                  setCode(newCode)
                  setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2 }, 0)
                }
              }}
            />

            {/* Test results */}
            {testResults.length > 0 && (
              <div className="border-t border-border-subtle bg-bg-surface overflow-y-auto max-h-56">
                <div className="px-4 py-2 border-b border-border-subtle flex items-center gap-3">
                  <span className="font-mono text-xs text-text-muted tracking-widest">TEST RESULTS</span>
                  {allPassed && <span className="font-mono text-xs text-green-400">✓ All Passed</span>}
                </div>
                <div className="flex flex-col gap-0">
                  {testResults.map((r, i) => (
                    <div key={i} className={`px-4 py-3 border-b border-border-subtle ${r.passed ? 'bg-green-400/5' : 'bg-brand-red/5'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-mono text-xs font-bold ${r.passed ? 'text-green-400' : 'text-brand-red'}`}>
                          {r.passed ? '✓ PASSED' : '✗ FAILED'} — Test {i+1}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                        <div>
                          <p className="text-text-muted mb-1">Input</p>
                          <pre className="text-text-secondary bg-bg-elevated rounded px-2 py-1 whitespace-pre-wrap break-all">{r.input}</pre>
                        </div>
                        <div>
                          <p className="text-text-muted mb-1">Expected</p>
                          <pre className="text-green-400 bg-bg-elevated rounded px-2 py-1">{r.expected}</pre>
                        </div>
                        <div>
                          <p className="text-text-muted mb-1">Your Output</p>
                          <pre className={`${r.passed ? 'text-green-400' : 'text-brand-red'} bg-bg-elevated rounded px-2 py-1`}>
                            {r.error ? r.error.substring(0,100) : r.actual || '(empty)'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function PracticePage() {
  const [tab, setTab] = useState('coding') // 'mcq' | 'coding'

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="flex items-center justify-between px-6 py-3">
          <span className="font-display font-bold text-base text-cyan tracking-tight">HireIQ <span className="text-text-muted font-normal">/ Practice</span></span>
          <div className="flex items-center gap-1 bg-bg-elevated border border-border-subtle rounded-lg p-1">
            <button onClick={() => setTab('mcq')}
              className={`font-mono text-xs px-4 py-1.5 rounded-md transition-all duration-200 ${
                tab === 'mcq' ? 'bg-bg-surface text-text-primary border border-border-subtle' : 'text-text-muted hover:text-text-primary'
              }`}>
              MCQ
            </button>
            <button onClick={() => setTab('coding')}
              className={`font-mono text-xs px-4 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                tab === 'coding' ? 'bg-cyan/10 text-cyan border border-cyan/30' : 'text-text-muted hover:text-cyan'
              }`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              CODING
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
            {tab === 'mcq' ? <MCQSection /> : <CodingSection />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
