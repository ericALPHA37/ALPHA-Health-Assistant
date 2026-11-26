import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const searchbox = (page: import('@playwright/test').Page) => page.getByRole('searchbox')

test('production search works without JS errors, CSP violations or query requests', async ({ page }) => {
  const errors: string[] = []
  const requests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.goto('./')
  await expect(searchbox(page)).toBeVisible()
  // Ignore initial static resources. No request should occur on submit/edit.
  await page.waitForLoadState('networkidle')
  page.on('request', (request) => requests.push(request.url()))
  await searchbox(page).fill('vacinação')
  await searchbox(page).press('Enter')
  await expect(page.getByRole('status')).toContainText('Vacinação')
  await expect(page.getByRole('link', { name: /Consultar:/ })).toHaveAttribute('rel', 'noopener noreferrer')
  await searchbox(page).fill('sono')
  await expect(page.getByRole('article')).toHaveCount(0)
  await page.getByRole('button', { name: 'Consultar' }).click()
  await expect(page.getByRole('status')).toContainText('Nenhum tema único')
  expect(requests).toEqual([])
  expect(errors).toEqual([])
})

test('accessible initial, success and empty states, without horizontal overflow', async ({ page }) => {
  await page.goto('./')
  for (const query of ['', 'água', 'sono']) {
    if (query) {
      await searchbox(page).fill(query)
      await searchbox(page).press('Enter')
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})

test('keyboard focus and native required/length validation work', async ({ page }) => {
  await page.goto('./')
  await page.keyboard.press('Tab')
  await expect(searchbox(page)).toBeFocused()
  await page.keyboard.press('Enter')
  expect(await searchbox(page).evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBe(true)
  await expect(page.getByRole('status')).toBeEmpty()
  await searchbox(page).fill('v'.repeat(205))
  // fill is programmatic; test the HTML contract as well as browser typing.
  await expect(searchbox(page)).toHaveAttribute('maxlength', '200')
  await searchbox(page).fill('v')
  await searchbox(page).press('Enter')
  expect(await searchbox(page).evaluate((element: HTMLInputElement) => element.validity.tooShort)).toBe(true)
})

test('CSP blocks script injection and network connections', async ({ page }) => {
  await page.goto('./')
  await expect(searchbox(page)).toBeVisible()
  const blocked = await page.evaluate(async () => {
    const violations: string[] = []
    document.addEventListener('securitypolicyviolation', (event) => violations.push(event.effectiveDirective))
    const script = document.createElement('script')
    script.textContent = 'window.__injected = true'
    document.body.append(script)
    let networkBlocked = false
    try { await fetch('/should-not-be-sent') } catch { networkBlocked = true }
    await new Promise((resolve) => setTimeout(resolve, 50))
    return { networkBlocked, violations, injected: '__injected' in window }
  })
  expect(blocked.networkBlocked).toBe(true)
  expect(blocked.injected).toBe(false)
  expect(blocked.violations).toContain('script-src-elem')
  expect(blocked.violations).toContain('connect-src')
})

test('404 links use the deployed base and remain styled under CSP', async ({ page }) => {
  await page.goto('404.html')
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
  expect(await page.locator('body').evaluate((element) => getComputedStyle(element).display)).toBe('grid')
  await page.getByRole('link', { name: /Voltar/ }).click()
  await expect(searchbox(page)).toBeVisible()
})
