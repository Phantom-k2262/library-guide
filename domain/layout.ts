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
