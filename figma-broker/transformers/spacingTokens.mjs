import { formatName } from "../functions/utils";

export const makeSpacingTokens = spacingTokens =>
  spacingTokens
    .filter(x => x.type === "COMPONENT")
    .map(spacing => {
      let name,
        value = "";
      try {
        name = formatName(spacing.name);
        value = spacingString(spacing.absoluteBoundingBox.height);
      } catch (error) {
        throw Error(`Height not found for ${name}`);
      }
      return {
        name,
        value
      };
    })
    .reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});

const spacingString = spacing => `${spacing}px`;
