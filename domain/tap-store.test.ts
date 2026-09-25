import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createTapStore } from "./tap-store";

function store() {
  return createTapStore(join(mkdtempSync(join(tmpdir(), "taps-")), "spot-tap-counts.json"));
}

describe("回数保存", () => {
  it("対象スポットの加算で該当IDだけが1増える", () => {
    const taps = store();
    expect(taps.recordTap(2)).toEqual({ ok: true, spotId: 2, tapCount: 1 });
    expect(taps.recordTap(14)).toEqual({ ok: true, spotId: 14, tapCount: 1 });
    expect(taps.listCounts()).toEqual([
      { spotId: 2, tapCount: 1 },
      { spotId: 14, tapCount: 1 },
    ]);
  });

  it("同じスポットの再度の記録でさらに1増える", () => {
    const taps = store();
    taps.recordTap(2);
    expect(taps.recordTap(2)).toEqual({ ok: true, spotId: 2, tapCount: 2 });
  });

  it("id 1とid 8、未知のID、0、負数、文字列を加算しない", () => {
    const taps = store();
    expect(taps.recordTap(1)).toEqual({ ok: false, error: "not_kpi_target" });
    expect(taps.recordTap(8)).toEqual({ ok: false, error: "not_kpi_target" });
    expect(taps.recordTap(99)).toEqual({ ok: false, error: "unknown_spot_id" });
    expect(taps.recordTap(0)).toEqual({ ok: false, error: "invalid_spot_id" });
    expect(taps.recordTap(-2)).toEqual({ ok: false, error: "invalid_spot_id" });
    expect(taps.recordTap("2")).toEqual({ ok: false, error: "invalid_spot_id" });
    expect(taps.listCounts()).toEqual([]);
  });
});

describe("JSONファイル", () => {
  it("書き込んだ回数を同じファイルから読み戻す", () => {
    const filePath = join(mkdtempSync(join(tmpdir(), "taps-")), "spot-tap-counts.json");
    const first = createTapStore(filePath);
    first.recordTap(14);
    const second = createTapStore(filePath);
    expect(second.listCounts()).toEqual([{ spotId: 14, tapCount: 1 }]);
    expect(JSON.parse(readFileSync(filePath, "utf8"))).toEqual({ counts: { "14": 1 } });
  });
});
