import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStreamingFeedback } from '../../hooks/useStreamingFeedback'

/**
 * StreamingFeedbackPanel
 *
 * Shows live typewriter-style feedback while AI evaluates.
 * Used inside FeedbackPanel when evaluation is in progress.
 * Once done, switches to full structured feedback.
 */
export default function StreamingFeedbackPanel({ question, answer, role, onStreamDone }) {
  const { streamedText, isStreaming, streamDone, startStream, reset } = useStreamingFeedback()

  useEffect(() => {
    startStream(question, answer, role)
    return () => reset()
  }, [question, answer, role])

  useEffect(() => {
    if (streamDone && streamedText && onStreamDone) {
      // Give user 800ms to read the streamed text before switching to full eval
      const t = setTimeout(() => onStreamDone(streamedText), 800)
      return () => clearTimeout(t)
    }
  }, [streamDone, streamedText])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass overflow-hidden">

      <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
        {/* Animated AI icon */}
        <div className="w-8 h-8 rounded-full bg-cyan-dim border border-cyan/20 flex items-center justify-center flex-shrink-0">
          <span className="text-cyan text-xs font-mono font-semibold">AI</span>
        </div>
        <div className="flex-1">
          <div className="text-text-primary text-sm font-medium">AI Evaluating</div>
          <div className="flex items-center gap-1 mt-0.5">
            {isStreaming ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                <span className="font-mono text-xs text-cyan tracking-widest">LIVE</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                <span className="font-mono text-xs text-brand-green tracking-widest">DONE</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-5 min-h-[80px]">
        <p className="text-text-secondary text-sm leading-relaxed">
          {streamedText}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-cyan ml-0.5 animate-pulse align-middle" />
          )}
        </p>
        {!streamedText && isStreaming && (
          <div className="flex items-center gap-2 text-text-muted">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i}
                  className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot"
                  style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <span className="font-mono text-xs tracking-widest">Thinking</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
