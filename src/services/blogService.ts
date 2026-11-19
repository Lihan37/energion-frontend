import axios from 'axios'
import { apiClient } from './apiClient'
import type { Blog } from '../types/blog'
export async function getBlogs(): Promise<Blog[]> {
  return (await apiClient.get('/content/blogs')).data.blogs
}
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    return (await apiClient.get(`/content/blogs/${encodeURIComponent(slug)}`)).data.blog
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}
