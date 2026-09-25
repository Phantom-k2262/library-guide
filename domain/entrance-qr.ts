import QRCode from "qrcode";

export const GUIDE_PATH = "/";

export const ENTRANCES = [
  { id: 1, name: "新刊・話題書コーナー" },
  { id: 8, name: "予約受取ロッカー" },
] as const;

export function guideUrl(origin: string): string {
  return new URL(GUIDE_PATH, origin).toString();
}

export function publicGuideOrigin(
  input: {
    host?: string | null;
    forwardedHost?: string | null;
    forwardedProto?: string | null;
  },
  env: Record<string, string | undefined> = process.env,
): string {
  const fromEnv = env.GUIDE_PUBLIC_ORIGIN?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  return originFromRequest(input);
}

export function originFromRequest(input: {
  host?: string | null;
  forwardedHost?: string | null;
  forwardedProto?: string | null;
}): string {
  const host = input.forwardedHost ?? input.host ?? "127.0.0.1:3000";
  const proto = input.forwardedProto ?? "http";
  return `${proto}://${host}`;
}

export async function entranceQrs(origin: string) {
  const url = guideUrl(origin);
  return Promise.all(
    ENTRANCES.map(async (entrance) => ({
      id: entrance.id,
      name: entrance.name,
      path: GUIDE_PATH,
      url,
      image: await QRCode.toDataURL(url),
    })),
  );
}
