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

const darkScopeMatches = css.match(/\[data-color-scheme=.?dark.?\]/g) ?? []
if (darkScopeMatches.length < 2) {
  throw new Error(
    'variables.min.css is missing the [data-color-scheme=dark] custom-property scope rule (expected at least 2 occurrences: color-scheme rule + token override rule)',
  )
}
