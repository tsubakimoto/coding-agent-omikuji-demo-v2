import { test, expect } from '@playwright/test';

test.describe('User Interface and Animation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have smooth animations during fortune drawing', async ({ page }) => {
    // Click the fortune drawing button
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    
    // Check that loading animation elements are present
    await expect(page.locator('.animate-pulse')).toBeVisible();
    await expect(page.locator('.animate-spin')).toBeVisible();
    
    // Verify loading text
    await expect(page.locator('text=運勢を占っています...')).toBeVisible();
    
    // Wait for animation to complete
    await page.waitForTimeout(3000);
    
    // Check that result appears with fade-in animation
    await expect(page.locator('.fade-in')).toBeVisible();
  });

  test('should have hover effects on interactive elements', async ({ page }) => {
    // Test hover effect on fortune drawing button
    const drawButton = page.getByRole('button', { name: /おみくじを回す/i });
    
    // Hover over the button
    await drawButton.hover();
    
    // Button should have hover styling (transform scale)
    await expect(drawButton).toHaveClass(/hover:scale-105/);
    
    // Test hover effect on theme toggle
    const themeButton = page.locator('.theme-toggle');
    await themeButton.hover();
    
    await expect(themeButton).toHaveClass(/hover:scale-110/);
  });

  test('should disable button during fortune drawing', async ({ page }) => {
    const drawButton = page.getByRole('button', { name: /おみくじを回す/i });
    
    // Button should be enabled initially
    await expect(drawButton).toBeEnabled();
    
    // Click to start drawing
    await drawButton.click();
    
    // Button should be disabled during drawing
    await expect(drawButton).toBeDisabled();
    
    // Wait for animation to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(drawButton).toBeEnabled();
  });

  test('should have proper card styling and layout', async ({ page }) => {
    // Check that main card has proper styling classes
    const mainCard = page.locator('.omikuji-card');
    await expect(mainCard).toBeVisible();
    
    // Should have rounded corners, shadow, and padding
    await expect(mainCard).toHaveClass(/rounded-xl/);
    await expect(mainCard).toHaveClass(/shadow-lg/);
    await expect(mainCard).toHaveClass(/p-8/);
    
    // Should have background color
    await expect(mainCard).toHaveClass(/bg-white/);
  });

  test('should have gradient background', async ({ page }) => {
    // Check that body has gradient background
    const background = page.locator('.min-h-screen');
    await expect(background).toHaveClass(/bg-gradient-to-br/);
    await expect(background).toHaveClass(/from-pink-50/);
    await expect(background).toHaveClass(/to-red-50/);
  });

  test('should display correct fortune icons', async ({ page }) => {
    // Draw a fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    // Check that fortune result has an emoji icon
    const iconElement = page.locator('.text-6xl');
    const iconText = await iconElement.textContent();
    
    // Should contain an emoji icon (not just bamboo)
    const validIcons = ['🌟', '✨', '🍀', '🌸', '⚡', '🌧️'];
    const hasValidIcon = validIcons.some(icon => iconText.includes(icon));
    expect(hasValidIcon).toBeTruthy();
  });
});