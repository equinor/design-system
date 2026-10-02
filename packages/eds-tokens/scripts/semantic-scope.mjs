/**
 * Shared definition of the widened selectors, used by
 * widen-semantic-scope.mjs (writes them) and generate-css-bundle.mjs
 * (asserts them before bundling).
 *
 * The semantic layer is widened to every element that can change what
 * it resolves against: `[data-color-scheme]` for the scale aliases
 * (#5226) and `[data-density]` for the density layer (#5247). The
 * density base (`density/comfortable.css`) is widened to
 * `[data-density="comfortable"]`, so asking for Comfortable inside a
 * Compact or Relaxed subtree gets Comfortable back.
 *
 * The *_WIDE constants are the Prettier-canonical form (one selector
 * per line) so the generated files are stable under `prettier --write`
 * / formatOnSave. The regexes are whitespace-tolerant for the same
 * reason — matching must not depend on which tool touched the file
 * last.
 */
export const WIDE = ':root,\n[data-color-scheme],\n[data-density] {'
export const WIDE_RE =
  /^:root,\s*\[data-color-scheme\],\s*\[data-density\]\s*\{/
export const NARROW_RE = /^:root\s*\{/

// The #5226 selector, before `[data-density]` was added. Accepted as
// input so the committed files can be widened again without a fresh
// export.
export const PREVIOUS_WIDE_RE = /^:root,\s*\[data-color-scheme\]\s*\{/

// Double quotes to match the export's own `[data-density="compact"]` and
// `[data-density="relaxed"]`. Prettier would write single quotes, so the
// regex accepts either.
export const DENSITY_BASE_WIDE = ':root,\n[data-density="comfortable"] {'
export const DENSITY_BASE_WIDE_RE =
  /^:root,\s*\[data-density=(["'])comfortable\1\]\s*\{/
