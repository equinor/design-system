import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test("static page should match screenshot", async ({ page }) => {
    await page.goto("/static");

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Take a screenshot and compare it with the baseline
    await expect(page).toHaveScreenshot("static-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("static exercise page should match screenshot", async ({ page }) => {
    await page.goto("/static/exercise");

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Take a screenshot and compare it with the baseline
    await expect(page).toHaveScreenshot("static-exercise-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("dynamic page should match screenshot", async ({ page }) => {
    await page.goto("/dynamic");

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Take a screenshot and compare it with the baseline
    await expect(page).toHaveScreenshot("dynamic-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("dynamic exercise page should match screenshot", async ({ page }) => {
    await page.goto("/dynamic/exercise");

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Take a screenshot and compare it with the baseline
    await expect(page).toHaveScreenshot("dynamic-exercise-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
