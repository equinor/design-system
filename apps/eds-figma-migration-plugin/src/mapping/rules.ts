/**
 * The mapping from variables in the deprecated EDS libraries to variables and
 * text styles in EDS Foundation [EDS Beta]. docs/mapping-rules.md is the
 * source; each rule below names the section it implements.
 *
 * Every old variable resolves to one of three outcomes:
 * - sure: one target, from the name alone
 * - check: the target depends on the role of the layer; the first candidate
 *   is the proposal, and a designer confirms it before it is applied
 * - none: no equivalent; the old binding stays and is listed
 */
import {
  getNewTextStyle,
  getNewVariable,
  NEW_TEXT_STYLES,
  OLD,
  oldCollectionInfo,
} from './inventory'
import { guessRole, isDivider, nearNamesMatch, roleNameMatches } from './role'
import type { RoleGuess } from './role'
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
 * the tests fail on that note.
 */
function finalise(
  resolution: Resolution,
  exists: (name: string) => boolean,
): Resolution {
  if (resolution.outcome === 'none') return resolution
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
    outcome: missing.includes(resolution.candidates[0])
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
  if (slot === 'Backdrop') {
    return none(
      'Bg/Backdrop has no equivalent; background/backdrop has been removed (#5846)',
      'colour/backdrop',
    )
  }

  const tone = parsed.tone
  if (!tone) return none(`No rule for Bg/${slot}`, 'colour/unknown')
  const guess = guessRole(context)

  if (slot === 'Canvas' || slot === 'Surface') {
    const target =
      tone === 'neutral'
        ? `background/${slot.toLowerCase()}`
        : `background/non-interactive/${tone}/${slot === 'Canvas' ? 'muted' : 'default'}`
    // There is no interactive canvas or surface. The plane is proposed
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
  if (!fill) return none(`No rule for Bg/${slot}`, 'colour/unknown')
  const level = fill[1].toLowerCase()
  const oldState = fill[2]
  const interactive = (state: string) =>
    `background/interactive/${tone}/${level}/${state}`
  const nonInteractive = `background/non-interactive/${tone}/${level}`
  const oldStateAsNew = oldState === 'Active' ? 'pressed' : 'default'

  if (guess.selected) {
    if (tone !== 'accent' && tone !== 'neutral') {
      return none(
        `Only accent and neutral have a selected level (${guess.because})`,
        'colour/selected-tone',
      )
    }
    const state = oldState === 'Hover' ? 'hover' : stateSuffix(guess)
    return check(
      [
        `background/interactive/${tone}/selected/${state}`,
        interactive(oldState === 'Hover' ? 'hover' : oldStateAsNew),
      ],
      `Selected element (${guess.because}): selected fill, whatever the old fill was${toneNote(parsed)}`,
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

  // Hover and Active only exist on interactive elements. A layer named as
  // non-interactive with such a fill is reported.
  if (guess.keyword === 'non-interactive' && guess.role === 'non-interactive') {
    return none(
      `${oldState} on an element that is not interactive (${guess.because}); non-interactive fills have no states`,
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
  if (!tone || !(slot in levels)) {
    return none(`No rule for Border/${slot}`, 'colour/unknown')
  }
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
  return none(
    `Border/Medium on an interactive element that is neither an outlined control nor a field (${guess.because})`,
    'colour/border-medium-other',
  )
}

/** What the fill under a text or icon is, as the text rules need it. */
type SurfaceKind = 'plain' | 'tinted' | 'emphasis' | 'state-only'

function classifyFillUnder(fillUnder: FillUnder | undefined): {
  kind: SurfaceKind
  because: string
} {
  if (!fillUnder) return { kind: 'plain', because: 'no fill under it' }
  let target = fillUnder.newVariableName
  if (!target && fillUnder.oldVariable) {
    const resolution = resolveVariable({
      kind: 'fill',
      variable: fillUnder.oldVariable,
      context: fillUnder.context,
    })
    target = resolution.candidates[0]
  }
  const owner = fillUnder.context.names[0] ?? 'the layer'
  const on = target ? `${target} on “${owner}”` : `the fill of “${owner}”`
  if (!target) return { kind: 'plain', because: `it sits on ${on}` }
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
  if (!tone) return none(`No rule for Text/${slot}`, 'colour/unknown')

  if (slot === 'Strong on emphasis') {
    return sure(
      `text/on-emphasis/${tone}`,
      `Strong on emphasis${toneNote(parsed)}`,
      'colour/text-on-emphasis',
    )
  }
  if (slot === 'Subtle on emphasis') {
    return check(
      [`text/on-emphasis/${tone}`],
      `Subtle on emphasis has no equivalent: there is one foreground per tone on an emphasis fill${toneNote(parsed)}`,
      'colour/text-subtle-on-emphasis',
    )
  }
  if (slot !== 'Strong' && slot !== 'Subtle') {
    return none(`No rule for Text/${slot}`, 'colour/unknown')
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
  switch (surface.kind) {
    case 'tinted':
      return check([onMuted, onDefault], reason, 'colour/text-on-fill')
    case 'emphasis':
      return check(
        [`text/on-emphasis/${tone}`, onDefault],
        reason,
        'colour/text-on-fill',
      )
    case 'state-only':
      return check([onDefault, onMuted], reason, 'colour/text-on-fill')
    default:
      return check([onDefault, onMuted], reason, 'colour/text-on-fill')
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
      `${variable.name} is a palette colour; choose a semantic variable by role`,
      'colour/palette',
    )
  }
  if (kind === 'effect') {
    return none(`No rule for colours on effects`, 'colour/effect')
  }
  const parsed = parseColour(variable, context)
  if (!parsed) return none(`No rule for ${variable.name}`, 'colour/unknown')

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
      `${text.candidates[0]} has no icon variable to use on a ${context.nodeType.toLowerCase()}`,
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

const NO_EQUIVALENT: [RegExp, string][] = [
  [/^sizing\/icon\//, 'There is no icon size variable'],
  [/^Icon\//, 'There is no icon size variable'],
  [/Icon size$|icon-size$/, 'There is no icon size variable'],
  [/Icon (container|width)/i, 'There is no icon size variable'],
  [
    /container-padding|container padding/i,
    'There is no icon container padding',
  ],
  [/^typography\/icon-/, 'There is no icon size variable'],
  [/^Typography\/Baseline adjust/, 'The Beta has no baseline trim'],
  [/^baseline\//, 'The Beta has no baseline trim'],
  [/(^|\/)padding-(centred|baselined)$/, 'The Beta has no baseline trim'],
  [/(^|\/)cap-(rounded|height-rounded)$/, 'The Beta has no baseline trim'],
  [/^Min height$/, 'There is no minimum height variable'],
  [
    /^sizing\/selectable\//,
    'There is no size variable for selectable controls',
  ],
  [
    /^(Selectable\/Size|Size\/Selectables\/Size)$/,
    'There is no size variable for selectable controls',
  ],
  [
    /^sizing\/stroke\/|^Stroke\/thickness$|^Generic\/Stroke width$|^Stroke$/,
    'There is no stroke width variable',
  ],
]

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
          `${name}${via}: no step beyond ${match[1]}`,
          'spacing/inset-proportion',
        )
  }
  match = /^spacing\/border-radius\/(none|rounded|pill)$/.exec(name)
  if (match) {
    return sure(`corner-radius/${match[1]}`, `${name}${via}`, 'radius/step')
  }
  const reason = noEquivalent(name)
  if (reason) return none(`${name}${via}: ${reason}`, 'spacing/no-equivalent')
  if (/^spacing\/icon\//.test(name)) {
    return none(
      `${name}${via}: no rule for the gap between an icon and its text`,
      'spacing/icon-gap',
    )
  }
  if (/^typography\//.test(name)) {
    return none(
      `${name}${via} is a typography variable on ${kind}; text styles replace typography variables`,
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
    ' (read from the old modes, since the alias chain could not be read)'
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
  if (name === 'Generic/Gap horizontal') {
    return check(['spacing/xs'], `${name}${fromModes}`, 'spacing/modes')
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
    return none(
      `${variable.name}: there is no stroke width variable`,
      'number/stroke-weight',
    )
  }
  if (kind === 'opacity') {
    return none(
      `${variable.name}: there is no opacity variable`,
      'number/opacity',
    )
  }

  const ownReason = noEquivalent(variable.name)
  if (ownReason)
    return none(`${variable.name}: ${ownReason}`, 'spacing/no-equivalent')

  const density = densityName(variable)
  const via =
    density && density !== variable.name
      ? ` (${variable.name} points to ${density} under the modes in force)`
      : ''
  if (density) {
    const resolved = resolveDensityName(density, kind, via)
    if (resolved) return resolved
    return none(`No rule for ${density}${via}`, 'spacing/unknown')
  }

  const fromModes = resolveFromModes(variable, kind, context)
  if (fromModes) return fromModes

  if (kind === 'radius') {
    const fromValue = radiusFromValue(variable)
    if (fromValue) return fromValue
  }
  return none(`No rule for ${variable.name}`, 'spacing/unknown')
}

// ---------------------------------------------------------------------------
// Entry points

export type VariableInput = {
  kind: BindingKind
  variable: OldVariable
  context: RoleContext
}

/** Resolves one bound old variable to its outcome and candidates. */
export function resolveVariable(input: VariableInput): Resolution {
  const { kind, variable, context } = input
  let resolution: Resolution
  if (variable.type === 'COLOR') {
    resolution = resolveColour(kind, variable, context)
  } else if (variable.type === 'FLOAT') {
    resolution = resolveNumber(kind, variable, context)
  } else {
    resolution = none(
      `No rule for ${variable.type.toLowerCase()} variables such as ${variable.name}`,
      'other/type',
    )
  }
  return fitScope(
    finalise(resolution, (name) => getNewVariable(name) !== undefined),
    kind,
    context.nodeType,
  )
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

/** Turns a sure proposal into a check item when its scopes do not include the property. */
function fitScope(
  resolution: Resolution,
  kind: BindingKind,
  nodeType: string,
): Resolution {
  const proposal = resolution.candidates[0]
  if (resolution.outcome !== 'sure' || !proposal) return resolution
  const scopes = getNewVariable(proposal)?.scopes ?? []
  const accepted = acceptedScopes(kind, nodeType)
  if (scopes.some((scope) => accepted.includes(scope))) return resolution
  return {
    ...resolution,
    outcome: 'check',
    reason: `${resolution.reason}; the old variable sits on a ${PROPERTY_NAMES[kind]}, which ${proposal} is not scoped for`,
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
        reason: `${label}: the old Spacious is the new comfortable`,
        rule: 'mode/density',
      }
    }
    if (modeName === 'Comfortable') {
      return {
        outcome: 'sure',
        target: { collection: 'density', mode: 'compact' },
        reason: `${label}: the old Comfortable was the dense mode, and its values match the new compact`,
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
      reason: `${label}: the mode only selects a ${collectionKey === OLD.appearance ? 'tone' : 'step'}, which goes into the new variable names; it is cleared once nothing below it uses the old variables`,
      rule: 'mode/clear',
    }
  }
  return {
    outcome: 'none',
    target: null,
    reason: `No rule for the mode ${label}`,
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

/** Resolves the typography of a text node, or of one range in it, to a text style. */
export function resolveTypography(input: TypographyInput): Resolution {
  const { fields, font, fontSize, context } = input
  const info: TypeInfo = {}
  const notes: string[] = []
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
      role = 'label'
      notes.push('single-line text inside a control takes label, not body')
    } else {
      role = 'body'
    }
  } else {
    role = context.singleLine ? 'label' : 'body'
    notes.push(
      `no line height variable, so ${role} is chosen because the text is ${context.singleLine ? 'on one line' : 'on several lines'}`,
    )
  }

  // Step
  let step = info.step
  if (!step && fontSize !== undefined) {
    step = stepFromSize(role, fontSize)
    if (step)
      notes.push(
        `no size variable, so the step is the nearest to ${fontSize}px`,
      )
  }
  if (!step) {
    return none('The type size could not be read', 'type/no-step')
  }
  if (role === 'mono') {
    const monoStep = step === 'lg' || TYPE_STEPS.indexOf(step) > 3 ? 'lg' : 'md'
    if (monoStep !== step)
      notes.push(`mono has md and lg only, so ${step} becomes ${monoStep}`)
    step = monoStep
  } else {
    const nearest = nearestStep(role, step)
    if (!nearest) return none(`No ${role} step near ${step}`, 'type/no-step')
    if (nearest !== step)
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
  const resolution: Resolution =
    notes.length === 0
      ? sure(proposal, described, 'type/style')
      : check(
          [proposal, ...alternatives],
          `${described}; ${notes.join('; ')}`,
          'type/style',
        )
  return finalise(resolution, (name) => getNewTextStyle(name) !== undefined)
}
