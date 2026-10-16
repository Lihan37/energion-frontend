import { useEffect, useState, type PropsWithChildren } from 'react'
import axios from 'axios'
import { getCurrentUser, loginUser, logoutUser, signupUser } from '../services/authService'
import type { AuthUser } from '../types/auth'
import { AuthContext, type AuthContextValue } from './auth-store'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    getCurrentUser()
      .then((data) => {
        if (active) setUser(data.user)
      })
      .catch((error: unknown) => {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) console.error(error)
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const value: AuthContextValue = {
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
    refreshSession: async () => {
      try {
        const data = await getCurrentUser()
        setUser(data.user)
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) console.error(error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    },
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
