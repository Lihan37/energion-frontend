import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { Product } from '../src/types/product'
import { campaignPhotos } from '../src/constants/campaignPhotos'
const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/products.json', import.meta.url), 'utf8'),
) as { products: Product[] }
async function setup(page: Page, products = fixture.products) {
  await page.route('**/api/products', (route) => route.fulfill({ json: { products } }))
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({ status: 401, json: { message: 'QA' } }),
  )
  await page.route('https://res.cloudinary.com/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800"><rect width="400" height="800" fill="#0a0a0a"/></svg>',
    }),
  )
}
test('each model has a shareable reloadable URL, matching metadata and normal navigation', async ({
  page,
}) => {
  await setup(page)
  for (const product of fixture.products) {
    await page.goto(`/products/${product.slug}`)
    await expect(
      page.getByRole('heading', { level: 1, name: product.name, exact: true }),
    ).toBeVisible()
    await expect(page).toHaveTitle(`${product.name} | Energion E-Mobility`)
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://energion-emobility.com/products/${product.slug}`,
    )
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      product.image,
    )
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.reload()
    await expect(page.locator('.model-page .detail-visual img')).toHaveCSS('object-fit', 'contain')
    await page.getByRole('link', { name: 'All models', exact: true }).click()
    await expect(page).toHaveURL(/\/products$/)
  }
})
test('unpublished and unknown models have a safe unavailable state, not a product or price leak', async ({
  page,
}) => {
  const products = fixture.products.map((product, index) => ({
    ...product,
    published: index !== 0,
  }))
  await setup(page, products)
  for (const slug of [products[0].slug, 'does-not-exist']) {
    await page.goto(`/products/${slug}`)
    await expect(
      page.getByRole('heading', { level: 1, name: "Let's find your next ride." }),
    ).toBeVisible()
    await expect(page.locator('.model-page')).toHaveCount(0)
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, follow')
  }
})
test('all nine ZIP assets decorate editorial pages, never catalog cards or model galleries', async ({
  page,
}) => {
  await setup(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const seen = new Set<string>()
  for (const path of ['/', '/about', '/contact', '/map', '/blog']) {
    await page.goto(path)
    await page.locator('h1').waitFor()
    const images = page.locator('.campaign-photo-panel img')
    await expect(images.first()).toBeVisible()
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded()
      const src = await image.getAttribute('src')
      if (src) seen.add(src)
      expect(
        await image.evaluate(async (element: HTMLImageElement) => {
          await element.decode()
          return element.naturalWidth > 0
        }),
      ).toBe(true)
    }
  }
  expect([...seen].sort()).toEqual(
    Object.values(campaignPhotos)
      .map((photo) => photo.src)
      .sort(),
  )
  await page.goto('/products')
  await expect(page.locator('.vehicle-card')).toHaveCount(fixture.products.length)
  await expect(page.locator('.vehicle-card img[src^="/images/campaign/"]')).toHaveCount(0)
  await page.goto(`/products/${fixture.products[0].slug}`)
  await expect(page.locator('.model-page')).toBeVisible()
  await expect(page.locator('.model-page img[src^="/images/campaign/"]')).toHaveCount(0)
})
test('model without verified specifications remains useful without invented technical numbers', async ({
  page,
}) => {
  const product = {
    ...fixture.products[0],
    battery: '',
    range: '',
    topSpeed: '',
    chargingTime: '',
    specs: [],
  }
  await setup(page, [product])
  await page.goto(`/products/${product.slug}`)
  await expect(page.locator('.model-page-spec-note')).toContainText('not yet published')
  await expect(page.locator('.spec-highlights')).toHaveCount(0)
  await expect(page.locator('.model-page-spec-grid')).toHaveCount(0)
  await expect(
    page.getByRole('link', { name: 'Enquire about this model' }).first(),
  ).toHaveAttribute('href', `/contact?model=${encodeURIComponent(product.name)}`)
})
