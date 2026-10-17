import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { Product } from '../src/types/product'

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/products.json', import.meta.url), 'utf8'),
) as { products: Product[] }
// Geometry-only imagery stays in tests; production uses the supplied bike photographs.
const geometry =
  '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="500"><rect x="90" y="90" width="520" height="320" fill="#0a0a0a"/></svg>'
async function setup(page: Page) {
  const products = structuredClone(fixture.products)
  for (const product of products)
    product.images = [0, 1].map((index) => ({
      url: `https://res.cloudinary.com/test/image/upload/${product.slug}-${index}.webp`,
      alt: `${product.name} view ${index + 1}`,
      colour: index ? 'Alternative view' : 'Main view',
      caption: 'Test gallery view',
    }))
  await page.route('**/api/products', (route) => route.fulfill({ json: { products } }))
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({ status: 401, json: { message: 'Not signed in' } }),
  )
  await page.route('https://res.cloudinary.com/**', (route) =>
    route.fulfill({ contentType: 'image/svg+xml', body: geometry }),
  )
}

test('hero finishes its choreography and remains contained at campaign breakpoints', async ({
  page,
}) => {
  await setup(page)
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Ride electric.' })).toBeVisible()
    await expect(page.locator('.machine-image')).toHaveCSS('opacity', '1')
    await expect(page.locator('.machine-image img')).toHaveCSS('object-fit', 'contain')
    await expect(page.locator('.hero-strike')).toHaveCSS(
      'transform',
      /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
    )
    const box = await page.locator('.campaign-hero-title').boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
      ),
    ).toBe(true)
    await expect(
      page.getByRole('link', { name: 'Explore our bikes', exact: true }).first(),
    ).toHaveAttribute('href', '/products')
  }
})

test('desktop story sticks natively, changes chapters and changes real gallery views', async ({
  page,
}) => {
  await setup(page)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.locator('.story-sticky')).toHaveCSS('position', 'sticky')
  await page.locator('#story-1').scrollIntoViewIfNeeded()
  await expect(page.locator('.story-chapter-nav a').nth(1)).toHaveAttribute('aria-current', 'step')
  await expect(page.locator('.story-visual img')).toHaveAttribute('src', /-1\.webp/)
  const top = (await page.locator('.story-visual').boundingBox())!.y
  await page.evaluate(() => window.scrollBy(0, 100))
  await expect
    .poll(async () => (await page.locator('.story-visual').boundingBox())!.y)
    .toBeCloseTo(top, 0)
  await page.locator('#story-3').scrollIntoViewIfNeeded()
  await expect(page.locator('.story-chapter-nav a').nth(3)).toHaveAttribute('aria-current', 'step')
  await page
    .locator('#story-3')
    .getByRole('link', { name: /^Inside the/ })
    .click()
  await expect(page.locator('.model-page')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('mobile storytelling is sequential rather than pinned and keeps two-column metrics', async ({
  page,
}) => {
  await setup(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.locator('.story-sticky')).toHaveCSS('position', 'static')
  await expect(page.locator('.story-chapter')).toHaveCount(4)
  for (const chapter of await page.locator('.story-chapter').all()) {
    await chapter.scrollIntoViewIfNeeded()
    expect((await chapter.boundingBox())!.height).toBeLessThan(844)
  }
  await page.goto('/products')
  await page.getByRole('link', { name: 'Explore EVOX', exact: true }).click()
  await expect(page.locator('.model-page-glance .spec-highlights')).toHaveCSS(
    'grid-template-columns',
    /\d+.*\d+/,
  )
})

test('kinetic typography pauses explicitly and stops outside the viewport', async ({ page }) => {
  await setup(page)
  await page.goto('/')
  await page.locator('.kinetic-band').scrollIntoViewIfNeeded()
  await expect(page.locator('.kinetic-track')).toHaveCSS('animation-play-state', 'running')
  await page.getByRole('button', { name: 'Pause moving text' }).click()
  await expect(page.locator('.kinetic-track')).toHaveCSS('animation-play-state', 'paused')
  await page.getByRole('button', { name: 'Play moving text' }).click()
  await expect(page.locator('.kinetic-track')).toHaveCSS('animation-play-state', 'running')
  await page.locator('.site-footer').scrollIntoViewIfNeeded()
  await expect(page.locator('.kinetic-track')).toHaveCSS('animation-play-state', 'paused')
})

test('reduced motion removes kinetic text, autoplay and spatial hero animation', async ({
  page,
}) => {
  await setup(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.kinetic-track')).toHaveCSS('animation-name', 'none')
  await expect(page.getByRole('button', { name: 'Pause moving text' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Pause model slideshow' })).toHaveCount(0)
  await expect(page.locator('.machine-image')).toHaveCSS('opacity', '1')
  await expect(page.locator('.campaign-hero-machine')).toHaveCSS('transform', 'none')
})

test('keyboard card interaction and gallery updates work without hover or public prices', async ({
  page,
}) => {
  await setup(page)
  await page.goto('/products')
  const card = page
    .locator('.vehicle-card')
    .filter({ has: page.getByRole('heading', { name: 'EVOX', exact: true }) })
  const button = card.getByRole('link', { name: 'Explore EVOX', exact: true })
  await button.focus()
  await expect(card.locator('.vehicle-card-visual')).toHaveCSS(
    'background-color',
    'rgb(183, 210, 52)',
  )
  await button.press('Enter')
  const dialog = page.locator('.model-page')
  await dialog.getByRole('button', { name: 'View EVOX view 2' }).click()
  await expect(dialog.locator('.gallery-view-label')).toContainText('02 / 02')
  await expect(dialog.locator('.detail-visual img')).toHaveAttribute('alt', 'EVOX view 2')
  await expect(dialog.locator('.detail-visual img')).toHaveCSS('object-fit', 'contain')
  expect(await page.content()).not.toMatch(/starting price|Tk\s?[\d,]+|BDT\s?[\d,]+|"offers"\s*:/i)
})

test('showcase keeps a stable stage when a model has no published specifications', async ({
  page,
}) => {
  await setup(page)
  const products = structuredClone(fixture.products.filter((product) => product.featured))
  Object.assign(products[1], { battery: '', range: '', topSpeed: '', chargingTime: '', specs: [] })
  await page.route('**/api/products', (route) => route.fulfill({ json: { products } }))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    const showcase = page.locator('.model-showcase')
    await page.evaluate(() => document.fonts.ready)
    await showcase.getByRole('tab').first().click()
    const first = (await showcase.boundingBox())!.height
    await showcase.getByRole('tab').nth(1).click()
    await expect(showcase.locator('.model-spec-note')).toBeVisible()
    expect(
      Math.abs((await showcase.boundingBox())!.height - first),
      `Stage height at ${width}px`,
    ).toBeLessThanOrEqual(2)
  }
})
