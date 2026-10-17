import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import type { Product } from '../src/types/product'
import { toPublicProduct } from '../src/lib/productPresentation'

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/products.json', import.meta.url), 'utf8'),
) as { products: Product[] }

async function mockCatalog(page: Page) {
  await page.route('**/api/products', (route) => route.fulfill({ json: fixture }))
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({ status: 401, json: { message: 'Not signed in' } }),
  )
}

async function noPrices(page: Page) {
  const markup = await page.content()
  expect(markup).not.toMatch(/starting price|Tk\s?[\d,]+|BDT\s?[\d,]+|"offers"\s*:/i)
  // Motion transform decimals are not business content and can coincidentally
  // contain a price's digits. Check visible content and SEO values explicitly.
  const text = await page.locator('body').innerText()
  const metadata = await page
    .locator('meta[content], script[type="application/ld+json"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('content') ?? node.textContent ?? '').join(' '),
    )
  for (const product of fixture.products) {
    expect(`${text} ${metadata}`).not.toContain(product.price.toLocaleString('en-US'))
    expect(`${text} ${metadata}`).not.toMatch(new RegExp(`\\b${product.price}\\b`))
  }
}

test('public projection removes pricing while retaining real specifications', () => {
  for (const product of fixture.products) {
    const result = toPublicProduct(product)
    expect(result).not.toHaveProperty('price')
    expect(result.specs).toEqual(product.specs)
    expect(result.image).toBe(product.image)
    expect(product).toHaveProperty('price')
  }
})

test('catalog filters, every model page, full images and enquiry context', async ({ page }) => {
  await mockCatalog(page)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/products')
  await expect(page.locator('.vehicle-card')).toHaveCount(fixture.products.length)
  for (const product of fixture.products) {
    await page.getByRole('link', { name: `Explore ${product.name}`, exact: true }).click()
    const detail = page.locator('.model-page')
    await expect(page).toHaveURL(new RegExp(`/products/${product.slug}$`))
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(
      detail.getByRole('heading', { name: product.name, exact: true, level: 1 }),
    ).toBeVisible()
    await expect(
      detail.locator('.model-page-glance').getByText(product.range, { exact: true }),
    ).toBeVisible()
    await expect(detail.locator('.detail-visual')).toBeVisible()
    const fit = await detail.locator('.detail-visual').evaluate((container) => {
      const image = container.querySelector('img')
      return image
        ? getComputedStyle(image).objectFit
        : container.querySelector('.image-placeholder')
          ? 'contain'
          : ''
    })
    expect(fit).toBe('contain')
    await expect(
      detail.getByRole('link', { name: 'Enquire about this model' }).first(),
    ).toHaveAttribute('href', `/contact?model=${encodeURIComponent(product.name)}`)
    await noPrices(page)
    await page.getByRole('link', { name: 'All models', exact: true }).click()
    await expect(page.locator('.vehicle-card')).toHaveCount(fixture.products.length)
  }
  await page.getByRole('searchbox', { name: 'Search models' }).fill('NEXO')
  await expect(page.locator('.vehicle-card')).toHaveCount(1)
  await page.getByRole('link', { name: 'Explore NEXO' }).click()
  await page.getByRole('link', { name: 'Enquire about this model' }).first().click()
  await expect(page.getByLabel('Model of interest (optional)')).toHaveValue('NEXO')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
  expect(errors).toEqual([])
})

test('model selector loops, supports keyboard and advances after six seconds', async ({ page }) => {
  await mockCatalog(page)
  await page.goto('/')
  const showcase = page.getByRole('region', { name: 'Featured electric vehicles' })
  await expect(showcase.getByRole('tab')).toHaveCount(
    fixture.products.filter((product) => product.featured).length,
  )
  await showcase.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  const firstName = await showcase.getByRole('tab', { selected: true }).innerText()
  await expect(showcase.getByRole('tab', { selected: true })).not.toHaveText(firstName, {
    timeout: 8500,
  })
  await showcase.getByRole('button', { name: 'Pause model slideshow' }).click()
  await showcase.getByRole('tab').first().click()
  await showcase.getByRole('tab').first().press('ArrowLeft')
  await expect(showcase.getByRole('tab').last()).toHaveAttribute('aria-selected', 'true')
  await showcase.getByRole('button', { name: 'Next model' }).click()
  await expect(showcase.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true')
  await noPrices(page)
})

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`public routes and details fit ${width}px without overflow`, async ({ page }) => {
    await mockCatalog(page)
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const route of [
      '/',
      '/products',
      '/products/jaguar',
      '/about',
      '/contact',
      '/map',
      '/blog',
      '/blog/how-electric-bikes-are-changing-city-commutes',
      '/auth',
    ]) {
      await page.goto(route)
      await expect(page.locator('h1')).toBeVisible()
      if (route === '/products') await expect(page.locator('.vehicle-card')).toHaveCount(6)
      const size = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }))
      expect(size.content, route).toBeLessThanOrEqual(size.viewport + 1)
      await noPrices(page)
    }
    await page.goto('/products')
    await page.getByRole('link', { name: 'Explore JAGUAR', exact: true }).click()
    const detail = page.locator('.model-page')
    await expect(detail.locator('.model-page-glance .spec-highlights')).toHaveCSS(
      'grid-template-columns',
      /\d+.*\d+/,
    )
    expect(await detail.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
    await expect(page.getByRole('dialog')).toHaveCount(0)
    expect(errors).toEqual([])
  })
}

test('mobile menu traps focus, closes on navigation and restores scroll', async ({ page }) => {
  await mockCatalog(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  const dialog = page.getByRole('dialog', { name: 'Mobile navigation' })
  await expect(dialog.getByRole('button', { name: 'Close navigation' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('link', { name: 'Login', exact: true })).toBeFocused()
  await dialog.getByRole('link', { name: 'Our Bikes' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(page).toHaveURL(/\/products$/)
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('enquiry validates fields and prepares a real email without claiming delivery', async ({
  page,
}) => {
  await mockCatalog(page)
  await page.goto('/contact?model=NEXO')
  await page.getByRole('button', { name: 'Prepare enquiry email' }).click()
  await expect(page.getByText('Please enter your name')).toBeVisible()
  await page.getByLabel('Your name', { exact: true }).fill('QA Rider')
  await page.getByLabel('Phone number', { exact: true }).fill('01806442201')
  await page.getByLabel('Email address').fill('rider@example.com')
  await page
    .getByLabel('Your message')
    .fill('I would like details about the NEXO electric vehicle.')
  await page.getByRole('button', { name: 'Prepare enquiry email' }).click()
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveAttribute(
    'href',
    /^mailto:info@energion-emobility.com\?subject=.*NEXO/,
  )
  await expect(page.getByText(/send it to complete your enquiry/i)).toBeVisible()
  await expect(page.getByText(/message sent|reach out shortly/i)).toHaveCount(0)
})

test('API failures show retry instead of fictional products or stock bikes', async ({ page }) => {
  await mockCatalog(page)
  await page.route('**/api/products', (route) =>
    route.fulfill({ status: 503, json: { message: 'Unavailable' } }),
  )
  await page.goto('/products')
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible({ timeout: 12000 })
  await expect(page.locator('.vehicle-card')).toHaveCount(0)
  await expect(page.locator('img[src*="unsplash"]')).toHaveCount(0)
})

test('unauthenticated admin access redirects to login', async ({ page }) => {
  await mockCatalog(page)
  await page.goto('/admin/products')
  await expect(page).toHaveURL(/\/auth$/)
  await expect(page.getByLabel('Phone Number', { exact: true })).toBeVisible()
})

test('phone login, admin dashboard access, editable pricing and image preview remain functional', async ({
  page,
}) => {
  await mockCatalog(page)
  let signedIn = false
  const user = {
    id: 'qa-admin',
    name: 'QA Admin',
    phone: '01700000000',
    email: '',
    role: 'admin',
    createdAt: '2026-01-01',
  }
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({
      status: signedIn ? 200 : 401,
      json: signedIn ? { user } : { message: 'Sign in' },
    }),
  )
  await page.route('**/api/auth/login', async (route) => {
    expect(route.request().postDataJSON()).toEqual({
      phone: '01700000000',
      password: 'qa-password',
    })
    signedIn = true
    await route.fulfill({ json: { user, message: 'Signed in' } })
  })
  await page.route('**/api/admin/summary', (route) =>
    route.fulfill({
      json: { summary: { products: 6, blogs: 3, dealers: 0, messages: 0, users: 1, admins: 1 } },
    }),
  )
  await page.route('**/api/admin/products', (route) => route.fulfill({ json: fixture }))
  await page.goto('/auth')
  await page.getByLabel('Phone Number', { exact: true }).fill('01700000000')
  await page.getByLabel('Password', { exact: true }).fill('qa-password')
  await page.getByRole('button', { name: 'Login', exact: true }).last().click()
  await expect(page).toHaveURL(/\/admin\/dashboard$/)
  await page.getByRole('link', { name: /Products Live/i }).click()
  await expect(page).toHaveURL(/\/admin\/products$/)
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click()
  await expect(page.getByLabel('Price (BDT)', { exact: true })).toHaveValue(
    String(fixture.products[0].price),
  )
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
    'base64',
  )
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'qa-preview.png', mimeType: 'image/png', buffer: png })
  await expect(page.locator('img[src^="data:image/png"]')).toBeVisible()
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible()
})

test('loaded vehicle images stay contained and broken sources have a readable fallback', async ({
  page,
}) => {
  await mockCatalog(page)
  await page.route('https://res.cloudinary.com/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800"><rect width="400" height="800" fill="#EBEEE6"/></svg>',
    }),
  )
  await page.goto('/products')
  const image = page.locator('.vehicle-card-visual img').first()
  await expect(image).toHaveCSS('object-fit', 'contain')
  await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalHeight)).toBe(800)
  await page.getByRole('link', { name: 'Explore JAGUAR', exact: true }).click()
  await expect(page.locator('.detail-visual img')).toHaveCSS('object-fit', 'contain')
  await page.getByRole('link', { name: 'All models', exact: true }).click()
  await page.route('https://res.cloudinary.com/**', (route) =>
    route.fulfill({ status: 401, body: 'Unavailable' }),
  )
  await page.reload()
  await expect(page.locator('.vehicle-card-visual .image-placeholder')).toHaveCount(6)
  await expect(page.locator('.vehicle-card-visual img')).toHaveCount(0)
})

test('major public pages and model page have no WCAG AA accessibility violations', async ({
  page,
}) => {
  test.setTimeout(90000)
  await mockCatalog(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const path of ['/', '/products', '/about', '/contact', '/map', '/blog', '/auth']) {
    await page.goto(path)
    await page.locator('h1').waitFor()
    if (path === '/') await expect(page.locator('.model-showcase')).toBeVisible()
    if (path === '/products') await expect(page.locator('.vehicle-card')).toHaveCount(6)
    await page.evaluate(() => document.fonts.ready)
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(
      result.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target),
      })),
      path,
    ).toEqual([])
  }
  await page.goto('/products')
  await page.getByRole('link', { name: 'Explore JAGUAR', exact: true }).click()
  await page.locator('.model-page').waitFor()
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(result.violations.map((violation) => violation.id)).toEqual([])
})

test('capture desktop and mobile review screenshots', async ({ page }) => {
  test.setTimeout(120000)
  await mockCatalog(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await mkdir('artifacts/redesign', { recursive: true })
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const [name, route] of Object.entries({
      home: '/',
      products: '/products',
      about: '/about',
      contact: '/contact',
      dealers: '/map',
      journal: '/blog',
      account: '/auth',
    })) {
      await page.goto(route)
      await page.locator('h1').waitFor()
      if (name === 'products') await expect(page.locator('.vehicle-card')).toHaveCount(6)
      if (name === 'home') await expect(page.locator('.model-showcase')).toBeVisible()
      await page.evaluate(async () => {
        await document.fonts.ready
        for (let top = 0; top < document.documentElement.scrollHeight; top += window.innerHeight) {
          window.scrollTo(0, top)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
        window.scrollTo(0, 0)
        await Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {})))
      })
      await page.screenshot({ path: `artifacts/redesign/${name}-${width}.png`, fullPage: true })
      if (name === 'home') await page.screenshot({ path: `artifacts/redesign/hero-${width}.png` })
    }
    await page.goto('/products')
    await page.getByRole('link', { name: 'Explore JAGUAR', exact: true }).click()
    await page.locator('.model-page').waitFor()
    await page.screenshot({ path: `artifacts/redesign/details-${width}.png`, fullPage: true })
  }
})

test('archived models are excluded and gallery colours can be selected', async ({ page }) => {
  await mockCatalog(page)
  const products = fixture.products.map((product, index) => ({
    ...product,
    published: index !== 0,
  }))
  products[1].images = [
    {
      url: 'https://res.cloudinary.com/ncdyagc3/image/upload/nexo-blue.webp',
      alt: 'NEXO blue side view',
      caption: 'Blue colourway',
      colour: 'Blue',
    },
    {
      url: 'https://res.cloudinary.com/ncdyagc3/image/upload/nexo-silver.webp',
      alt: 'NEXO silver side view',
      caption: 'Silver colourway',
      colour: 'Silver',
    },
  ]
  products[1].image = products[1].images[0].url
  await page.route('**/api/products', (route) => route.fulfill({ json: { products } }))
  await page.route('https://res.cloudinary.com/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#EBEEE6"/></svg>',
    }),
  )
  await page.goto('/products')
  await expect(page.locator('.vehicle-card')).toHaveCount(5)
  await page.getByRole('link', { name: 'Explore NEXO', exact: true }).click()
  await page.getByRole('button', { name: 'View NEXO silver side view' }).click()
  await expect(page.locator('.model-page').getByText('Silver colourway')).toBeVisible()
  await expect(page.locator('.model-page .detail-visual img')).toHaveAttribute(
    'alt',
    'NEXO silver side view',
  )
  await noPrices(page)
})

test('admin can edit image metadata, choose the cover and archive a model', async ({ page }) => {
  await mockCatalog(page)
  const product = {
    ...fixture.products[0],
    published: true,
    images: [
      {
        url: 'https://res.cloudinary.com/ncdyagc3/image/upload/first.webp',
        alt: 'First product view',
        caption: 'First view',
        publicId: 'energion/products/first',
      },
      {
        url: 'https://res.cloudinary.com/ncdyagc3/image/upload/second.webp',
        alt: 'Second product view',
        caption: 'Second view',
        publicId: 'energion/products/second',
      },
    ],
  }
  product.image = product.images[0].url
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({
      json: { user: { id: 'qa-admin', name: 'QA Admin', phone: '01700000000', role: 'admin' } },
    }),
  )
  await page.route('**/api/admin/products', (route) =>
    route.fulfill({ json: { products: [product] } }),
  )
  let saved: Record<string, unknown> | undefined
  await page.route(`**/api/admin/products/${product.id}`, async (route) => {
    const raw = route.request().postDataBuffer()?.toString() ?? ''
    saved = JSON.parse(raw.match(/name="payload"\r\n\r\n([^\r]+)/)?.[1] ?? '{}')
    await route.fulfill({ json: { product: { ...product, ...saved }, message: 'Updated' } })
  })
  await page.goto('/admin/products')
  await page.getByRole('button', { name: 'Edit', exact: true }).click()
  await page.getByLabel('Image 1 caption', { exact: true }).fill('Updated side-profile caption')
  await page.getByRole('button', { name: 'Use as cover', exact: true }).click()
  await page.getByLabel('Visible on public website').uncheck()
  await page.getByRole('button', { name: 'Update product', exact: true }).click()
  await expect(page.getByText('Product updated successfully.', { exact: true })).toBeVisible()
  expect(saved?.published).toBe(false)
  expect(saved?.primaryImageUrl).toBe(product.images[1].url)
  expect((saved?.images as Array<{ caption: string }>)[0].caption).toBe(
    'Updated side-profile caption',
  )
})
