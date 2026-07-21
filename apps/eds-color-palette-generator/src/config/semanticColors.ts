/**
 * Canonical EDS semantic colour values for the preview components.
 *
 * LIGHT is transcribed from the Figma "Color Map Light" (node 73:314) and
 * matches the generator's own OKLCH ramp output.
 *
 * DARK uses tonal inversion — the generator's OKLCH ramp output in dark mode.
 * Accent/concept hues are LIGHTENED (not reused at their light-mode hex) so
 * fills pop on dark surfaces and take dark text; neutrals stay pure-gray. This
 * is the documented rule (plan/light-dark-parity-comparison.md §4a), chosen over
 * the fixed-#206f77 Figma dark board (node 132:23906) for accessibility (WCAG
 * fill contrast) and consistency with the generator engine.
 *
 * A few light-mode accent-emphasis values aren't emitted by the Figma light map
 * and use the known brand values (marked below).
 */

export type ColorMode = 'light' | 'dark'

export type SemanticColors = Record<string, string>

const LIGHT: SemanticColors = {
  // neutral surfaces
  'bg-neutral-canvas': '#f5f5f5',
  'bg-neutral-surface': '#ffffff',
  'bg-neutral-fill-muted-default': '#e1e1e1',
  'bg-neutral-fill-muted-hover': '#d4d4d4',
  'bg-neutral-fill-muted-active': '#c4c4c4',
  'bg-neutral-fill-emphasis-default': '#636363',
  'bg-neutral-fill-emphasis-hover': '#525252',
  'bg-neutral-fill-emphasis-active': '#4d4d4d',
  'bg-floating': '#ffffff',
  'bg-backdrop': '#aeaeae',
  // accent surfaces
  'bg-accent-canvas': '#eaf8fa',
  'bg-accent-surface': '#f6ffff',
  'bg-accent-fill-muted-default': '#cfe7e9',
  'bg-accent-fill-muted-hover': '#bbdbdf',
  'bg-accent-fill-muted-active': '#a2cdd2',
  'bg-accent-fill-emphasis-default': '#206f77', // brand (not in MCP light dump)
  'bg-accent-fill-emphasis-hover': '#205c62',
  'bg-accent-fill-emphasis-active': '#1c5157', // derived (not in MCP light dump)
  // borders
  'border-accent-subtle': '#bbdbdf',
  'border-accent-medium': '#7cbac1',
  'border-accent-strong': '#21767e',
  'border-neutral-subtle': '#d4d4d4',
  'border-neutral-medium': '#aeaeae',
  'border-neutral-strong': '#696969',
  'border-focus': '#6fb6e9',
  // text
  'text-neutral-subtle': '#585858',
  'text-neutral-strong': '#333333', // (not in MCP light dump; Gray/13)
  'text-neutral-subtle-on-emphasis': '#dedede',
  'text-neutral-strong-on-emphasis': '#ffffff',
  'text-accent-subtle': '#1f6369',
  'text-accent-strong': '#141f20',
  'text-accent-subtle-on-emphasis': '#cae4e7',
  'text-accent-strong-on-emphasis': '#ffffff',
  'text-link': '#0070a9',
  // concept — success / info / warning / danger
  'bg-success-fill-muted-default': '#cfeacc',
  'bg-success-fill-emphasis-default': '#207720',
  'text-success-subtle': '#20691f',
  'border-success-subtle': '#bbe0b8',
  'bg-info-fill-muted-default': '#cae6fa',
  'bg-info-fill-emphasis-default': '#006aa0',
  'text-info-subtle': '#015e8d',
  'border-info-subtle': '#b5daf5',
  'bg-warning-fill-muted-default': '#fbdac1',
  'bg-warning-fill-emphasis-default': '#9b4900',
  'text-warning-subtle': '#8a4100',
  'border-warning-subtle': '#f6caaa',
  'bg-danger-fill-muted-default': '#ffd0ce',
  'bg-danger-fill-emphasis-default': '#bc002a',
  'text-danger-subtle': '#a50827',
  'border-danger-subtle': '#ffbcba',
}

const DARK: SemanticColors = {
  // Tonal-inversion dark palette — the generator's OKLCH ramp output (dark mode).
  // Neutrals use the pure-gray "Gray" ramp; accent uses the "Moss Green" ramp
  // LIGHTENED (emphasis fill #8cd2da, not #206f77) so it pops on dark surfaces
  // and takes dark text. See plan/light-dark-parity-comparison.md §4a.
  //
  // neutral surfaces (Gray ramp)
  'bg-neutral-canvas': '#0b0b0b', // Gray/1
  'bg-neutral-surface': '#222222', // Gray/2 — brighter than canvas (elevation)
  'bg-neutral-fill-muted-default': '#5b5b5b', // Gray/3
  'bg-neutral-fill-muted-hover': '#696969', // Gray/4
  'bg-neutral-fill-muted-active': '#7a7a7a', // Gray/5
  'bg-neutral-fill-emphasis-default': '#c4c4c4', // Gray/9
  'bg-neutral-fill-emphasis-hover': '#d7d7d7', // Gray/10
  'bg-neutral-fill-emphasis-active': '#e8e8e8', // Gray/11
  'bg-floating': '#222222', // = surface
  'bg-backdrop': '#0b0b0b', // near-black modal scrim
  // accent surfaces (Moss Green ramp)
  'bg-accent-canvas': '#0a0b0b', // Moss Green/1
  'bg-accent-surface': '#1e2323', // Moss Green/2
  'bg-accent-fill-muted-default': '#3c6266', // Moss Green/3
  'bg-accent-fill-muted-hover': '#3e7378', // Moss Green/4
  'bg-accent-fill-muted-active': '#41878e', // Moss Green/5
  'bg-accent-fill-emphasis-default': '#8cd2da', // Moss Green/9 — light teal (tonal)
  'bg-accent-fill-emphasis-hover': '#ace3e9', // Moss Green/10
  'bg-accent-fill-emphasis-active': '#c7f1f6', // Moss Green/11
  // borders
  'border-accent-subtle': '#3c6266', // Moss Green/6
  'border-accent-medium': '#439199', // Moss Green/7
  'border-accent-strong': '#6ec0c9', // Moss Green/8
  'border-neutral-subtle': '#5b5b5b', // Gray/6
  'border-neutral-medium': '#838383', // Gray/7
  'border-neutral-strong': '#b1b1b1', // Gray/8
  'border-focus': '#2d8bc5', // Blue/7
  // text
  'text-neutral-subtle': '#e1e1e1', // Gray/12
  'text-neutral-strong': '#fcfcfc', // Gray/13
  'text-neutral-subtle-on-emphasis': '#353535', // Gray/14 — dark text on light fill
  'text-neutral-strong-on-emphasis': '#030303', // Gray/15 — dark text on light fill
  'text-accent-subtle': '#bcebf1', // Moss Green/12
  'text-accent-strong': '#e6ffff', // Moss Green/13
  'text-accent-subtle-on-emphasis': '#2c3839', // Moss Green/14 — dark text on light fill
  'text-accent-strong-on-emphasis': '#030303', // Moss Green/15 — dark text on light accent fill
  'text-link': '#5abbfb', // Blue/8
  // concept — success / info / warning / danger (seed ramps, dark — already tonal)
  'bg-success-fill-muted-default': '#3c673a',
  'bg-success-fill-emphasis-default': '#8cdb87',
  'text-success-subtle': '#bcf2b8',
  'border-success-subtle': '#3c673a',
  'bg-info-fill-muted-default': '#33607e',
  'bg-info-fill-emphasis-default': '#7dceff',
  'text-info-subtle': '#b7e8ff',
  'border-info-subtle': '#33607e',
  'bg-warning-fill-muted-default': '#7e4e25',
  'bg-warning-fill-emphasis-default': '#ffad63',
  'text-warning-subtle': '#ffd4aa',
  'border-warning-subtle': '#7e4e25',
  'bg-danger-fill-muted-default': '#923a3c',
  'bg-danger-fill-emphasis-default': '#ffa3a1',
  'text-danger-subtle': '#ffd0ce',
  'border-danger-subtle': '#923a3c',
}

export function getSemanticColors(mode: ColorMode): SemanticColors {
  return mode === 'dark' ? DARK : LIGHT
}
