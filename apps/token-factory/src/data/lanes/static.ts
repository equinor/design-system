// The colours-static lane — today's protagonist story.
//
// Follows Bg.Floating from its raw JSON form in Concept.Mode 1.json
// (inside the 🎨 EDS Colours (static) Figma file), through the build
// pipeline, to the real EDS Button rendered with real CSS variables in
// Scene 9.
//
// 8 post-Dock scenes: inside, crack, reveal, peel, cutting, tray,
// packaging, jeweller. Intro + Dock are in PROLOGUE (shared).

import type { Lane } from './types'

export const STATIC_LANE: Lane = {
  id: 'colours-static',
  label: 'colours · static',
  accent: '--pico-dark-purple',
  status: 'ready',
  // Pipeline stations the token visits. Mirrors the figjam pipeline
  // map (FigJam node 148:632) for the semantic / Layer-2 path. 9 cells
  // so LaneMapDialog can render a 3×3 connected snake (flow goes:
  // top-left → top-right, down, right→left across row 2, down,
  // left→right across row 3).
  stages: [
    { id: 'figma', label: 'figma', viz: 'figma', pkg: 'figma file' },
    { id: 'sync', label: 'sync', viz: 'sync', pkg: 'eds-tokens-sync' },
    { id: 'json', label: 'json', viz: 'json', pkg: 'eds-tokens (source)' },
    { id: 'crack', label: 'open', viz: 'crack', pkg: 'eds-tokens-build' },
    { id: 'layers', label: 'layers', viz: 'layers', pkg: 'eds-tokens-build' },
    { id: 'cut', label: 'cut', viz: 'cut', pkg: 'eds-tokens-build' },
    { id: 'file', label: 'css', viz: 'file', pkg: 'eds-tokens (build/css)' },
    {
      id: 'bundle',
      label: 'bundle',
      viz: 'bundle',
      pkg: 'lightningcss + dark-scope',
    },
    { id: 'ship', label: 'ship', viz: 'ship', pkg: 'eds-core-react' },
  ],
  scenes: [
    {
      id: 'inside',
      title: 'inside the factory',
      stage: 'json',
      lines: [
        'Inside, the belt carries our crate deeper.',
        'Our crate carries two JSON files — Semantic.Mode 1.json and Concept.Mode 1.json. We follow the concept side.',
        "Inside Concept.Mode 1.json are dozens of tokens. We'll pick one: Bg.Floating. We meet him properly when the build cracks the crate open.",
      ],
    },
    {
      id: 'crack',
      title: 'the crack',
      stage: 'crack',
      lines: [
        'At the build station, the crate gets opened.',
        'SLAM.',
        'Inside: a geode. This is Bg.Floating in his raw JSON form.',
      ],
    },
    {
      id: 'reveal',
      title: 'the reveal',
      stage: 'layers',
      lines: [
        "Look closer. The geode isn't one solid stone.",
        "It's three-layered — concept, scheme, palette. Each ring lives in its own JSON file.",
        'This is what Figma actually ships us.',
      ],
    },
    {
      id: 'peel',
      stage: 'layers',
      title: 'the peel',
      lines: [
        "This geode is three-layered. Let's open it.",
        'Outer ring — Bg.Floating in Concept.Mode 1.json (in the colours-static Figma file). The name product code asks for.',
        'Middle ring — bg-floating in 🌗 Color scheme.Light.json (Foundations file). Routes the concept to a palette colour. This is the swap point — change the scheme, change the route.',
        'Inner core — Light.Gray.2 in Color Light.Mode 1.json (Foundations). The actual hex: #ffffff.',
        'Three layers, three jobs. Swap the middle ring and the colour changes without touching product code or palette.',
        'Now eds-tokens-build steps in. It needs to give this geode a CSS variable name.',
        'It stamps an EDS-prefixed name onto the geode: --eds-color-bg-floating.',
        'The geode now carries its CSS variable name. It still needs cutting and packaging before it becomes a line of CSS.',
      ],
    },
    {
      id: 'cutting',
      title: 'the cutting',
      stage: 'cut',
      lines: [
        "But here's the twist: the same token has a different colour in dark mode.",
        'In dark mode, Bg.Floating = #202223 instead of #ffffff (resolved through 🌗 Color scheme.Dark.json → Dark.North sea.2).',
        'The cutter fuses both into one gemstone with two facets.',
        'Written in CSS: light-dark(#ffffff, #202223).',
        "One token, two values, one declaration. That's how light and dark theming works.",
      ],
    },
    {
      id: 'tray',
      title: 'the tray',
      stage: 'file',
      lines: [
        'The finished gemstone joins a tray of other concept-colour gemstones.',
        'The build emits this tray to a file called color-scheme.css — together with the scheme aliases and palette tokens our concepts resolve through.',
      ],
    },
    {
      id: 'packaging',
      title: 'the packaging',
      stage: 'bundle',
      lines: [
        'At the shipping bench, our tray meets materials from the other four lanes.',
        'Cords from spacing & typography primitives. Clasps from foundations (elevation). Chains from spacing & typography tokens (font axes, density, radius). Lacquer from colours · dynamic (appearance).',
        'But before sealing the box, an inspector adds one more polish.',
        'Browsers without light-dark() still need to know which value to use.',
        'So the inspector re-declares the same token under four selector scopes.',
        'This is the build-dark-scope step. One variable. Four resolved values.',
        'Box sealed. Labelled variables.css.',
      ],
    },
    {
      id: 'jeweller',
      title: 'the jeweller',
      stage: 'ship',
      lines: [
        'And here are the actual jewels — the core components.',
        'It takes our gemstones, our cords, our clasps, our chains, our lacquer.',
        'And is assembled into jewellery.',
        'This is our design system.',
        'Every component we ship rides on the back of this pipeline.',
      ],
    },
  ],
}
