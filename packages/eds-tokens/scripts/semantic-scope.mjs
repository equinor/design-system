/**
 * Shared definition of the widened semantic-layer selector (#5226),
 * used by widen-semantic-scope.mjs (writes it) and
 * generate-css-bundle.mjs (asserts it before bundling).
 *
 * WIDE is the Prettier-canonical form (one selector per line) so the
 * generated files are stable under `prettier --write` / formatOnSave.
 * The regexes are whitespace-tolerant for the same reason — matching
 * must not depend on which tool touched the file last.
 */
export const WIDE = ':root,\n[data-color-scheme] {'
export const WIDE_RE = /^:root,\s*\[data-color-scheme\]\s*\{/
export const NARROW_RE = /^:root\s*\{/
