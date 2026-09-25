"use client";

import { useState } from "react";
import { categoryColor, CATEGORY_COLOR } from "../domain/categories";
import { FLOOR_X_MAX, FLOOR_Y_MAX, toPinPosition } from "../domain/layout";
import type { SpotView } from "../domain/spots";

type Props = {
  floor1: SpotView[];
  floor2: SpotView[];
};

export function GuideMap({ floor1, floor2 }: Props) {
  const [floor, setFloor] = useState<1 | 2>(1);
  const [openId, setOpenId] = useState<number | null>(null);
  const spots = floor === 1 ? floor1 : floor2;
  const openSpot = spots.find((spot) => spot.id === openId) ?? null;

  function showFloor(next: 1 | 2) {
    setFloor(next);
    setOpenId(null);
  }

  return (
    <section>
      <p>{floor}階</p>
      <div>
        <button type="button" aria-pressed={floor === 1} onClick={() => showFloor(1)}>
          1階
        </button>
        <button type="button" aria-pressed={floor === 2} onClick={() => showFloor(2)}>
          2階
        </button>
      </div>
      <div
        className="floor-map"
        style={{ aspectRatio: `${FLOOR_X_MAX} / ${FLOOR_Y_MAX}` }}
      >
        {spots.map((spot) => {
          const pin = toPinPosition(spot.x, spot.y);
          return (
            <button
              key={spot.id}
              type="button"
              aria-label={spot.name}
              className="spot-pin"
              data-open={openId === spot.id}
              onClick={() => setOpenId(spot.id)}
              style={{
                left: `${pin.leftPercent}%`,
                top: `${pin.topPercent}%`,
                background: categoryColor(spot.category),
              }}
            >
              {spot.id}
            </button>
          );
        })}
      </div>
      <ul className="legend">
        {Object.entries(CATEGORY_COLOR).map(([name, color]) => (
          <li key={name}>
            <span style={{ background: color }} />
            {name}
          </li>
        ))}
      </ul>
      {openSpot ? (
        <aside className="spot-sheet">
          <p>{openSpot.name}</p>
          <p>{openSpot.category}</p>
          <p>{openSpot.desc}</p>
          <button type="button" onClick={() => setOpenId(null)}>
            閉じる
          </button>
        </aside>
      ) : null}
    </section>
  );
}
