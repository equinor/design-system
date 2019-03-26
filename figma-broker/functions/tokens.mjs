import { makeColorToken } from "../transformers/colorTokens";
import { makeSpacingTokens } from "../transformers/spacingTokens";

const fixPageName = name =>
  name
    .replace(/(🚧*)(✅*)/, "")
    .toLowerCase()
    .trim();

export const makeTokens = figmaPages => {
  const tokens = [];

  figmaPages.forEach(page => {
    const fixedPageName = fixPageName(page.name);

    if (fixedPageName === "color") {
      tokens.push({
        name: "colors",
        value: makeColorToken(page.children)
      });
    }

    if (fixedPageName === "spacing") {
      tokens.push({
        name: "spacings",
        value: makeSpacingTokens(page.children)
      });
    }
    if (fixedPageName === "placeholder") {
      tokens.push({
        name: "placeholder",
        value: makeSpacingTokens(page.children)
      });
    }
  });

  return tokens;
};
