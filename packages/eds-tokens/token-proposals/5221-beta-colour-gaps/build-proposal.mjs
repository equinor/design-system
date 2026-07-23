/**
 * Builds the import-ready Tokens Studio proposal sets for issue #5221.
 *
 * Reads the current pulled raw sets (`src/tokens/raw/`) and the evaluated
 * CSS export (`src/tokens/css/colors/default.css`), applies the proposed
 * additions/changes, and writes complete replacement set files to this
 * directory:
 *
 *   semantic.json        — fill group, surface tone equivalents, tone
 *                          text/border, collision fixes
 *   scheme/light.json    — alpha step twins added; duplicated concept
 *   scheme/dark.json       tokens (border-focus, border-disabled,
 *                          text-disabled) removed
 *
 * Alpha twins are explicit hex8 values (the platform only evaluates colour
 * formulas in the CSS export, so `modify` formulas are not an option). Each
 * twin is computed so that compositing it over white (light scheme) or
 * black (dark scheme) reproduces the opaque step exactly — the standard
 * alpha-scale construction (cf. Radix), which keeps alpha minimal. Over
 * the actual canvas (`neutral.1`, #f8f8f8 / #131414) the composite
 * deviates by at most a few 8-bit channel steps; the deviation is
 * reported per twin. Colour conversion uses the same oklch → sRGB math
 * (CSS Color 4 gamut mapping) as `scripts/generate-ts-tokens.mjs`.
 *
 * Deterministic and re-runnable: after a new `studio tokens pull`, run
 * `node build-proposal.mjs` again to rebase the proposal on fresh sets.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const TOKENS = join(HERE, '..', '..', 'src', 'tokens')

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

function fail(message) {
  console.error(`✖ ${message}`)
  process.exit(1)
}

/* ---------------------------------------------------------------- *
 * Colour math — copied from scripts/generate-ts-tokens.mjs so the
 * proposal uses exactly the same oklch → hex conversion as the
 * generated TS tokens (CSS Color 4 §13.2 gamut mapping).
 * ---------------------------------------------------------------- */

function oklabToLinearSrgb(lightness, a, b) {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

function linearSrgbToOklab([red, green, blue]) {
  const l = Math.cbrt(
    0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue,
  )
  const m = Math.cbrt(
    0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue,
  )
  const s = Math.cbrt(
    0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue,
  )
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

const inSrgbGamut = (linear) => linear.every((c) => c >= 0 && c <= 1)
const clip = (linear) => linear.map((c) => Math.min(1, Math.max(0, c)))

/** Linear sRGB → gamma-encoded 8-bit channels. */
function linearToChannels(linear) {
  return clip(linear).map((channel) => {
    const gamma =
      channel <= 0.0031308
        ? 12.92 * channel
        : 1.055 * channel ** (1 / 2.4) - 0.055
    return Math.round(gamma * 255)
  })
}

/** oklch(L C H) → [r, g, b] 8-bit, gamut-mapped like the CSS export. */
function oklchToChannels(value) {
  const match = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(value)
  if (!match) fail(`unsupported oklch form: ${value}`)
  const [lightness, chroma, hueDegrees] = match.slice(1).map(Number)
  if (lightness >= 1) return [255, 255, 255]
  if (lightness <= 0) return [0, 0, 0]
  const hue = (hueDegrees * Math.PI) / 180
  const toLinear = (c) =>
    oklabToLinearSrgb(lightness, c * Math.cos(hue), c * Math.sin(hue))

  const direct = toLinear(chroma)
  if (inSrgbGamut(direct)) return linearToChannels(direct)

  const JND = 0.02
  const EPSILON = 0.0001
  let low = 0
  let high = chroma
  while (high - low > EPSILON) {
    const mid = (low + high) / 2
    const mapped = toLinear(mid)
    if (inSrgbGamut(mapped)) {
      low = mid
    } else {
      const clipped = linearSrgbToOklab(clip(mapped))
      const candidate = [lightness, mid * Math.cos(hue), mid * Math.sin(hue)]
      const deltaE = Math.hypot(
        clipped[0] - candidate[0],
        clipped[1] - candidate[1],
        clipped[2] - candidate[2],
      )
      if (deltaE < JND) return linearToChannels(mapped)
      high = mid
    }
  }
  return linearToChannels(toLinear(low))
}

const toHex = (channels) =>
  `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`

/* ---------------------------------------------------------------- *
 * Token resolution — scheme alias ({neutral.3}) → colour set path
 * ({light.gray.3}) → evaluated oklch from the CSS export.
 * ---------------------------------------------------------------- */

/** Parse `--name: value;` declarations from a CSS export file. */
function parseCssVariables(css) {
  const variables = new Map()
  for (const match of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    variables.set(match[1], match[2].trim())
  }
  return variables
}

const evaluatedColors = parseCssVariables(
  readFileSync(join(TOKENS, 'css', 'colors', 'default.css'), 'utf8'),
)

/** Resolve a token path within one scheme set to 8-bit sRGB channels. */
function resolveToChannels(schemeSet, path) {
  let current = `{${path}}`
  const seen = new Set()
  while (true) {
    const reference = /^\{([\w.-]+)\}$/.exec(current)
    if (!reference) break
    if (seen.has(reference[1])) fail(`circular reference at {${reference[1]}}`)
    seen.add(reference[1])
    const segments = reference[1].split('.')
    let node = schemeSet
    for (const segment of segments) node = node?.[segment]
    if (node?.$value !== undefined) {
      current = node.$value
      continue
    }
    // Not in the scheme set — expect an evaluated colour in the CSS export
    const cssName = `eds-${segments.join('-')}`
    const evaluated = evaluatedColors.get(cssName)
    if (!evaluated) fail(`cannot resolve {${reference[1]}} (--${cssName})`)
    current = evaluated
  }
  if (current.startsWith('oklch(')) return oklchToChannels(current)
  if (/^#[0-9a-f]{6}$/i.test(current)) {
    return [1, 3, 5].map((i) => parseInt(current.slice(i, i + 2), 16))
  }
  return fail(`unsupported colour value: ${current}`)
}

/* ---------------------------------------------------------------- *
 * Alpha twin computation.
 *
 * Given opaque target T and background B (both 8-bit sRGB), find the
 * smallest alpha a (quantised to n/255 so the hex8 form is exact) and
 * base colour C such that compositing C at alpha a over B reproduces
 * T exactly: round(a·C + (1−a)·B) == T per channel. CSS composites
 * rgba over opaque backgrounds in gamma-encoded sRGB, so the math
 * happens on the 8-bit channels directly.
 * ---------------------------------------------------------------- */

function alphaTwin(target, background) {
  for (let step = 1; step <= 255; step++) {
    const alpha = step / 255
    const base = target.map((t, i) => {
      const c = Math.round((t - (1 - alpha) * background[i]) / alpha)
      return Math.min(255, Math.max(0, c))
    })
    const composite = base.map((c, i) =>
      Math.round(alpha * c + (1 - alpha) * background[i]),
    )
    if (composite.every((c, i) => c === target[i])) {
      return { alpha, base, hex8: toHex([...base, step]) }
    }
  }
  return fail(
    `no exact alpha twin for ${toHex(target)} over ${toHex(background)}`,
  )
}

/* ---------------------------------------------------------------- *
 * Proposal mutations.
 * ---------------------------------------------------------------- */

const RAW = join(TOKENS, 'raw')
const semantic = readJson(join(RAW, 'semantic.json'))
const schemes = {
  light: readJson(join(RAW, 'scheme', 'light.json')),
  dark: readJson(join(RAW, 'scheme', 'dark.json')),
}

const TONES = ['accent', 'neutral', 'danger']
const ALPHA_STEPS = [3, 7]

const colorToken = (value, scopes) => ({
  $value: value,
  $type: 'color',
  $extensions: { 'com.figma': { scopes } },
})
const hiddenColorToken = (value) => ({
  $value: value,
  $type: 'color',
  $extensions: { 'com.figma': { hiddenFromPublishing: true } },
})

const sortKeys = (object) =>
  Object.fromEntries(
    Object.entries(object).sort(([a], [b]) => a.localeCompare(b)),
  )

// 1. Alpha step twins in the scheme sets (explicit hex8 values), and
//    removal of the concept tokens that collide with the semantic layer.
const COMPOSITE_BASE = { light: [255, 255, 255], dark: [0, 0, 0] }
const twinReport = []
for (const [schemeName, schemeSet] of Object.entries(schemes)) {
  const base = COMPOSITE_BASE[schemeName]
  const canvas = resolveToChannels(schemeSet, 'neutral.1')
  for (const tone of TONES) {
    const group = {}
    for (const step of ALPHA_STEPS) {
      const target = resolveToChannels(schemeSet, `${tone}.${step}`)
      const twin = alphaTwin(target, base)
      group[step] = hiddenColorToken(twin.hex8)
      const overCanvas = twin.base.map((c, i) =>
        Math.round(twin.alpha * c + (1 - twin.alpha) * canvas[i]),
      )
      const canvasDelta = Math.max(
        ...overCanvas.map((c, i) => Math.abs(c - target[i])),
      )
      twinReport.push({
        scheme: schemeName,
        token: `${tone}-alpha.${step}`,
        value: twin.hex8,
        alpha: `${Math.round((twin.alpha ?? 0) * 1000) / 10}%`,
        matches: `${tone}.${step} = ${toHex(target)} over ${toHex(base)}`,
        canvasDelta: `±${canvasDelta}/255 over ${toHex(canvas)}`,
      })
    }
    schemeSet[`${tone}-alpha`] = group
  }
  delete schemeSet['border-focus']
  delete schemeSet['border-disabled']
  delete schemeSet['text-disabled']
}

// 2. Semantic fill group per tone (Button consumes steps 9/10/11 today;
//    disabled = alpha twin of step 3, replacing the legacy
//    bg-fill-emphasis-disabled pattern).
const FILL_SCOPES = ['FRAME_FILL', 'SHAPE_FILL']
semantic.background.fill = Object.fromEntries(
  TONES.map((tone) => [
    tone,
    {
      default: colorToken(`{${tone}.9}`, FILL_SCOPES),
      hover: colorToken(`{${tone}.10}`, FILL_SCOPES),
      pressed: colorToken(`{${tone}.11}`, FILL_SCOPES),
      disabled: colorToken(`{${tone}-alpha.3}`, FILL_SCOPES),
    },
  ]),
)
semantic.background = sortKeys(semantic.background)

// 3. Neutral/danger equivalents of the accent-only surface group,
//    mirroring the accent steps exactly.
const retone = (node, tone) =>
  JSON.parse(JSON.stringify(node).replaceAll('{accent.', `{${tone}.`))
for (const tone of ['neutral', 'danger']) {
  semantic.background.surface[tone] = retone(
    semantic.background.surface.accent,
    tone,
  )
}
semantic.background.surface = sortKeys(semantic.background.surface)

// 4. Tone text and border tokens (secondary/ghost Button consumes steps
//    12 and 8 today). text.accent currently points at {info.8} (link
//    blue) — repointed to the accent scale; link blue stays available
//    as text-link in the scheme sets.
semantic.text.accent.$value = '{accent.12}'
semantic.text.neutral = colorToken('{neutral.12}', ['TEXT_FILL'])
semantic.text.danger = colorToken('{danger.12}', ['TEXT_FILL'])
for (const tone of TONES) {
  semantic.border[tone] = colorToken(`{${tone}.8}`, ['STROKE_COLOR'])
}

// 5. Collision fixes — the semantic layer becomes the single owner of
//    border-focus / border-disabled / text-disabled. border.focus loses
//    its self-reference by aliasing {info.7} (light.blue.7 / dark.blue.7,
//    the exact values the removed concept token had). Disabled tokens
//    move to the alpha twins of step 7 (the value the scheme sets and
//    the legacy bundle used — the semantic set said 5/2, see README).
semantic.border.focus.$value = '{info.7}'
semantic.border.disabled.$value = '{neutral-alpha.7}'
semantic.text.disabled.$value = '{neutral-alpha.7}'
semantic.icon.disabled.$value = '{neutral-alpha.7}'
semantic.text = sortKeys(semantic.text)
semantic.border = sortKeys(semantic.border)

/* ---------------------------------------------------------------- *
 * Verification — every reference resolves, and no flattened CSS name
 * is declared by both the semantic set and a scheme set.
 * ---------------------------------------------------------------- */

function* leaves(node, path = []) {
  if (node && typeof node === 'object') {
    if (node.$value !== undefined) {
      yield [path.join('.'), node.$value]
    } else {
      for (const [key, value] of Object.entries(node)) {
        yield* leaves(value, [...path, key])
      }
    }
  }
}

let referenceCount = 0
for (const [schemeName, schemeSet] of Object.entries(schemes)) {
  const combined = { ...schemeSet, ...semantic }
  for (const [path, value] of leaves(combined)) {
    for (const match of String(value).matchAll(/\{([\w.-]+)\}/g)) {
      referenceCount += 1
      const segments = match[1].split('.')
      let node = combined
      for (const segment of segments) node = node?.[segment]
      if (node?.$value === undefined) {
        const cssName = `eds-${segments.join('-')}`
        if (!evaluatedColors.has(cssName)) {
          fail(`[${schemeName}] ${path}: unresolved reference {${match[1]}}`)
        }
      }
    }
  }
  const flat = (set) =>
    new Set([...leaves(set)].map(([p]) => p.replaceAll('.', '-')))
  const collisions = [...flat(semantic)].filter((name) =>
    flat(schemeSet).has(name),
  )
  if (collisions.length > 0) {
    fail(
      `[${schemeName}] flattened CSS name collisions: ${collisions.join(', ')}`,
    )
  }
}

/* ---------------------------------------------------------------- *
 * Write output.
 * ---------------------------------------------------------------- */

const write = (relative, data) => {
  const path = join(HERE, relative)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`wrote ${relative}`)
}

write('semantic.json', sortKeys(semantic))
write('scheme/light.json', sortKeys(schemes.light))
write('scheme/dark.json', sortKeys(schemes.dark))

console.log(
  `\n${referenceCount} references verified, no CSS name collisions.\n`,
)
console.table(twinReport)
