/**
 * Check the contrast of the documented colour pairings (#5382,
 * ADR-0016 § Confirmation 5).
 *
 * EDS measures colour pairs on two levels. WCAG 2.1 AA is the minimum
 * every pair must meet: 4.5:1 for text and 3:1 for icons, which WCAG
 * treats as non-text. The APCA targets are what EDS aims for: Lc 90 for
 * body text (`text.primary`) and Lc 60 for secondary text and
 * interactive elements, against `background.surface`, with `on-emphasis`
 * measured against its emphasis fill. The run fails on a pair below the
 * minimum, in either scheme or any state, and only lists the pairs below
 * their APCA target.
 *
 * The docs and the ADR give a target for some pairs only. The others
 * get Lc 60, the target for secondary text and interactive elements,
 * marked "assumed" in the output. Tertiary gets none, since it is meant
 * for places where WCAG does not require contrast.
 *
 * The pairs are the ones `foundation/colour/usage.mdx` documents in
 * § Foreground pairing and § Check for a dedicated role, for text and
 * icons alike:
 *
 * - `<text|icon>.on-<level>.<tone>` on the fill of the same level and
 *   tone, in every state of the interactive fills
 * - `<text|icon>.primary`, `.secondary` and `.tertiary` on
 *   `background.surface`. The usage page also puts them on
 *   `background.canvas`, but EDS measures against the surface only, as
 *   Confirmation 5 says
 * - `<text|icon>.primary` on the selected fills, in every state
 * - `<text|icon>.inverted` on `background.inverted`
 * - `<text|icon>.interactive.link.*` on `background.surface`, in every
 *   state. The usage page gives links no background, so they are
 *   measured against the surface like the text hierarchy
 *
 * Borders stay out of scope, as Confirmation 5 records: APCA has no
 * agreed target for them, and the border-to-surface pairs are not
 * documented.
 *
 * EXCEPTIONS lists the pairs the docs exclude from the minimum, each by
 * scheme, foreground and background, exactly as the docs list them. They
 * are reported with their values but do not fail the run. Any other state
 * or scheme of the same foreground still fails, so the docs cannot go out
 * of date without the run noticing. A listed pair that meets the minimum
 * is reported as a warning, so that it can be removed here and on the
 * docs page; the run must not fail because a pair got better.
 *
 * The values come from the generated TS modules
 * (`src/tokens/ts/semantic/{light,dark}.ts`), which hold every semantic
 * colour resolved per scheme and converted from OKLCH to sRGB hex with
 * the CSS Color 4 gamut mapping (see `generate-ts-tokens.mjs`). That is
 * the colour a consumer gets, and the hex in the report can be pasted
 * into any contrast checker. The modules are TypeScript, so this script
 * relies on Node's type stripping, which is on by default from Node
 * 22.18 (`.node-version` pins 24).
 *
 * The WCAG ratio uses the sRGB relative luminance of WCAG 2.1. The Lc
 * uses APCA-W3 0.0.98G-4g, the version colorjs.io implements and the
 * palette generator reports with. It is given as an absolute value,
 * because the targets apply to both polarities.
 *
 * It runs in `tokens_studio_release.yaml` after the TS modules are
 * generated and before the PR is created, so a release that breaks the
 * minimum opens no PR. Every finding is collected before reporting,
 * because the Actions log is the only place to read them.
 *
 * Usage: node scripts/check-contrast.mjs [--ts <dir>]
 */
import { access } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import process from 'node:process'

const args = parseArgs(process.argv.slice(2))
// Relative to the package, not the working directory, so the check also
// runs from the repository root without install or --ts
const TS_DIR =
  args.ts ?? fileURLToPath(new URL('../src/tokens/ts', import.meta.url))

const SCHEMES = ['light', 'dark']
const TONES = ['accent', 'neutral', 'info', 'success', 'warning', 'danger']
const STATES = ['default', 'hover', 'pressed']

/** WCAG 2.1 AA: 1.4.3 for text, 1.4.11 for icons. */
const MINIMUM = { text: 4.5, icon: 3 }
const BODY_TEXT_TARGET = 90
const TARGET = 60

/**
 * Documented pairs that do not have to meet the minimum, written as
 * `<scheme> <foreground> on <background>`. Each group names the page that
 * documents it; change the page and this list together.
 */
const EXCEPTIONS = [
  {
    name: 'tertiary in light',
    reason:
      'foundation/accessibility.md § Colour: text.tertiary and icon.tertiary fall below the minimum in light and are only for places where WCAG 2.1 does not require contrast, such as disabled controls',
    pairs: [
      'light text.tertiary on background.surface',
      'light icon.tertiary on background.surface',
    ],
  },
  {
    name: 'primary on accent selected',
    reason:
      'foundation/accessibility.md § Colour and foundation/colour/usage.mdx § Selected backgrounds: selected fills have no foreground of their own, and these states of text.primary and icon.primary on accent selected fall below the minimum',
    pairs: [
      'light text.primary on background.interactive.accent.selected.pressed',
      'dark text.primary on background.interactive.accent.selected.hover',
      'dark text.primary on background.interactive.accent.selected.pressed',
      'dark icon.primary on background.interactive.accent.selected.pressed',
    ],
  },
]
/** `<scheme> <foreground> on <background>` -> its exception group */
const exceptionFor = new Map(
  EXCEPTIONS.flatMap((group) => group.pairs.map((key) => [key, group])),
)

const semanticByScheme = Object.fromEntries(
  await Promise.all(
    SCHEMES.map(async (scheme) => [scheme, await loadSemantic(scheme)]),
  ),
)

const pairs = documentedPairs()
const failures = []
const excepted = []
const shortfalls = []
/** Listed exceptions that now meet the minimum */
const clearedExceptions = []
/** Listed exceptions the loop has met, to catch a typo in EXCEPTIONS */
const seenExceptions = new Set()

for (const scheme of SCHEMES) {
  for (const pair of pairs) {
    const foreground = lookup(semanticByScheme[scheme], pair.foreground)
    const background = lookup(semanticByScheme[scheme], pair.background)
    const key = `${scheme} ${pair.foreground} on ${pair.background}`
    const exception = exceptionFor.get(key)
    if (exception !== undefined) seenExceptions.add(key)
    const where = `${scheme.padEnd(5)}  ${pair.foreground} on ${pair.background}`

    const problem =
      colourProblem(pair.foreground, foreground) ??
      colourProblem(pair.background, background)
    if (problem !== undefined) {
      failures.push(`${where}: ${problem}`)
      continue
    }

    const ratio = wcagRatio(foreground, background)
    const lc = Math.abs(apcaContrast(foreground, background))
    const target =
      pair.target === null
        ? ''
        : ` (target Lc ${pair.target}${pair.assumed ? ', assumed' : ''})`
    const line = `${where}  ${foreground} on ${background}  ${ratio.toFixed(2)}:1 (minimum ${pair.minimum}:1)  Lc ${lc.toFixed(1)}${target}`

    if (ratio < pair.minimum) {
      if (exception === undefined) failures.push(line)
      else excepted.push(`${line}  [${exception.name}]`)
      continue
    }
    if (exception !== undefined)
      clearedExceptions.push(`${line}  [${exception.name}]`)
    if (pair.target !== null && lc < pair.target) shortfalls.push(line)
  }
}

for (const key of exceptionFor.keys())
  if (!seenExceptions.has(key))
    failures.push(
      `EXCEPTIONS lists "${key}", which is not a documented pair. Fix the entry in this script`,
    )

const checks = pairs.length * SCHEMES.length
console.log(
  `check-contrast: ${pairs.length} documented pairs in ${SCHEMES.join(' and ')} (${checks} checks). Minimum: WCAG 2.1 AA, ${MINIMUM.text}:1 for text and ${MINIMUM.icon}:1 for icons. Target: APCA Lc ${BODY_TEXT_TARGET} for text.primary on the surface, Lc ${TARGET} otherwise, none for tertiary; "assumed" marks a target the docs and ADR-0016 do not give.`,
)

if (excepted.length > 0) {
  console.log(
    `\nDocumented exceptions below the minimum (${excepted.length}, reported, not failed):\n  ${excepted.join('\n  ')}`,
  )
  for (const exception of EXCEPTIONS)
    console.log(`  [${exception.name}] ${exception.reason}`)
}

if (shortfalls.length > 0)
  console.log(
    `\nBelow the APCA target (${shortfalls.length}, reported, not failed):\n  ${shortfalls.join('\n  ')}`,
  )

if (clearedExceptions.length > 0)
  console.warn(
    `check-contrast: ${clearedExceptions.length} pair(s) listed in EXCEPTIONS now meet the minimum. Remove each one from EXCEPTIONS and from the page that documents it:\n  ${clearedExceptions.join('\n  ')}`,
  )

if (failures.length > 0)
  fail(
    `${failures.length} documented pair(s) below the WCAG 2.1 AA minimum or not measurable:\n  ${failures.join('\n  ')}`,
  )

console.log(
  `\ncheck-contrast: every documented pair meets the minimum, apart from the ${excepted.length} documented exception(s).`,
)

/** The pairs the usage page documents, for text and icons. */
function documentedPairs() {
  const list = []
  const add = (kind, role, background, target, assumed) =>
    list.push({
      foreground: `${kind}.${role}`,
      background,
      minimum: MINIMUM[kind],
      target,
      // Every icon target is assumed: the targets are given for text
      assumed: kind === 'icon' || assumed,
    })

  for (const kind of ['text', 'icon']) {
    for (const tone of TONES) {
      // ADR-0016 gives the target for on-emphasis only
      for (const level of ['muted', 'emphasis'])
        for (const state of STATES)
          add(
            kind,
            `on-${level}.${tone}`,
            `background.interactive.${tone}.${level}.${state}`,
            TARGET,
            level !== 'emphasis',
          )
      for (const level of ['muted', 'default', 'emphasis'])
        add(
          kind,
          `on-${level}.${tone}`,
          `background.non-interactive.${tone}.${level}`,
          TARGET,
          level !== 'emphasis',
        )
    }

    // Measured against the surface only (ADR-0016 Confirmation 5)
    add(
      kind,
      'primary',
      'background.surface',
      kind === 'text' ? BODY_TEXT_TARGET : TARGET,
      false,
    )
    add(kind, 'secondary', 'background.surface', TARGET, false)
    add(kind, 'tertiary', 'background.surface', null, false)

    // Selected fills exist for accent and neutral only. usage.mdx
    // § Selected backgrounds judges text.primary on them against Lc 60
    for (const tone of ['accent', 'neutral'])
      for (const state of STATES)
        add(
          kind,
          'primary',
          `background.interactive.${tone}.selected.${state}`,
          TARGET,
          false,
        )

    // No target is given for the inverted foregrounds
    add(kind, 'inverted', 'background.inverted', TARGET, true)

    // Links are interactive elements, which have Lc 60 as their target
    for (const state of STATES)
      add(
        kind,
        `interactive.link.${state}`,
        'background.surface',
        TARGET,
        false,
      )
  }
  return list
}

async function loadSemantic(scheme) {
  const file = resolve(join(TS_DIR, 'semantic', `${scheme}.ts`))
  await access(file).catch(() =>
    fail(
      `cannot read ${file}. Run "pnpm run generate:ts-tokens" (or pass --ts <dir>) before checking`,
    ),
  )
  const module = await import(pathToFileURL(file).href).catch((error) =>
    fail(
      error?.code === 'ERR_UNKNOWN_FILE_EXTENSION'
        ? `cannot import ${file}: this check needs Node 22.18 or later, which strips TypeScript types by default`
        : `cannot import ${file}: ${error?.message ?? error}`,
    ),
  )
  if (typeof module.semantic !== 'object' || module.semantic === null)
    fail(`${file} does not export a "semantic" object`)
  return module.semantic
}

/** `text.on-muted.accent` -> semantic.text.onMuted.accent */
function lookup(semantic, token) {
  return token
    .split('.')
    .map((segment) =>
      segment.replace(/-([a-z0-9])/g, (_, next) => next.toUpperCase()),
    )
    .reduce((node, key) => (node == null ? undefined : node[key]), semantic)
}

function colourProblem(token, value) {
  if (value === undefined)
    return `${token} does not exist. A token was renamed or removed, so update the pairs in this script and in usage.mdx § Foreground pairing`
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value))
    return `${token} is ${JSON.stringify(value)}, not an opaque #rrggbb colour (ADR-0016 D4), so it has no contrast value`
  return undefined
}

function channels(hex) {
  return [1, 3, 5].map(
    (start) => parseInt(hex.slice(start, start + 2), 16) / 255,
  )
}

/**
 * WCAG 2.1 relative luminance. The linearisation threshold is the sRGB
 * standard's 0.04045, which WCAG 2.2 also uses. WCAG 2.1 prints 0.03928,
 * a typo from an earlier sRGB draft. No 8-bit channel value lies between
 * the two, so the result is the same; do not change it to "match" 2.1.
 */
function relativeLuminance(hex) {
  const [red, green, blue] = channels(hex).map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function wcagRatio(foreground, background) {
  const [lighter, darker] = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

/** APCA-W3 0.0.98G-4g. Positive for dark text on light, negative for the reverse. */
function apcaContrast(text, background) {
  const luminance = (hex) => {
    const [red, green, blue] = channels(hex).map((channel) => channel ** 2.4)
    const y = 0.2126729 * red + 0.7151522 * green + 0.072175 * blue
    // Soft clamp near black
    return y > 0.022 ? y : y + (0.022 - y) ** 1.414
  }
  const textY = luminance(text)
  const backgroundY = luminance(background)
  if (Math.abs(backgroundY - textY) < 0.0005) return 0

  if (backgroundY > textY) {
    const contrast = (backgroundY ** 0.56 - textY ** 0.57) * 1.14
    return contrast < 0.1 ? 0 : (contrast - 0.027) * 100
  }
  const contrast = (backgroundY ** 0.65 - textY ** 0.62) * 1.14
  return contrast > -0.1 ? 0 : (contrast + 0.027) * 100
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '')
    const value = argv[i + 1]
    if (!key || !value) fail(`invalid arguments: ${argv.join(' ')}`)
    out[key] = value
  }
  return out
}

function fail(message) {
  console.error(`check-contrast: ${message}`)
  process.exit(1)
}
