"use client";

import { useState } from "react";
import { categoryColor, CATEGORY_COLOR } from "../domain/categories";
import { isKpiTarget } from "../domain/kpi";
import { FLOOR_X_MAX, FLOOR_Y_MAX, placePins } from "../domain/layout";
import { booksForSpot } from "../domain/books";
import type { SpotView } from "../domain/spots";
import { FloorPlan } from "./floor-plan";

function recordSpotTap(spotId: number) {
  void fetch("/api/spot-taps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spotId }),
  });
}

type Props = {
  floor1: SpotView[];
  floor2: SpotView[];
};

export function GuideMap({ floor1, floor2 }: Props) {
  const [floor, setFloor] = useState<1 | 2>(1);
  const [openId, setOpenId] = useState<number | null>(null);
  const spots = floor === 1 ? floor1 : floor2;
  const pins = placePins(spots);
  const openSpot = spots.find((spot) => spot.id === openId) ?? null;

  function showFloor(next: 1 | 2) {
    setFloor(next);
    setOpenId(null);
  }

  function showSpot(spotId: number) {
    if (openId === spotId) {
      return;
    }
    setOpenId(spotId);
    if (isKpiTarget(spotId)) {
      recordSpotTap(spotId);
    }
  }

  return (
    <section className="guide">
      <header className="guide-head">
        <p>{floor}階</p>
        <div className="floor-tabs" role="tablist" aria-label="階">
          <button type="button" aria-pressed={floor === 1} onClick={() => showFloor(1)}>
            1階
          </button>
          <button type="button" aria-pressed={floor === 2} onClick={() => showFloor(2)}>
            2階
          </button>
        </div>
      </header>
      <div
        className="floor-map"
        style={{ aspectRatio: `${FLOOR_X_MAX} / ${FLOOR_Y_MAX}` }}
      >
        <FloorPlan floor={floor} />
        {spots.map((spot) => {
          const pin = pins.find((item) => item.id === spot.id)!;
          return (
            <button
              key={spot.id}
              type="button"
              aria-label={spot.name}
              className="spot-pin"
              data-open={openId === spot.id}
              onClick={() => showSpot(spot.id)}
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
        <>
          <button
            type="button"
            className="sheet-backdrop"
            aria-label="説明を閉じる"
            onClick={() => setOpenId(null)}
          />
          <aside className="spot-sheet">
            <div className="sheet-handle" />
            <div className="sheet-top">
              <span
                className="sheet-chip"
                style={{ background: categoryColor(openSpot.category) }}
              >
                {openSpot.category}
              </span>
              <button type="button" className="sheet-close" onClick={() => setOpenId(null)}>
                閉じる
              </button>
            </div>
            <h2>{openSpot.name}</h2>
            <p>{openSpot.desc}</p>
            <section className="sheet-books">
              <h3>おすすめ本</h3>
              <ul>
                {booksForSpot(openSpot.id).map((book) => (
                  <li key={book.id}>
                    <span>{book.title}</span>
                    <span>{book.author}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </>
      ) : null}
    </section>
  );
}
