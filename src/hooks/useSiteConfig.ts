import { useQuery } from '@tanstack/react-query'
import { siteConfig } from '../constants/site'
import { apiClient } from '../services/apiClient'
export function useSiteConfig() {
  const query = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () =>
      (await apiClient.get<{ settings: typeof siteConfig }>('/content/settings')).data.settings,
    staleTime: 60_000,
  })
  return query.data ?? siteConfig
}
