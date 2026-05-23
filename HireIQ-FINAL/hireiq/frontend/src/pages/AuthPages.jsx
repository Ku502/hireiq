import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

function AuthLayout({ title, sub, children }) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-bold text-2xl text-cyan tracking-tight">HireIQ</Link>
          <h1 className="font-display font-bold text-2xl tracking-tight mt-4 mb-1">{title}</h1>
          <p className="text-text-secondary text-sm">{sub}</p>
        </div>
        <div className="glass p-8">{children}</div>
      </motion.div>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      toast.success('Welcome to HireIQ!')
      navigate('/dashboard')
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Registration failed'),
  })

  return (
    <AuthLayout title="Create your account" sub="Start your AI interview journey today.">
      <form onSubmit={handleSubmit(data => mutate(data))} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-text-muted tracking-widest block mb-1.5">FULL NAME</label>
          <input className="input" placeholder="Kunal Sharma"
            {...register('fullName', { required: 'Name is required' })} />
          {errors.fullName && <p className="text-brand-red text-xs mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="font-mono text-xs text-text-muted tracking-widest block mb-1.5">USERNAME</label>
          <input className="input" placeholder="kunal502"
            {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Min 3 characters' } })} />
          {errors.username && <p className="text-brand-red text-xs mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <label className="font-mono text-xs text-text-muted tracking-widest block mb-1.5">EMAIL</label>
          <input className="input" type="email" placeholder="you@example.com"
            {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
          {errors.email && <p className="text-brand-red text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="font-mono text-xs text-text-muted tracking-widest block mb-1.5">PASSWORD</label>
          <input className="input" type="password" placeholder="Min 8 characters"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })} />
          {errors.password && <p className="text-brand-red text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="font-mono text-xs text-text-muted tracking-widest block mb-1.5">TARGET ROLE</label>
          <input className="input" placeholder="Java Backend Developer"
            {...register('targetRole')} />
        </div>
        <button type="submit" disabled={isPending} className="btn-primary w-full py-3 mt-2">
          {isPending ? 'Creating account…' : 'Create account →'}
        </button>
        <p className="text-center text-text-secondary text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      navigate('/dashboard')
    },
    onError: () => toast.error('Invalid email or password'),
  })

  return (
    <AuthLayout title="Welcome back" sub="Pick up where you left off.">
      <form onSubmit={handleSubmit(data => mutate(data))} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-text-muted tracking-widest block mb-1.5">EMAIL</label>
          <input className="input" type="email" placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-brand-red text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="font-mono text-xs text-text-muted tracking-widest block mb-1.5">PASSWORD</label>
          <input className="input" type="password" placeholder="Your password"
            {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className="text-brand-red text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isPending} className="btn-primary w-full py-3 mt-2">
          {isPending ? 'Logging in…' : 'Log in →'}
        </button>
        <p className="text-center text-text-secondary text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan hover:underline">Sign up free</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
