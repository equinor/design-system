import { formatName } from "../functions/utils";

export const makeElevationTokens = elevationTokens =>
  elevationTokens
    .filter(x => x.type === "FRAME")
    .reduce((acc, x) => [...acc, ...x.children], [])
    .filter(x => /^token-row/.test(x.name.toLowerCase()))
    .reduce((acc, x) => [...acc, ...x.children], [])
    .filter(x => x.type === "RECTANGLE")
    .map(row => {
      let name,
        value = "";
      try {
        name = formatName(row.name);
        value = row.effects
          .reduce(
            (acc, val) => [
              ...acc,
              `${unitString(val.offset, val.radius)} ${colorString(val.color)}`
            ],
            []
          )
          .toString();
      } catch (error) {
        throw Error(`Error parsing elevation for ${name}. ${error.message}`);
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

const colorString = ({ r, g, b, a }) =>
  `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a.toFixed(2) * 1})`;

const unitString = (offset, radius) =>
  `${offset.x}px ${offset.y}px ${radius}px`;
