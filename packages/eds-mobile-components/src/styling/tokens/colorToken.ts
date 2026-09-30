import { color as darkColorToken } from "@equinor/eds-tokens/ts/color/color-scheme/dark-semantic";
import { color as lightColorToken } from "@equinor/eds-tokens/ts/color/color-scheme/light-semantic";

export { darkColorToken, lightColorToken };

export type ColorToken = typeof lightColorToken | typeof darkColorToken;
