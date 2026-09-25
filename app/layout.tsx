import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "館内案内",
  description: "市立図書館の館内地図",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
