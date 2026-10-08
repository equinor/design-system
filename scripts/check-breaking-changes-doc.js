#!/usr/bin/env node

/**
 * Checks that a pull request moving a published /next component's surface also
 * says what changed on the breaking changes page.
 *
 * The page (packages/eds-core-react/stories/docs/BreakingChanges.mdx) answers
 * one question per component: what does an EDS 1.0 consumer meet in 2.0? It is
 * what the migration guide grows out of at graduation (#5387). It is not a
 * changelog - a change from one beta to the next is recorded in the commit and
 * the pull request, not on the page.
 *
 * What the page cannot survive is going stale about 2.0. The answer it gives
 * has a before and an after, and every beta changes the after. Four `fix!` PRs
 * moved a published API without revisiting it (#5410, #5409, #5127, #5509) and
 * two more did it without even the `!` (#5479, #5406), so the page described
 * beta.1 behaviour well into beta.2 and #5455 had to correct nine entries at
 * once. See #5572.
 *
 * Marking a PR breaking is therefore the wrong thing to key on. What matters
 * is whether the PR moved a published component's surface, because that is
 * what the section describes. It fails when both hold:
 *
 *   1. The diff changes a `.ts` or `.tsx` file belonging to a component
 *      the /next barrel exports - including one this very PR exports for the
 *      first time, which is how a new component gets its first section. That
 *      is the API and markup a consumer sees.
 *      Tests, stories, docs, snapshots and Code Connect files are not, and
 *      neither is CSS on its own: the page does not track colour, spacing or
 *      the type scale, and a class rename has to pass through the `.tsx` that
 *      applies it.
 *   2. The breaking changes page is not in the diff.
 *
 * A PR that does mark itself breaking is held to a wider rule - every /next
 * file bar the excluded ones, CSS included - because it has already said that
 * something consumers can see moved.
 *
 * Escape hatch: the `skip-breaking-changes-doc` label, for a change that moves
 * the component without changing the answer - an internal refactor, or undoing
 * something the beta introduced and 1.0 never had. Using it leaves a warning
 * annotation on the check, so the claim shows up in review rather than only in
 * the job log.
 *
 * Blind spots. It checks that the page is in the diff, not that the right
 * section is: a PR touching Button and editing the Tooltip section passes. A
 * plain `fix:` that retires a known issue still leaves the stale entry behind
 * - #5571 covers that direction. And the title read here is the pull request
 * title, while the squash merge dialog lets that title be edited on the way
 * in: a `!` typed there lands in the commit without retriggering this
 * workflow. That one costs little now - since `!` only widens the net rather
 * than switching the check on, a late `!` cannot let a surface change through
 * unseen.
 *
 * Companion: check-breaking-changes-coverage.js asks whether the page covers
 * every published component at all. This one asks whether a change reached it.
 *
 * Run in CI by .github/workflows/breaking-changes-doc-check.yml, which passes
 * the PR title, body and labels through the environment. Run it by hand
 * against any PR with `node scripts/check-breaking-changes-doc.js --pr 5410`,
 * which reads the same values through `gh`.
 */

const { execFileSync } = require('child_process')
const { publishedComponents } = require('./check-breaking-changes-coverage')

const NEXT_SRC = 'packages/eds-core-react/src/components/next/'
const PAGE = 'packages/eds-core-react/stories/docs/BreakingChanges.mdx'
const PAGE_TITLE = 'EDS 2.0 (beta) / Breaking changes'
const SKIP_LABEL = 'skip-breaking-changes-doc'

const REPO = process.env.GITHUB_REPOSITORY || 'equinor/design-system'

// Files under NEXT_SRC that cannot change the API or markup a consumer sees.
// Keeps the check off PRs that only touch stories, tests, docs or the Figma
// Code Connect mappings, which nothing in the package exports.
// `.mdx?` covers both the component `.docs.mdx` files and any plain `.md`.
const NON_API_FILE =
  /(\.test\.tsx?|\.stories\.tsx?|\.figma\.tsx|\.mdx?|\.snap)$/
const SNAPSHOT_DIR = '__snapshots__/'

// The narrower set used when the PR has not marked itself breaking: the code,
// as opposed to the look of it. Every `.ts` and `.tsx` left after NON_API_FILE
// counts, which means the per-component `index.ts` barrels and hooks such as
// `Field/useFieldIds.ts` - that one sets the ids on five components and is the
// contract the page's id bullet describes (#5564). CSS is deliberately out:
// the page does not track colour, spacing or the type scale, and the class
// names it does track are applied in the `.tsx`.
const SURFACE_FILE = /\.tsx?$/

// A dependency bump never changes an API on purpose, but it does drag lint
// fixes through component files: #5163 reformatted four of them. Dependabot
// cannot label its own pull request, so without this the weekly rotation pays
// for it. A bump that does change behaviour is a review problem, not a page
// entry. Nothing else is exempt - release pull requests touch only CHANGELOG
// and version files, which these rules already leave alone.
const BOT_AUTHORS = new Set(['dependabot[bot]'])

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
 * the first 100 files, this one paginates.
 *
 * `previous_filename` is read too, because a rename reports only the new path.
 * A component moved out of /next - what graduation looks like - would
 * otherwise not register as a /next change at all. */
const fetchChangedFiles = (prNumber) =>
  splitLines(
    gh([
      'api',
      '--paginate',
      `repos/${REPO}/pulls/${prNumber}/files`,
      '--jq',
      '.[] | .filename, (.previous_filename // empty)',
    ]),
  )

const readInputs = () => {
  const prArgIndex = process.argv.indexOf('--pr')
  const prArg = prArgIndex === -1 ? null : process.argv[prArgIndex + 1]
  const prNumber = prArg || process.env.PR_NUMBER
  const filesOverride = process.env.CHANGED_FILES

  // Said here rather than failing later on a request for pulls/undefined/files.
  if (!prNumber && !filesOverride) {
    throw new Error(
      'no pull request to check - pass `--pr <number>`, or set PR_NUMBER (CI does) or CHANGED_FILES',
    )
  }

  // `--pr` reads everything from the API so any past PR can be replayed. In
  // CI the event payload is the source of truth for title, body and labels -
  // it is what triggered the run, and it costs no API call.
  let title, body, labels, author
  if (prArg) {
    const pr = JSON.parse(
      gh([
        'pr',
        'view',
        prArg,
        '--repo',
        REPO,
        '--json',
        'title,body,labels,author',
      ]),
    )
    title = pr.title || ''
    body = pr.body || ''
    labels = pr.labels.map((label) => label.name)
    author = pr.author?.login || ''
  } else {
    title = process.env.PR_TITLE || ''
    body = process.env.PR_BODY || ''
    labels = parseLabels(process.env.PR_LABELS)
    author = process.env.PR_AUTHOR || ''
  }

  // CHANGED_FILES is an override for driving the script by hand; CI leaves it
  // unset and the list is fetched from the PR.
  const files = filesOverride
    ? splitLines(filesOverride)
    : fetchChangedFiles(prNumber)

  return { prNumber, title, body, labels, author, files }
}

/** The component directory a /next path belongs to, or the file name for the
 * handful of files that sit directly in /next (index.ts, index.css). */
const componentOf = (file) => {
  const rest = file.slice(NEXT_SRC.length)
  const slash = rest.indexOf('/')
  return slash === -1 ? rest : rest.slice(0, slash)
}

/** Shared code under /next rather than a component: `utils/selectOptions.ts`
 * is Select's and Autocomplete's option handling. Components are PascalCase by
 * the naming convention in AGENTS.md, so a lower-case directory is shared, and
 * a new one counts without anyone remembering to list it here. */
const isSharedDir = (file) => {
  const dir = componentOf(file)
  return dir !== file.slice(NEXT_SRC.length) && /^[a-z]/.test(dir)
}

const isApiFile = (file) =>
  file.startsWith(NEXT_SRC) &&
  !file.includes(SNAPSHOT_DIR) &&
  !NON_API_FILE.test(file)

/** Narrower than isApiFile, and limited to components the barrel exports.
 *
 * The barrel is read from the checkout, which on a pull request is its head:
 * a PR that adds a component and exports it in one go is caught by the same
 * run. Before that export the component reaches nobody and its API is still
 * moving, so a section written then would only go stale - and it cannot slip
 * past, because check-breaking-changes-coverage.js fails the moment an export
 * has no section. Foundation and the other unexported directories stay out
 * for the same reason. */
const isSurfaceFile = (file, published) =>
  isApiFile(file) &&
  SURFACE_FILE.test(file) &&
  (published.has(componentOf(file)) || isSharedDir(file))

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
  const { prNumber, title, body, labels, author, files } = readInputs()

  if (BOT_AUTHORS.has(author)) {
    report([`✅ Opened by ${author} - not a deliberate API change.`])
    return
  }

  const breaking = BREAKING_TITLE.test(title) || BREAKING_FOOTER.test(body)
  const published = publishedComponents()

  // Marking the PR breaking widens the net rather than switching the check on:
  // the author has already said something consumers can see moved, so CSS and
  // the barrel count too.
  const changed = breaking
    ? files.filter(isApiFile)
    : files.filter((file) => isSurfaceFile(file, published))

  if (changed.length === 0) {
    const subject = prNumber ? `PR #${prNumber}` : 'This change'
    report([
      breaking
        ? '✅ Breaking, but no `/next` source file changed (tests, stories, docs, snapshots and Code Connect files do not count) - nothing to check.'
        : `✅ ${subject} changes no props or markup of a \`/next\` component the package exports - nothing to check.`,
    ])
    return
  }

  // Shared code names its directory, not a component, so it is listed apart:
  // the author is the one who knows which sections it reaches.
  const named = changed.filter((file) => !isSharedDir(file))
  const shared = [...new Set(changed.filter(isSharedDir).map(componentOf))]
  const components = [...new Set(named.map(componentOf))].sort()
  const subjects = [
    ...components,
    ...shared.map((dir) => `shared \`${dir}/\``),
  ].join(', ')
  const what = breaking
    ? `Breaking change to ${subjects}`
    : `${subjects} changed under \`/next\``

  if (files.includes(PAGE)) {
    report([`✅ ${what}, and the breaking changes page was updated.`])
    return
  }

  if (labels.includes(SKIP_LABEL)) {
    report([
      `⚠️ ${what} with nothing added to the breaking changes page, skipped by the \`${SKIP_LABEL}\` label.`,
      '',
      'Worth a second look in review: the label says this PR leaves the EDS 1.0 to 2.0 answer unchanged.',
    ])
    // An annotation as well as the summary: the check goes green either way,
    // and a green check nobody opens is how the label turns into a habit.
    console.log(
      `::warning::/next changed with no entry on the breaking changes page, skipped by the ${SKIP_LABEL} label`,
    )
    return
  }

  report([
    `❌ ${what}, but the breaking changes page is not in this diff.`,
    '',
    `The page answers one question per component - what an EDS 1.0 consumer meets in 2.0 - and becomes the migration guide at graduation. Update the \`## <Component>\` section in \`${PAGE}\`, the Storybook page "${PAGE_TITLE}", so it describes 2.0 as it now stands: props, composition, markup, behaviour.`,
    '',
    'Describe the component, not the beta. Going from one beta to the next is not what the page is for - say that in this PR description and the commit message instead.',
    ...(shared.length
      ? [
          '',
          `Shared code changed too. Update the section of every component that uses ${shared.map((dir) => `\`${dir}/\``).join(', ')}.`,
        ]
      : []),
    '',
    `If the EDS 1.0 to 2.0 answer is unchanged by this PR, add the \`${SKIP_LABEL}\` label and say why.`,
    '',
    'Changed `/next` files:',
    ...changed.map((file) => `- \`${file}\``),
  ])
  console.log(
    '::error::A published /next component changed without an entry on the breaking changes page',
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
