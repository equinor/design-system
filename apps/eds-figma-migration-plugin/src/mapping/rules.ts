/**
 * The mapping from variables in the deprecated EDS libraries to variables and
 * text styles in EDS Foundation [EDS Beta]. docs/mapping-rules.md is the
 * source; each rule below names the section it implements.
 *
 * Every old variable resolves to one of three outcomes:
 * - sure: one target, from the name alone
 * - check: the target depends on the role of the layer; the first candidate
 *   is the proposal, and a designer confirms it before it is applied
 * - none: no equivalent, since the EDS Beta has no token for it, which is a
 *   gap in the tokens. The first candidate is a stand-in (see Stand-ins
 *   below), applied only once a designer chooses it or another target
 */
import { colourDistance } from './colour-distance'
import { targetDensity } from './density'
import type { Density } from './density'
import {
  getNewTextStyle,
  getNewVariable,
  NEW_TEXT_STYLES,
  NEW_VARIABLES,
  OLD,
  oldCollectionInfo,
} from './inventory'
import {
  CLEAR_VALUE,
  literalTarget,
  literalValue,
  opacityTarget,
} from './literal'
import { guessRole, isDivider, nearNamesMatch, roleNameMatches } from './role'
import type { RoleGuess } from './role'
import { targetScheme } from './scheme'
import type {
  BindingKind,
  FillUnder,
  ModeInput,
  ModeResolution,
  OldVariable,
  Resolution,
  RoleContext,
  TypographyInput,
} from './types'

export const TONES = [
  'neutral',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
] as const
export type Tone = (typeof TONES)[number]

/** The new spacing steps, smallest first. */
export const SPACING_STEPS = [
  'none',
  '4xs',
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
]

/** Type steps, smallest first, for finding the nearest step a role has. */
const TYPE_STEPS = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
]

/** Never proposed: removed from Tokens Studio and eds-tokens (#5846). */
export const FORBIDDEN_TARGETS = ['background/backdrop']

const MISSING_NOTE = 'is not in EDS Foundation'

// ---------------------------------------------------------------------------
// Outcome helpers

/** A sure outcome from a list of candidates, the first being the target. */
function sureOf(
  candidates: string[],
  reason: string,
  rule: string,
): Resolution {
  return { ...sure(candidates[0], reason, rule), candidates }
}

function sure(candidate: string, reason: string, rule: string): Resolution {
  return { outcome: 'sure', candidates: [candidate], reason, rule }
}

function check(candidates: string[], reason: string, rule: string): Resolution {
  return {
    outcome: 'check',
    candidates: [...new Set(candidates)],
    reason,
    rule,
  }
}

function none(reason: string, rule: string): Resolution {
  return { outcome: 'none', candidates: [], reason, rule }
}

/** Sure when nothing points to a role that would change the target, check otherwise. */
function byRole(
  guess: RoleGuess,
  candidates: string[],
  reason: string,
  rule: string,
): Resolution {
  return guess.signal
    ? check(candidates, `${reason} (${guess.because})`, rule)
    : sure(candidates[0], reason, rule)
}

/**
 * Drops candidates that do not exist in EDS Foundation, and the forbidden
 * ones. A rule that names a missing target is a bug, so the reason says so;
 * the tests fail on that note. When no candidate is left, the outcome is
 * none, and resolveVariable and resolveTypography propose a stand-in
 * instead.
 */
function finalise(
  resolution: Resolution,
  exists: (name: string) => boolean,
): Resolution {
  const missing = resolution.candidates.filter(
    (name) => !exists(name) || FORBIDDEN_TARGETS.includes(name),
  )
  if (missing.length === 0) return resolution
  const candidates = resolution.candidates.filter(
    (name) => !missing.includes(name),
  )
  const note = `${missing.join(', ')} ${MISSING_NOTE}`
  if (candidates.length === 0) {
    return none(`${resolution.reason}; ${note}`, resolution.rule)
  }
  return {
    ...resolution,
    outcome:
      resolution.outcome === 'sure' &&
      missing.includes(resolution.candidates[0])
        ? 'check'
        : resolution.outcome,
    candidates,
    reason: `${resolution.reason}; ${note}`,
  }
}

// ---------------------------------------------------------------------------
// Colour (mapping-rules.md § 4)

type ParsedColour = {
  group: 'Bg' | 'Border' | 'Text'
  /** Undefined for the single-purpose `Concept` variables */
  tone?: Tone
  /** Where the tone came from, for the reason */
  toneFrom?: 'name' | 'mode'
  /** The rest of the name, with `Fill Muted` written as `Fill/Muted` */
  slot: string
}

function isTone(value: string): value is Tone {
  return (TONES as readonly string[]).includes(value)
}

function appearanceTone(context: RoleContext): Tone {
  const mode = context.modes[OLD.appearance]?.toLowerCase()
  return mode && isTone(mode) ? mode : 'neutral'
}

function parseColour(
  variable: OldVariable,
  context: RoleContext,
): ParsedColour | null {
  const [group, ...rest] = variable.name.split('/')
  if (group !== 'Bg' && group !== 'Border' && group !== 'Text') return null
  const normalise = (parts: string[]) =>
    parts.join('/').replace(/^Fill (Emphasis|Muted)\b/, 'Fill/$1')

  if (variable.collectionKey === OLD.staticSemantic) {
    const tone = rest[0]?.toLowerCase()
    if (!tone || !isTone(tone)) return null
    return { group, tone, toneFrom: 'name', slot: normalise(rest.slice(1)) }
  }
  if (variable.collectionKey === OLD.appearance) {
    return {
      group,
      tone: appearanceTone(context),
      toneFrom: 'mode',
      slot: normalise(rest),
    }
  }
  if (
    variable.collectionKey === OLD.staticConcept ||
    variable.collectionKey === OLD.dynamicConcept
  ) {
    return { group, slot: normalise(rest) }
  }
  return null
}

function toneNote(parsed: ParsedColour): string {
  return parsed.toneFrom === 'mode'
    ? `, tone ${parsed.tone} from the 🎨 Appearance mode`
    : ''
}

function stateSuffix(guess: RoleGuess): 'default' | 'hover' | 'pressed' {
  return guess.state === 'hover' || guess.state === 'pressed'
    ? guess.state
    : 'default'
}

/** A colour name no rule recognises. */
function noColourRule(name: string): Resolution {
  return none(
    `No rule for ${name}: the plugin knows no EDS Beta token for it`,
    'colour/unknown',
  )
}

function resolveBackground(
  parsed: ParsedColour,
  context: RoleContext,
): Resolution {
  const { slot } = parsed
  if (slot === 'Floating') {
    return sure('background/floating', 'Bg/Floating', 'colour/plane')
  }
  if (slot === 'Input') {
    return sure('background/input', 'Bg/Input', 'colour/plane')
  }
  if (slot === 'Disabled' || /^Fill\/(Emphasis|Muted)\/Disabled$/.test(slot)) {
    return sure(
      'background/interactive/disabled',
      'A disabled fill',
      'colour/plane',
    )
  }
  // The dimmed layer behind a dialog is the scrim's role, not a background
  // (background/backdrop was removed in #5846). A check, since the docs have
  // not settled backdrop and scrim yet (decided 2026-11-12).
  if (slot === 'Backdrop') {
    return check(
      ['overlay/scrim'],
      'Bg/Backdrop dims what is behind a dialog, which is the role of overlay/scrim; the docs have not settled the scrim yet, and its opacity differs between Figma and the docs',
      'colour/backdrop',
    )
  }

  const tone = parsed.tone
  if (!tone) return noColourRule(`Bg/${slot}`)
  const guess = guessRole(context)

  if (slot === 'Canvas' || slot === 'Surface') {
    const target =
      tone === 'neutral'
        ? `background/${slot.toLowerCase()}`
        : `background/non-interactive/${tone}/${slot === 'Canvas' ? 'muted' : 'default'}`
    // On an interactive element, the neutral canvas becomes the ghost-control
    // fill: background/interactive/neutral/muted is the canvas colour at rest,
    // with hover and pressed states (decided 2026-11-12).
    if (
      guess.role === 'interactive' &&
      slot === 'Canvas' &&
      tone === 'neutral'
    ) {
      const ghost =
        guess.state === 'disabled'
          ? 'background/interactive/disabled'
          : `background/interactive/neutral/muted/${guess.state === 'focus' ? 'hover' : guess.state}`
      return check(
        [ghost, target],
        `Bg/Canvas on an interactive element: the ghost-control fill, which is the canvas colour at rest and has hover and pressed states (${guess.because})`,
        'colour/canvas-interactive',
      )
    }
    // There is no interactive surface, or toned canvas. The plane is proposed
    // anyway, so a designer can confirm it instead of leaving the old
    // binding, for example on a table row filled with the surface.
    if (guess.role === 'interactive') {
      return check(
        [target],
        `Bg/${slot} on an interactive element, which has no interactive equivalent (${guess.because})${toneNote(parsed)}`,
        'colour/plane-interactive',
      )
    }
    return sure(target, `${slot}${toneNote(parsed)}`, 'colour/plane')
  }

  const fill = /^Fill\/(Emphasis|Muted)\/(Default|Hover|Active)$/.exec(slot)
  if (!fill) return noColourRule(`Bg/${slot}`)
  const level = fill[1].toLowerCase()
  const oldState = fill[2]
  const interactive = (state: string) =>
    `background/interactive/${tone}/${level}/${state}`
  const nonInteractive = `background/non-interactive/${tone}/${level}`
  const oldStateAsNew = oldState === 'Active' ? 'pressed' : 'default'

  if (guess.selected) {
    // Only accent and neutral have a selected level: selection is a UI
    // state, not a semantic condition (usage.mdx). A toned element keeps its
    // tone at the legacy level in the default state, as the Beta Chip does,
    // which shows selection with a check icon (decided 2026-11-12).
    if (tone !== 'accent' && tone !== 'neutral') {
      return check(
        [interactive(oldState === 'Hover' ? 'hover' : 'default')],
        `Selected element in ${tone} (${guess.because}): only accent and neutral have a selected level, since selection is a UI state. The element keeps its tone, and its selection has to show another way, as the Beta Chip does with a check icon`,
        'colour/selected-tone',
      )
    }
    const state = oldState === 'Hover' ? 'hover' : stateSuffix(guess)
    return check(
      [
        `background/interactive/${tone}/selected/${state}`,
        interactive(oldState === 'Hover' ? 'hover' : oldStateAsNew),
      ],
      `Selected element (${guess.because}): selected fill, whatever the legacy fill was${toneNote(parsed)}`,
      'colour/selected',
    )
  }

  if (oldState === 'Default') {
    if (guess.role === 'interactive') {
      return check(
        [interactive('default'), nonInteractive],
        `Interactive element (${guess.because})${toneNote(parsed)}`,
        'colour/fill-role',
      )
    }
    return byRole(
      guess,
      [nonInteractive, interactive('default')],
      `Not interactive${toneNote(parsed)}`,
      'colour/fill-role',
    )
  }

  // Hover and Active only exist on interactive elements. On a layer named as
  // non-interactive the fill and the name contradict each other; the fill is
  // trusted and a designer settles it (decided 2026-11-12).
  if (guess.keyword === 'non-interactive' && guess.role === 'non-interactive') {
    return check(
      [interactive(oldState === 'Hover' ? 'hover' : 'pressed'), nonInteractive],
      `${oldState} fill on an element named as not interactive (${guess.because}): the fill has a state, so it is proposed as interactive; the static fill is the other option${toneNote(parsed)}`,
      'colour/fill-state-non-interactive',
    )
  }
  if (oldState === 'Hover') {
    return sure(
      interactive('hover'),
      `Hover fill${toneNote(parsed)}`,
      'colour/fill-state',
    )
  }
  if (level === 'emphasis') {
    return sure(
      interactive('pressed'),
      `Active is pressed${toneNote(parsed)}`,
      'colour/fill-state',
    )
  }
  return check(
    tone === 'accent' || tone === 'neutral'
      ? [
          interactive('pressed'),
          `background/interactive/${tone}/selected/default`,
        ]
      : [interactive('pressed')],
    `Fill Muted/Active was often used for selection; nothing in the names says selected, so pressed is proposed${toneNote(parsed)}`,
    'colour/fill-muted-active',
  )
}

function resolveBorder(parsed: ParsedColour, context: RoleContext): Resolution {
  const { slot, tone } = parsed
  if (slot === 'Focus') {
    return sure('border/interactive/focus', 'Border/Focus', 'colour/plane')
  }
  if (slot === 'Disabled') {
    return sure(
      'border/interactive/disabled',
      'Border/Disabled',
      'colour/plane',
    )
  }
  const levels: Record<string, string> = {
    Subtle: 'muted',
    Medium: 'default',
    Strong: 'emphasis',
  }
  if (!tone || !(slot in levels)) return noColourRule(`Border/${slot}`)
  const nonInteractive = `border/non-interactive/${tone}/${levels[slot]}`

  if (isDivider(context)) {
    return sure(
      nonInteractive,
      `A stroke on one side only is a divider, which is not interactive${toneNote(parsed)}`,
      'colour/border-divider',
    )
  }
  const guess = guessRole(context)
  if (guess.role === 'non-interactive') {
    const interactiveLevel = slot === 'Strong' ? 'emphasis' : 'muted'
    return byRole(
      guess,
      [
        nonInteractive,
        `border/interactive/${tone}/${interactiveLevel}/${stateSuffix(guess)}`,
      ],
      `Not interactive${toneNote(parsed)}`,
      'colour/border-role',
    )
  }

  const state = stateSuffix(guess)
  const muted = `border/interactive/${tone}/muted/${state}`
  const emphasis = `border/interactive/${tone}/emphasis/${state}`
  const because = `Interactive element (${guess.because})${toneNote(parsed)}`
  if (slot === 'Subtle') {
    return check([muted, nonInteractive], because, 'colour/border-role')
  }
  if (slot === 'Strong') {
    return check([emphasis, nonInteractive], because, 'colour/border-role')
  }
  if (roleNameMatches(context, 'outlineControls')) {
    return check(
      [emphasis, muted],
      `${because}: the border is the outline of the control`,
      'colour/border-medium-outline',
    )
  }
  if (roleNameMatches(context, 'fieldControls')) {
    return check(
      [muted, emphasis],
      `${because}: the outline of an input, field or checkbox`,
      'colour/border-medium-field',
    )
  }
  // A border on a clickable card, row or tile is rarely its main outline, so
  // the quieter level is proposed (decided 2026-11-12).
  return check(
    [muted, emphasis],
    `Border/Medium on an interactive element that is neither an outlined control nor a field (${guess.because}): the quieter interactive border is proposed, with emphasis as the other option`,
    'colour/border-medium-other',
  )
}

/** What the fill under a text or icon is, as the text rules need it. */
type SurfaceKind = 'plain' | 'tinted' | 'emphasis' | 'state-only'

function classifyFillUnder(fillUnder: FillUnder | undefined): {
  kind: SurfaceKind
  because: string
  /** False when no fill was found under the text, or it could not be resolved */
  found?: boolean
} {
  if (!fillUnder) return { kind: 'plain', because: 'no fill under it' }
  let target = fillUnder.newVariableName
  if (!target && fillUnder.oldVariable) {
    const resolution = resolveVariable({
      kind: 'fill',
      variable: fillUnder.oldVariable,
      context: fillUnder.context,
    })
    // A stand-in waits for a designer, so it does not decide the text.
    if (resolution.outcome !== 'none') target = resolution.candidates[0]
  }
  const owner = fillUnder.context.names[0] ?? 'the layer'
  const on = target ? `${target} on “${owner}”` : `the fill of “${owner}”`
  if (!target) return { kind: 'plain', because: `it sits on ${on}` }
  return { ...classifyTarget(target, on), found: true }
}

function classifyTarget(
  target: string,
  on: string,
): { kind: SurfaceKind; because: string } {
  if (/\/selected\//.test(target)) {
    return { kind: 'tinted', because: `it sits on a selected fill, ${on}` }
  }
  if (/emphasis/.test(target)) {
    return { kind: 'emphasis', because: `it sits on an emphasis fill, ${on}` }
  }
  if (
    /^background\/interactive\/[a-z]+\/muted\/(hover|pressed)$/.test(target)
  ) {
    return {
      kind: 'state-only',
      because: `it sits on ${on}, a hover or pressed fill on a control with no fill in its default state`,
    }
  }
  if (
    /^background\/interactive\/[a-z]+\/muted\/default$/.test(target) ||
    /^background\/non-interactive\/[a-z]+\/(muted|default)$/.test(target)
  ) {
    return { kind: 'tinted', because: `it sits on a tinted fill, ${on}` }
  }
  return { kind: 'plain', because: `it sits on ${on}` }
}

function resolveTextColour(
  parsed: ParsedColour,
  context: RoleContext,
): Resolution {
  const { slot, tone } = parsed
  if (slot === 'Link') {
    const guess = guessRole(context)
    const state = stateSuffix(guess)
    return state === 'default'
      ? sure('text/interactive/link/default', 'Text/Link', 'colour/text-link')
      : check(
          [`text/interactive/link/${state}`, 'text/interactive/link/default'],
          `Text/Link in the ${state} state (${guess.because})`,
          'colour/text-link',
        )
  }
  if (slot === 'Disabled') {
    return sure('text/interactive/disabled', 'Text/Disabled', 'colour/plane')
  }
  if (!tone) return noColourRule(`Text/${slot}`)

  if (slot === 'Strong on emphasis') {
    return sure(
      `text/on-emphasis/${tone}`,
      `Strong on emphasis${toneNote(parsed)}`,
      'colour/text-on-emphasis',
    )
  }
  // One foreground per tone on an emphasis fill now; the subtle level is
  // gone, and the docs give the target, so it is sure (decided 2026-11-12).
  if (slot === 'Subtle on emphasis') {
    return sure(
      `text/on-emphasis/${tone}`,
      `Subtle on emphasis: there is one foreground per tone on an emphasis fill now, so the text is as strong as Strong on emphasis${toneNote(parsed)}`,
      'colour/text-subtle-on-emphasis',
    )
  }
  if (slot !== 'Strong' && slot !== 'Subtle') {
    return noColourRule(`Text/${slot}`)
  }
  if (tone === 'neutral') {
    return sure(
      slot === 'Strong' ? 'text/primary' : 'text/secondary',
      `Neutral ${slot}${toneNote(parsed)}`,
      'colour/text-neutral',
    )
  }

  const surface = classifyFillUnder(context.fillUnder)
  const subtleNote =
    slot === 'Subtle'
      ? '; the subtle level has no direct equivalent, so the Strong rule is used'
      : ''
  const onDefault = `text/on-default/${tone}`
  const onMuted = `text/on-muted/${tone}`
  const reason = `Text is named for what ${surface.because}${toneNote(parsed)}${subtleNote}`
  // Sure when an ancestor's fill decided it; a check when no fill was found,
  // since a background drawn as a sibling shape is invisible here (decided
  // 2026-11-12).
  const decide = surface.found ? sureOf : check
  switch (surface.kind) {
    case 'tinted':
      return decide([onMuted, onDefault], reason, 'colour/text-on-fill')
    case 'emphasis':
      return decide(
        [`text/on-emphasis/${tone}`, onDefault],
        reason,
        'colour/text-on-fill',
      )
    case 'state-only':
      return decide([onDefault, onMuted], reason, 'colour/text-on-fill')
    default:
      return decide([onDefault, onMuted], reason, 'colour/text-on-fill')
  }
}

/** The icon variable that matches a text variable, or undefined when there is none. */
export function iconTwin(textName: string): string | undefined {
  const twin = textName.replace(/^text\//, 'icon/')
  return twin !== textName && getNewVariable(twin) ? twin : undefined
}

function resolveColour(
  kind: BindingKind,
  variable: OldVariable,
  context: RoleContext,
): Resolution {
  const info = oldCollectionInfo(variable.collectionKey)
  if (
    variable.collectionKey === OLD.colorScheme ||
    info?.libraryId === 'colours-shared'
  ) {
    return none(
      `${variable.name} is a palette colour, and the EDS Beta has no palette colours, only colours named for their role`,
      'colour/palette',
    )
  }
  if (kind === 'effect') {
    return none(
      'The EDS Beta has no colour token for effects, such as shadows',
      'colour/effect',
    )
  }
  const parsed = parseColour(variable, context)
  if (!parsed) return noColourRule(variable.name)

  if (parsed.group === 'Bg') return resolveBackground(parsed, context)
  if (parsed.group === 'Border') return resolveBorder(parsed, context)

  const text = resolveTextColour(parsed, context)
  // A text colour on a vector, an icon or a shape becomes its icon twin.
  if (context.nodeType === 'TEXT' || text.outcome === 'none') return text
  const twins = text.candidates
    .map(iconTwin)
    .filter((name): name is string => name !== undefined)
  if (twins.length === 0) {
    return none(
      `The EDS Beta has no icon variable to match ${text.candidates[0]} on a ${context.nodeType.toLowerCase()}`,
      'colour/icon',
    )
  }
  return {
    ...text,
    candidates: twins,
    reason: `${text.reason}; on a ${context.nodeType.toLowerCase()}, so the icon variable`,
    rule: `${text.rule}+icon`,
  }
}

// ---------------------------------------------------------------------------
// Spacing and corner radius (mapping-rules.md § 5)

/** One step up or down on the new spacing scale. */
export function spacingStep(step: string, delta: number): string | undefined {
  const index = SPACING_STEPS.indexOf(step)
  if (index === -1) return undefined
  return SPACING_STEPS[index + delta]
}

/**
 * The name to apply the `💎 Density` rules to: the variable itself when it is
 * in `💎 Density`, otherwise the first `💎 Density` variable in its alias
 * chain under the modes in force.
 */
function densityName(variable: OldVariable): string | undefined {
  if (variable.collectionKey === OLD.density) return variable.name
  return variable.chain?.find((step) => step.collectionKey === OLD.density)
    ?.name
}

/**
 * Legacy numbers the EDS Beta has no token for, with what it lacks. They are
 * No equivalent, with a stand-in by px (numberStandIn). Icon container
 * padding, baseline trims and the minimum height are normalised before this
 * list is read (normalised), and selectable control sizes are sized like
 * icons (resolveIconSize).
 */
const NO_EQUIVALENT: [RegExp, string][] = [
  [
    /^sizing\/stroke\/|^Stroke\/thickness$|^Generic\/Stroke width$|^Stroke$/,
    'the EDS Beta has no stroke width token',
  ],
]

/** Variables that size an icon. */
const ICON_SIZE = [
  /^sizing\/icon\//,
  /^Icon\/Size$/,
  /Icon size$|icon-size$/,
  /Icon (container )?width/i,
  /Icon container size/i,
  /^typography\/icon-/,
]

function isIconSize(name: string | undefined): boolean {
  return name !== undefined && ICON_SIZE.some((pattern) => pattern.test(name))
}

const SPACING_STEP = /^spacing\/[a-z0-9]+$/
const RADIUS_STEP = /^corner-radius\/[a-z0-9-]+$/

/** The number a variable resolves to on the layer, in px, when it was read. */
function readPx(variable: OldVariable): number | undefined {
  const value = variable.value ?? variable.resolvedValue
  return typeof value === 'number' ? value : undefined
}

type NumberStep = { name: string; size: number }

/** The EDS Beta variables whose names match, with the px each has in a density. */
function numberSteps(pattern: RegExp, density: Density): NumberStep[] {
  return NEW_VARIABLES.filter((candidate) => pattern.test(candidate.name))
    .map((candidate) => ({
      name: candidate.name,
      size: candidate.values?.[density],
    }))
    .filter((step): step is NumberStep => typeof step.size === 'number')
}

/**
 * An icon size becomes the spacing token with the same number in the density
 * the layer will have, since EDS sizes icons with spacing tokens (spacing
 * usage: "Size an icon by binding its width and height to a spacing token.
 * Button uses spacing.lg, and an Icon without size is spacing.xl"). It is a
 * proposal for a designer to confirm, because the token was made for space,
 * not for icons. Without an exact match, the nearest steps are offered.
 */
function resolveIconSize(
  variable: OldVariable,
  context: RoleContext,
  sized: 'icon' | 'control' = 'icon',
): Resolution {
  const rule = sized === 'icon' ? 'size/icon' : 'size/control'
  const value = readPx(variable)
  if (value === undefined) {
    return none(
      `${variable.name}: the legacy size could not be read, so the rule cannot match a spacing token to it`,
      rule,
    )
  }
  const density = targetDensity(context.modes)
  const steps = numberSteps(SPACING_STEP, density)
  const exact = steps.find((step) => step.size === value)
  const why =
    sized === 'icon'
      ? `${variable.name} is ${value}px. Icons are sized with spacing tokens in EDS`
      : `${variable.name} is ${value}px. Selectable controls are sized with spacing tokens in EDS (Checkbox and Radio use spacing-lg)`
  // spacing-usage.mdx and the Beta Icon size icons with the spacing token of
  // the same px, so an exact match is sure.
  if (exact) {
    return sure(
      exact.name,
      `${why}, and ${exact.name} is ${value}px in ${density}`,
      rule,
    )
  }
  const nearest = [...steps]
    .sort((a, b) => Math.abs(a.size - value) - Math.abs(b.size - value))
    .slice(0, 2)
  return check(
    nearest.map((step) => step.name),
    `${why}, but no step is ${value}px in ${density}; the nearest are ${nearest
      .map((step) => `${step.name} (${step.size}px)`)
      .join(' and ')}`,
    rule,
  )
}

const ICON_CONTAINER = /container-padding|container padding/i
const BASELINE_TRIM = [
  /^Typography\/Baseline adjust/,
  /^baseline\//,
  /(^|\/)padding-(centred|baselined)$/,
  /(^|\/)cap-(rounded|height-rounded)$/,
]
const MIN_HEIGHT = /^Min height$/
const CONTROL_SIZE = [
  /^sizing\/selectable\//,
  /^(Selectable\/Size|Size\/Selectables\/Size)$/,
]

function isControlSize(name: string | undefined): boolean {
  return (
    name !== undefined && CONTROL_SIZE.some((pattern) => pattern.test(name))
  )
}

/**
 * Legacy numbers with no EDS Beta token, normalised to how the Beta
 * components work (decided 2026-11-12). They are check items, since the
 * layout can shift: an icon has no container padding, text is not trimmed,
 * and no component sets a minimum height.
 */
function normalised(name: string, via: string): Resolution | undefined {
  if (ICON_CONTAINER.test(name)) {
    return check(
      [literalTarget(0)],
      `${name}${via}: the EDS Beta has no icon container. An icon is sized with a spacing token and has no padding around it, as in Button, so the padding is removed`,
      'number/icon-container',
    )
  }
  if (BASELINE_TRIM.some((pattern) => pattern.test(name))) {
    return check(
      [literalTarget(0)],
      `${name}${via}: the EDS Beta does not trim text (ADR-0029); height comes from padding and line height, so the trim is removed`,
      'number/baseline-trim',
    )
  }
  if (MIN_HEIGHT.test(name)) {
    return check(
      [CLEAR_VALUE],
      `${name}${via}: no EDS Beta component sets a minimum height; height comes from padding and line height, so the minimum is removed`,
      'number/min-height',
    )
  }
  return undefined
}

function noEquivalent(name: string): string | undefined {
  return NO_EQUIVALENT.find(([pattern]) => pattern.test(name))?.[1]
}

function resolveDensityName(
  name: string,
  kind: BindingKind,
  via: string,
): Resolution | undefined {
  let match = /^spacing\/(horizontal|vertical)\/([a-z0-9]+)$/.exec(name)
  if (match) {
    return sure(`spacing/${match[2]}`, `${name}${via}`, 'spacing/step')
  }
  match = /^spacing\/inset\/([a-z0-9]+)\/(horizontal|vertical-squared)$/.exec(
    name,
  )
  if (match) {
    return sure(`spacing/${match[1]}`, `${name}${via}`, 'spacing/inset')
  }
  match = /^spacing\/inset\/([a-z0-9]+)\/vertical-(squished|stretched)$/.exec(
    name,
  )
  if (match) {
    const target = spacingStep(match[1], match[2] === 'squished' ? -1 : 1)
    return target
      ? sure(
          `spacing/${target}`,
          `${name}${via}: one step ${match[2] === 'squished' ? 'down' : 'up'}`,
          'spacing/inset-proportion',
        )
      : none(
          `${name}${via}: the EDS Beta has no spacing step beyond ${match[1]}`,
          'spacing/inset-proportion',
        )
  }
  match = /^spacing\/border-radius\/(none|rounded|pill)$/.exec(name)
  if (match) {
    return sure(`corner-radius/${match[1]}`, `${name}${via}`, 'radius/step')
  }
  const normal = normalised(name, via)
  if (normal) return normal
  const reason = noEquivalent(name)
  if (reason) return none(`${name}${via}: ${reason}`, 'spacing/no-equivalent')
  // spacing.mdx: the icon gaps become spacing-xs at every icon size; no
  // current token grows with the icon the way these did.
  if (/^spacing\/icon\/[a-z0-9]+\/gap-/.test(name)) {
    return sure(
      'spacing/xs',
      `${name}${via}: the gap between an icon and its text is xs at every icon size in EDS`,
      'spacing/icon-gap',
    )
  }
  if (/^typography\//.test(name)) {
    return none(
      `${name}${via} is a typography variable on a ${PROPERTY_NAMES[kind]}; text styles replace typography variables, and the EDS Beta has no typography token for a ${PROPERTY_NAMES[kind]}`,
      'spacing/typography-elsewhere',
    )
  }
  return undefined
}

function modeStep(context: RoleContext, collectionKey: string) {
  return context.modes[collectionKey]?.toLowerCase()
}

/** Moves a vertical step by the `🪐 Space proportions` mode in force. */
function proportionsStep(
  context: RoleContext,
  step: string,
): string | undefined {
  const proportion = modeStep(context, OLD.spaceProportions) ?? 'squared'
  if (proportion === 'squished') return spacingStep(step, -1)
  if (proportion === 'stretched') return spacingStep(step, 1)
  return step
}

/**
 * Reads the old modes when the alias chain of a mode-driven variable could
 * not be read, for example because the deprecated library is not enabled.
 */
function resolveFromModes(
  variable: OldVariable,
  kind: BindingKind,
  context: RoleContext,
): Resolution | undefined {
  const { name } = variable
  const fromModes =
    ' (read from the legacy modes, since the alias chain could not be read)'
  const vertical = /vertical/i.test(name)

  const match =
    /^spacing-proportions\/([a-z0-9]+)\/(horizontal|vertical)$/.exec(name)
  if (match) {
    const step =
      match[2] === 'vertical' ? proportionsStep(context, match[1]) : match[1]
    return step
      ? check([`spacing/${step}`], `${name}${fromModes}`, 'spacing/modes')
      : undefined
  }
  if (
    /^(Container\/(Space|Gap) (horizontal|vertical)|container-space\/(horizontal|vertical))$/.test(
      name,
    )
  ) {
    const step =
      vertical && /Space|space/.test(name)
        ? proportionsStep(context, 'md')
        : 'md'
    return step
      ? check([`spacing/${step}`], `${name}${fromModes}`, 'spacing/modes')
      : undefined
  }
  if (
    /^(Selectable\/Space (horizontal|vertical)|selectable-space\/(horizontal|vertical))$/.test(
      name,
    )
  ) {
    const size = modeStep(context, OLD.selectableSpace) ?? 'xs'
    const step = vertical ? proportionsStep(context, size) : size
    return step
      ? check([`spacing/${step}`], `${name}${fromModes}`, 'spacing/modes')
      : undefined
  }
  if (
    (name === 'Border/radius' || name === 'Generic/Corner radius') &&
    kind === 'radius'
  ) {
    const mode = modeStep(context, OLD.borderRadius)
    return mode && ['none', 'rounded', 'pill'].includes(mode)
      ? check([`corner-radius/${mode}`], `${name}${fromModes}`, 'radius/modes')
      : undefined
  }
  return undefined
}

const GENERIC_SPACING = /^Generic\/(Space|Gap) (horizontal|vertical)$/

/**
 * `Generic/Space *` and `Generic/Gap *` take their step from the `🪐
 * Horizontal space`, `🪐 Vertical space`, `🪐 Horizontal gap` or `🪐 Vertical
 * gap` mode in force. A step mode aliases a `💎 Density` variable, which the
 * density rules handle. This covers the rest: the mode None, where the
 * variable is 0px with no alias to follow, and a chain that could not be
 * read. The spacing docs give `xs` where code set no step; in Figma the
 * default mode None is 0px, and the migration keeps what the layer shows.
 */
function resolveGeneric(
  variable: OldVariable,
  context: RoleContext,
): Resolution | undefined {
  const match = GENERIC_SPACING.exec(variable.name)
  if (!match) return undefined
  const [, family, direction] = match
  const horizontal = direction === 'horizontal'
  const key =
    family === 'Space'
      ? horizontal
        ? OLD.horizontalSpace
        : OLD.verticalSpace
      : horizontal
        ? OLD.horizontalGap
        : OLD.verticalGap
  const collection = `🪐 ${horizontal ? 'Horizontal' : 'Vertical'} ${family.toLowerCase()}`
  const modeName = context.modes[key]
  const mode = modeName?.toLowerCase()
  const value = variable.resolvedValue ?? variable.value
  if (value === 0 || (mode === 'none' && value === undefined)) {
    return sure(
      'spacing/none',
      `${variable.name} is 0px, since the ${collection} mode in force is ${modeName ?? 'None'}`,
      'spacing/generic',
    )
  }
  if (mode && mode !== 'none' && SPACING_STEPS.includes(mode)) {
    return check(
      [`spacing/${mode}`],
      `${variable.name}: the ${collection} mode is ${modeName} (read from the legacy modes, since the alias chain could not be read)`,
      'spacing/generic',
    )
  }
  return check(
    ['spacing/xs'],
    `${variable.name}: no ${collection} mode or value could be read; the spacing docs give xs where no step was set`,
    'spacing/generic',
  )
}

/**
 * The old container gap put one step between any two children; the Beta
 * scale separates groups with lg and sections with xl (spacing.mdx). The
 * plugin cannot tell which a container holds, so the row says it.
 */
function containerGapNote(
  variable: OldVariable,
  resolution: Resolution,
): Resolution {
  if (!/^(Container\/Gap|container-gap)/.test(variable.name)) return resolution
  if (resolution.outcome === 'none') return resolution
  return {
    ...resolution,
    reason: `${resolution.reason}. If the children are separate groups or sections, spacing/lg separates groups and spacing/xl sections`,
  }
}

/**
 * A spacing of 0 needs no token: in CSS it is `gap: 0` or no gap at all, so
 * nobody binds `spacing/none`. A proposal of `spacing/none` becomes the
 * number 0 without a variable, which Apply sets in place of the legacy one.
 */
function zeroWithoutToken(resolution: Resolution): Resolution {
  if (!resolution.candidates.includes('spacing/none')) return resolution
  return {
    ...resolution,
    candidates: [
      ...new Set(
        resolution.candidates.map((name) =>
          name === 'spacing/none' ? literalTarget(0) : name,
        ),
      ),
    ],
    reason: `${resolution.reason}. A 0 needs no token, so the plugin sets 0 and removes the variable`,
  }
}

/** Corner radius from a resolved value: 0 is none, up to 8 is rounded, 999 and above is pill. */
function radiusFromValue(variable: OldVariable): Resolution | undefined {
  const value = variable.resolvedValue
  if (typeof value !== 'number') return undefined
  const via = `${variable.name} resolves to ${value}`
  if (value === 0) return sure('corner-radius/none', via, 'radius/value')
  if (value <= 8) return sure('corner-radius/rounded', via, 'radius/value')
  if (value >= 999) return sure('corner-radius/pill', via, 'radius/value')
  return check(
    ['corner-radius/rounded', 'corner-radius/pill'],
    `${via}, between rounded and pill`,
    'radius/value',
  )
}

function resolveNumber(
  kind: BindingKind,
  variable: OldVariable,
  context: RoleContext,
): Resolution {
  if (kind === 'strokeWeight') {
    // EDS has no stroke width variable yet, so the width becomes a number.
    const value = variable.value ?? variable.resolvedValue
    if (typeof value !== 'number') {
      return none(
        `${variable.name}: there is no stroke width variable, and the legacy width could not be read`,
        'number/stroke-weight',
      )
    }
    return sure(
      literalTarget(value),
      `${variable.name} is ${value}px. EDS has no stroke width variable yet, so the width is set as a number`,
      'number/stroke-weight',
    )
  }
  if (kind === 'opacity') {
    // No opacity variable in the Beta; disabled controls use the disabled
    // colour tokens. The opacity becomes a number, for a designer to check.
    const value = variable.value ?? variable.resolvedValue
    if (typeof value !== 'number') {
      return none(
        `${variable.name}: there is no opacity variable, and the legacy opacity could not be read`,
        'number/opacity',
      )
    }
    const opacity = value > 1 ? value / 100 : value
    return check(
      [opacityTarget(opacity)],
      `${variable.name} is ${Math.round(opacity * 100)}%. The EDS Beta has no opacity variable, and disabled controls use the disabled colour tokens instead, so the opacity is set as a number`,
      'number/opacity',
    )
  }

  const ownNormal = normalised(variable.name, '')
  if (ownNormal) return ownNormal
  const ownReason = noEquivalent(variable.name)
  if (ownReason) {
    return none(`${variable.name}: ${ownReason}`, 'spacing/no-equivalent')
  }

  const density = densityName(variable)
  if (isIconSize(variable.name) || isIconSize(density)) {
    return resolveIconSize(variable, context)
  }
  if (isControlSize(variable.name) || isControlSize(density)) {
    return resolveIconSize(variable, context, 'control')
  }
  const via =
    density && density !== variable.name
      ? ` (${variable.name} points to ${density} under the modes in force)`
      : ''
  if (density) {
    const resolved = resolveDensityName(density, kind, via)
    if (resolved) return resolved
    return noNumberRule(`${density}${via}`)
  }

  const generic = resolveGeneric(variable, context)
  if (generic) return generic

  const fromModes = resolveFromModes(variable, kind, context)
  if (fromModes) return fromModes

  if (kind === 'radius') {
    const fromValue = radiusFromValue(variable)
    if (fromValue) return fromValue
  }
  return noNumberRule(variable.name)
}

/** A number variable no rule recognises. */
function noNumberRule(name: string): Resolution {
  return none(
    `No rule for ${name}: the plugin knows no EDS Beta token for it`,
    'spacing/unknown',
  )
}

// ---------------------------------------------------------------------------
// Stand-ins (decision D, 2026-11-16)
//
// Where the EDS Beta has no token for a legacy variable, the value stays No
// equivalent, since it shows a gap in the tokens, and the plugin proposes a
// stand-in as its first candidate. Apply leaves the value until a designer
// chooses the stand-in or another target (categoryAfter in scan/mapping.ts).
// A value gets no stand-in only where none is possible: a string or boolean
// variable, or a number whose px could be read neither from the variable nor
// from the layer.

/**
 * Rules that end in No equivalent only because the legacy value could not
 * be read, and say so in their reason.
 */
const UNREAD_VALUE_RULES = [
  'size/icon',
  'size/control',
  'number/stroke-weight',
  'number/opacity',
]

/** A No equivalent with a stand-in: the reason names the gap, then the stand-in. */
function standIn(
  gap: Resolution,
  candidates: string[],
  says: string,
  rule: string,
): Resolution {
  return {
    outcome: 'none',
    candidates: [...new Set(candidates)],
    reason: `${gap.reason}; ${says}`,
    rule,
  }
}

/**
 * Numbers by px: the EDS Beta variable of the same kind with the same px in
 * the density the layer will have, as for icon sizes, so spacing for spacing
 * and sizes, and corner radius for radius. Without one, the px without a
 * variable, as for stroke widths. A number on an effect, such as the blur of
 * a shadow, is a spacing number like any other, and Apply sets the px on the
 * effect when no spacing token has it.
 *
 * The px is the legacy value as it resolves on the layer. When the scan
 * could not read it, for example because the legacy library is not enabled,
 * it is the value the layer has now for the property (`layerValue`), which
 * is the last value the variable gave it, and the reason says so. An
 * opacity read from the layer gets the opacity without a variable.
 */
function numberStandIn(
  gap: Resolution,
  kind: BindingKind,
  variable: OldVariable,
  context: RoleContext,
): Resolution {
  const legacy = readPx(variable)
  const px = legacy ?? variable.layerValue
  if (px === undefined) return gap
  // Said first when the px comes from the layer, with the cause unless the
  // gap already gives it.
  const fromLayer =
    legacy === undefined
      ? `${UNREAD_VALUE_RULES.includes(gap.rule) ? '' : 'the legacy value could not be read, so '}the px is the layer's current value, ${px}px; `
      : ''
  // An opacity is a fraction or a percent, not px. Its rule reads the
  // legacy value, so only the layer's opacity is left for here.
  if (kind === 'opacity') {
    if (legacy !== undefined) return gap
    const opacity = px > 1 ? px / 100 : px
    const percent = Math.round(opacity * 1000) / 10
    return standIn(
      gap,
      [opacityTarget(opacity)],
      `the stand-in is the layer's current opacity, ${percent}%, without a variable`,
      'number/opacity',
    )
  }
  const density = targetDensity(context.modes)
  const family =
    kind === 'radius'
      ? { pattern: RADIUS_STEP, words: 'corner radius' }
      : kind === 'strokeWeight'
        ? undefined
        : { pattern: SPACING_STEP, words: 'spacing' }
  // A 0 needs no token (zeroWithoutToken), so spacing/none is not proposed.
  if (px === 0 && kind !== 'radius') {
    return standIn(
      gap,
      [literalTarget(0)],
      `${fromLayer}the stand-in is 0 without a variable, since a 0 needs no token`,
      'number/as-px',
    )
  }
  const same =
    family &&
    numberSteps(family.pattern, density).find((step) => step.size === px)
  if (same) {
    return standIn(
      gap,
      [same.name],
      `${fromLayer}the stand-in is ${same.name}, which is ${px}px in ${density}${fromLayer ? '' : ', the same as the legacy value'}`,
      'number/same-px',
    )
  }
  return standIn(
    gap,
    [literalTarget(px)],
    `${fromLayer}${family ? `no EDS Beta ${family.words} token is ${px}px in ${density}, so ` : ''}the stand-in is ${px}px without a variable`,
    'number/as-px',
  )
}

type ColourRole = 'background' | 'border' | 'text' | 'icon'

/** The one see-through colour in the EDS Beta, offered for shadows. */
const SCRIM = 'overlay/scrim'

/** Shapes that draw an icon: a fill on one is an icon colour. */
const ICON_SHAPES = ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON']

/**
 * The role a colour has on the layer, decided as resolveColour does: a text
 * fill is text and a stroke is a border. On a fill or an effect, the legacy
 * family decides where the name has one (a Text colour on a shape draws an
 * icon, a Border colour on a fill draws a line), and otherwise the layer
 * does: text on a text layer, an icon on a vector, a border on a line drawn
 * as a shape, and a background on anything else. An effect takes the role of
 * the layer's fill.
 */
function colourRole(
  kind: BindingKind,
  variable: OldVariable,
  context: RoleContext,
): ColourRole {
  if (kind === 'textFill') return 'text'
  if (kind === 'stroke') return 'border'
  const family = variable.name.split('/')[0]
  if (family === 'Text') return context.nodeType === 'TEXT' ? 'text' : 'icon'
  if (family === 'Border') return 'border'
  if (family === 'Bg') return 'background'
  if (context.nodeType === 'TEXT') return 'text'
  if (ICON_SHAPES.includes(context.nodeType)) return 'icon'
  if (isLineShape(context)) return 'border'
  return 'background'
}

/**
 * The EDS Beta colours that fit the role on the layer. Interactive colours
 * only go on an interactive element (guessRole), in the state the layer is
 * in; fills and borders on an interactive element take only interactive
 * ones, and a divider is never interactive. Selected fills only go on a
 * selected element, the disabled colour only on a disabled one, and the
 * focus border only on a focused one. Tertiary text and icons are left out,
 * since they fall below the contrast minimum on text people read. An effect
 * also gets overlay/scrim, the one see-through colour, which suits a shadow.
 */
function colourPool(
  role: ColourRole,
  context: RoleContext,
  effect: boolean,
): string[] {
  const guess = guessRole(context)
  const disabled = `${role}/interactive/disabled`
  if (guess.state === 'disabled' && getNewVariable(disabled)) return [disabled]
  const state = stateSuffix(guess)
  const interactive =
    guess.role === 'interactive' && !(role === 'border' && isDivider(context))
  const fits = NEW_VARIABLES.filter(
    (variable) =>
      variable.type === 'COLOR' &&
      variable.name.startsWith(`${role}/`) &&
      !FORBIDDEN_TARGETS.includes(variable.name),
  )
    .map((variable) => variable.name)
    .filter((name) => {
      if (name === disabled || name.endsWith('/tertiary')) return false
      if (name.endsWith('/focus')) return guess.state === 'focus'
      if (name.includes('/selected/') && !guess.selected) return false
      const last = name.split('/').pop()
      if (
        name.includes('/interactive/') &&
        (last === 'default' || last === 'hover' || last === 'pressed')
      ) {
        return last === state
      }
      return true
    })
  const isInteractive = (name: string) =>
    name.startsWith(`${role}/interactive/`)
  // Text and icons on a control keep the names for what they sit on, such
  // as text/on-emphasis, so only fills and borders are limited to the
  // interactive colours there.
  const byRole = fits.filter((name) =>
    interactive
      ? role === 'text' || role === 'icon' || isInteractive(name)
      : !isInteractive(name),
  )
  const pool = byRole.length > 0 ? byRole : fits
  return effect ? [...pool, SCRIM] : pool
}

/** The stand-in when the legacy colour could not be read: the usual colour for the role. */
function usualColour(
  role: ColourRole,
  context: RoleContext,
  effect: boolean,
  pool: string[],
): string {
  const guess = guessRole(context)
  const state = stateSuffix(guess)
  const interactive = guess.role === 'interactive'
  const preferred = effect
    ? [SCRIM]
    : role === 'text'
      ? ['text/primary']
      : role === 'icon'
        ? ['icon/primary']
        : role === 'border'
          ? [
              interactive
                ? `border/interactive/neutral/muted/${state}`
                : 'border/non-interactive/neutral/default',
            ]
          : [
              interactive
                ? `background/interactive/neutral/muted/${state}`
                : 'background/surface',
            ]
  return preferred.find((name) => pool.includes(name)) ?? pool[0]
}

/**
 * Colours by role: the EDS Beta colour for the role of the layer that is
 * nearest to the legacy colour as it resolves on the layer, in the colour
 * scheme the layer will have (colour-distance.ts). The next two nearest are
 * offered after it. On an effect, overlay/scrim is always offered too, since
 * a shadow is usually see-through and the distance is measured on the
 * surface, where a light opaque grey can be nearer.
 */
function colourStandIn(
  gap: Resolution,
  kind: BindingKind,
  variable: OldVariable,
  context: RoleContext,
): Resolution {
  const role = colourRole(kind, variable, context)
  const effect = kind === 'effect'
  const pool = colourPool(role, context, effect)
  if (pool.length === 0) return gap
  const scheme = targetScheme(context.modes)
  const legacy = variable.colour
  const measured = legacy
    ? pool
        .map((name) => {
          const value = getNewVariable(name)?.values?.[scheme]
          return {
            name,
            distance:
              typeof value === 'string'
                ? colourDistance(legacy, value, scheme)
                : undefined,
          }
        })
        .filter(
          (entry): entry is { name: string; distance: number } =>
            entry.distance !== undefined,
        )
        .sort((a, b) => a.distance - b.distance)
    : []
  const scrim = effect ? [SCRIM] : []
  if (legacy && measured.length > 0) {
    return standIn(
      gap,
      [...measured.slice(0, 3).map((entry) => entry.name), ...scrim],
      `the stand-in is ${measured[0].name}, the ${measured[0].name === SCRIM ? 'see-through' : role} colour nearest to the legacy ${legacy} in ${scheme}`,
      'colour/nearest-by-role',
    )
  }
  const usual = usualColour(role, context, effect, pool)
  return standIn(
    gap,
    [usual, ...scrim],
    usual === SCRIM
      ? `the legacy colour could not be read, so the stand-in is ${SCRIM}, the one see-through colour in the EDS Beta, which suits a shadow`
      : `the legacy colour could not be read, so the stand-in is ${usual}, the usual ${role} colour`,
    'colour/nearest-by-role',
  )
}

/** The stand-in for a variable the rules have no target for, when one is possible. */
function withStandIn(resolution: Resolution, input: VariableInput): Resolution {
  if (resolution.outcome !== 'none' || resolution.candidates.length > 0) {
    return resolution
  }
  const { kind, variable, context } = input
  if (variable.type === 'COLOR') {
    return colourStandIn(resolution, kind, variable, context)
  }
  if (variable.type === 'FLOAT') {
    return numberStandIn(resolution, kind, variable, context)
  }
  return resolution
}

// ---------------------------------------------------------------------------
// Entry points

export type VariableInput = {
  kind: BindingKind
  variable: OldVariable
  context: RoleContext
}

/**
 * Resolves one bound old variable to its outcome and candidates. A variable
 * the rules have no target for, or whose target is missing from the EDS
 * Beta, gets a stand-in where one is possible.
 */
export function resolveVariable(input: VariableInput): Resolution {
  const { kind, variable, context } = input
  let resolution: Resolution
  if (variable.type === 'COLOR') {
    resolution = resolveColour(kind, variable, context)
  } else if (variable.type === 'FLOAT') {
    resolution = containerGapNote(
      variable,
      zeroWithoutToken(resolveNumber(kind, variable, context)),
    )
  } else {
    const type = variable.type.toLowerCase()
    resolution = none(
      `No rule for ${type} variables such as ${variable.name}, and a ${type} has no stand-in by px or by colour`,
      'other/type',
    )
  }
  const final = finalise(
    resolution,
    (name) =>
      getNewVariable(name) !== undefined || literalValue(name) !== undefined,
  )
  return fitScope(withStandIn(final, input), kind, context)
}

const PROPERTY_NAMES: Record<BindingKind, string> = {
  fill: 'fill',
  stroke: 'stroke',
  effect: 'effect',
  textFill: 'text fill',
  spacing: 'padding or gap',
  size: 'width or height',
  radius: 'corner radius',
  strokeWeight: 'stroke weight',
  opacity: 'opacity',
  other: 'property',
}

/**
 * The variable scopes that fit a property. Scopes only steer Figma's
 * variable picker, so a binding outside them still works, but it is worth a
 * designer's look.
 */
export function acceptedScopes(kind: BindingKind, nodeType: string): string[] {
  switch (kind) {
    case 'textFill':
      return ['TEXT_FILL', 'ALL_FILLS', 'ALL_SCOPES']
    case 'fill':
      return nodeType === 'FRAME' ||
        nodeType === 'COMPONENT' ||
        nodeType === 'INSTANCE'
        ? ['FRAME_FILL', 'ALL_FILLS', 'ALL_SCOPES']
        : ['SHAPE_FILL', 'ALL_FILLS', 'ALL_SCOPES']
    case 'stroke':
      return ['STROKE_COLOR', 'ALL_SCOPES']
    case 'spacing':
      return ['GAP', 'ALL_SCOPES']
    case 'size':
      return ['WIDTH_HEIGHT', 'ALL_SCOPES']
    case 'radius':
      return ['CORNER_RADIUS', 'ALL_SCOPES']
    default:
      return ['ALL_SCOPES']
  }
}

/**
 * A shape at most 2px thick and at least four times as long, such as a
 * connector or a divider drawn as a rectangle: a fill on it draws a line.
 */
export function isLineShape(context: RoleContext): boolean {
  if (!context.size) return false
  const [width, height] = context.size
  const thin = Math.min(width, height)
  return thin > 0 && thin <= 2 && Math.max(width, height) >= thin * 4
}

/** Turns a sure proposal into a check item when its scopes do not include the property. */
function fitScope(
  resolution: Resolution,
  kind: BindingKind,
  context: RoleContext,
): Resolution {
  const proposal = resolution.candidates[0]
  if (resolution.outcome !== 'sure' || !proposal) return resolution
  if (literalValue(proposal) !== undefined) return resolution
  const scopes = getNewVariable(proposal)?.scopes ?? []
  const accepted = acceptedScopes(kind, context.nodeType)
  if (scopes.some((scope) => accepted.includes(scope))) return resolution
  // A border colour on a line drawn as a filled shape is the right token;
  // the scope only keeps it out of the fill picker.
  if (kind === 'fill' && /^border\//.test(proposal) && isLineShape(context)) {
    const [width, height] = context.size ?? [0, 0]
    return {
      ...resolution,
      reason: `${resolution.reason}; the layer is a line (${width}×${height}px) drawn with a fill, so the border token fits although it is scoped for strokes`,
    }
  }
  return {
    ...resolution,
    outcome: 'check',
    reason: `${resolution.reason}; the legacy variable sits on a ${PROPERTY_NAMES[kind]}, which ${proposal} is not scoped for`,
  }
}

/** Resolves an old explicit mode on a frame. */
export function resolveMode(input: ModeInput): ModeResolution {
  const { collectionKey, modeName } = input
  const info = oldCollectionInfo(collectionKey)
  const label = `${info?.name ?? collectionKey}: ${modeName}`
  if (collectionKey === OLD.colorScheme) {
    const mode = modeName.toLowerCase()
    if (mode === 'light' || mode === 'dark') {
      return {
        outcome: 'sure',
        target: { collection: 'color-scheme', mode },
        reason: label,
        rule: 'mode/color-scheme',
      }
    }
  }
  if (collectionKey === OLD.density) {
    if (modeName === 'Spacious') {
      return {
        outcome: 'sure',
        target: { collection: 'density', mode: 'comfortable' },
        reason: `${label}: the legacy Spacious is the new comfortable`,
        rule: 'mode/density',
      }
    }
    if (modeName === 'Comfortable') {
      return {
        outcome: 'sure',
        target: { collection: 'density', mode: 'compact' },
        reason: `${label}: the legacy Comfortable was the dense mode, and its values match the new compact`,
        rule: 'mode/density',
      }
    }
  }
  if (
    info &&
    collectionKey !== OLD.colorScheme &&
    collectionKey !== OLD.density
  ) {
    return {
      outcome: 'sure',
      target: null,
      reason: `${label}: the mode only selects a ${collectionKey === OLD.appearance ? 'tone' : 'step'}, which goes into the new variable names; it is cleared once nothing below it uses the legacy variables`,
      rule: 'mode/clear',
    }
  }
  // No equivalent, with clearing the legacy mode as the stand-in: the layer
  // then takes the mode from above it (decision D, 2026-11-16).
  return {
    outcome: 'none',
    target: null,
    reason: `No rule for the mode ${label}: the EDS Beta has no mode that matches it; the stand-in is to remove the legacy mode, so the layer takes the mode set above it`,
    rule: 'mode/unknown',
  }
}

// ---------------------------------------------------------------------------
// Typography (mapping-rules.md § 6)

type TypeInfo = {
  family?: 'header' | 'ui-body'
  step?: string
  lineHeight?: 'default' | 'squished'
  weight?: 'normal' | 'bolder' | 'lighter'
}

const TYPE_NAME =
  /^typography\/(header|ui-body)\/(?:([a-z0-9]+)\/)?(font-size|font-family|line-height-(default|squished)|font-weight-(normal|bolder|lighter)|tracking-[a-z]+)$/

function readTypeName(name: string, info: TypeInfo, isSize: boolean) {
  const match = TYPE_NAME.exec(name)
  if (!match) return
  info.family ??= match[1] as TypeInfo['family']
  if (match[2] && (isSize || !info.step)) info.step = match[2]
  if (match[4]) info.lineHeight ??= match[4] as TypeInfo['lineHeight']
  if (match[5]) info.weight ??= match[5] as TypeInfo['weight']
}

/** Reads the 🗣️ Semantic typography variables from the modes in force. */
function readTypeModes(field: string, context: RoleContext, info: TypeInfo) {
  const size = modeStep(context, OLD.fontSize)
  const family = context.modes[OLD.fontFamily]
  const lineHeight = modeStep(context, OLD.lineHeight)
  if (size) info.step ??= size
  if (family) info.family ??= family === 'Header' ? 'header' : 'ui-body'
  if (
    field === 'lineHeight' &&
    (lineHeight === 'default' || lineHeight === 'squished')
  ) {
    info.lineHeight ??= lineHeight
  }
}

const STYLE_WEIGHTS: [RegExp, number][] = [
  [/thin|hairline/i, 100],
  [/extra ?light|ultra ?light/i, 200],
  [/light/i, 300],
  [/semi ?bold|demi ?bold/i, 600],
  [/extra ?bold|ultra ?bold/i, 800],
  [/black|heavy/i, 900],
  [/bold/i, 700],
  [/medium/i, 500],
  [/regular|normal|book|roman/i, 400],
]

/** The numeric weight of a font style such as `Medium` or `700 Regular`. */
export function weightFromStyle(style: string): number | undefined {
  const numeric = /\b([1-9]00)\b/.exec(style)
  if (numeric) return Number(numeric[1])
  return STYLE_WEIGHTS.find(([pattern]) => pattern.test(style))?.[1]
}

function stepsFor(role: string): string[] {
  const steps = new Set<string>()
  for (const style of NEW_TEXT_STYLES) {
    const [styleRole, step] = style.name.split('/')
    if (styleRole === role) steps.add(step)
  }
  return TYPE_STEPS.filter((step) => steps.has(step))
}

function nearestStep(role: string, step: string): string | undefined {
  const available = stepsFor(role)
  if (available.includes(step)) return step
  const index = TYPE_STEPS.indexOf(step)
  if (index === -1) return undefined
  return available.reduce((best, candidate) =>
    Math.abs(TYPE_STEPS.indexOf(candidate) - index) <
    Math.abs(TYPE_STEPS.indexOf(best) - index)
      ? candidate
      : best,
  )
}

function stepFromSize(role: string, fontSize: number): string | undefined {
  let best: { step: string; distance: number } | undefined
  for (const style of NEW_TEXT_STYLES) {
    const [styleRole, step] = style.name.split('/')
    if (styleRole !== role) continue
    const distance = Math.abs(style.fontSize - fontSize)
    if (!best || distance < best.distance) best = { step, distance }
  }
  return best?.step
}

function styleName(
  role: 'header' | 'label' | 'body' | 'mono',
  step: string,
  weight: 'default' | 'medium' | 'bold',
): string {
  if (role === 'header') return `header/${step}`
  return `${role}/${step}/${weight}`
}

/**
 * The family, step, line height and weight the legacy typography variables
 * give, from their names or, for the 🗣️ Semantic variables, from the modes
 * in force.
 */
function readTypeInfo(
  fields: TypographyInput['fields'],
  context: RoleContext,
): TypeInfo {
  const info: TypeInfo = {}
  // The size variable decides the step, so it is read first.
  const ordered = Object.entries(fields).sort(
    ([a], [b]) => Number(b === 'fontSize') - Number(a === 'fontSize'),
  )
  for (const [field, variable] of ordered) {
    if (!variable) continue
    const name = densityName(variable)
    if (name) readTypeName(name, info, field === 'fontSize')
    else if (variable.collectionKey === OLD.spacingSemantic) {
      readTypeModes(field, context, info)
    }
  }
  return info
}

/**
 * The legacy typography of a text in a few words, as the rules read it: the
 * family, the step, or the font size when no step can be read, the font
 * style, with the font's name when it is not the family's own, and the line
 * height, such as “UI body, md, Medium, squished”. Every instance of the
 * legacy Typography component binds the same variables and differs only in
 * its modes and font, so the rows of the Typography tab are told apart by
 * this (test session 2, 2026-11-25). The step and the weight come first,
 * since a row at the default width cuts the end off.
 */
export function legacyTypographyText(input: TypographyInput): string {
  const { font, fontSize } = input
  const info = readTypeInfo(input.fields, input.context)
  const family =
    info.family === 'header'
      ? 'Header'
      : info.family === 'ui-body'
        ? 'UI body'
        : undefined
  const ownFont =
    family === 'Header' ? 'Equinor' : family === 'UI body' ? 'Inter' : undefined
  return [
    family,
    info.step ?? (fontSize !== undefined ? `${fontSize}px` : undefined),
    font.family === ownFont ? font.style : `${font.family} ${font.style}`,
    info.lineHeight,
  ]
    .filter(Boolean)
    .join(', ')
}

/** Resolves the typography of a text node, or of one range in it, to a text style. */
export function resolveTypography(input: TypographyInput): Resolution {
  const { fields, font, fontSize, context } = input
  const info = readTypeInfo(fields, context)
  const notes: string[] = []
  // Said in the reason without making the style a check item
  const remarks: string[] = []

  // Role
  let role: 'header' | 'label' | 'body' | 'mono'
  if (/mono/i.test(font.family)) {
    role = 'mono'
  } else if (info.family === 'header' || font.family === 'Equinor') {
    role = 'header'
  } else if (info.lineHeight === 'squished') {
    role = 'label'
  } else if (info.lineHeight === 'default') {
    if (context.singleLine && nearNamesMatch(context, 'labelControls')) {
      // ADR-0027: label is for single-line functional text (decided
      // 2026-11-12 to apply it without asking).
      role = 'label'
      remarks.push(
        'single-line text inside a control takes label, not body (ADR-0027)',
      )
    } else {
      role = 'body'
    }
  } else {
    role = context.singleLine ? 'label' : 'body'
    notes.push(
      `no line height variable, so ${role} is chosen because the text is ${context.singleLine ? 'on one line' : 'on several lines'}`,
    )
  }

  // Step. Where no EDS Beta step fits, the text is No equivalent with a
  // stand-in: the step nearest to the font size, or md of the role when the
  // size cannot be read (decision D, 2026-11-16).
  let gap: { what: string; why: string } | undefined
  let step = info.step
  if (!step && fontSize !== undefined) {
    step = stepFromSize(role, fontSize)
    if (step)
      notes.push(
        `no size variable, so the step is the nearest to ${fontSize}px`,
      )
  }
  if (!step) {
    gap = {
      what: 'The type size could not be read, so no EDS Beta text style can be matched to it',
      why: `the md step of ${role}`,
    }
    step = 'md'
  }
  if (role === 'mono') {
    const monoStep = step === 'lg' || TYPE_STEPS.indexOf(step) > 3 ? 'lg' : 'md'
    if (monoStep !== step)
      notes.push(`mono has md and lg only, so ${step} becomes ${monoStep}`)
    step = monoStep
  } else {
    let nearest = nearestStep(role, step)
    if (!nearest) {
      const bySize =
        fontSize !== undefined ? stepFromSize(role, fontSize) : undefined
      gap = bySize
        ? {
            what: `The EDS Beta has no ${role} step near ${step}`,
            why: `the step nearest to ${fontSize}px`,
          }
        : {
            what: `The EDS Beta has no ${role} step near ${step}, and the size could not be read`,
            why: `the md step of ${role}`,
          }
      nearest = bySize ?? 'md'
    }
    if (nearest !== step && !gap)
      notes.push(
        `${role} has no ${step}, so the nearest step, ${nearest}, is used`,
      )
    step = nearest
  }

  // Weight: the font style first, since a layer can be set in Medium without
  // a weight variable; then the variable.
  const styleWeight = weightFromStyle(font.style)
  const variableWeight =
    info.weight === 'bolder'
      ? 500
      : info.weight === 'normal' || info.weight === 'lighter'
        ? 400
        : undefined
  const weightValue = styleWeight ?? variableWeight ?? 400
  let weight: 'default' | 'medium' | 'bold' =
    weightValue <= 450 ? 'default' : weightValue <= 600 ? 'medium' : 'bold'
  if (weightValue === 600)
    notes.push('Semi Bold has no style, so medium is used')
  if (weightValue < 400)
    notes.push('the lighter weight is gone, so default is used')
  if (/italic/i.test(font.style)) notes.push('the text styles have no italic')
  if (role === 'header' && weight !== 'medium') {
    notes.push(`header styles have one weight, medium; the text was ${weight}`)
  }
  if (role === 'body' && weight === 'medium') {
    notes.push('body has no medium, so default is used')
    weight = 'default'
  }
  if (role === 'mono' && weight === 'medium') {
    notes.push('mono has no medium, so default is used')
    weight = 'default'
  }

  const proposal = styleName(role, step, weight)
  const alternatives: string[] = []
  if (role === 'label')
    alternatives.push(
      styleName(
        'body',
        nearestStep('body', step) ?? step,
        weight === 'medium' ? 'default' : weight,
      ),
    )
  if (role === 'body')
    alternatives.push(
      styleName('label', nearestStep('label', step) ?? step, weight),
    )

  const described = [
    info.family && `${info.family === 'header' ? 'header' : 'ui-body'} family`,
    info.step && `step ${info.step}`,
    info.lineHeight && `${info.lineHeight} line height`,
    `${font.family} ${font.style}`,
  ]
    .filter(Boolean)
    .join(', ')
  const said = [described, ...remarks].join('; ')
  const resolution: Resolution = gap
    ? {
        outcome: 'none',
        candidates: [...new Set([proposal, ...alternatives])],
        reason: [
          `${gap.what}; the stand-in is ${proposal}, ${gap.why}`,
          said,
          ...notes,
        ].join('; '),
        rule: 'type/nearest-step',
      }
    : notes.length === 0
      ? sure(proposal, said, 'type/style')
      : check(
          [proposal, ...alternatives],
          `${said}; ${notes.join('; ')}`,
          'type/style',
        )
  const final = finalise(
    resolution,
    (name) => getNewTextStyle(name) !== undefined,
  )
  // A style the rules name that is missing from the EDS Beta: body/md is
  // the stand-in.
  if (final.outcome === 'none' && final.candidates.length === 0) {
    const fallback = 'body/md/default'
    if (!getNewTextStyle(fallback)) return final
    return {
      ...final,
      candidates: [fallback],
      reason: `${final.reason}; the stand-in is ${fallback}`,
      rule: 'type/nearest-step',
    }
  }
  return final
}
