import { theme as darkComfortableTheme } from "@equinor/eds-tokens/next/ts/dark-comfortable";
import { theme as darkCompactTheme } from "@equinor/eds-tokens/next/ts/dark-compact";
import { theme as lightComfortableTheme } from "@equinor/eds-tokens/next/ts/light-comfortable";
import { theme as lightCompactTheme } from "@equinor/eds-tokens/next/ts/light-compact";
import type { ColorScheme, Density } from "../types";

/**
 * The tokens from the Tokens Studio TypeScript export, one file per colour scheme and density.
 * Components read them as `token.theme` while the old `colors`, `spacing` and `typography`
 * parts are still in place. `relaxed` is left out until it is decided whether mobile exposes it.
 */
const themeTokens = {
    light: {
        compact: lightCompactTheme,
        comfortable: lightComfortableTheme,
    },
    dark: {
        compact: darkCompactTheme,
        comfortable: darkComfortableTheme,
    },
} as const;

export type ThemeToken =
    | typeof lightCompactTheme
    | typeof lightComfortableTheme
    | typeof darkCompactTheme
    | typeof darkComfortableTheme;

/**
 * The provider's `spacious` density is the export's `comfortable`,
 * and the provider's `comfortable` density is the export's `compact`.
 */
const themeDensity = {
    comfortable: "compact",
    spacious: "comfortable",
} as const satisfies Record<Density, "compact" | "comfortable">;

/**
 * Picks the theme token for a colour scheme and a provider density.
 */
export function resolveThemeToken(
    colorScheme: ColorScheme,
    density: Density
): ThemeToken {
    return themeTokens[colorScheme][themeDensity[density]];
}
