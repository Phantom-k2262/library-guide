import { describe, expect, it } from "vitest";
import { FLOOR_X_MAX, FLOOR_Y_MAX, toPinPosition } from "./layout";
import { spotsOnFloor } from "./spots";

const expected = [
  { id: 1, floor: 1, x: 5, y: 5 },
  { id: 2, floor: 1, x: 15, y: 8 },
  { id: 3, floor: 1, x: 18, y: 12 },
  { id: 4, floor: 1, x: 8, y: 20 },
  { id: 5, floor: 1, x: 14, y: 22 },
  { id: 6, floor: 1, x: 25, y: 5 },
  { id: 7, floor: 1, x: 28, y: 10 },
  { id: 8, floor: 1, x: 3, y: 2 },
  { id: 9, floor: 1, x: 30, y: 20 },
  { id: 10, floor: 1, x: 22, y: 18 },
  { id: 11, floor: 2, x: 6, y: 6 },
  { id: 12, floor: 2, x: 12, y: 8 },
  { id: 13, floor: 2, x: 16, y: 10 },
  { id: 14, floor: 2, x: 24, y: 6 },
  { id: 15, floor: 2, x: 26, y: 9 },
  { id: 16, floor: 2, x: 8, y: 20 },
  { id: 17, floor: 2, x: 20, y: 15 },
  { id: 18, floor: 1, x: 8, y: 21 },
  { id: 19, floor: 2, x: 22, y: 18 },
  { id: 20, floor: 2, x: 15, y: 25 },
] as const;

describe("配置", () => {
  it("床の縦横比は 34:28", () => {
    expect(FLOOR_X_MAX).toBe(34);
    expect(FLOOR_Y_MAX).toBe(28);
    expect(FLOOR_X_MAX / FLOOR_Y_MAX).toBeCloseTo(34 / 28);
  });

  it("20件の階と、印の中心位置", () => {
    const placed = [1, 2].flatMap((floor) =>
      spotsOnFloor(floor as 1 | 2).map((spot) => ({
        ...spot,
        ...toPinPosition(spot.x, spot.y),
      })),
    );
    expect(placed).toHaveLength(20);

    for (const spot of expected) {
      const pin = placed.find((item) => item.id === spot.id);
      expect(pin?.floor).toBe(spot.floor);
      expect(pin?.leftPercent).toBeCloseTo((spot.x / 34) * 100);
      expect(pin?.topPercent).toBeCloseTo(((28 - spot.y) / 28) * 100);
    }
  });

  it("小さい y は矩形の下になる", () => {
    const nearEntrance = toPinPosition(3, 2);
    const farther = toPinPosition(5, 5);
    expect(nearEntrance.topPercent).toBeGreaterThan(farther.topPercent);
  });
});
