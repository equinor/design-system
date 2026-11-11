/**
 * The options an override picker offers: the rule's candidates first, then
 * every other variable or text style that fits the property.
 */
import { NEW_TEXT_STYLES, NEW_VARIABLES } from './inventory'
import { FORBIDDEN_TARGETS } from './rules'
import type { BindingKind } from './types'

export type PickerSubject = {
  /** What the bindings are on; empty for typography and modes */
  kinds: BindingKind[]
  group:
    'colour' | 'typography' | 'spacing' | 'size' | 'radius' | 'modes' | 'other'
  candidates: string[]
}

export type PickerOptions = {
  /** The rule's candidates, the proposal first */
  proposed: string[]
  /** Everything else that fits, in the order of compareNames */
  others: string[]
}

/** Where a size sits on the scale: none, 9xs … 2xs, xs, sm, md, lg, xl, 2xl … 9xl. */
function sizeRank(segment: string): number | undefined {
  if (segment === 'none') return -100
  const match = /^(\d*)(xs|sm|md|lg|xl)$/.exec(segment)
  if (!match) return undefined
  const times = match[1] ? Number(match[1]) : 1
  switch (match[2]) {
    case 'xs':
      return 2 - times
    case 'sm':
      return 2
    case 'md':
      return 3
    case 'lg':
      return 4
    default:
      return 4 + times
  }
}

/** States and weights in the order a designer reads them. */
const WORD_ORDER = ['default', 'medium', 'bold', 'hover', 'pressed']

function compareSegments(a: string, b: string): number {
  const sizeA = sizeRank(a)
  const sizeB = sizeRank(b)
  if (sizeA !== undefined && sizeB !== undefined) return sizeA - sizeB
  const wordA = WORD_ORDER.indexOf(a)
  const wordB = WORD_ORDER.indexOf(b)
  if (wordA >= 0 && wordB >= 0) return wordA - wordB
  return a.localeCompare(b, 'en', { numeric: true })
}

/**
 * Orders names the way Figma's picker lists the EDS Foundation library:
 * sizes from small to large (sm before md before lg, xs before 2xl),
 * default before hover and pressed, and numbers by value (cat/2 before
 * cat/10). The inventory itself is sorted by plain string comparison.
 */
export function compareNames(a: string, b: string): number {
  const partsA = a.split('/')
  const partsB = b.split('/')
  for (let index = 0; index < Math.min(partsA.length, partsB.length); index++) {
    const result = compareSegments(partsA[index], partsB[index])
    if (result !== 0) return result
  }
  return partsA.length - partsB.length
}

const COLOUR_KINDS: BindingKind[] = ['fill', 'stroke', 'effect', 'textFill']

/** Scopes a variable needs to be offered for a property. Scopes only steer Figma's picker, so this is a filter for usefulness, not validity. */
function scopesFor(kind: BindingKind): string[] | undefined {
  switch (kind) {
    case 'fill':
      return ['FRAME_FILL', 'SHAPE_FILL', 'ALL_FILLS', 'ALL_SCOPES']
    case 'textFill':
      return ['TEXT_FILL', 'ALL_FILLS', 'ALL_SCOPES']
    case 'stroke':
      return ['STROKE_COLOR', 'ALL_SCOPES']
    case 'effect':
      return ['EFFECT_COLOR', 'ALL_SCOPES']
    case 'spacing':
      return ['GAP', 'ALL_SCOPES']
    case 'size':
      return ['WIDTH_HEIGHT', 'ALL_SCOPES']
    case 'radius':
      return ['CORNER_RADIUS', 'ALL_SCOPES']
    default:
      return undefined
  }
}

const MODE_OPTIONS: Record<string, string[]> = {
  density: ['density: comfortable', 'density: compact', 'density: relaxed'],
  'color-scheme': ['color-scheme: light', 'color-scheme: dark'],
}

export function pickerOptions(subject: PickerSubject): PickerOptions {
  const proposed = subject.candidates.filter(
    (name) => !FORBIDDEN_TARGETS.includes(name),
  )
  const without = (names: string[]) =>
    names.filter((name) => !proposed.includes(name))

  if (subject.group === 'typography') {
    return {
      proposed,
      others: without(NEW_TEXT_STYLES.map((s) => s.name)).sort(compareNames),
    }
  }
  if (subject.group === 'modes') {
    const collection = proposed[0]?.split(':')[0]
    return {
      proposed,
      others: without(collection ? (MODE_OPTIONS[collection] ?? []) : []),
    }
  }
  if (subject.kinds.length === 0) return { proposed, others: [] }

  const type = COLOUR_KINDS.includes(subject.kinds[0]) ? 'COLOR' : 'FLOAT'
  const scopeLists = subject.kinds.map(scopesFor)
  // Any scope that fits one of the properties is offered.
  const scopes = scopeLists.includes(undefined)
    ? undefined
    : [...new Set(scopeLists.flatMap((list) => list ?? []))]
  const fitting = NEW_VARIABLES.filter(
    (variable) =>
      variable.type === type &&
      !FORBIDDEN_TARGETS.includes(variable.name) &&
      (!scopes || variable.scopes.some((scope) => scopes.includes(scope))),
  )
    .map((variable) => variable.name)
    .sort(compareNames)
  // Data visualisation colours fit every colour property; they go last.
  const isDataViz = (name: string) => name.startsWith('data-visualization/')
  return {
    proposed,
    others: without([
      ...fitting.filter((name) => !isDataViz(name)),
      ...fitting.filter(isDataViz),
    ]),
  }
}

export type PickerItem = {
  kind?: BindingKind
  group: PickerSubject['group']
  candidates: string[]
}

/**
 * What kind of value a binding takes. Bindings can only share one target
 * when they take the same kind of value: colours, numbers, text styles, or
 * the modes of one collection.
 */
export function valueType(item: PickerItem): string {
  if (item.group === 'typography') return 'typography'
  if (item.group === 'modes') {
    return `mode:${item.candidates[0]?.split(':')[0] ?? 'clear'}`
  }
  if (item.kind && COLOUR_KINDS.includes(item.kind)) return 'colour'
  return 'number'
}

/** One picker for several bindings, or undefined when they take different kinds of value. */
export function sharedSubject(items: PickerItem[]): PickerSubject | undefined {
  if (items.length === 0) return undefined
  const types = new Set(items.map(valueType))
  if (types.size > 1 || types.has('mode:clear')) return undefined
  // The most proposed targets first.
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const name of item.candidates.slice(0, 1)) {
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }
  const candidates = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
  return {
    kinds: [
      ...new Set(
        items
          .map((item) => item.kind)
          .filter((kind): kind is BindingKind => kind !== undefined),
      ),
    ],
    group: items[0].group,
    candidates,
  }
}
