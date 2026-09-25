import { getTapStore } from "../../../domain/tap-store";

export const dynamic = "force-dynamic";

const ERROR_STATUS = {
  invalid_spot_id: 400,
  unknown_spot_id: 404,
  not_kpi_target: 403,
} as const;

export async function GET() {
  return Response.json({ counts: getTapStore().listCounts() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_spot_id" }, { status: 400 });
  }

  const spotId =
    body !== null && typeof body === "object" && "spotId" in body
      ? (body as { spotId: unknown }).spotId
      : undefined;
  const result = getTapStore().recordTap(spotId);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: ERROR_STATUS[result.error] });
  }
  return Response.json({ spotId: result.spotId, tapCount: result.tapCount });
}
