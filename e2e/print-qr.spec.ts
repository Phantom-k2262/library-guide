import { expect, test } from "@playwright/test";

test("印刷用の経路でQRが2枚見える", async ({ page }) => {
  await page.goto("/print/qr");
  await expect(page.getByRole("heading", { name: "入口用QR" })).toBeVisible();
  await expect(page.getByRole("img", { name: "新刊・話題書コーナーのQR" })).toBeVisible();
  await expect(page.getByRole("img", { name: "予約受取ロッカーのQR" })).toBeVisible();
  await expect(page.locator(".qr-print img")).toHaveCount(2);
});
