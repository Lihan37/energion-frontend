import { test as base, expect } from '@playwright/test'
import { blogs } from '../src/data/blogs'
import { dealers } from '../src/data/dealers'
import { siteConfig } from '../src/constants/site'
export { expect }
export type { Page } from '@playwright/test'
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.route('**/api/content/**', (route) => {
      const path = new URL(route.request().url()).pathname
      if (path === '/api/content/settings') return route.fulfill({ json: { settings: siteConfig } })
      if (path === '/api/content/dealers') return route.fulfill({ json: { dealers } })
      if (path === '/api/content/blogs') return route.fulfill({ json: { blogs } })
      const blog = blogs.find((b) => path === `/api/content/blogs/${b.slug}`)
      return route.fulfill({
        status: blog ? 200 : 404,
        json: blog ? { blog } : { message: 'Not found' },
      })
    })
    await provide(page)
  },
})
