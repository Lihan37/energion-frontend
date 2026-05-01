export type UserRole = 'admin' | 'user'

export interface AuthUser {
  id: string
  name: string
  phone: string
  email: string
  role: UserRole
  createdAt: string
}

export interface AuthResponse {
  message: string
  user: AuthUser
}

export interface AdminSummary {
  products: number
  blogs: number
  dealers: number
  messages: number
  users: number
  admins: number
}
