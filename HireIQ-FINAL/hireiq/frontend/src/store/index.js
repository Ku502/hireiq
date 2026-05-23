import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: 'hireiq-auth', partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken }) }
  )
)

export const useInterviewStore = create((set, get) => ({
  // Session
  session: null,         // { interviewId, questions, startedAt }
  currentIndex: 0,
  answers: {},           // { [position]: evaluationResponse }
  scores: [],
  skipped: [],
  elapsed: 0,
  report: null,
  isEvaluating: false,

  setSession: (session) => set({ session, currentIndex: 0, answers: {}, scores: [], skipped: [], elapsed: 0, report: null }),
  setCurrentIndex: (i) => set({ currentIndex: i }),
  setAnswer: (position, evaluation) => set((s) => ({
    answers: { ...s.answers, [position]: evaluation },
    scores: [...s.scores.filter((_, i) => i !== position), evaluation.score].filter(Boolean),
  })),
  addSkipped: (position) => set((s) => ({ skipped: [...s.skipped, position] })),
  tickElapsed: () => set((s) => ({ elapsed: s.elapsed + 1 })),
  setReport: (report) => set({ report }),
  setEvaluating: (v) => set({ isEvaluating: v }),
  clearSession: () => set({ session: null, currentIndex: 0, answers: {}, scores: [], skipped: [], elapsed: 0, report: null }),

  get avgScore() {
    const { scores } = get()
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  },
}))
