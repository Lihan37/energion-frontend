import { test, expect } from './content-fixture'
import { blogs } from '../src/data/blogs'
import { dealers } from '../src/data/dealers'
import { siteConfig } from '../src/constants/site'
import { mkdir } from 'node:fs/promises'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({
      json: {
        user: { id: 'operator', name: 'Primary Admin', phone: '01716285196', role: 'admin' },
      },
    }),
  )
})

test('all sidebar modules are active and dealer edits are persisted through API', async ({
  page,
}) => {
  let records = [{ ...dealers[0], published: true }]
  await page.route('**/api/admin/content/dealers**', async (route) => {
    if (route.request().method() === 'PUT') {
      records = [{ ...route.request().postDataJSON(), id: records[0].id }]
      return route.fulfill({ json: { record: records[0] } })
    }
    return route.fulfill({ json: { dealers: records } })
  })
  await page.goto('/admin/dealers')
  await expect(page.getByText('Soon', { exact: true })).toHaveCount(0)
  for (const name of ['Blog and Media', 'Dealers / Map Points', 'Messages', 'Settings', 'Admins'])
    await expect(page.locator('aside').getByRole('link', { name: new RegExp(name) })).toBeVisible()
  await page.getByRole('button', { name: 'Edit', exact: true }).click()
  await page.getByLabel('Showroom', { exact: true }).fill('Updated showroom')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('heading', { name: 'Updated showroom' })).toBeVisible()
  expect(records[0].showroom).toBe('Updated showroom')
})

test('blog editor retains article sections and can publish a draft', async ({ page }) => {
  let story = { ...blogs[0], published: false }
  await page.route('**/api/admin/content/blogs**', (route) => {
    if (route.request().method() === 'PUT') {
      story = route.request().postDataJSON()
      return route.fulfill({ json: { record: story } })
    }
    return route.fulfill({ json: { blogs: [story] } })
  })
  await page.goto('/admin/blogs')
  await page.getByRole('button', { name: 'Edit', exact: true }).click()
  await expect(page.getByRole('group')).toHaveCount(story.content.length)
  await page.getByLabel('Published on website').check()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('Published', { exact: true })).toBeVisible()
  expect(story.content).toEqual(blogs[0].content)
  expect(story.published).toBe(true)
})

test('inbox status, public settings and protected admin access work', async ({ page }) => {
  let status = 'new'
  let settings = { ...siteConfig }
  await page.route('**/api/admin/content/messages**', (route) => {
    if (route.request().method() === 'PATCH') {
      status = route.request().postDataJSON().status
      return route.fulfill({ json: {} })
    }
    return route.fulfill({
      json: {
        messages: [
          {
            id: 'msg1',
            name: 'Rider',
            email: 'rider@example.com',
            phone: '01800000000',
            message: 'Please tell me about NEXO.',
            model: 'NEXO',
            status,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    })
  })
  await page.route('**/api/admin/content/settings', (route) => {
    if (route.request().method() === 'PUT') settings = route.request().postDataJSON()
    return route.fulfill({ json: { settings } })
  })
  await page.route('**/api/content/settings', (route) => route.fulfill({ json: { settings } }))
  await page.route('**/api/admin/content/admins', (route) =>
    route.fulfill({
      json: {
        users: [{ id: 'operator', name: 'Primary Admin', phone: '01716285196', role: 'admin' }],
        protectedPhones: ['01716285196'],
        canManage: true,
      },
    }),
  )
  await page.goto('/admin/messages')
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('resolved')
  await expect(page.getByRole('combobox', { name: 'Status', exact: true })).toHaveValue('resolved')
  await page
    .locator('aside')
    .getByRole('link', { name: /Settings/ })
    .click()
  await page.getByLabel('Phone', { exact: true }).fill('01811111111')
  await page.getByRole('button', { name: 'Save settings' }).click()
  await expect(page.getByText('Settings saved.')).toBeVisible()
  await page
    .locator('aside')
    .getByRole('link', { name: /Admins/ })
    .click()
  await expect(page.getByRole('button', { name: 'Revoke access' })).toHaveCount(0)
  await page.goto('/contact')
  await expect(
    page.locator('.contact-details').getByRole('link', { name: '01811111111' }),
  ).toBeVisible()
})

test('admin content failure is recoverable and mobile does not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  let fails = true
  await page.route('**/api/admin/content/dealers', (route) =>
    route.fulfill({
      status: fails ? 503 : 200,
      json: fails ? { message: 'Temporarily unavailable' } : { dealers: [] },
    }),
  )
  await page.goto('/admin/dealers')
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible({ timeout: 15000 })
  fails = false
  await page.getByRole('button', { name: 'Retry' }).click()
  await page.getByRole('button', { name: 'Add dealer' }).click()
  await expect(page.getByLabel('Showroom')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('dealer directory and content editor are readable at desktop and mobile sizes', async ({
  page,
}) => {
  await mkdir('artifacts/admin-content', { recursive: true })
  await page.route('**/api/admin/content/dealers', (route) =>
    route.fulfill({ json: { dealers: [{ ...dealers[0], published: true }] } }),
  )
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/admin/dealers')
    await page.getByRole('button', { name: 'Edit', exact: true }).click()
    await page.locator('.cms-panel').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `artifacts/admin-content/editor-${width}.png` })
    await page.goto('/map')
    await expect(page.locator('.dealer-card')).toHaveCount(37)
    await page.locator('.dealer-toolbar').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `artifacts/admin-content/dealers-${width}.png` })
  }
})
