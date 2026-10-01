# About page

The About page (`/about`, `src/app/about/page.tsx`) explains how the EDS Colour Palette Generator makes a colour scale, what each step is for, how contrast is checked and how to propose a change to Tokens Studio.

Every number and colour on the page comes from Tokens Studio through `src/config/tokensStudio.ts` and `src/config/config.ts`, and the example scales are generated with `generateColorScale` when the page renders. Nothing is typed by hand, so when a Tokens Studio pull changes an anchor, a lightness value or a step role, the page follows without edits. The examples use the colour scheme chosen in settings, and the components that depend on it remount on a scheme change so their sliders start at that scheme's values.

## Sections

Each section is a component in `src/components/docs/about/`, rendered in this order:

| Section                             | Component                   | What it shows                                                                                                                              |
| ----------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Contents                            | `AboutTableOfContents`      | Links to the sections below                                                                                                                |
| Overview                            | `AboutOverview`             | What the tool is for, Tokens Studio as the source of truth, the parity test, and what each page does                                       |
| How a scale is made                 | `AboutHowItWorks`           | `set_chroma(set_lightness(anchor, L), gaussian(L) × C)` step by step, with the accent hue generated live and step 9 worked through         |
| The 15 steps                        | `AboutStepRoles`            | Why the lightness is hand-set (ADR 0016 D3), the dark dip and the inverse steps 14 and 15, and a table of every step's lightness and roles |
| The Gaussian chroma curve           | `AboutGaussianBellCurve`    | The formula, the Tokens Studio mean and standard deviation, and `BellCurveVisualization` with the 15 steps marked on the curve             |
| Try it                              | `AboutChromaDistribution`   | `ChromaDistributionDemo`: pick an anchor and curve, see the chroma per step and the generated scale                                        |
| Palettes with several anchors       | `AboutMultipleAnchors`      | How anchors are interpolated, why they cannot be proposed to Tokens Studio, and a live two-anchor example                                  |
| Why OKLCH                           | `AboutOklchColorSpace`      | L, C and H, OKLCH as the canonical form (ADR 0016 D9), the OKLCH/HEX switch and the sRGB gamut                                             |
| Light and dark mode                 | `AboutLightAndDark`         | What differs between the modes: lightness, the curve's mean and the neutral hue                                                            |
| Contrast requirements               | `AboutContrastRequirements` | The APCA targets from ADR 0016 Confirmation 5 and `ContrastRequirementsTable`                                                              |
| Proposing a change to Tokens Studio | `AboutTokensStudio`         | How palette names map to hues, the Tokens Studio anchors download, Share and the palettes file                                             |
| Tips                                | `AboutTips`                 | Practical advice on anchors, modes and proposals                                                                                           |
| Learn more                          | `AboutLearnMore`            | ADR 0016, ADR 0011 and external reading on OKLCH and APCA                                                                                  |

`ScaleStrip` renders a generated scale as 15 numbered swatches and is shared by the examples. `links.ts` holds the ADR 0016 link.

## Interactive components

- **`BellCurveVisualization`** (`src/components/docs/`): the Gaussian curve with sliders for mean and standard deviation. `markers` takes lightness values and draws a dot for each step on the curve.
- **`ChromaDistributionDemo`** (`src/components/docs/`): takes an anchor, the 15 lightness values and the curve parameters. It accepts any CSS colour, shows the chroma of each step as a bar chart in the step's colour, and renders the scale with `ScaleStrip`.
- **`ContrastRequirementsTable`** (`src/components/docs/`): lists every step with a contrast requirement from `PALETTE_STEPS`, with its APCA level and, for reference, the WCAG 2.1 ratio.

The sliders in both demos only change the demo. The Theme Builder always uses the Tokens Studio curve.

## Styling

The page uses the app's Tailwind classes, which map onto Tokens Studio semantic variables in `src/app/globals.css` (`bg-canvas`, `bg-surface`, `text-secondary`, `border-muted` and so on). SVG coordinates are rounded with `toFixed(2)` so the server and browser render the same markup.
