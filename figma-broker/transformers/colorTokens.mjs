import { formatName } from "../functions/utils";

export const makeColorToken = colorTokens =>
  colorTokens
    .filter(x => x.type === "FRAME")
    .map(color => ({
      name: formatName(color.name),
      value: colorString(color.backgroundColor)
    }))
    .reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});

const colorString = color =>
  `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${color.a * 1})`;
