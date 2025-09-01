import localFont from "next/font/local";

export const equinorFont = localFont({
  variable: "--font-equinor",
  src: [
    {
      path: "./Equinor-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Equinor-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Equinor-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Equinor-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Equinor-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./Equinor-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Equinor-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./Equinor-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});
