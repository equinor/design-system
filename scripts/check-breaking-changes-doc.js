#!/usr/bin/env node

/**
 * Checks that a pull request making a breaking change to a /next component
 * also adds something to the breaking changes page.
 *
 * The page (packages/eds-core-react/stories/docs/BreakingChanges.mdx) is the
 * single living list consumers use to tell an intended change from a bug. Four
 * `fix!` PRs changed a published /next API without touching it (#5410, #5409,
 * #5127, #5509), so the page described beta.1 behaviour well into beta.2 and
 * #5455 had to correct nine entries at once. Nothing failed when they merged,
 * so this script does. See #5572.
 *
 * It fails when all three hold:
 *   1. The PR is marked breaking - a `!` before the colon in the title, or a
 *      `BREAKING CHANGE:` footer in the body.
 *   2. The diff touches a file under packages/eds-core-react/src/components/
 *      next/ that can change what a consumer sees (so not tests, stories,
 *      docs or snapshots).
 *   3. The breaking changes page is not in the diff.
 *
 * Escape hatch: the `skip-breaking-changes-doc` label. Some breaking changes
 * genuinely need no entry - an internal rename with no consumer-visible
 * surface, say. The label is logged when used so it shows up in review.
 *
 * Blind spot, by design: a plain `fix:` that retires a known issue rather than
 * introducing a breaking change does not trip this. #5571 covers that
 * direction.
 *
 * Run in CI by .github/workflows/breaking-changes-doc-check.yml, which passes
 * the PR title, body and labels through the environment. Run it by hand
 * against any PR with `node scripts/check-breaking-changes-doc.js --pr 5410`,
 * which reads the same values through `gh`.
 */

const { execFileSync } = require('child_process')

const NEXT_SRC = 'packages/eds-core-react/src/components/next/'
const PAGE = 'packages/eds-core-react/stories/docs/BreakingChanges.mdx'
const PAGE_TITLE = 'EDS 2.0 (beta) / Breaking changes'
const SKIP_LABEL = 'skip-breaking-changes-doc'

const REPO = process.env.GITHUB_REPOSITORY || 'equinor/design-system'

// Files under NEXT_SRC that cannot change the API or markup a consumer sees.
// Keeps the check off PRs that only touch stories, tests or docs.
// `.mdx?` covers both the component `.docs.mdx` files and any plain `.md`.
const NON_API_FILE = /(\.test\.tsx?|\.stories\.tsx|\.mdx?|\.snap)$/
const SNAPSHOT_DIR = '__snapshots__/'

// `type!: desc` or `type(scope)!: desc`. The title is the reliable signal:
// squash merges use it and leave the body empty (#5388). The footer is
// checked too because the beta guide asks for both.
const BREAKING_TITLE = /^[a-z]+(\([^)]*\))?!:/
const BREAKING_FOOTER = /^BREAKING[ -]CHANGE:/m

const gh = (args) =>
  execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })

/** Accepts a JSON array (GitHub's `toJSON(...labels.*.name)`), or a plain
 * newline- or comma-separated list, so the script is easy to drive by hand. */
const parseLabels = (raw) => {
  if (!raw) return []
  const trimmed = raw.trim()
  if (trimmed.startsWith('[')) return JSON.parse(trimmed)
  return trimmed
    .split(/[\n,]/)
    .map((label) => label.trim())
    .filter(Boolean)
}

const splitLines = (raw) =>
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

/** The REST endpoint rather than `gh pr view --json files`: that one stops at
 * the first 100 files, this one paginates. */
const fetchChangedFiles = (prNumber) =>
  splitLines(
    gh([
      'api',
      '--paginate',
      `repos/${REPO}/pulls/${prNumber}/files`,
      '--jq',
      '.[].filename',
    ]),
  )

const readInputs = () => {
  const prArgIndex = process.argv.indexOf('--pr')
  const prArg = prArgIndex === -1 ? null : process.argv[prArgIndex + 1]
  const prNumber = prArg || process.env.PR_NUMBER

  // `--pr` reads everything from the API so any past PR can be replayed. In
  // CI the event payload is the source of truth for title, body and labels -
  // it is what triggered the run, and it costs no API call.
  let title, body, labels
  if (prArg) {
    const pr = JSON.parse(
      gh(['pr', 'view', prArg, '--repo', REPO, '--json', 'title,body,labels']),
    )
    title = pr.title || ''
    body = pr.body || ''
    labels = pr.labels.map((label) => label.name)
  } else {
    title = process.env.PR_TITLE || ''
    body = process.env.PR_BODY || ''
    labels = parseLabels(process.env.PR_LABELS)
  }

  // CHANGED_FILES is an override for driving the script by hand; CI leaves it
  // unset and the list is fetched from the PR.
  const files = process.env.CHANGED_FILES
    ? splitLines(process.env.CHANGED_FILES)
    : fetchChangedFiles(prNumber)

  return { prNumber, title, body, labels, files }
}

/** The component directory a /next path belongs to, or the file name for the
 * handful of files that sit directly in /next (index.ts, index.css). */
const componentOf = (file) => {
  const rest = file.slice(NEXT_SRC.length)
  const slash = rest.indexOf('/')
  return slash === -1 ? rest : rest.slice(0, slash)
}

const isApiFile = (file) =>
  file.startsWith(NEXT_SRC) &&
  !file.includes(SNAPSHOT_DIR) &&
  !NON_API_FILE.test(file)

/** Written to the job summary as well as the log, so a reviewer sees the
 * reason without opening the run. */
const report = (lines) => {
  console.log(lines.join('\n'))
  if (process.env.GITHUB_STEP_SUMMARY) {
    require('fs').appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `${lines.join('\n')}\n`,
    )
  }
}

const main = () => {
  const { prNumber, title, body, labels, files } = readInputs()

  const breaking = BREAKING_TITLE.test(title) || BREAKING_FOOTER.test(body)
  if (!breaking) {
    report([
      `✅ PR #${prNumber} is not marked breaking (no \`!\` in the title, no \`BREAKING CHANGE:\` footer) - nothing to check.`,
    ])
    return
  }

  const apiFiles = files.filter(isApiFile)
  if (apiFiles.length === 0) {
    report([
      '✅ Breaking, but no `/next` source file changed (tests, stories, docs and snapshots do not count) - nothing to check.',
    ])
    return
  }

  const components = [...new Set(apiFiles.map(componentOf))].sort()

  if (files.includes(PAGE)) {
    report([
      `✅ Breaking change to ${components.join(', ')}, and the breaking changes page was updated.`,
    ])
    return
  }

  if (labels.includes(SKIP_LABEL)) {
    report([
      `⚠️ Breaking change to ${components.join(', ')} with no entry on the breaking changes page, skipped by the \`${SKIP_LABEL}\` label.`,
      '',
      'Worth a second look in review: the label says this change has no consumer-visible surface.',
    ])
    return
  }

  report([
    `❌ This PR is marked breaking and changes ${components.join(', ')} under \`/next\`, but does not touch the breaking changes page.`,
    '',
    `Add or update the component's entry in \`${PAGE}\` - the Storybook page "${PAGE_TITLE}". It is the list consumers read to tell an intended change from a bug, and it has to say what changed, before and after.`,
    '',
    `If this change has no consumer-visible surface, add the \`${SKIP_LABEL}\` label and say why in the PR description.`,
    '',
    'Changed `/next` files:',
    ...apiFiles.map((file) => `- \`${file}\``),
  ])
  console.log(
    '::error::Breaking change to /next without an entry on the breaking changes page',
  )
  process.exitCode = 1
}

try {
  main()
} catch (error) {
  console.error(
    `Could not run the breaking changes page check: ${error.message}`,
  )
  process.exitCode = 1
}
