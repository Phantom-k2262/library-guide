import { describe, expect, it } from "vitest";
import { spotsOnFloor, toView, type SpotRecord } from "./spots";

describe("画面用スポット", () => {
  it("1階11件、2階9件", () => {
    expect(spotsOnFloor(1)).toHaveLength(11);
    expect(spotsOnFloor(2)).toHaveLength(9);
    expect(spotsOnFloor(1).length + spotsOnFloor(2).length).toBe(20);
  });

  it("平均滞在時間を渡さない", () => {
    const record: SpotRecord = {
      id: 14,
      name: "郷土資料室（古地図・写真アーカイブ）",
      category: "郷土",
      floor: 2,
      x: 24,
      y: 6,
      stay_min: 40,
      desc: "市の歴史資料・古地図・写真を所蔵。",
    };
    const view = toView(record);
    expect(view).not.toHaveProperty("stay_min");
    expect(spotsOnFloor(1).concat(spotsOnFloor(2)).every((spot) => !("stay_min" in spot))).toBe(true);
  });

  it("画面用の説明に利用者層や人気の推測を置かない", () => {
    const banned =
      /10〜20代|親子|年配|ファン|人気|来室者は少ない|貸出数|貸出は緩やかに減少|放課後の利用|来館者の大半|滞在せず帰る|資格試験前に利用|知られていない|満席|固定化|気づかれにくい/;
    for (const spot of spotsOnFloor(1).concat(spotsOnFloor(2))) {
      expect(spot.desc, spot.name).not.toMatch(banned);
    }
  });
});
