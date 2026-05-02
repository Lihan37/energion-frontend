import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, ShieldCheck, Smartphone, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

const loginSchema = z.object({
  phone: z.string().min(8, 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.email('Enter a valid email address').or(z.literal('')),
    phone: z.string().min(8, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type LoginValues = z.infer<typeof loginSchema>
type SignupValues = z.infer<typeof signupSchema>

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [serverMessage, setServerMessage] = useState<string>('')
  const [serverError, setServerError] = useState<string>('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup } = useAuth()

  const redirectTo = (userRole: 'admin' | 'user') => {
    if (userRole === 'admin') {
      navigate('/admin/dashboard')
      return
    }

    const state = location.state as { from?: string } | null
    navigate(state?.from && state.from !== '/auth' ? state.from : '/')
  }

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  })

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  })

  return (
    <div className="flex min-h-screen items-center py-12">
      <Container className="flex justify-center">
        <div className="surface-card w-full max-w-3xl rounded-[2.5rem] border border-white/40 p-6 shadow-[0_24px_80px_rgba(8,17,31,0.22)] sm:p-8">
          <div className="flex flex-wrap gap-3 rounded-full border border-[rgba(16,27,45,0.08)] bg-slate-50 p-2">
            {(['login', 'signup'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab)
                  setServerError('')
                  setServerMessage('')
                }}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  activeTab === tab ? 'bg-brand-gradient text-white' : 'text-slate-700'
                }`}
              >
                {tab === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="mt-8 max-w-lg">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950">
              {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {activeTab === 'login'
                ? 'Use your phone number and password to continue.'
                : 'Sign up once. Admin access is assigned automatically by approved phone numbers.'}
            </p>
          </div>

          {serverError ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {serverError}
            </div>
          ) : null}
          {serverMessage ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {serverMessage}
            </div>
          ) : null}

          {activeTab === 'login' ? (
            <form
              className="mt-8 space-y-5"
              onSubmit={loginForm.handleSubmit(async (values) => {
                setServerError('')
                setServerMessage('')
                try {
                  const user = await login(values)
                  setServerMessage('Login successful.')
                  redirectTo(user.role)
                } catch (error: unknown) {
                  setServerError(getErrorMessage(error))
                }
              })}
            >
              <div className="relative">
                <Smartphone className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone"
                  className="pl-11"
                  {...loginForm.register('phone')}
                  error={loginForm.formState.errors.phone?.message}
                />
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  className="pl-11"
                  {...loginForm.register('password')}
                  error={loginForm.formState.errors.password?.message}
                />
              </div>
              <Button type="submit" disabled={loginForm.formState.isSubmitting}>
                {loginForm.formState.isSubmitting ? 'Signing in...' : 'Login'}
              </Button>
            </form>
          ) : (
            <form
              className="mt-8 space-y-5"
              onSubmit={signupForm.handleSubmit(async (values) => {
                setServerError('')
                setServerMessage('')
                try {
                  const user = await signup({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    password: values.password,
                  })
                  setServerMessage('Account created successfully.')
                  redirectTo(user.role)
                } catch (error: unknown) {
                  setServerError(getErrorMessage(error))
                }
              })}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    className="pl-11"
                    {...signupForm.register('name')}
                    error={signupForm.formState.errors.name?.message}
                  />
                </div>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
                  <Input
                    label="Email"
                    placeholder="Optional email"
                    className="pl-11"
                    {...signupForm.register('email')}
                    error={signupForm.formState.errors.email?.message}
                  />
                </div>
              </div>
              <div className="relative">
                <Smartphone className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone"
                  className="pl-11"
                  {...signupForm.register('phone')}
                  error={signupForm.formState.errors.phone?.message}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create password"
                    className="pl-11"
                    {...signupForm.register('password')}
                    error={signupForm.formState.errors.password?.message}
                  />
                </div>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    className="pl-11"
                    {...signupForm.register('confirmPassword')}
                    error={signupForm.formState.errors.confirmPassword?.message}
                  />
                </div>
              </div>
              <Button type="submit" disabled={signupForm.formState.isSubmitting}>
                {signupForm.formState.isSubmitting ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  )
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message
  }

  return 'Something went wrong. Please try again.'
}
