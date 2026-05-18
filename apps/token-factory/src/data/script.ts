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
      'every morning, lorries arrive at our goods terminal.',
      "this is eds-tokens-sync — figma's rest api drops variable files at our door.",
      "our crate is labelled 'color scheme'. that's our lane today.",
      "see the other four belts? other lanes. not today's story.",
      'the worker reads the label and sorts our crate onto the color scheme belt.',
      'the gate slides open and our crate enters the factory.',
    ],
  },
  {
    id: 'inside',
    title: 'inside the factory',
    lines: [
      'inside, the belt carries our crate deeper.',
      "the crate holds one token. let's call him bg-floating.",
      "bg-floating doesn't know what he is yet. that gets figured out at the next station.",
    ],
  },
  {
    id: 'crack',
    title: 'the crack',
    lines: [
      'at the build station, the crate gets opened.',
      'SLAM.',
      'inside: a geode. this is our token in its raw json form.',
    ],
  },
  {
    id: 'reveal',
    title: 'the reveal',
    lines: [
      "look closer. the geode isn't one solid stone.",
      "it's two-layered — an outer name and an inner value.",
      'this is what figma actually ships us.',
    ],
  },
  {
    id: 'peel',
    title: 'the peel',
    lines: [
      "let's open the geode. it's two-layered.",
      'outer: this is the figma source name — Bg.Floating — in Concept.Mode 1.json.',
      'core: the actual colour — #ffffff — resolved from Light.Gray.2 in Color Light.Mode 1.json.',
      'now eds-tokens-build wants to ship this as css.',
      'it stamps an EDS-prefixed CSS variable onto the geode: --eds-color-bg-floating.',
      'the geode is now shippable as CSS. figma never knew this name existed.',
    ],
  },
  {
    id: 'cutting',
    title: 'the cutting',
    lines: [
      "but here's the twist: the same token has a different colour in dark mode.",
      'in dark mode, bg-floating = #202223 instead of #ffffff.',
      'the cutter fuses both into one gemstone with two facets.',
      'written in css: light-dark(#ffffff, #202223).',
      "one token, two values, one declaration. that's how light and dark theming works.",
    ],
  },
  {
    id: 'tray',
    title: 'the tray',
    lines: [
      'the finished gemstone joins a tray of other concept-colour gemstones.',
      "this tray is our lane's output. it's called color-scheme.css.",
    ],
  },
  {
    id: 'packaging',
    title: 'the packaging',
    lines: [
      'at the shipping bench, our tray meets materials from the other four lanes.',
      'cords from spacing. clasps from density. chains from typography.',
      'but before sealing the box, an inspector adds one more polish.',
      'not every consumer can handle the two-facet cut directly.',
      'so the inspector adds three explicit faces — light, dark, and a fallback.',
      'this is the build-dark-scope step. now any consumer can use them.',
      'box sealed. labelled variables.min.css.',
    ],
  },
  {
    id: 'jeweller',
    title: 'the jeweller',
    lines: [
      'and here are the jewellers — your team. the eds product team.',
      'they take our gemstones, our cords, our clasps.',
      'and they assemble them into jewellery.',
      'what they make is your design system.',
      'every component you ship rides on the back of this pipeline.',
    ],
  },
]
