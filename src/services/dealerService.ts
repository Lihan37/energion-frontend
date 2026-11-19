import { apiClient } from './apiClient'
import type { Dealer } from '../types/dealer'
export async function getDealers(): Promise<Dealer[]> {
  return (await apiClient.get('/content/dealers')).data.dealers
}
