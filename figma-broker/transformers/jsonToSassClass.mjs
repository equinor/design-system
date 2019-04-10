// TODO: Determine how we want to convert Figma API font values
// Example of Figma font output
// "heading--h1": {
//   "fontFamily": "Equinor",
//   "fontPostScriptName": "Equinor-Bold",
//   "fontWeight": 700,
//   "fontSize": 32,
//   "textAlignHorizontal": "LEFT",
//   "textAlignVertical": "TOP",
//   "letterSpacing": 0,
//   "lineHeightPx": 48,
//   "lineHeightPercent": 128
// },
export const jsonToSassClassString = json =>
  Object.entries(json).reduce(
    (acc, [name, value,]) =>
      `${acc}.${name} {
  font-family: ${value.fontFamily};
  font-size: ${pxToRem(value.fontSize)}rem;
  font-weight: ${value.fontWeight};
  line-height: ${pxToRem(value.lineHeightPx)}rem;
  letter-spacing: ${pxToRem(value.letterSpacing)}rem;
}\n`,
    ""
  );

const pxToRem = unit => (unit / 16).toFixed(2);
