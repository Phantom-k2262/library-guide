import { describe, expect, it } from "vitest";
import { EXCLUDED_KPI_SPOTS, isKpiTarget } from "./kpi";
import { spotsOnFloor } from "./spots";

describe("KPI対象", () => {
  it("id 1とid 8を名前付きで対象外にする", () => {
    expect(EXCLUDED_KPI_SPOTS).toEqual([
      { id: 1, name: "新刊・話題書コーナー" },
      { id: 8, name: "予約受取ロッカー" },
    ]);
    expect(isKpiTarget(1)).toBe(false);
    expect(isKpiTarget(8)).toBe(false);
  });

  it("それ以外の18件を対象にする", () => {
    const all = spotsOnFloor(1).concat(spotsOnFloor(2));
    const targets = all.filter((spot) => isKpiTarget(spot.id));
    expect(all).toHaveLength(20);
    expect(targets).toHaveLength(18);
    expect(targets.every((spot) => spot.id !== 1 && spot.id !== 8)).toBe(true);
  });
});
