import { blogs } from '../data/blogs'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getBlogs() {
  await delay(300)
  return blogs
}

export async function getBlogBySlug(slug: string) {
  await delay(200)
  return blogs.find((blog) => blog.slug === slug) ?? null
}
