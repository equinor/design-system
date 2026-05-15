// The five parallel build lanes in the eds-tokens pipeline.
// Mirrors the FigJam architecture board (148:632).
//
// Colors match the FigJam legend so the team can cross-reference.

export type LaneId =
  | 'color-scheme'
  | 'semantic-static'
  | 'semantic-dynamic'
  | 'spacing'
  | 'typography'

export type Lane = {
  id: LaneId
  label: string
  source: string
  build: string
  output: string
  colorVar: string
  /** True for the lane this workshop walks through. */
  active: boolean
}

export const LANES: Lane[] = [
  {
    id: 'color-scheme',
    label: 'color scheme',
    source: '🌗 Color scheme + Concept',
    build: 'build-color-scheme-variables',
    output: 'color-scheme.css (light-dark)',
    colorVar: 'var(--pico-dark-purple)',
    active: true,
  },
  {
    id: 'semantic-static',
    label: 'semantic (static)',
    source: '🗣️ Semantic.Mode 1',
    build: 'build-semantic-static-variables',
    output: 'static/variables.css + ts/js/json',
    colorVar: 'var(--pico-dark-green)',
    active: false,
  },
  {
    id: 'semantic-dynamic',
    label: 'appearance (dynamic)',
    source: '🎨 Appearance.*',
    build: 'build-semantic-dynamic-variables',
    output: 'dynamic/variables.css',
    colorVar: 'var(--pico-orange)',
    active: false,
  },
  {
    id: 'spacing',
    label: 'spacing',
    source: '🪐 Spacing + Density',
    build: 'build-spacing',
    output: 'spacing.css',
    colorVar: 'var(--pico-light-gray)',
    active: false,
  },
  {
    id: 'typography',
    label: 'typography',
    source: '🅰️ Typography axes',
    build: 'build-typography',
    output: 'typography.css',
    colorVar: 'var(--pico-light-gray)',
    active: false,
  },
]

export const ACTIVE_LANE = LANES.find((l) => l.active)!
