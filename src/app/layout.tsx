import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VRChat写真歪み修正ツール",
  description: "VRChat写真のFOV歪みを修正します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
