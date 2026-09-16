/**
 * Spacing steps that are decided and staged in Tokens Studio, but have not reached
 * packages/eds-tokens yet.
 *
 * Added 2026-09-16 and **merged on Tokens Studio `main`** for page-level spacing: the work so far
 * has been components, and patterns and layout need steps above `3xl`. They reach the package with
 * the next `tokens_studio_release` PR, tracked in equinor/design-system#5487.
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

/** Step name -> the primitive index each density picks. */
export const PENDING_STEPS = {
  '4xl': { compact: 275, comfortable: 300, relaxed: 325 },
  '5xl': { compact: 550, comfortable: 600, relaxed: 700 },
  '6xl': { compact: 700, comfortable: 800, relaxed: 900 },
}

/** Where they already exist, for the note the pages render. */
export const PENDING_SOURCE = 'Tokens Studio, merged on main'

/** The issue tracking the release that brings them into the package. */
export const PENDING_ISSUE = 5487

/** Dotted names, e.g. `spacing.4xl`. */
export const pendingNames = () =>
  Object.keys(PENDING_STEPS).map((step) => `spacing.${step}`)

/** Every primitive index the pending steps point at. */
export const pendingPrimitives = () =>
  new Set(
    Object.values(PENDING_STEPS).flatMap((densities) =>
      Object.values(densities),
    ),
  )
