export const FLOOR_X_MAX = 34;
export const FLOOR_Y_MAX = 28;

export type PinPosition = {
  leftPercent: number;
  topPercent: number;
};

export function toPinPosition(x: number, y: number): PinPosition {
  return {
    leftPercent: (x / FLOOR_X_MAX) * 100,
    topPercent: ((FLOOR_Y_MAX - y) / FLOOR_Y_MAX) * 100,
  };
}

export const PIN_SEPARATION_METERS = 3;

export function placePins(spots: { id: number; x: number; y: number }[]) {
  const placed = spots.map((spot) => ({
    id: spot.id,
    x: spot.x,
    y: spot.y,
    ...toPinPosition(spot.x, spot.y),
  }));

  for (let i = 0; i < placed.length; i += 1) {
    for (let j = i + 1; j < placed.length; j += 1) {
      const left = placed[i]!;
      const right = placed[j]!;
      const distance = Math.hypot(left.x - right.x, left.y - right.y);
      if (distance >= PIN_SEPARATION_METERS) {
        continue;
      }
      const shift = PIN_SEPARATION_METERS;
      const moved = left.id > right.id ? left : right;
      moved.x = Math.min(FLOOR_X_MAX, moved.x + shift);
      Object.assign(moved, toPinPosition(moved.x, moved.y));
    }
  }

  return placed;
}
