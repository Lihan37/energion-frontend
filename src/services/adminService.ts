import { apiClient } from './apiClient'
import type { AdminSummary } from '../types/auth'

export async function getAdminSummary() {
  const { data } = await apiClient.get<{ summary: AdminSummary }>('/admin/summary')
  return data.summary
}
