import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import spots from "../data/spots.json";
import { isKpiTarget } from "./kpi";
import type { SpotRecord } from "./spots";

export const DEFAULT_TAP_STORE_PATH = "data/spot-tap-counts.json";

export type TapCount = {
  spotId: number;
  tapCount: number;
};

export type RecordTapResult =
  | { ok: true; spotId: number; tapCount: number }
  | { ok: false; error: "invalid_spot_id" | "unknown_spot_id" | "not_kpi_target" };

function parseSpotId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  return null;
}

function readCounts(filePath: string): Record<number, number> {
  try {
    const raw = JSON.parse(readFileSync(filePath, "utf8")) as {
      counts?: Record<string, number>;
    };
    const counts: Record<number, number> = {};
    for (const [key, value] of Object.entries(raw.counts ?? {})) {
      const spotId = Number(key);
      if (Number.isInteger(spotId) && typeof value === "number" && value >= 0) {
        counts[spotId] = value;
      }
    }
    return counts;
  } catch {
    return {};
  }
}

function writeCounts(filePath: string, counts: Record<number, number>) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify({ counts }, null, 2)}\n`);
}

export function createTapStore(filePath: string) {
  return {
    recordTap(spotId: unknown): RecordTapResult {
      const id = parseSpotId(spotId);
      if (id === null) {
        return { ok: false, error: "invalid_spot_id" };
      }
      const exists = (spots as SpotRecord[]).some((spot) => spot.id === id);
      if (!exists) {
        return { ok: false, error: "unknown_spot_id" };
      }
      if (!isKpiTarget(id)) {
        return { ok: false, error: "not_kpi_target" };
      }
      const counts = readCounts(filePath);
      counts[id] = (counts[id] ?? 0) + 1;
      writeCounts(filePath, counts);
      return { ok: true, spotId: id, tapCount: counts[id] };
    },
    listCounts(): TapCount[] {
      return Object.entries(readCounts(filePath))
        .map(([spotId, tapCount]) => ({ spotId: Number(spotId), tapCount }))
        .sort((a, b) => a.spotId - b.spotId);
    },
  };
}

export function getTapStore() {
  return createTapStore(process.env.TAP_STORE_PATH ?? DEFAULT_TAP_STORE_PATH);
}
