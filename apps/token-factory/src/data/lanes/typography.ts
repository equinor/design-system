// The st-tokens lane — the typography story (foundry frame).
//
// Where the colours-static lane is GEOLOGY (a value is buried inside a
// geode; you crack and peel to find it), typography is MACHINING: the
// size doesn't exist yet — it's milled to spec from one master measure
// by formula, then ground to the baseline. Same factory, different wing.
// The contrast between the two wings IS the lesson; reusing the gem
// metaphor for both would flatten it.
//
// Protagonist: ui-body / md → --eds-typography-ui-body-md-font-size
// (the body text EDS Buttons wear; 14px spacious, ~12px comfortable).
//
// Lane id maps to the 🅰️ EDS Spacing & Typography tokens Figma file.
// The protagonist's role token (ui-body.md) lives there; it resolves
// through the sibling 🅰️ Spacing & Typography Primitives file — the same
// way colours-static's concept token resolves through Foundations.
//
// Accuracy note: the token-factory app imports only
// @equinor/eds-tokens/css/variables, which ships STATIC per-density
// values (.875rem spacious / .75rem comfortable). The pow() modular-scale
// formula lives in the component-library foundation layer the app does
// not load. So the foundry depicts the eds-tokens build output (what
// actually ships); the formula is taught as the shape of the scale, not
// claimed as a runtime artefact of this output.

import type { Lane } from './types'

export const TYPOGRAPHY_LANE: Lane = {
  id: 'st-tokens',
  label: 's&t tokens',
  // Steel-grey accent — the machine-shop wing reads metallic, distinct
  // from the gem hall's purple. Already mapped in base.css.
  accent: '--pico-light-gray',
  // All 8 post-dock scenes have real components (H.1–H.6), so the lane
  // is a full ready story alongside colours-static.
  status: 'ready',
  stages: [
    { id: 'figma', label: 'figma', viz: 'figma', pkg: 'figma file' },
    { id: 'sync', label: 'sync', viz: 'sync', pkg: 'eds-tokens-sync' },
    { id: 'json', label: 'json', viz: 'json', pkg: 'eds-tokens (source)' },
    { id: 'billet', label: 'billet', viz: 'crack', pkg: 'eds-tokens-build' },
    { id: 'gauge', label: 'scale', viz: 'layers', pkg: 'eds-tokens-build' },
    { id: 'mill', label: 'mill', viz: 'cut', pkg: 'eds-tokens-build' },
    { id: 'rack', label: 'css', viz: 'file', pkg: 'eds-tokens (build/css)' },
    { id: 'grind', label: 'bundle', viz: 'bundle', pkg: 'lightningcss' },
    { id: 'fit', label: 'fit', viz: 'ship', pkg: 'eds-core-react' },
  ],
  // 8 post-dock scenes mirror the colours-static count. inside reuses
  // the shared belt component; billet → inspection are placeholders
  // until their real components land (H.2–H.6); assembly is the
  // validated payoff (H.1), built first.
  scenes: [
    {
      id: 'foundry-inside',
      title: 'inside the foundry',
      stage: 'json',
      lines: [
        "Inside, the belt carries our crate deeper — but it's routed to the machine shop, not the gem hall.",
        'Our crate carries two files: the Spacing & Typography Primitives, and the Spacing & Typography tokens. Type is split across the two.',
        "We follow one part: ui-body, size md. The body text your buttons wear. The machine shop makes it — it isn't dug up.",
      ],
    },
    {
      id: 'billet',
      title: 'the billet',
      stage: 'billet',
      lines: [
        'At the build station, the crate gets opened. SLAM.',
        "Colour's crate held a gem you peel to. Ours holds a rough billet — raw stock.",
        'This is ui-body / md. A name, no measurements yet. The size gets machined.',
      ],
    },
    {
      id: 'master-gauge',
      title: 'the master gauge',
      stage: 'gauge',
      lines: [
        "Sizes here aren't a list someone typed. They're milled from one master measure.",
        'Each step is a fixed ratio up from the last — the fifth root of two. Ten sorts, xs to 6xl.',
        'One curve, not ten guesses. Our billet is the md rung.',
      ],
    },
    {
      id: 'milling',
      title: 'milling to spec',
      stage: 'mill',
      lines: [
        'The blank billet goes on the mill bed.',
        'The mill cuts md to spec: the base, times two-to-the-minus-one-fifth. At the default base, 14 pixels — snapped to the nearest half-pixel so it stays crisp.',
        'Then the seat is cut — line-height from a second curve, snapped to a 4-pixel grid so every line shares one rhythm. The old printers called that strip of metal the leading. For md, 16.',
        'eds-tokens-build engraves the part number: --eds-typography-ui-body-md-font-size.',
      ],
    },
    {
      id: 'density-dial',
      title: 'the density dial',
      stage: 'mill',
      lines: [
        "Here's the twist colour doesn't have. There isn't one size — there's a dial.",
        'Density. Turn it from spacious to comfortable and the master measure drops from 16 to 14.',
        'Watch the whole rack re-mill. md goes 14 down to about 12. Line-heights, icon sizes, gaps — all of it rescales. One dial, nothing else touched.',
        'That is the gift of milling from a base instead of typing fixed numbers. Change one measure, the whole system follows.',
      ],
    },
    {
      id: 'rack',
      title: 'the rack',
      stage: 'rack',
      lines: [
        'Our md sort joins the rack — the full range, xs to 6xl. Plus the header row, cut in Equinor instead of Inter.',
        'Each sort carries its own facets: weights, tracking, a tight line-height and a roomy one. Picked per use, not baked in.',
        'The build emits the rack to the typography CSS — every size, both typefaces, ready to fit.',
      ],
    },
    {
      id: 'inspection',
      title: 'final inspection',
      stage: 'grind',
      lines: [
        'At the shipping bench, the rack meets the other lanes — colours static and dynamic, foundations, and our sibling primitives file.',
        'One last pass. The inspector runs each sort across the surface plate, grinding it so the cap-height seats exactly on the baseline — the 4-pixel grid, slack trimmed top and bottom. That is the text-box trim step.',
        'Without it, text floats inside its line. With it, every line lands on the grid. Box sealed. Labelled variables.css.',
      ],
    },
    {
      id: 'assembly',
      title: 'assembly',
      stage: 'fit',
      lines: [
        'The box reaches the product team. Two wings meet here.',
        "Colour's gem drops into the seat the machine shop milled. Aligned on the baseline rail.",
        "And here's our md — not a number on a slide. Real text on a real button. Inter, 14 pixels, on the baseline.",
        'Remember the dial? Still here. Watch the text resize — comfortable, spacious — the whole component following one measure.',
        "One found its value in the stone. One milled it from a base. Together, they're your design system.",
      ],
    },
  ],
}
