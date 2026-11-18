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
    await expect(section.locator('.team-grid article').last().locator('h3')).toHaveText('MD. Annafy Al Amin')
    await expect(section.locator('.team-grid-label')).toHaveCSS('font-size', width < 768 ? '14px' : '16px')
    await expect(section.getByText('People. Purpose. Progress.', { exact: true })).toBeVisible()
    await expect(section.locator('.team-member p').first()).toHaveCSS('font-size', '14px')
    await expect(section.locator('.team-member-index')).toHaveCount(0)
    await expect(section.locator('.team-member .team-portrait').first()).toHaveCSS('background-color', 'rgb(227, 231, 220)')
    await expect(section.locator('.team-member .team-portrait img').first()).toHaveCSS('mix-blend-mode', 'normal')
    for (const image of await section.locator('.team-member .team-portrait img').all()) {
      await expect(image).toHaveAttribute('src', /-studio\.webp$/)
    }
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

test('story cards and article covers use matching AI rider scenes with disclosure', async ({ page }) => {
  await page.goto('/blog')
  const images = page.locator('.journal-card img')
  await expect(images).toHaveCount(3)
  for (let index = 0; index < blogs.length; index++) {
    expect(blogs[index].coverImage).toBe(`/images/editorial/${['city-commuting', 'battery-care', 'dealer-support'][index]}.webp`)
    await expect(images.nth(index)).toHaveAttribute('src', blogs[index].coverImage)
    await expect(images.nth(index)).toHaveAttribute('alt', blogs[index].coverAlt!)
    await expect(images.nth(index)).toHaveCSS('object-fit', 'cover')
    await images.nth(index).evaluate(async (image: HTMLImageElement) => {
      image.loading = 'eager'
      await image.decode()
      if (image.naturalWidth < 1000) throw new Error('Editorial cover missing or too small')
    })
  }
  await expect(page.locator('.journal-card figcaption')).toHaveCount(3)
  for (const blog of blogs) {
    await page.goto(`/blog/${blog.slug}`)
    const image = page.locator('.article-cover')
    await expect(image).toHaveAttribute('src', blog.coverImage)
    await expect(image).toHaveCSS('object-fit', 'cover')
    await expect(page.locator('.article-figure figcaption')).toHaveText('AI-generated illustration')
  }
})

for (const width of [390, 1440]) {
  test(`team scroll entrances are staggered in order and finish visibly at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(() => {
      const original = Element.prototype.animate
      const records: { name: string; delay: number; duration: number }[] = []
      Object.assign(window, { teamEntrances: records })
      Element.prototype.animate = function (frames, options) {
        if (this.matches('.team-reveal') && typeof options === 'object') {
          records.push({ name: this.querySelector('h3')!.textContent!, delay: Number(options.delay), duration: Number(options.duration) })
        }
        return original.call(this, frames, options)
      }
    })
    await page.goto('/about')
    await page.locator('.team-reveal').first().waitFor()
    for (const card of await page.locator('.team-reveal').all()) {
      await card.scrollIntoViewIfNeeded()
    }
    const records = () => page.evaluate(() => (window as Window & { teamEntrances?: { name: string; delay: number; duration: number }[] }).teamEntrances ?? [])
    await expect.poll(async () => (await records()).length).toBe(5)
    const entrances = await records()
    for (const [index, member] of team.slice(1).entries()) {
      const entrance = entrances.find((entry) => entry.name === member.name)
      expect(entrance?.delay).toBeCloseTo(index * 160)
      expect(entrance?.duration).toBe(850)
    }
    await page.locator('.team-grid').evaluate(async (grid) => {
      await Promise.all(grid.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})))
    })
    for (const card of await page.locator('.team-reveal').all()) {
      await expect(card).toHaveCSS('opacity', '1')
      await expect(card).toHaveCSS('transform', 'none')
    }
  })
}
