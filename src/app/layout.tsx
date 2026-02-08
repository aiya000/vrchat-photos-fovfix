import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VRChat Photos Fovfix Tool",
  description: "Fix FOV distortion in VRChat photos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
