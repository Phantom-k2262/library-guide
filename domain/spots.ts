import spots from "../data/spots.json";

export type SpotRecord = {
  id: number;
  name: string;
  category: string;
  floor: 1 | 2;
  x: number;
  y: number;
  stay_min: number;
  desc: string;
};

export type SpotView = {
  id: number;
  name: string;
  category: string;
  floor: 1 | 2;
  x: number;
  y: number;
  desc: string;
};

export function toView(spot: SpotRecord): SpotView {
  return {
    id: spot.id,
    name: spot.name,
    category: spot.category,
    floor: spot.floor,
    x: spot.x,
    y: spot.y,
    desc: spot.desc,
  };
}

export function spotsOnFloor(floor: 1 | 2): SpotView[] {
  return (spots as SpotRecord[]).filter((spot) => spot.floor === floor).map(toView);
}
