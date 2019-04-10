import { formatName, } from "../functions/utils";

const getChildren = (acc, x) => [...acc, ...x.children,];

export const makeColorToken = colorTokens =>
  colorTokens
    .filter(x => x.type === "FRAME")
    .reduce(getChildren, [])
    .filter(x => x.type === "RECTANGLE")
    .map(x => {
      let name = "",
        value = "";
      try {
        name = formatName(x.name);
        const fill = x.fills.find(x => x.type === "SOLID");
        value = colorString(fill.color);
      } catch (error) {
        throw Error(`Error parsing color for ${name}. ${error.message}`);
      }
      return {
        name,
        value,
      };
    })
    .reduce((acc, { name, value, }) => {
      acc[name] = value;
      return acc;
    }, {});

const colorString = color =>
  `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${color.a * 1})`;
