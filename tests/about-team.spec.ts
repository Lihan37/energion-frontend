import { test, expect } from '@playwright/test'
import { team } from '../src/data/team'
import { blogs } from '../src/data/blogs'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: {} }))
  await page.route('**/api/products', (route) => route.fulfill({ json: { products: [] } }))
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('About shows all six supplied portraits, names and roles in responsive grids', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/about')
    const section = page.getByRole('region', { name: 'Our team. Shared ambition.' })
    await section.scrollIntoViewIfNeeded()
    await expect(section.locator('article')).toHaveCount(6)
    await expect(section.locator('.team-founder h3')).toHaveText(team[0].name)
    await expect(section.locator('.team-grid article')).toHaveCount(5)
    const founderBounds = await section.locator('.team-founder').boundingBox()
    const memberBounds = await section.locator('.team-grid').boundingBox()
    expect(founderBounds!.y + founderBounds!.height).toBeLessThan(memberBounds!.y)
    for (const member of team) {
      await expect(section.getByRole('heading', { name: member.name, exact: true })).toBeVisible()
      await expect(section.getByText(member.role, { exact: true })).toBeVisible()
      await section.getByRole('img', { name: member.name, exact: true }).evaluate(async (image: HTMLImageElement) => {
        image.loading = 'eager'
        await image.decode()
        if (!image.naturalWidth) throw new Error('Portrait missing')
      })
    }
    const columns = await section.locator('.team-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(width < 768 ? 2 : width < 1200 ? 3 : 5)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  }
})

test('story cards and article covers use the supplied full bike photos, not stock bikes', async ({ page }) => {
  await page.route('https://res.cloudinary.com/**', (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800"/>',
  }))
  await page.goto('/blog')
  const images = page.locator('.journal-card img')
  await expect(images).toHaveCount(3)
  for (let index = 0; index < blogs.length; index++) {
    expect(blogs[index].coverImage).toContain('res.cloudinary.com/ncdyagc3/')
    await expect(images.nth(index)).toHaveAttribute('src', blogs[index].coverImage)
    await expect(images.nth(index)).toHaveCSS('object-fit', 'contain')
  }
  for (const blog of blogs) {
    await page.goto(`/blog/${blog.slug}`)
    const image = page.locator('.article-cover')
    await expect(image).toHaveAttribute('src', blog.coverImage)
    await expect(image).toHaveCSS('object-fit', 'contain')
  }
})
