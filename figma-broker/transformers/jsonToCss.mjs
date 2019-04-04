export const jsonToCssString = json =>
  `:root{
${Object.entries(json).reduce(
  (acc, [name, value,]) => `${acc}  --${name}: ${value};\n`,
  ""
)}}`;
