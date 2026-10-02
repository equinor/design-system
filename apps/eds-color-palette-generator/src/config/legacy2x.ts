/**
 * Lightness values of the frozen 2.x colour scale.
 *
 * The 2.x scale is not edited in place (ADR 0016 D1, D10). `packages/eds-tokens`
 * still generates it with this app's CLI (`generate:tokens:color-core`), so the
 * CLI uses these values unless a config file supplies its own. They are the
 * values `config.ts` had before the generator moved to Tokens Studio.
 *
 * Do not change them. The 3.0 values come from Tokens Studio (tokensStudio.ts).
 */
export const LEGACY_2X_LIGHTNESS = {
  light: [
    0.97, 0.999, 0.91, 0.87, 0.82, 0.87, 0.75, 0.52, 0.5, 0.44, 0.42, 0.46,
    0.23, 0.9, 1,
  ],
  dark: [
    0.15, 0.25, 0.47, 0.52, 0.58, 0.47, 0.61, 0.76, 0.82, 0.88, 0.93, 0.91,
    0.99, 0.33, 0.1,
  ],
} as const
