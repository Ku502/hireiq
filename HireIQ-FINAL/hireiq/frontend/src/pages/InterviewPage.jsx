import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { interviewAPI } from '../services/api'
import { useInterviewStore } from '../store'
import toast from 'react-hot-toast'
import ScoreRing from '../components/interview/ScoreRing'
import FeedbackPanel from '../components/interview/FeedbackPanel'
import QuestionDots from '../components/interview/QuestionDots'
import WebcamPreview from '../components/ui/WebcamPreview'

// ── Piston API languages ───────────────────────────────────────────────────
const LANGUAGES = [
  { label: 'Java',       value: 'java',       version: '15.0.2' },
  { label: 'Python',     value: 'python',     version: '3.10.0' },
  { label: 'JavaScript', value: 'javascript', version: '18.15.0' },
  { label: 'C++',        value: 'c++',        version: '10.2.0' },
  { label: 'C',          value: 'c',          version: '10.2.0' },
]

const DEFAULT_CODE = {
  java: `public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println("Hello, World!");\n    }\n}`,
  python: `# Write your solution here\nprint("Hello, World!")`,
  javascript: `// Write your solution here\nconsole.log("Hello, World!");`,
  'c++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    printf("Hello, World!\\n");\n    return 0;\n}`,
}

// ── Code Editor Component ──────────────────────────────────────────────────
function CodeEditor({ code, setCode, onRun, isRunning, output, language, setLanguage }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-muted tracking-widest">LANGUAGE</span>
          <select
            value={language}
            onChange={e => {
              setLanguage(e.target.value)
              setCode(DEFAULT_CODE[e.target.value])
            }}
            className="bg-bg-elevated border border-border-subtle text-text-primary font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan"
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 text-cyan font-mono text-xs px-4 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              RUNNING...
            </>
          ) : (
            <>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <path d="M0 0l10 6-10 6z"/>
              </svg>
              RUN CODE
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="relative rounded-lg overflow-hidden border border-border-subtle bg-bg-elevated">
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          className="w-full min-h-[220px] bg-transparent font-mono text-sm text-text-primary p-4 resize-none focus:outline-none leading-relaxed"
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
      </div>

      {/* Output */}
      {output !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border-subtle bg-bg-elevated overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle">
            <div className={`w-2 h-2 rounded-full ${output.error ? 'bg-brand-red' : 'bg-green-400'}`} />
            <span className="font-mono text-xs text-text-muted tracking-widest">
              {output.error ? 'ERROR' : 'OUTPUT'}
            </span>
          </div>
          <pre className={`px-4 py-3 font-mono text-xs leading-relaxed whitespace-pre-wrap ${output.error ? 'text-brand-red' : 'text-green-400'}`}>
            {output.text || '(no output)'}
          </pre>
        </motion.div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function InterviewPage() {
  const navigate = useNavigate()
  const {
    session, currentIndex, answers, skipped,
    setCurrentIndex, setAnswer, addSkipped,
    tickElapsed, elapsed, setEvaluating, isEvaluating
  } = useInterviewStore()

  const [answerText, setAnswerText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [followUpText, setFollowUpText] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)

  // Code editor state
  const [activeTab, setActiveTab] = useState('text') // 'text' | 'code'
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('java')
  const [codeOutput, setCodeOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const recRef = useRef(null)
  const textRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!session) navigate('/setup')
  }, [session])

  useEffect(() => {
    timerRef.current = setInterval(tickElapsed, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Reset code editor on question change
  useEffect(() => {
    setActiveTab('text')
    setCode(DEFAULT_CODE[language])
    setCodeOutput(null)
  }, [currentIndex])

  const question = session?.questions?.[currentIndex]
  const isTechnical = question?.type === 'TECHNICAL' || question?.category === 'DSA' || question?.category === 'OOP' || question?.category === 'Collections'
  const currentEval = answers[currentIndex]
  const isLast = currentIndex === (session?.questions?.length ?? 0) - 1
  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const completedProgress = session ? ((currentIndex + (showFeedback ? 1 : 0)) / session.questions.length) * 100 : 0

  // ── Run code via Piston API ───────────────────────────────────────────────
  const runCode = async () => {
    if (!code.trim()) return
    setIsRunning(true)
    setCodeOutput(null)
    try {
      const lang = LANGUAGES.find(l => l.value === language)
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang.value,
          version: lang.version,
          files: [{ name: language === 'java' ? 'Main.java' : `main.${language === 'c++' ? 'cpp' : language === 'javascript' ? 'js' : language}`, content: code }],
        }),
      })
      const data = await res.json()
      const out = data.run?.stdout || data.run?.stderr || ''
      const isError = !!data.run?.stderr && !data.run?.stdout
      setCodeOutput({ text: out, error: isError })
    } catch (e) {
      setCodeOutput({ text: 'Failed to connect to code runner. Check your internet connection.', error: true })
    } finally {
      setIsRunning(false)
    }
  }

  // ── Build final answer text (text + code if written) ──────────────────────
  const buildFinalAnswer = () => {
    if (activeTab === 'code' || code !== DEFAULT_CODE[language]) {
      const textPart = answerText.trim() ? `${answerText.trim()}\n\n` : ''
      const outputPart = codeOutput && !codeOutput.error ? `\nOutput: ${codeOutput.text.trim()}` : ''
      return `${textPart}Code (${language}):\n${code}${outputPart}`
    }
    return answerText
  }

  // ── Submit answer ─────────────────────────────────────────────────────────
  const { mutate: submitAnswer, isPending: submitting } = useMutation({
    mutationFn: () => interviewAPI.submitAnswer(session.interviewId, {
      questionText: question.question,
      answerText: buildFinalAnswer(),
      position: currentIndex,
      idealAnswer: question.idealAnswer,
      keywords: question.keywords,
      timeTakenSecs: elapsed,
    }),
    onMutate: () => setEvaluating(true),
    onSuccess: (data) => {
      setAnswer(currentIndex, data)
      setShowFeedback(true)
      setEvaluating(false)
    },
    onError: () => {
      setEvaluating(false)
      toast.error('Evaluation failed — please try again.')
    },
  })

  // ── Complete interview ────────────────────────────────────────────────────
  const { mutate: completeInterview } = useMutation({
    mutationFn: () => interviewAPI.complete(session.interviewId),
    onSuccess: (report) => {
      useInterviewStore.getState().setReport(report)
      navigate('/results')
    },
    onError: () => {
      setIsCompleting(false)
      toast.error('Failed to generate report. Please try again.')
    },
  })

  const handleSubmitInterview = useCallback(() => {
    clearInterval(timerRef.current)
    setIsCompleting(true)
    toast.loading('Generating your report...', { id: 'completing' })
    completeInterview()
  }, [session])

  const handleSkip = useCallback(() => {
    if (session) interviewAPI.skip(session.interviewId, currentIndex).catch(() => {})
    addSkipped(currentIndex)
    setShowFeedback(false)
    setAnswerText('')
    setFollowUpText('')
    setCurrentIndex(currentIndex + 1)
  }, [currentIndex, session])

  const goNext = useCallback(() => {
    setShowFeedback(false)
    setAnswerText('')
    setFollowUpText('')
    if (isLast) {
      handleSubmitInterview()
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, isLast])

  // ── Voice input ───────────────────────────────────────────────────────────
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice input requires Chrome browser.')
      return
    }
    if (isRecording) {
      recRef.current?.stop()
      setIsRecording(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    recRef.current = new SR()
    recRef.current.continuous = true
    recRef.current.interimResults = true
    recRef.current.lang = 'en-US'
    recRef.current.onresult = (e) => {
      let transcript = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      setAnswerText(transcript)
    }
    recRef.current.onend = () => setIsRecording(false)
    recRef.current.start()
    setIsRecording(true)
  }

  if (!session || !question) return null

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-6">
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-3 h-3 rounded-full bg-cyan typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <p className="font-mono text-cyan tracking-widest text-sm">GENERATING YOUR REPORT...</p>
        <p className="text-text-muted text-sm">AI is analyzing your performance</p>
      </div>
    )
  }

  const tagColor = {
    TECHNICAL: 'tag-cyan', BEHAVIORAL: 'tag-purple', HR: 'tag-amber',
    SYSTEM_DESIGN: 'tag-green', CODING: 'tag-cyan',
  }[question.type] || 'tag-cyan'

  const diffDots = { EASY: 1, MEDIUM: 2, HARD: 3, EXPERT: 4 }[question.difficulty] || 2

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">

      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="flex items-center justify-between px-6 py-3">
          <span className="font-display font-bold text-base text-cyan tracking-tight">HireIQ</span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-text-muted bg-bg-elevated border border-border-subtle px-3 py-1 rounded-full">
              {session.questions[0]?.type || 'TECHNICAL'} · {session?.questions?.length} Q
            </span>
            <span className="font-mono text-sm text-brand-amber min-w-[48px] text-right">
              {formatTime(elapsed)}
            </span>
          </div>
        </div>
        <div className="h-[2px] bg-border-subtle relative">
          <motion.div
            className="h-full bg-cyan absolute left-0 top-0"
            animate={{ width: `${completedProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col gap-6">

        <QuestionDots
          total={session.questions.length}
          current={currentIndex}
          answers={answers}
          skipped={skipped}
        />

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <span className={`tag ${tagColor}`}>{question.category}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= diffDots ? 'bg-brand-amber' : 'bg-border-default'}`} />
                  ))}
                </div>
                <span className="font-mono text-xs text-text-muted">
                  Q{currentIndex + 1} / {session.questions.length}
                </span>
              </div>
            </div>

            <div className="px-6 py-6">
              <p className="text-xl font-medium leading-relaxed tracking-tight text-text-primary">
                {question.question}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer area */}
        {!showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3">

            {/* Tabs — only show for Technical questions */}
            {isTechnical && (
              <div className="flex items-center gap-1 bg-bg-elevated border border-border-subtle rounded-lg p-1 w-fit">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`font-mono text-xs px-4 py-1.5 rounded-md transition-all duration-200 ${
                    activeTab === 'text'
                      ? 'bg-bg-surface text-text-primary border border-border-subtle'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  TEXT
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`font-mono text-xs px-4 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'code'
                      ? 'bg-cyan/10 text-cyan border border-cyan/30'
                      : 'text-text-muted hover:text-cyan'
                  }`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                  CODE
                </button>
              </div>
            )}

            {/* Text answer tab */}
            {activeTab === 'text' && (
              <>
                <div className="font-mono text-xs text-text-muted tracking-widest">YOUR ANSWER</div>
                <div className="relative">
                  <textarea
                    ref={textRef}
                    className="input min-h-[140px] resize-none leading-relaxed text-[15px]"
                    placeholder="Be specific — mention concepts, examples, and real-world experience…"
                    value={answerText}
                    onChange={e => setAnswerText(e.target.value)}
                    disabled={submitting}
                  />
                  {submitting && (
                    <div className="absolute inset-0 bg-bg-elevated/80 backdrop-blur-sm rounded-lg flex items-center justify-center gap-3">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-2 h-2 rounded-full bg-cyan typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                      <span className="font-mono text-xs text-cyan tracking-widest">AI EVALUATING</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Code editor tab */}
            {activeTab === 'code' && (
              <CodeEditor
                code={code}
                setCode={setCode}
                onRun={runCode}
                isRunning={isRunning}
                output={codeOutput}
                language={language}
                setLanguage={setLanguage}
              />
            )}

            <div className="flex items-center gap-3">
              {/* Voice button — only on text tab */}
              {activeTab === 'text' && (
                <button onClick={toggleVoice}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200
                    ${isRecording
                      ? 'border-brand-red bg-brand-red/10 text-brand-red'
                      : 'border-border-default text-text-muted hover:border-brand-red hover:text-brand-red'
                    }`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                  </svg>
                </button>
              )}

              {/* Skip or Submit Interview button */}
              {isLast ? (
                <button
                  onClick={handleSubmitInterview}
                  disabled={submitting}
                  className="btn-primary text-sm px-6 bg-green-600 hover:bg-green-500 border-green-600">
                  Submit Interview →
                </button>
              ) : (
                <button onClick={handleSkip} disabled={submitting}
                  className="btn-ghost text-sm">
                  Skip
                </button>
              )}

              <button
                onClick={() => submitAnswer()}
                disabled={submitting || (activeTab === 'text' && !answerText.trim() && code === DEFAULT_CODE[language])}
                className="btn-primary flex items-center gap-2 flex-1 justify-center text-sm">
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Evaluating…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Evaluate Answer
                  </>
                )}
              </button>

              {activeTab === 'text' && (
                <span className="font-mono text-xs text-text-muted min-w-[60px] text-right">
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Feedback Panel */}
        <AnimatePresence>
          {showFeedback && currentEval && (
            <FeedbackPanel
              evaluation={currentEval}
              question={question}
              followUpText={followUpText}
              setFollowUpText={setFollowUpText}
              isLast={isLast}
              onNext={goNext}
            />
          )}
        </AnimatePresence>

      </main>

      <WebcamPreview position="bottom-right" />
    </div>
  )
}
