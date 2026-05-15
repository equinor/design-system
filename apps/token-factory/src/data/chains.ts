// Real EDS token chains, curated for the Reference Resolver.
//
// Source files:
//   packages/eds-tokens/tokens/{fileKey}/Concept.Mode 1.json
//   packages/eds-tokens/tokens/{fileKey}/🌗 Color scheme.Light.json
//   packages/eds-tokens/tokens/{fileKey}/Color Light.Mode 1.json
//
// Each chain shows the three-layer model the team works with:
//   Concept   — cross-cutting token consumers actually use
//   Semantic  — per-scheme alias (lives in Color scheme.Light.json)
//   Palette   — raw hex value (lives in Color Light.Mode 1.json)

export type Chain = {
  id: string
  concept: {
    cssVar: string
    refsTo: string
  }
  semantic: {
    name: string
    refsTo: string
  }
  palette: {
    name: string
    value: string
  }
}

export const chains: Chain[] = [
  {
    id: 'bg-floating',
    concept: { cssVar: '--eds-color-bg-floating', refsTo: 'bg-floating' },
    semantic: { name: 'bg-floating', refsTo: 'Light.Gray.2' },
    palette: { name: 'Light.Gray.2', value: '#ffffff' },
  },
  {
    id: 'border-focus',
    concept: { cssVar: '--eds-color-border-focus', refsTo: 'border-focus' },
    semantic: { name: 'border-focus', refsTo: 'Light.Blue.7' },
    palette: { name: 'Light.Blue.7', value: '#6fb6e9' },
  },
  {
    id: 'text-link',
    concept: { cssVar: '--eds-color-text-link', refsTo: 'text-link' },
    semantic: { name: 'text-link', refsTo: 'Light.Blue.8' },
    palette: { name: 'Light.Blue.8', value: '#0070a9' },
  },
]
