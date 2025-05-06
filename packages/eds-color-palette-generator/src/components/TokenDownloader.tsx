import React from "react";
import { formatColorsAsTokens } from "../utils/tokenFormatter";
import { ColorValue } from "@/types";

type TokenDownloaderProps = {
  lightColors: {
    accent: ColorValue[];
    neutral: ColorValue[];
    success: ColorValue[];
    info: ColorValue[];
    warning: ColorValue[];
    danger: ColorValue[];
  };
  darkColors: {
    accentDark: ColorValue[];
    neutralDark: ColorValue[];
    successDark: ColorValue[];
    infoDark: ColorValue[];
    warningDark: ColorValue[];
    dangerDark: ColorValue[];
  };
};

const TokenDownloader: React.FC<TokenDownloaderProps> = ({
  lightColors,
  darkColors,
}) => {
  const handleDownload = () => {
    const tokenData = formatColorsAsTokens(lightColors, darkColors);
    const blob = new Blob([tokenData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "color-tokens.json";
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div className="token-downloader">
      <button
        onClick={handleDownload}
        style={{
          padding: "12px 24px",
          backgroundColor: "#007079",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "24px",
          marginBottom: "24px",
        }}
      >
        Download Color Tokens (W3C Format)
      </button>
    </div>
  );
};

export default TokenDownloader;
