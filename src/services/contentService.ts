import axios from 'axios'
import { apiClient } from './apiClient'
import type { Blog } from '../types/blog'
import type { Dealer } from '../types/dealer'
import type { AuthUser } from '../types/auth'
import { siteConfig } from '../constants/site'

export type StoryRecord = Blog & { published: boolean }
export type DealerRecord = Dealer & { published: boolean }
export type SiteSettings = typeof siteConfig
export interface InboxMessage {
  id: string
  name: string
  email: string
  phone: string
  model: string
  message: string
  status: 'new' | 'read' | 'resolved'
  createdAt: string
}
export interface AccessList {
  users: AuthUser[]
  protectedPhones: string[]
  canManage: boolean
}
export async function readContent<T>(path: string): Promise<T> {
  return (await apiClient.get(`/admin/content/${path}`)).data
}
export async function writeContent(
  path: string,
  body: unknown,
  method: 'post' | 'put' | 'patch' | 'delete' = 'put',
) {
  return (await apiClient.request({ url: `/admin/content/${path}`, method, data: body })).data
}
export function contentError(error: unknown) {
  return axios.isAxiosError(error)
    ? (error.response?.data?.message ?? 'The server could not be reached. Please try again.')
    : 'Could not complete this action.'
}
export async function uploadContentImage(file: File): Promise<string> {
  const body = new FormData()
  body.append('image', file)
  return (await apiClient.post('/admin/content/uploads', body)).data.url
}
