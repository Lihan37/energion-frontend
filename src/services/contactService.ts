import { apiClient } from './apiClient'

export interface ContactPayload {
  name: string
  email: string
  phone: string
  message: string
  model?: string
}

export async function submitContactMessage(payload: ContactPayload) {
  return (await apiClient.post<{ message: string }>('/content/messages', payload)).data
}
