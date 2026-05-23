import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
            <Route path="*"           element={<Navigate to="/" replace />} />
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
