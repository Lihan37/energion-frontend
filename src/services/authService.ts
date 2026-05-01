import { apiClient } from './apiClient'
import type { AuthResponse } from '../types/auth'

export interface SignupPayload {
  name: string
  email?: string
  phone: string
  password: string
}

export interface LoginPayload {
  phone: string
  password: string
}

export async function signupUser(payload: SignupPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/signup', payload)
  return data
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function logoutUser() {
  const { data } = await apiClient.post<{ message: string }>('/auth/logout')
  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<{ user: AuthResponse['user'] }>('/auth/me')
  return data
}
