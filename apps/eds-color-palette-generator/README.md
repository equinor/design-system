# EDS Colour Palette Generator

Internal tool for proposing and checking colour palettes for the Equinor Design System.

**Tokens Studio is the source of truth for EDS colour** ([ADR 0011](../../documentation/adr/0011-adopt-tokens-studio-platform-pipeline.md), [ADR 0016](../../documentation/adr/0016-colour-approach-for-eds-2.md)). The generator reads its defaults from the Tokens Studio pull committed in `packages/eds-tokens/src/tokens/`, and a unit test fails if its output drifts from what Tokens Studio exports. Palettes you build here are proposals: to change EDS colour, change it in Tokens Studio.

## Routes

| Route | Tool |
| --- | --- |
| `/` | **Theme Builder**. Edit palettes, see every step with its Tokens Studio roles, check contrast, and preview components through the Tokens Studio semantic mapping. State is shareable through the URL. |
| `/dataviz` | **Data visualisation**. Generate categorical, sequential and diverging palettes and audit them for colour vision deficiency and contrast. |
| `/palette` | **Palette editor**. Start from the archived generator's saved palettes and edit the hex value of each step. The edited palettes are also offered on the Examples page. |
| `/contrast` | **Contrast**. Every step of a Tokens Studio palette against its best text colour, and a combined view of Tokens Studio token pairs across tones. |
| `/example` | **Examples**. Tokens Studio token pairs and nested surfaces on example layouts, for the Tokens Studio palettes and your edited ones. |
| `/about` | How the generator works: OKLCH, the gaussian chroma curve, step roles and contrast requirements. |
| `/old` | The archived Gaussian colour-scale generator. Still works, no longer the entry point. |

`/themebuilder` redirects to `/` for links shared before the Theme Builder moved.

## Where the values come from

| What | Source |
| --- | --- |
| Seven hue anchors (moss-green, gray, north-sea, blue, green, orange, red) | Tokens Studio `input/palette` |
| 15 lightness values per scheme, gaussian mean and standard deviation | Tokens Studio `input/scale` |
| Tone → hue per scheme (neutral is gray in light, north-sea in dark) | Tokens Studio `scheme/light`, `scheme/dark` |
| Semantic roles per step (`text.primary` → step 13, `background.surface` → step 15, …) | Tokens Studio `semantic` |
| Contrast requirements | ADR 0016, Confirmation 5 (in `src/config/config.ts`) |

`src/config/tokensStudio.ts` reads these from `packages/eds-tokens/src/tokens/raw/`, which the Tokens Studio release workflow keeps up to date. Nothing in the app types a colour value by hand. `src/config/tokensStudio.test.ts` generates all seven hues in both schemes and compares them with the resolved values in `packages/eds-tokens/src/tokens/css/colors/default.css` (largest difference today: ΔE 0.0005).

The generation formula is the one Tokens Studio uses (ADR 0016 D2): every step takes its lightness from the scale, and the anchor supplies hue and chroma, with chroma shaped by a gaussian curve over lightness:

```
chroma = gaussian(lightness, mean, stdDev) × anchorChroma
gaussian(x, mean, stdDev) = exp((-25 / stdDev) × (mean - x)²)
```

## Getting started

```bash
pnpm dev                 # Next dev server on :3000
pnpm dev --port 3001     # if the docs dev server already uses :3000
```

## Styling

The UI uses the Tokens Studio CSS bundle (`packages/eds-tokens/src/tokens/css/variables.css`) and maps Tailwind utilities onto its semantic variables in `src/app/globals.css`. Class names follow the token names: `bg-canvas` is `background.canvas`, `text-secondary` is `text.secondary`, `border-muted` is `border.non-interactive.neutral.muted`. Tailwind's own colour palette is removed, so a class like `bg-gray-100` does not compile. Fonts are Inter and Equinor from the EDS CDN, and icons come from `@equinor/eds-icons`.

The scheme is set with `data-color-scheme` on `<html>`. An inline script applies the saved choice (or `?mode=`, or the system preference) before first paint.

## Download and import

The Theme Builder's **Config** button opens a dialog with two exports, both in OKLCH:

- **Tokens Studio anchors**: the anchors you changed or added, compared with Tokens Studio, as a token set in the shape of `input/palette` (`input.palette.<hue>.anchor`). This is the handoff for proposing a colour change; Tokens Studio generates the steps from the anchors.
- **Palettes file**: your palettes only (`{ "colors": [...] }`), to import again later.

Uploading a palettes file (or an older palette config) replaces the palettes. Lightness and chroma always come from Tokens Studio, so only the palettes are read.

## CLI

```bash
generate-colors [configPath] [outputDir]
```

Writes light and dark token files from a palette configuration. **The CLI defaults to the frozen 2.x lightness scale**, because `packages/eds-tokens` generates the 2.x palette with it (`generate:tokens:color-core`) and ADR 0016 freezes that scale. Pass `lightModeValues` and `darkModeValues` in the configuration to use other values. The CLI has no role in the 3.0 scale: Tokens Studio generates it. See [src/cli/README.md](./src/cli/README.md).

## Tests

```bash
pnpm test:run            # Vitest: colour maths, Tokens Studio parity, utilities, CLI
pnpm test:e2e            # Playwright against a running dev server
PLAYWRIGHT_URL=http://localhost:3001/old pnpm test:e2e   # when the server runs on :3001
```

The CLI tests run the built CLI in `dist/`, so run `pnpm build:cli` first after changing the generator.

## Reports

`PALETTE_OVERVIEW.md` and `PALETTE_CONTRAST_REPORT.md` are generated; regenerate them rather than editing:

```bash
pnpm generate:palette-config-in-markdown
pnpm generate:palette-contrast-report
```

## Learn more

* [Oklab colour space](https://bottosson.github.io/posts/oklab/)
* [APCA contrast algorithm](https://github.com/Myndex/SAPC-APCA)
* [WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
* [OKLCH colour picker](https://oklch.com/)
