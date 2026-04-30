import { readFileSync } from 'node:fs'

const css = readFileSync('./build/css/variables.min.css', 'utf8')

if (css.includes('light-dark(')) {
  throw new Error(
    'variables.min.css still contains light-dark() — build-dark-scope step did not run or was skipped',
  )
}

if (/--lightningcss-(light|dark)/.test(css)) {
  throw new Error(
    'variables.min.css contains lightningcss polyfill markers — a downstream tool downleveled light-dark()',
  )
}

const darkScopeMatches = css.match(/\[data-color-scheme=["']?dark["']?\]/g) ?? []
if (darkScopeMatches.length < 3) {
  throw new Error(
    'variables.min.css is missing expected [data-color-scheme=dark] occurrences (need at least 3: original color-scheme rule + appended primitive token override + semantic token re-declaration)',
  )
}

const lightScopeMatches =
  css.match(/\[data-color-scheme=["']?light["']?\]/g) ?? []
if (lightScopeMatches.length < 3) {
  throw new Error(
    'variables.min.css is missing expected [data-color-scheme=light] occurrences (need at least 3: original color-scheme rule + widened primitive block + widened semantic block)',
  )
}
