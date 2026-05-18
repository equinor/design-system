// Narrator beats per scene. Each scene auto-types its lines one at a
// time within the scene; driver presses space to advance to the next
// scene (or skip mid-typing).
//
// Lines are pixel-art-friendly: short, plain language, no jargon unless
// the same beat introduces it. The narrator is the resized LibrarianBot
// pinned to the top-right of the stage.

export type SceneId =
  | 'dock'
  | 'inside'
  | 'crack'
  | 'reveal'
  | 'peel'
  | 'cutting'
  | 'tray'
  | 'packaging'
  | 'jeweller'

export type Scene = {
  id: SceneId
  title: string
  lines: string[]
}

export const SCRIPT: Scene[] = [
  {
    id: 'dock',
    title: 'the goods terminal',
    lines: [
      'Every morning, lorries arrive at our goods terminal.',
      "This is eds-tokens-sync — Figma's REST API drops variable files at our door.",
      "Our crate is labelled 'color scheme'. That's our lane today.",
      "See the other four belts? Other lanes. Not today's story.",
      'The worker reads the label and sorts our crate onto the color scheme belt.',
      'The gate slides open and our crate enters the factory.',
    ],
  },
  {
    id: 'inside',
    title: 'inside the factory',
    lines: [
      'Inside, the belt carries our crate deeper.',
      "The crate holds one token. Let's call him bg-floating.",
      "Bg-floating doesn't know what he is yet. That gets figured out at the next station.",
    ],
  },
  {
    id: 'crack',
    title: 'the crack',
    lines: [
      'At the build station, the crate gets opened.',
      'SLAM.',
      'Inside: a geode. This is our token in its raw JSON form.',
    ],
  },
  {
    id: 'reveal',
    title: 'the reveal',
    lines: [
      "Look closer. The geode isn't one solid stone.",
      "It's two-layered — an outer name and an inner value.",
      'This is what Figma actually ships us.',
    ],
  },
  {
    id: 'peel',
    title: 'the peel',
    lines: [
      "Let's open the geode. It's two-layered.",
      'Outer: this is the Figma source name — Bg.Floating — in Concept.Mode 1.json.',
      'Core: the actual colour — #ffffff — resolved from Light.Gray.2 in Color Light.Mode 1.json.',
      'Now eds-tokens-build steps in. It needs to give this geode a CSS variable name.',
      'It stamps an EDS-prefixed name onto the geode: --eds-color-bg-floating.',
      'The geode now carries its CSS variable name. It still needs cutting and packaging before it becomes a line of CSS.',
    ],
  },
  {
    id: 'cutting',
    title: 'the cutting',
    lines: [
      "But here's the twist: the same token has a different colour in dark mode.",
      'In dark mode, bg-floating = #202223 instead of #ffffff.',
      'The cutter fuses both into one gemstone with two facets.',
      'Written in CSS: light-dark(#ffffff, #202223).',
      "One token, two values, one declaration. That's how light and dark theming works.",
    ],
  },
  {
    id: 'tray',
    title: 'the tray',
    lines: [
      'The finished gemstone joins a tray of other concept-colour gemstones.',
      "This tray is our lane's output. It's called color-scheme.css.",
    ],
  },
  {
    id: 'packaging',
    title: 'the packaging',
    lines: [
      'At the shipping bench, our tray meets materials from the other four lanes.',
      'Cords from spacing. Clasps from density. Chains from typography.',
      'But before sealing the box, an inspector adds one more polish.',
      'Browsers without light-dark() still need to know which value to use.',
      'So the inspector re-declares the same token under four selector scopes.',
      'This is the build-dark-scope step. One variable. Four resolved values.',
      'Box sealed. Labelled variables.min.css.',
    ],
  },
  {
    id: 'jeweller',
    title: 'the jeweller',
    lines: [
      'And here are the actual jewels — the core components.',
      'It takes our gemstones, our cords, our clasps.',
      'And is assembled into jewellery.',
      'This is our design system.',
      'Every component we ship rides on the back of this pipeline.',
    ],
  },
]
