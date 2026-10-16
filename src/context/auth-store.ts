import { createContext, useContext } from 'react'
import type { AuthUser } from '../types/auth'
import type { LoginPayload, SignupPayload } from '../services/authService'

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  signup: (payload: SignupPayload) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider.')
  return context
}
