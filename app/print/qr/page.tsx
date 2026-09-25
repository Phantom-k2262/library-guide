import { headers } from "next/headers";
import { entranceQrs, publicGuideOrigin } from "../../../domain/entrance-qr";

export default async function PrintQrPage() {
  const headerList = await headers();
  const origin = publicGuideOrigin({
    host: headerList.get("host"),
    forwardedHost: headerList.get("x-forwarded-host"),
    forwardedProto: headerList.get("x-forwarded-proto"),
  });
  const qrs = await entranceQrs(origin);

  return (
    <main className="qr-print">
      <h1>入口用QR</h1>
      <p>どちらも同じ案内を開きます。印刷して入口に置いてください。</p>
      <p>{qrs[0]?.url}</p>
      <ul>
        {qrs.map((qr) => (
          <li key={qr.id}>
            <img src={qr.image} alt={`${qr.name}のQR`} width={240} height={240} />
            <p>{qr.name}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
