import { describe, expect, it } from "vitest";
import { ENTRANCES, GUIDE_PATH, entranceQrs, guideUrl, originFromRequest, publicGuideOrigin } from "./entrance-qr";

describe("入口QR", () => {
  it("2つのQRは同じパスを指し、ラベルだけが違う", async () => {
    const qrs = await entranceQrs("http://127.0.0.1:3000");
    expect(GUIDE_PATH).toBe("/");
    expect(qrs).toHaveLength(2);
    expect(qrs[0]?.path).toBe("/");
    expect(qrs[1]?.path).toBe("/");
    expect(qrs[0]?.url).toBe(qrs[1]?.url);
    expect(qrs[0]?.url).toBe(guideUrl("http://127.0.0.1:3000"));
    expect(new URL(qrs[0]!.url).pathname).toBe("/");
    expect(qrs[0]?.name).toBe("新刊・話題書コーナー");
    expect(qrs[1]?.name).toBe("予約受取ロッカー");
    expect(qrs[0]?.name).not.toBe(qrs[1]?.name);
    expect(qrs.map((qr) => qr.id)).toEqual([1, 8]);
    expect(ENTRANCES.map((e) => e.name)).toEqual([qrs[0]?.name, qrs[1]?.name]);
    expect(qrs.every((qr) => qr.image.startsWith("data:image/png"))).toBe(true);
  });

  it("印刷用の2枚は同じURLで、ホストから組み立てられる", async () => {
    const origin = originFromRequest({
      host: "127.0.0.1:3000",
      forwardedHost: null,
      forwardedProto: "http",
    });
    const qrs = await entranceQrs(origin);
    expect(qrs).toHaveLength(2);
    expect(new Set(qrs.map((qr) => qr.url)).size).toBe(1);
    expect(qrs.map((qr) => qr.name)).toEqual(["新刊・話題書コーナー", "予約受取ロッカー"]);
  });

  it("TunnelのHTTPSがあるときは、館外から同じ案内を開く", async () => {
    const origin = publicGuideOrigin(
      { host: "127.0.0.1:3000", forwardedHost: null, forwardedProto: "http" },
      { GUIDE_PUBLIC_ORIGIN: "https://guide.example.trycloudflare.com/" },
    );
    expect(origin).toBe("https://guide.example.trycloudflare.com");
    const qrs = await entranceQrs(origin);
    expect(qrs[0]?.url).toBe("https://guide.example.trycloudflare.com/");
    expect(new URL(qrs[0]!.url).protocol).toBe("https:");
    expect(new URL(qrs[0]!.url).pathname).toBe("/");
    expect(qrs[1]?.url).toBe(qrs[0]?.url);
  });
});
