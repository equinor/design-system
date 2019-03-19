import { formatName } from "../functions/utils";

export const makeSpacingTokens = spacingTokens =>
  spacingTokens
    .filter(x => x.type === "FRAME")
    .map(spacing => {
      const spacer = spacing.children.find(x => x.name === "Spacer");
      const height = spacingString(spacer.absoluteBoundingBox.height);
      return {
        name: formatName(spacing.name),
        value: height
      };
    })
    .reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});

const spacingString = spacing => `${spacing}px`;
