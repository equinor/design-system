import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equinor Design System Tokens",
  description:
    "Demo and exercise where we replace colors with tokens from Equinor Design System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
