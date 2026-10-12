/**
 * Typography tokens that are decided in Tokens Studio, but have not reached packages/eds-tokens
 * yet.
 *
 * Tokens Studio release 0.1.2 carries the typography decided on equinor/design-system#5530: the
 * `header`, `label` and `body` roles, `font-weight.medium` and `font-weight.bold`, new header line
 * heights, and `lineheight-scale.1200`. It reaches the package with the next
 * `tokens_studio_release` PR. That PR cannot merge yet, so the pages document the release from here.
 *
 * Why the decisions are listed here rather than typed into the pages: every primitive these point at
 * already ships, so the px values are still resolved from the package, the way every other value on
 * these pages is. What is recorded here is which primitive each density picks, which is the design
 * decision. The entries were copied mechanically from the release's DTCG export, not typed.
 *
 * Two things have no primitive in the package yet. `lineheight-scale.1200` is recorded as the
 * spacing primitive it aliases, which ships. `font-weight.bold` is 700, and nothing in the package
 * resolves to 700, so it is the one literal in this file.
 *
 * The generator reads this file for the tables, and writes src/css/pending-typography-tokens.css
 * from it, which declares the tokens on the docs site so the specimens render with these values.
 * `check-colour-docs.mjs` reads it too, so the name checker accepts the pending names.
 *
 * The pages list these tokens like every other token, with no marker.
 *
 * TO REMOVE: once the release merges, delete this file, src/css/pending-typography-tokens.css and
 * its import in theme-variables.css. The generator compares every entry with the package as soon
 * as the release is there, and tells you to do this, so a stale entry cannot sit here unnoticed.
 */

/**
 * Role -> step -> density -> [type-scale index, line-height step].
 *
 * The type-scale face follows from the role: `header` is set on the Equinor scale, `label` and
 * `body` on the Inter scale.
 */
export const PENDING_STYLES = {
  header: {
    xs: { compact: [100, 100], comfortable: [200, 200], relaxed: [300, 400] },
    sm: { compact: [200, 200], comfortable: [300, 400], relaxed: [400, 400] },
    md: { compact: [300, 400], comfortable: [400, 400], relaxed: [500, 500] },
    lg: { compact: [400, 400], comfortable: [500, 500], relaxed: [600, 700] },
    xl: { compact: [500, 500], comfortable: [600, 700], relaxed: [700, 800] },
    '2xl': {
      compact: [600, 700],
      comfortable: [700, 800],
      relaxed: [800, 1000],
    },
    '3xl': {
      compact: [700, 800],
      comfortable: [800, 1000],
      relaxed: [900, 1100],
    },
    '4xl': {
      compact: [800, 1000],
      comfortable: [900, 1100],
      relaxed: [1000, 1200],
    },
  },
  label: {
    xs: { compact: [100, 100], comfortable: [200, 200], relaxed: [300, 200] },
    sm: { compact: [200, 100], comfortable: [300, 200], relaxed: [400, 400] },
    md: { compact: [300, 200], comfortable: [400, 400], relaxed: [500, 500] },
    lg: { compact: [400, 400], comfortable: [500, 500], relaxed: [600, 500] },
    xl: { compact: [500, 500], comfortable: [600, 500], relaxed: [700, 700] },
    '2xl': {
      compact: [600, 500],
      comfortable: [700, 700],
      relaxed: [800, 800],
    },
    '3xl': {
      compact: [700, 700],
      comfortable: [800, 800],
      relaxed: [900, 800],
    },
    '4xl': {
      compact: [800, 800],
      comfortable: [900, 800],
      relaxed: [1000, 1000],
    },
    '5xl': {
      compact: [900, 800],
      comfortable: [1000, 1000],
      relaxed: [1100, 1100],
    },
  },
  body: {
    sm: { compact: [200, 200], comfortable: [300, 400], relaxed: [400, 500] },
    md: { compact: [300, 400], comfortable: [400, 500], relaxed: [500, 700] },
    lg: { compact: [400, 500], comfortable: [500, 700], relaxed: [600, 700] },
    xl: { compact: [500, 700], comfortable: [600, 700], relaxed: [700, 800] },
    '2xl': {
      compact: [600, 700],
      comfortable: [700, 800],
      relaxed: [800, 1000],
    },
    '3xl': {
      compact: [700, 800],
      comfortable: [800, 1000],
      relaxed: [900, 1200],
    },
  },
}

/** Line-height step -> the spacing primitive it aliases, for steps the package does not have. */
export const PENDING_LINE_HEIGHT_STEPS = { 1200: 275 }

/**
 * The two new weights. `medium` is the weight `bolder` has today under a new name, so it points at
 * that primitive. `bold` has no primitive in the package yet.
 */
export const PENDING_WEIGHTS = {
  medium: { primitive: 'bolder' },
  bold: { value: 700 },
}

/** Names the release removes. The pages do not list them, and they must be gone once it merges. */
export const REMOVED = [
  /^typography\.ui\./,
  /^font-weight\.bolder$/,
  /^font-weight\.lighter$/,
]

/** Dotted name -> CSS custom property, for every pending token. */
export const pendingNames = () => {
  const names = new Map()
  for (const [role, steps] of Object.entries(PENDING_STYLES)) {
    for (const step of Object.keys(steps)) {
      for (const prop of ['font-size', 'line-height']) {
        const name = `typography.${role}.${step}.${prop}`
        names.set(name, `--eds-${name.replaceAll('.', '-')}`)
      }
    }
  }
  for (const weight of Object.keys(PENDING_WEIGHTS)) {
    names.set(`font-weight.${weight}`, `--eds-font-weight-${weight}`)
  }
  return names
}
