import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import axios from 'axios'

import { getCurrentUser, loginUser, logoutUser, signupUser, type LoginPayload, type SignupPayload } from '../services/authService'
import type { AuthUser } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  signup: (payload: SignupPayload) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    try {
      const data = await getCurrentUser()
      setUser(data.user)
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error(error)
      }
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refreshSession()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (payload) => {
        const data = await loginUser(payload)
        setUser(data.user)
        return data.user
      },
      signup: async (payload) => {
        const data = await signupUser(payload)
        setUser(data.user)
        return data.user
      },
      logout: async () => {
        await logoutUser()
        setUser(null)
      },
      refreshSession,
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
