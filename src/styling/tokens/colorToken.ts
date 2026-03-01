import { color as darkColorToken } from "@equinor/eds-tokens/build/ts/color/color-scheme/dark-semantic";
import { color as lightColorToken } from "@equinor/eds-tokens/build/ts/color/color-scheme/light-semantic";

export { lightColorToken, darkColorToken };

export type ColorToken = typeof lightColorToken | typeof darkColorToken;
