import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Smartphone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Input } from '../../components/ui/Input'

const loginSchema = z.object({
  phone: z.string().min(8, 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginValues = z.infer<typeof loginSchema>

export function AdminLoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  return (
    <div className="flex min-h-screen items-center py-12">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/6 p-8 text-white backdrop-blur">
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.22em] uppercase text-[var(--brand-end)]">
            Admin Portal
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight">
            Manage products, blogs, dealers, and messages.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            This is the clean login entry point for the admin side of Energion. The UI is ready for authentication integration when the backend arrives.
          </p>
          <div className="mt-10 space-y-4">
            {[
              'Phone + password authentication layout',
              'Ready for protected routes and token storage',
              'Dashboard shell already scaffolded',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-[2.5rem] border border-white/40 p-6 shadow-[0_24px_80px_rgba(8,17,31,0.22)] sm:p-8">
          <div className="max-w-md">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950">Admin Login</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use phone and password to access the dashboard placeholder.
            </p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit(async () => {
              await new Promise((resolve) => setTimeout(resolve, 500))
              navigate('/admin/dashboard')
            })}
          >
            <div className="relative">
              <Smartphone className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
              <Input
                label="Phone Number"
                placeholder="Enter admin phone"
                className="pl-11"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-[3.05rem] size-4 text-slate-400" />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                className="pl-11"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login to Dashboard'}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
