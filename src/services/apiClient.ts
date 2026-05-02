import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://energion-backend-production.up.railway.app/api',
  withCredentials: true,
})
