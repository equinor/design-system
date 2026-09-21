/**
 * Spacing steps that are decided in Tokens Studio, but have not reached
 * packages/eds-tokens yet.
 *
 * The layout band above `3xl` is six steps, `4xl` to `9xl`, agreed on
 * equinor/design-system#5487. The work so far has been components, and patterns and layout need
 * spacing wider than `3xl` (32px). They reach the package with the next `tokens_studio_release`
 * PR, tracked in that issue.
 *
 * An earlier three-step version of this band (`4xl` 48px, `5xl` 96px, `6xl` 128px) was staged in
 * Tokens Studio and Figma but never shipped. It is superseded: those three bindings are now
 * `5xl`, `8xl` and `9xl`, so a name from that version means a different width here.
 *
 * Why they are listed here rather than typed into the pages: every primitive these point at
 * already ships, so the px values are still resolved from the package CSS the way every other
 * value on these pages is. The only thing recorded here is the primitive each density picks,
 * which is the design decision. No measurement is hand-written.
 *
 * Both `generate-spacing-reference.mjs` and `check-colour-docs.mjs` read this file, so the pages
 * and the name checker cannot disagree about which steps are allowed to be absent from source.
 *
 * TO REMOVE: once the release merges, delete this file and its two imports. The generator
 * verifies each step against the source as soon as it appears there and tells you to do this, so
 * a stale entry cannot sit here silently claiming a shipped token is still pending.
 */

/**
 * Step name -> the primitive index each density picks.
 *
 * Every triple is three adjacent positions on the primitive grid, which is what keeps the
 * one-position-apart density rule true on each row. Two consequences are deliberate and
 * documented on the scale page: primitive `350` (56px) is skipped between `5xl` and `6xl`, and
 * `6xl` and `8xl` have asymmetric density because the grid changes resolution at `400` and `600`.
 */
export const PENDING_STEPS = {
  '4xl': { compact: 225, comfortable: 250, relaxed: 275 },
  '5xl': { compact: 275, comfortable: 300, relaxed: 325 },
  '6xl': { compact: 375, comfortable: 400, relaxed: 450 },
  '7xl': { compact: 450, comfortable: 500, relaxed: 550 },
  '8xl': { compact: 550, comfortable: 600, relaxed: 700 },
  '9xl': { compact: 700, comfortable: 800, relaxed: 900 },
}

/** Where they already exist, for the note the pages render. */
export const PENDING_SOURCE = 'Tokens Studio, awaiting merge'

/** The issue tracking the release that brings them into the package. */
export const PENDING_ISSUE = 5487

/** Dotted names, e.g. `spacing.4xl`. */
export const pendingNames = () =>
  Object.keys(PENDING_STEPS).map((step) => `spacing.${step}`)
