/** How targets are written in the window. */
import { CLEAR_VALUE, literalText } from '../mapping/literal'
import { isResetTarget, resetText } from '../mapping/reset'
import type { PickerExtra } from '../mapping/picker'
import { CLEAR_MODE, REMOVE_ANYWAY } from '../scan/classify'
import { DECIDE_LATER } from '../scan/mapping'
import type { EffectiveTarget } from '../scan/mapping'

/** The label of Decide later, in the picker and as the target of a value set to it. */
export const DECIDE_LATER_LABEL = 'Decide later'

/** A target in words; null is a value the rules have no proposal for. */
export function targetLabel(target: string | null): string {
  if (target === null) return 'No target'
  if (target === DECIDE_LATER) return DECIDE_LATER_LABEL
  if (isResetTarget(target)) return resetText(target)
  const literal = literalText(target)
  if (literal !== undefined) {
    return target === CLEAR_VALUE ? literal : `${literal}, without a variable`
  }
  // Ready means the next Apply removes it: a legacy mode Apply would keep
  // is Waiting instead (mapping.ts, isKeptWaiting).
  if (target === CLEAR_MODE) return 'Remove the legacy mode'
  if (target === REMOVE_ANYWAY) return REMOVE_ANYWAY_LABEL
  return target
}

/** What removing a legacy mode anyway is called, in the picker, the rows and Review. */
export const REMOVE_ANYWAY_LABEL =
  'Remove the legacy mode anyway (the values below that read it change)'

/**
 * The picker's section for a legacy mode that waits (Waiting): removing it
 * in the next run anyway, which is never a proposal.
 */
export const REMOVE_ANYWAY_OPTION: PickerExtra = {
  title: 'Not waiting',
  targets: [REMOVE_ANYWAY],
}

/**
 * The extra section of the picker for legacy modes: removing them anyway,
 * offered while values below one of them read it and the next Apply leaves
 * those values (`blocked`, from the plugin: apply-plan.ts, modeWaits). That
 * covers a mode the rules keep, one the next Apply keeps, and one set to
 * Decide later.
 */
export function modePickerExtra(
  ids: string[],
  blocked: Record<string, string>,
): PickerExtra | undefined {
  return ids.some((id) => id in blocked) ? REMOVE_ANYWAY_OPTION : undefined
}

/**
 * What the picker says on legacy modes that wait for values below them:
 * what clearing one waits for, or how many wait, and what removing them
 * anyway does. Empty when none of them waits.
 */
export function modePickerNote(
  ids: string[],
  blocked: Record<string, string>,
): string {
  const waiting = ids.filter((id) => id in blocked)
  if (waiting.length === 0) return ''
  if (waiting.length === 1 && ids.length === 1) {
    return `Clearing it waits until ${blocked[waiting[0]]}. To remove it in the next run anyway, choose ${REMOVE_ANYWAY_LABEL}: the legacy values below that read it then change.`
  }
  const which =
    waiting.length === ids.length
      ? 'Each of these legacy modes waits for values below it.'
      : `${waiting.length} of these legacy modes wait for values below them.`
  return `${which} To remove them in the next run anyway, choose ${REMOVE_ANYWAY_LABEL}: the legacy values below that read them then change.`
}

/**
 * What the row picker says about the choices on single values in the row.
 * `own` is how many values in the row have a choice of their own, which a
 * target saved on the row replaces. `back` is how many choices Undo my
 * change brings back now, and `backAfterSave` how many it brings back once
 * a target saved on the row has replaced the values' own choices
 * (choicesToBringBack in scan/mapping.ts). Undo keeps the own choices, so
 * with `back` the note says that too. Empty when there is nothing to say.
 */
export function rowChoicesNote(
  count: number,
  own: number,
  back: number,
  backAfterSave: number,
): string {
  const choices = (n: number) => (n === 1 ? 'the choice' : `the ${n} choices`)
  if (own === 0) {
    return back === 0
      ? ''
      : `Undo my change brings back ${choices(back)} it replaced.`
  }
  const which =
    own === count
      ? count === 1
        ? 'The value has a choice of its own'
        : 'Each of them has a choice of its own'
      : own === 1
        ? '1 of them has a choice of its own'
        : `${own} of them have a choice of their own`
  const undo =
    back === 0
      ? `Undo my change brings back ${choices(backAfterSave)} it replaced.`
      : `Undo my change keeps ${own === 1 ? 'it' : 'them'} and brings back ${choices(back)} it replaced.`
  return `${which}, which this replaces. ${undo}`
}

/**
 * What a No equivalent value says before anybody has chosen a target: the
 * stand-in the plugin proposes for the gap in the EDS Beta. A string or
 * boolean variable has no stand-in. A legacy mode that waits for the values
 * below says so from the kept modes instead (KEPT_TARGET_LABEL).
 */
export function unchangedLabel(standIn?: string | null): string {
  if (standIn) {
    return `Stand-in: ${standIn === CLEAR_MODE ? 'Remove the legacy mode' : targetLabel(standIn)}`
  }
  return 'No equivalent and no stand-in'
}

/**
 * Who chose the target, under the target of a value. Decide later also says
 * what it means for the next run, since the value is not changed: Apply
 * leaves it, or Convert on the Typography tab leaves the instance.
 */
export function sourceLabel(
  source: EffectiveTarget['source'],
  target?: EffectiveTarget['target'],
  run: 'Apply' | 'Convert' = 'Apply',
): string | undefined {
  const later = target === DECIDE_LATER
  switch (source) {
    case 'record':
      return later
        ? `Your choice for this value. ${run} leaves it until you choose a target.`
        : 'Your choice for this value'
    case 'row':
      return later
        ? `Your choice for all of these. ${run} leaves them until you choose a target.`
        : 'Your choice for all of these'
    default:
      return undefined
  }
}
