import axios from 'axios'
import { useAuthStore } from '../store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/refresh`,
          null,
          { headers: { 'X-Refresh-Token': refreshToken } }
        )
        useAuthStore.getState().setAuth(data.user, data.accessToken, data.refreshToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  logout: (refreshToken) => api.post('/auth/logout', null, { headers: { 'X-Refresh-Token': refreshToken } }),
}

// ─── Interviews ─────────────────────────────────────────────────────────────
export const interviewAPI = {
  start: (data) => api.post('/interviews/start', data).then(r => r.data),
  submitAnswer: (id, data) => api.post(`/interviews/${id}/answer`, data).then(r => r.data),
  skip: (id, position) => api.post(`/interviews/${id}/skip`, null, { params: { position } }),
  complete: (id) => api.post(`/interviews/${id}/complete`).then(r => r.data),
  getReport: (id) => api.get(`/interviews/${id}/report`).then(r => r.data),
  list: (page = 0, size = 10) => api.get('/interviews', { params: { page, size } }).then(r => r.data),
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats').then(r => r.data),
  getSkills: () => api.get('/dashboard/skills').then(r => r.data),
}

// ─── Practice ──────────────────────────────────────────────────────────────
export const practiceAPI = {
  generateMCQ: (role, count, difficulty) =>
    api.get('/practice/mcq', { params: { role, count, difficulty } }).then(r => r.data),
}

export default api
