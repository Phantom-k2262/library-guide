import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "./route";

const previousPath = process.env.TAP_STORE_PATH;

beforeEach(() => {
  process.env.TAP_STORE_PATH = join(mkdtempSync(join(tmpdir(), "taps-api-")), "spot-tap-counts.json");
});

afterEach(() => {
  if (previousPath === undefined) {
    delete process.env.TAP_STORE_PATH;
  } else {
    process.env.TAP_STORE_PATH = previousPath;
  }
});

async function postSpot(spotId: unknown) {
  return POST(
    new Request("http://localhost/api/spot-taps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spotId }),
    }),
  );
}

describe("POST /api/spot-taps", () => {
  it("対象IDを受け付け、回数を残す", async () => {
    const first = await postSpot(2);
    expect(first.status).toBe(200);
    expect(await first.json()).toEqual({ spotId: 2, tapCount: 1 });

    const second = await postSpot(2);
    expect(await second.json()).toEqual({ spotId: 2, tapCount: 2 });

    const listed = await GET();
    expect(listed.status).toBe(200);
    expect(await listed.json()).toEqual({ counts: [{ spotId: 2, tapCount: 2 }] });
  });

  it("対象外と不正な値を保存しない", async () => {
    expect((await postSpot(1)).status).toBe(403);
    expect((await postSpot(8)).status).toBe(403);
    expect((await postSpot(99)).status).toBe(404);
    expect((await postSpot("2")).status).toBe(400);
    expect(
      (
        await POST(
          new Request("http://localhost/api/spot-taps", {
            method: "POST",
            body: "{",
          }),
        )
      ).status,
    ).toBe(400);

    const listed = await GET();
    expect(await listed.json()).toEqual({ counts: [] });
  });
});
