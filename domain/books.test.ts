import { describe, expect, it } from "vitest";
import { booksForSpot } from "./books";
import { spotsOnFloor } from "./spots";

describe("おすすめ本", () => {
  it("20スポットそれぞれに1冊以上ある", () => {
    const spots = spotsOnFloor(1).concat(spotsOnFloor(2));
    expect(spots).toHaveLength(20);
    for (const spot of spots) {
      expect(booksForSpot(spot.id).length, spot.name).toBeGreaterThanOrEqual(1);
    }
  });
});
