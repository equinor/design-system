import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equinor Design System Tokens",
  description:
    "Demo and exercise where we replace colors with tokens from Equinor Design System",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.eds.equinor.com/font/eds-uprights-vf.css"
        />
      </head>
      <body className="font-sans">
        <div id="debug">{children}</div>
      </body>
    </html>
  );
}
