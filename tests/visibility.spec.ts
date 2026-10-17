import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { Product } from '../src/types/product'

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/products.json', import.meta.url), 'utf8'),
) as { products: Product[] }
async function setup(page: Page) {
  await page.route('**/api/products', (route) => route.fulfill({ json: fixture }))
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({ status: 401, json: { message: 'QA' } }),
  )
}

async function expectReadable(heading: ReturnType<Page['locator']>) {
  await heading.evaluate(async (element) => {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => undefined)),
    )
  })
  for (const line of await heading.locator('.heading-line').all()) {
    await expect(line).toHaveCSS('transform', 'none')
    await expect
      .poll(() =>
        line.evaluate((element) => {
          const text = element.getBoundingClientRect()
          const mask = element.parentElement!.getBoundingClientRect()
          const overlap = Math.max(
            0,
            Math.min(text.bottom, mask.bottom) - Math.max(text.top, mask.top),
          )
          return text.height > 0 && overlap / text.height > 0.9
        }),
      )
      .toBe(true)
  }
}

for (const width of [1440, 390, 320]) {
  test(`CTA and footer headlines actually reveal with normal motion at ${width}px`, async ({
    page,
  }) => {
    await setup(page)
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    for (const route of ['/', '/products', '/about', '/map']) {
      await page.goto(route)
      const heading = page.locator('.enquiry-band h2')
      await heading.scrollIntoViewIfNeeded()
      await expect(heading).toHaveAccessibleName('Your next chapter. Make it electric.')
      await expectReadable(heading)
      const footer = page.locator('.footer-top h2')
      await footer.scrollIntoViewIfNeeded()
      await expectReadable(footer)
      await page.evaluate(() => window.scrollTo(0, 0))
      await heading.scrollIntoViewIfNeeded()
      await expectReadable(heading)
    }
  })
}

test('all campaign headings remain readable on fast scrolling and route re-entry', async ({
  page,
}) => {
  await setup(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const route of ['/', '/about', '/products/jaguar', '/contact', '/']) {
    await page.goto(route)
    await page.locator('h1').waitFor()
    for (const heading of await page.locator('.campaign-heading').all()) {
      await heading.scrollIntoViewIfNeeded()
      await expectReadable(heading)
    }
  }
})

test('observer failure cannot hide headings, product cards or decorative content', async ({
  page,
}) => {
  await setup(page)
  await page.addInitScript(() => {
    // Simulate an observer that never reports visibility, without breaking other motion hooks.
    class SilentObserver {
      root = null
      rootMargin = '0px'
      thresholds = [0]
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
    window.IntersectionObserver = SilentObserver as unknown as typeof IntersectionObserver
  })
  await page.goto('/products')
  await expect(page.locator('.vehicle-card')).toHaveCount(fixture.products.length)
  for (const card of await page.locator('.vehicle-card').all()) {
    await expect(card.locator('..')).toHaveCSS('opacity', '1')
  }
  const heading = page.locator('.enquiry-band h2')
  await heading.scrollIntoViewIfNeeded()
  await expectReadable(heading)
  await page.goto('/about')
  for (const heading of await page.locator('.campaign-heading').all()) await expectReadable(heading)
})

test('reduced motion stays readable and catalog trailing slashes retain correct metadata', async ({
  page,
}) => {
  await setup(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/products/')
  await expect(page).toHaveTitle('Our electric bikes | Energion E-Mobility')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    'https://energion-emobility.com/products',
  )
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'index, follow')
  await expectReadable(page.locator('.enquiry-band h2'))
  expect(
    await page
      .locator('.heading-line')
      .evaluateAll((lines) => lines.flatMap((line) => line.getAnimations()).length),
  ).toBe(0)
})
