import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText('おみくじ');
    
    // After drawing a fortune, check that result heading exists
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    const resultHeading = page.locator('h2');
    await expect(resultHeading).toBeVisible();
  });

  test('should have accessible button labels', async ({ page }) => {
    // Main fortune drawing button should have accessible text
    const drawButton = page.getByRole('button', { name: /おみくじを回す/i });
    await expect(drawButton).toBeVisible();
    
    // Theme toggle should have title attribute
    const themeButton = page.locator('.theme-toggle');
    const title = await themeButton.getAttribute('title');
    expect(title).toBeTruthy();
  });

  test('should have proper color contrast', async ({ page }) => {
    // Test both light and dark themes for contrast
    
    // Light theme
    await expect(page.locator('h1')).toHaveClass(/text-gray-800/);
    await expect(page.locator('p')).toHaveClass(/text-gray-600/);
    
    // Switch to dark theme
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(500);
    
    // Dark theme should have appropriate contrast
    await expect(page.locator('h1')).toHaveClass(/dark:text-white/);
    await expect(page.locator('p')).toHaveClass(/dark:text-gray-300/);
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Focus should be able to reach interactive elements
    await page.keyboard.press('Tab');
    
    // One of the interactive elements should be focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing to reach other elements
    await page.keyboard.press('Tab');
    const secondFocusedElement = page.locator(':focus');
    await expect(secondFocusedElement).toBeVisible();
  });

  test('should support screen reader content', async ({ page }) => {
    // Check that important text content is accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('あなたの今日の運勢を占いましょう')).toBeVisible();
    
    // Draw a fortune and check result accessibility
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    // Result should be accessible to screen readers
    const resultHeading = page.locator('h2');
    await expect(resultHeading).toBeVisible();
    
    const resultMessage = page.locator('.text-lg.text-gray-600');
    await expect(resultMessage).toBeVisible();
  });
});