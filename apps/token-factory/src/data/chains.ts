// Real EDS token chains, curated for the Reference Resolver.
//
// The team's working vocabulary is Palette / Semantic / Concept
// (team-assistant/decisions.md:259-263). The actual relationship:
//
//                    Palette
//                  (raw hex values)
//                  ↑              ↑
//            Semantic           Concept
//         (per-intent)     (cross-cutting)
//
// Semantic and Concept are PARALLEL consumer-facing namespaces. Both
// reference Palette via alias chains. Components consume Semantic
// (Bg.Neutral.Canvas, Border.Accent.Medium, ...) or Concept (bg-floating,
// border-focus, ...) — never Palette directly.
//
// Chain depth differs in the source files:
//   Concept:   1 hop  (bg-floating → Light.Gray.2)
//   Semantic:  2 hops (Bg.Neutral.Canvas → Neutral.1 → Light.Gray.1)
// The 2-hop Semantic detour exists because the per-intent slot first
// resolves to a scheme-alias (Neutral, Accent, Warning, ...) which then
// resolves to a Light.* / Dark.* hex. The station log narrates the full
// hop list; the card layout collapses to two cards (consumer + palette)
// for visual consistency.
//
// Sources verified against:
//   packages/eds-tokens/tokens/GnovDpL3UV6X51Ot7Kv6Im/🌗 Color scheme.Light.json
//   packages/eds-tokens/tokens/GnovDpL3UV6X51Ot7Kv6Im/Color Light.Mode 1.json
//   packages/eds-tokens/tokens/OWxw2XogDLUt1aCvcDFXPw/Semantic.Mode 1.json

export type Category = 'semantic' | 'concept'

export type Chain = {
  id: string
  category: Category
  consumer: {
    name: string
    cssVar: string
    refsTo: string
  }
  palette: {
    name: string
    value: string
  }
  /** Full alias hop list, narrated in the station log when hovered. */
  trace: string[]
}

export const chains: Chain[] = [
  {
    id: 'bg-neutral-canvas',
    category: 'semantic',
    consumer: {
      name: 'Bg.Neutral.Canvas',
      cssVar: '--eds-color-bg-neutral-canvas',
      refsTo: 'Neutral.1',
    },
    palette: { name: 'Light.Gray.1', value: '#f5f5f5' },
    trace: ['Bg.Neutral.Canvas', 'Neutral.1', 'Light.Gray.1', '#f5f5f5'],
  },
  {
    id: 'bg-floating',
    category: 'concept',
    consumer: {
      name: 'bg-floating',
      cssVar: '--eds-color-bg-floating',
      refsTo: 'Light.Gray.2',
    },
    palette: { name: 'Light.Gray.2', value: '#ffffff' },
    trace: ['bg-floating', 'Light.Gray.2', '#ffffff'],
  },
  {
    id: 'border-focus',
    category: 'concept',
    consumer: {
      name: 'border-focus',
      cssVar: '--eds-color-border-focus',
      refsTo: 'Light.Blue.7',
    },
    palette: { name: 'Light.Blue.7', value: '#6fb6e9' },
    trace: ['border-focus', 'Light.Blue.7', '#6fb6e9'],
  },
  {
    id: 'text-warning-strong',
    category: 'semantic',
    consumer: {
      name: 'Text.Warning.Strong',
      cssVar: '--eds-color-text-warning-strong',
      refsTo: 'Warning.13',
    },
    palette: { name: 'Light.Orange.13', value: '#27190e' },
    trace: ['Text.Warning.Strong', 'Warning.13', 'Light.Orange.13', '#27190e'],
  },
]
