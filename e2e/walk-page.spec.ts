import { test, expect } from "@playwright/test";

/**
 * End-to-end test for a city walk SEO page (`/walk/[slug]`).
 *
 * These pages are server-rendered and deterministic (generateStaticParams),
 * so they make the most reliable e2e target. We use "tokyo" — a stable slug
 * in src/data/cities.json.
 */

const SLUG = "tokyo";
const CITY = "Tokyo";

test.describe("City walk page", () => {
  test("renders SEO content, metadata, and JSON-LD", async ({ page }) => {
    await page.goto(`/walk/${SLUG}`);

    // Title metadata (generateMetadata)
    await expect(page).toHaveTitle(`${CITY} Virtual Walk — Free 4K Tour | Nearaway`);

    // Server-rendered H1
    await expect(
      page.getByRole("heading", { level: 1, name: `${CITY} Virtual Walk` })
    ).toBeVisible();

    // Canonical URL points at the public domain
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://nearaway.in/walk/${SLUG}`
    );

    // VideoObject JSON-LD is present and well-formed
    const ldJson = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const types = ldJson.map((raw) => JSON.parse(raw)["@type"]);
    expect(types).toContain("VideoObject");
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("FAQPage");
  });

  test("navigates back to the globe home via the nav link", async ({ page }) => {
    await page.goto(`/walk/${SLUG}`);

    await page.getByRole("link", { name: "All Cities" }).click();
    await expect(page).toHaveURL("/");
  });

  test("unknown slug returns 404", async ({ page }) => {
    const response = await page.goto("/walk/not-a-real-city");
    expect(response?.status()).toBe(404);
  });
});
