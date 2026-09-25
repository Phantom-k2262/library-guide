import { expect, test } from "@playwright/test";

test("初期は1階の地図", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "館内案内" })).toBeVisible();
  await expect(page.locator("p", { hasText: "1階" })).toBeVisible();
  await expect(page.getByRole("button", { name: "新刊・話題書コーナー" })).toBeVisible();
  await expect(page.locator(".spot-pin")).toHaveCount(11);
});

test("対象は増え、入口は増えない", async ({ page, request }) => {
  const before = await request.get("/api/spot-taps").then((res) => res.json());
  const countOf = (spotId: number) =>
    before.counts.find((row: { spotId: number; tapCount: number }) => row.spotId === spotId)?.tapCount ?? 0;

  await page.goto("/");
  await page.getByRole("button", { name: "文芸書の棚（小説・エッセイ）" }).dispatchEvent("click");
  await expect(page.locator(".spot-sheet")).toContainText("国内外の小説・エッセイ");

  const afterTarget = await request.get("/api/spot-taps").then((res) => res.json());
  const targetCount =
    afterTarget.counts.find((row: { spotId: number; tapCount: number }) => row.spotId === 2)?.tapCount ?? 0;
  expect(targetCount).toBe(countOf(2) + 1);

  await page.getByRole("button", { name: "新刊・話題書コーナー" }).dispatchEvent("click");
  await expect(page.locator(".spot-sheet")).toContainText("入口正面");

  const afterEntrance = await request.get("/api/spot-taps").then((res) => res.json());
  const entranceCount =
    afterEntrance.counts.find((row: { spotId: number; tapCount: number }) => row.spotId === 1)?.tapCount ?? 0;
  expect(entranceCount).toBe(countOf(1));
  expect(entranceCount).toBe(0);
});

test("閉じたあと開き直すとさらに1増え、390幅で操作できる", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const before = await request.get("/api/spot-taps").then((res) => res.json());
  const start =
    before.counts.find((row: { spotId: number; tapCount: number }) => row.spotId === 2)?.tapCount ?? 0;

  await page.goto("/");
  const pin = page.getByRole("button", { name: "文芸書の棚（小説・エッセイ）" });
  await expect(pin).toBeVisible();
  await pin.dispatchEvent("click");
  const sheet = page.locator(".spot-sheet");
  await expect(sheet).toContainText("文芸書の棚（小説・エッセイ）");
  await page.getByRole("button", { name: "閉じる" }).click();
  await expect(sheet).toHaveCount(0);

  await pin.dispatchEvent("click");
  await expect(sheet).toContainText("国内外の小説・エッセイ");

  const after = await request.get("/api/spot-taps").then((res) => res.json());
  const targetCount =
    after.counts.find((row: { spotId: number; tapCount: number }) => row.spotId === 2)?.tapCount ?? 0;
  expect(targetCount).toBe(start + 2);
});
