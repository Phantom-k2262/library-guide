export const EXCLUDED_KPI_SPOTS = [
  { id: 1, name: "新刊・話題書コーナー" },
  { id: 8, name: "予約受取ロッカー" },
] as const;

export function isKpiTarget(spotId: number): boolean {
  return !EXCLUDED_KPI_SPOTS.some((spot) => spot.id === spotId);
}
