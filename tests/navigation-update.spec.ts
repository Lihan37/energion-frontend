import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: {} }))
  await page.route('**/api/products', (route) => route.fulfill({ json: { products: [] } }))
  await page.route('**/api/blogs', (route) => route.fulfill({ json: { blogs: [] } }))
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('desktop navigation is readable and fits without overlaps', async ({ page }) => {
  for (const width of [1024, 1100, 1200, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/products')
    const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true })
    await expect(nav.getByRole('link', { name: 'Blog and Media', exact: true })).toBeVisible()
    await expect(nav.locator('a').first()).toHaveCSS('font-size', '14px')
    const bounds = await page.locator('.header-inner').evaluate((header) => {
      const children = [...header.children].filter((child) => getComputedStyle(child).display !== 'none')
      return children.map((child) => {
        const box = child.getBoundingClientRect()
        return { left: box.left, right: box.right }
      })
    })
    for (let index = 1; index < bounds.length; index++) {
      expect(bounds[index].left).toBeGreaterThanOrEqual(bounds[index - 1].right)
    }
    expect(bounds.at(-1)!.right).toBeLessThanOrEqual(width)
  }
})

test('mobile menu shows the renamed link and navigates to the journal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/products')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  const dialog = page.getByRole('dialog', { name: 'Mobile navigation' })
  await dialog.getByRole('link', { name: 'Blog and Media', exact: true }).click()
  await expect(page).toHaveURL(/\/blog$/)
  await expect(dialog).toHaveCount(0)
  await expect(page).toHaveTitle('Blog and Media | Energion E-Mobility')
})

test('moving banner and footer use the new brand statement', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.kinetic-band')).toContainText('EZ GO')
  await expect(page.locator('.kinetic-band')).toContainText('A HOMEGROWN ELECTRIC BRAND')
  await expect(page.locator('.footer-bottom')).toContainText('EZ GO. A Homegrown Electric Brand.')
  await expect(page.locator('body')).not.toContainText(/Energion by choice/i)
})
