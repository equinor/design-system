import { makeColorToken, } from "../transformers/colorTokens";
import { makeSpacingTokens, } from "../transformers/spacingTokens";
import { makeElevationTokens, } from "../transformers/elevationTokens";
import { makeClickboundsTokens, } from "../transformers/clickboundsTokens";
import { makeTextTokens, } from "../transformers/textTokens";

const fixPageName = name =>
  name
    .replace(/(🚧*)(✅*)/, "")
    .toLowerCase()
    .trim();

export const makeTokens = figmaPages => {
  const tokens = [];

  figmaPages.forEach(page => {
    const fixedPageName = fixPageName(page.name);

    switch (fixedPageName) {
      case "color":
        tokens.push({
          name: "colors",
          value: makeColorToken(page.children),
        });
        break;
      case "spacing":
        tokens.push({
          name: "spacings",
          value: makeSpacingTokens(page.children),
        });
        break;
      case "elevation":
        tokens.push({
          name: "elevation",
          value: makeElevationTokens(page.children),
        });
        break;
      case "clickbounds":
        tokens.push({
          name: "clickbounds",
          value: makeClickboundsTokens(page.children),
        });
        break;
      case "text":
        tokens.push({
          name: "text",
          value: makeTextTokens(page.children),
        });
        break;
      default:
        break;
    }
  });

  return tokens;
};
