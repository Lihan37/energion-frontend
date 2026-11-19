import { test, expect } from './content-fixture'
import { dealers } from '../src/data/dealers'

test('dealer catalog has the 37 supplied locations without invented contact details', () => {
  expect(dealers).toHaveLength(37)
  expect(new Set(dealers.map((dealer) => dealer.id)).size).toBe(37)
  expect(
    Object.fromEntries(
      ['Dhaka Metro', 'Chittagong', 'Rajshahi', 'Khulna', 'Rangpur'].map((area) => [
        area,
        dealers.filter((dealer) => dealer.region === area).length,
      ]),
    ),
  ).toEqual({ 'Dhaka Metro': 1, Chittagong: 3, Rajshahi: 10, Khulna: 13, Rangpur: 10 })
  expect(dealers.every((dealer) => !dealer.phone && !dealer.coordinates && !dealer.hours)).toBe(
    true,
  )
  expect(dealers.find((dealer) => dealer.showroom === 'Outlet Mirpur')?.address).toBe(
    'Moddo Pirerbag, Paka Masjhid, Mirpur-60ft, Dhaka',
  )
  expect(dealers.some((dealer) => dealer.showroom === 'Original Autos')).toBe(false)
})

test('all dealer areas, address search, directions and empty-state reset work', async ({
  page,
}) => {
  await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: {} }))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/map')
  await expect(page.locator('.dealer-card')).toHaveCount(37)
  for (const area of [...new Set(dealers.map((dealer) => dealer.region))]) {
    const group = dealers.filter((dealer) => dealer.region === area)
    await page.getByRole('button', { name: `${area} (${group.length})`, exact: true }).click()
    await expect(page.locator('.dealer-card')).toHaveCount(group.length)
    for (const dealer of group)
      await expect(
        page.locator('.dealer-card').getByRole('heading', { name: dealer.showroom, exact: true }),
      ).toBeVisible()
  }
  await page.getByRole('button', { name: 'All areas (37)', exact: true }).click()
  const search = page.getByRole('searchbox', { name: 'Search dealer points' })
  await search.fill('Khabashpur')
  await expect(page.locator('.dealer-card')).toHaveCount(1)
  await expect(page.locator('.dealer-card h3')).toHaveText('Shimul EV Motors')
  const directions = page.getByRole('link', { name: 'Get directions' })
  await expect(directions).toHaveAttribute(
    'href',
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Shimul EV Motors, Khabashpur, Barishal road, Beside Star Kabab, Faridpur.')}`,
  )
  await search.fill('no-matching-dealer')
  await expect(page.getByRole('heading', { name: 'No matching dealer points.' })).toBeVisible()
  await page.getByRole('button', { name: 'Show all dealer points' }).click()
  await expect(page.locator('.dealer-card')).toHaveCount(37)
  await page.setViewportSize({ width: 320, height: 900 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  )
})

test('dealer directory uses the wide viewport instead of a side rail', async ({ page }) => {
  await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: {} }))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/map')
    await expect(page.locator('.dealer-card')).toHaveCount(37)
    const grid = page.locator('.dealer-results-grid')
    const columns = await grid.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
    )
    expect(columns).toBe(width < 768 ? 1 : width <= 1100 ? 2 : width < 1700 ? 3 : 4)
    if (width >= 1440) {
      const bounds = await grid.boundingBox()
      expect(bounds!.width).toBeGreaterThan(width * 0.9)
      expect(bounds!.x).toBeLessThanOrEqual(56)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
  }
})
