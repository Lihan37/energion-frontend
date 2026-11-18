import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { Product } from '../src/types/product'

const fixture = JSON.parse(readFileSync(new URL('./fixtures/products.json', import.meta.url), 'utf8')) as { products: Product[] }
const images = [
  { url: 'https://gallery.test/portrait.svg', alt: 'Tall front view', width: 400, height: 1600 },
  { url: 'https://gallery.test/landscape.svg', alt: 'Wide side view', width: 1600, height: 400 },
  { url: 'https://gallery.test/square.svg', alt: 'Square view', width: 800, height: 800 },
]

for (const width of [320, 768, 1440]) {
  test(`gallery contains portrait, landscape and square photos at ${width}px`, async ({ page }) => {
    const product = { ...fixture.products[0], image: images[0].url, images }
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: {} }))
    await page.route('**/api/products', (route) => route.fulfill({ json: { products: [product] } }))
    await page.route('https://gallery.test/**', (route) => {
      const source = images.find((image) => image.url === route.request().url())!
      return route.fulfill({
        contentType: 'image/svg+xml',
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="${source.width}" height="${source.height}"><rect width="100%" height="100%" fill="green"/></svg>`,
      })
    })
    await page.goto(`/products/${product.slug}`)
    const thumbnails = page.locator('.gallery-thumbnail')
    await expect(thumbnails).toHaveCount(images.length)
    for (let index = 0; index < images.length; index++) {
      await thumbnails.nth(index).click()
      await expect(thumbnails.nth(index)).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('.detail-visual img')).toHaveAttribute('src', images[index].url)
      for (const image of await page.locator('.gallery-thumbnail img, .detail-visual img').all()) {
        const fits = await image.evaluate(async (element: HTMLImageElement) => {
          await element.decode()
          const imageBounds = element.getBoundingClientRect()
          const frame = element.parentElement!.getBoundingClientRect()
          return getComputedStyle(element).objectFit === 'contain' &&
            imageBounds.top >= frame.top && imageBounds.bottom <= frame.bottom &&
            imageBounds.left >= frame.left && imageBounds.right <= frame.right
        })
        expect(fits).toBe(true)
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })
}
