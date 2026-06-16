import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store'
import ErrorBoundary from './components/ui/ErrorBoundary'
import LandingPage from './pages/LandingPage'
import SetupPage from './pages/SetupPage'
import InterviewPage from './pages/InterviewPage'
import ResultsPage from './pages/ResultsPage'
import DashboardPage from './pages/DashboardPage'
import ReportPage from './pages/ReportPage'
import PracticePage from './pages/PracticePage'
import { RegisterPage, LoginPage } from './pages/AuthPages'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

function Protected({ children }) {
  const { accessToken } = useAuthStore()
  return accessToken ? children : <Navigate to="/login" replace />
}

// ✅ NEW: Proper 404 page
function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-8xl font-bold text-border-default">404</span>
        <span className="font-display font-bold text-2xl text-text-primary">Page not found</span>
        <p className="text-text-muted text-sm text-center">The page you're looking for doesn't exist or has been moved.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)}
          className="btn-ghost px-6 py-2 text-sm">
          ← Go Back
        </button>
        <button onClick={() => navigate('/')}
          className="btn-primary px-6 py-2 text-sm">
          Home
        </button>
      </div>
      <span className="font-display font-bold text-cyan tracking-tight opacity-20 text-4xl absolute bottom-8">HireIQ</span>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/"           element={<LandingPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="/setup"      element={<Protected><ErrorBoundary><SetupPage /></ErrorBoundary></Protected>} />
            <Route path="/interview"  element={<Protected><ErrorBoundary><InterviewPage /></ErrorBoundary></Protected>} />
            <Route path="/results"    element={<Protected><ErrorBoundary><ResultsPage /></ErrorBoundary></Protected>} />
            <Route path="/dashboard"  element={<Protected><ErrorBoundary><DashboardPage /></ErrorBoundary></Protected>} />
            <Route path="/report/:id" element={<Protected><ErrorBoundary><ReportPage /></ErrorBoundary></Protected>} />
            <Route path="/practice"   element={<Protected><ErrorBoundary><PracticePage /></ErrorBoundary></Protected>} />
            <Route path="*"           element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f0f1a',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f0f0ff',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00ff9d', secondary: '#0f0f1a' } },
          error:   { iconTheme: { primary: '#ff4466', secondary: '#0f0f1a' } },
        }}
      />
    </QueryClientProvider>
  )
}
