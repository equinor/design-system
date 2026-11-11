import roleHints from './role-hints.json'
import type { RoleContext } from './types'

export type State = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled'

export type RoleGuess = {
  role: 'interactive' | 'non-interactive'
  selected: boolean
  state: State
  /**
   * Which keyword list the deciding name matched: `both` when one name
   * matched both lists, `none` when no name matched either.
   */
  keyword: 'interactive' | 'non-interactive' | 'both' | 'none'
  /**
   * True when something about the layer points to interactive or selected:
   * an interactive keyword, a state or selection in the name, prototype
   * interactions, or a name that matches both lists. Layout with no such sign
   * is treated as non-interactive without asking.
   */
  signal: boolean
  /** What decided the guess, in words */
  because: string
}

type KeywordList = 'outlineControls' | 'fieldControls' | 'labelControls'

/** Lower-cases a layer name and turns punctuation into spaces, so keywords match whole words. */
function normalise(name: string): string {
  return ` ${name
    .toLowerCase()
    .replace(/[^a-z0-9À-ɏ]+/g, ' ')
    .trim()} `
}

function findKeyword(name: string, keywords: string[]): string | undefined {
  const normalised = normalise(name)
  return keywords.find((keyword) => normalised.includes(normalise(keyword)))
}

const STATE_ORDER: Exclude<State, 'default'>[] = [
  'disabled',
  'pressed',
  'hover',
  'focus',
]

function findState(name: string): State | undefined {
  return STATE_ORDER.find(
    (state) => findKeyword(name, roleHints.states[state]) !== undefined,
  )
}

function hasRoleKeyword(name: string): boolean {
  return (
    findKeyword(name, roleHints.interactive) !== undefined ||
    findKeyword(name, roleHints.nonInteractive) !== undefined
  )
}

/**
 * How many names, from the layer's own up, can decide its role. A frame is
 * the element that owns its fill and stroke, so only its own name counts;
 * otherwise a table inside a frame called “Bottom row” would be taken for a
 * row. A shape is usually the background or outline of its parent, and a
 * text or icon sits inside a container inside the element.
 */
function roleDepth(nodeType: string): number {
  if (nodeType === 'TEXT') return 3
  if (
    [
      'RECTANGLE',
      'ELLIPSE',
      'POLYGON',
      'STAR',
      'VECTOR',
      'LINE',
      'BOOLEAN_OPERATION',
    ].includes(nodeType)
  ) {
    return 2
  }
  return 1
}

/**
 * The names that decide the role: the layer's own name and its ancestors up
 * to the nearest one with a role keyword, within the depth for the node type.
 */
function decidingNames(context: RoleContext): string[] {
  const names = context.names.slice(0, roleDepth(context.nodeType))
  const index = names.findIndex(hasRoleKeyword)
  return index === -1 ? names : names.slice(0, index + 1)
}

/** True when the layer or its parent matches a keyword list. */
export function nearNamesMatch(
  context: RoleContext,
  list: KeywordList,
): boolean {
  return context.names
    .slice(0, 2)
    .some((name) => findKeyword(name, roleHints[list]) !== undefined)
}

/** True when the nearest name with a role keyword also matches a keyword list. */
export function roleNameMatches(
  context: RoleContext,
  list: KeywordList,
): boolean {
  const name = decidingNames(context).find(hasRoleKeyword)
  return name !== undefined && findKeyword(name, roleHints[list]) !== undefined
}

/** True when exactly one side of the layer has a stroke, which makes the stroke a divider. */
export function isDivider(context: RoleContext): boolean {
  if (!context.strokeSides) return false
  return context.strokeSides.filter((weight) => weight > 0).length === 1
}

/**
 * Guesses whether a layer is interactive, selected, and in which state, from
 * its own name and the names of its ancestors. The search stops at the
 * nearest name with a role keyword, so a label inside a button inside a card
 * takes the button's role.
 */
export function guessRole(context: RoleContext): RoleGuess {
  const names = decidingNames(context)

  let selectedName: string | undefined
  let selectedKeyword: string | undefined
  let state: State | undefined
  for (const name of names) {
    if (!selectedName) {
      selectedKeyword = findKeyword(name, roleHints.selected)
      if (selectedKeyword) selectedName = name
    }
    state ??= findState(name)
  }
  const selected = selectedName !== undefined
  const interactiveState = state === 'hover' || state === 'pressed'
  const base = { selected, state: state ?? 'default' }

  const roleName = names.find(hasRoleKeyword)
  const interactiveKeyword = roleName
    ? findKeyword(roleName, roleHints.interactive)
    : undefined
  const nonInteractiveKeyword = roleName
    ? findKeyword(roleName, roleHints.nonInteractive)
    : undefined

  if (interactiveKeyword && nonInteractiveKeyword) {
    return {
      ...base,
      role: 'non-interactive',
      keyword: 'both',
      signal: true,
      because: `“${roleName}” matches both ${interactiveKeyword}, which is interactive, and ${nonInteractiveKeyword}, which is not`,
    }
  }
  if (interactiveKeyword) {
    return {
      ...base,
      role: 'interactive',
      keyword: 'interactive',
      signal: true,
      because: selected
        ? `“${selectedName}” says ${selectedKeyword}`
        : `“${roleName}” matches ${interactiveKeyword}`,
    }
  }
  if (selected || interactiveState || context.hasReactions) {
    return {
      ...base,
      role: 'interactive',
      keyword: nonInteractiveKeyword ? 'non-interactive' : 'none',
      signal: true,
      because: selected
        ? `“${selectedName}” says ${selectedKeyword}`
        : interactiveState
          ? `the name has the state ${state}`
          : 'the layer has prototype interactions',
    }
  }
  if (nonInteractiveKeyword) {
    return {
      ...base,
      role: 'non-interactive',
      keyword: 'non-interactive',
      signal: false,
      because: `“${roleName}” matches ${nonInteractiveKeyword}`,
    }
  }
  return {
    ...base,
    role: 'non-interactive',
    keyword: 'none',
    signal: false,
    because: 'no layer name points to an interactive element',
  }
}
