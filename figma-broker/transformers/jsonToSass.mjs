export const jsonToSassString = json =>
  Object.entries(json).reduce(
    (acc, [name, value,]) => `${acc}$${name}: ${value};\n`,
    ""
  );
