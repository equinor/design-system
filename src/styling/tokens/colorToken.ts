import darkColorTokenJson from "@equinor/eds-tokens/build/json/color/color-scheme/nested/dark-semantic.json";
import lightColorTokenJson from "@equinor/eds-tokens/build/json/color/color-scheme/nested/light-semantic.json";

export const lightColorToken = lightColorTokenJson;
export const darkColorToken = darkColorTokenJson;

export type ColorToken = typeof lightColorToken | typeof darkColorToken;
