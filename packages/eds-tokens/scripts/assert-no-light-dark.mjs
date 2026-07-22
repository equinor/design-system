/**
 * Regression guard for published CSS bundles: no light-dark() literals,
 * no lightningcss polyfill markers, and both explicit color-scheme
 * scopes present.
 *
 * Usage: node scripts/assert-no-light-dark.mjs [file] [minSchemeScopes]
 *
 * Defaults match the 2.x build (`build/css/variables.min.css`, where
 * build-dark-scope widening produces at least 3 occurrences per scheme).
 * The Tokens Studio bundle (`src/tokens/css/variables.css`) has exactly
 * one block per scheme and is checked with a threshold of 1.
 */
import { readFileSync } from 'node:fs'

const [file = './build/css/variables.min.css', minSchemeScopes = '3'] =
  process.argv.slice(2)
const minScopes = Number(minSchemeScopes)

// A guard that can be silently disabled is no guard: NaN (from a
// non-numeric argument) makes every `length < minScopes` comparison
// false, so reject bad thresholds loudly instead
if (!Number.isInteger(minScopes) || minScopes < 1) {
  throw new Error(
    `invalid minSchemeScopes argument "${minSchemeScopes}" — expected a positive integer`,
  )
}

const css = readFileSync(file, 'utf8')

if (css.includes('light-dark(')) {
  throw new Error(
    `${file} still contains light-dark() — build-dark-scope step did not run or was skipped`,
  )
}

if (/--lightningcss-(light|dark)/.test(css)) {
  throw new Error(
    `${file} contains lightningcss polyfill markers — a downstream tool downleveled light-dark()`,
  )
}

const darkScopeMatches =
  css.match(/\[data-color-scheme=["']?dark["']?\]/g) ?? []
if (darkScopeMatches.length < minScopes) {
  throw new Error(
    `${file} is missing expected [data-color-scheme=dark] occurrences (found ${darkScopeMatches.length}, need at least ${minScopes})`,
  )
}

const lightScopeMatches =
  css.match(/\[data-color-scheme=["']?light["']?\]/g) ?? []
if (lightScopeMatches.length < minScopes) {
  throw new Error(
    `${file} is missing expected [data-color-scheme=light] occurrences (found ${lightScopeMatches.length}, need at least ${minScopes})`,
  )
}
