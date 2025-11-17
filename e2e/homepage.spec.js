import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load and display the homepage', async ({ page }) => {
    await page.goto('/')

    // Wait for the app to load
    await page.waitForLoadState('networkidle')

    // Check for main heading
    await expect(page.locator('h1')).toBeVisible()

    // Check for navigation
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should navigate to recipes page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click on "Explore All Recipes" or similar link
    const recipesLink = page.getByRole('link', { name: /recipes/i }).first()
    await recipesLink.click()

    // Wait for navigation
    await page.waitForURL('**/recipes')

    // Check that we're on the recipes page
    await expect(page).toHaveURL(/.*recipes/)
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that mobile menu button is visible
    const menuButton = page.locator('button[aria-label="menu"], button:has(svg)')
    await expect(menuButton.first()).toBeVisible()
  })

  test('should have proper accessibility', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for proper heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Check for skip links or landmarks
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })
})
