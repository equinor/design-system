export const camelize = str => {
  if (str) {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
      })
      .replace(/\s+/g, "");
  } else {
    throw new Error("No string provided to camelize()!");
  }
};

const removeForbiddenCharacters = str => {
  if (str) {
    return str.replace(/[|]|[.]|[-]|[–]|[—]/g, "");
  } else {
    throw new Error("No string for formatName()!");
  }
};

export const getFigmaNamePath = str => {
  const path = removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, "-")
    .split("/");
  const name = path.pop();
  return { name, path: pathToString(path), };
};

export const formatName = str =>
  removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, "-")
    .replace(/[/]/g, "--");

export const pathToString = str =>
  str.reduce((acc, val) => `${acc}/${val}`, "");
