/**
 * The previews of a run, for the Apply and Convert confirmations. The window
 * asks the plugin as a confirmation opens, and the plugin answers with the
 * counts of the run it would make (scan/apply-plan.ts, previewRun and
 * previewConversions), from the same plan as the run itself. The text of
 * each confirmation is built here from those counts, so every sentence in
 * it follows from what the run does, and the tests can read it without
 * rendering the dialog.
 */
import { useCallback, useRef, useState } from 'react'
import type {
  CarriedComponent,
  ConversionPreview,
  KeptModePreview,
  RemovedModePreview,
  RunPreview,
} from '../scan/apply-plan'
import type { PluginToUi } from '../shared/messages'
import { send, usePluginMessages } from './figma'

/** What a run applies to: the entries, or the selected values. */
export type PreviewScope = { entryIds: string[] } | { recordIds: string[] }

let lastId = 0

function nextId(): number {
  lastId += 1
  return lastId
}

/**
 * Asks the plugin for a preview and keeps the answer to the latest
 * question, so a dialog opened again does not show an earlier answer.
 */
export function useRunPreview(): {
  preview?: RunPreview
  request: (scope: PreviewScope) => void
} {
  const [preview, setPreview] = useState<RunPreview>()
  const asked = useRef<number | undefined>(undefined)
  const onMessage = useCallback((message: PluginToUi) => {
    if (message.type === 'preview' && message.id === asked.current) {
      setPreview(message.preview)
    }
  }, [])
  usePluginMessages(onMessage)
  const request = useCallback((scope: PreviewScope) => {
    const id = nextId()
    asked.current = id
    setPreview(undefined)
    send({ type: 'preview', id, ...scope })
  }, [])
  return { preview, request }
}

/** The same for Convert on the Typography tab: what converting the instances would do. */
export function useConversionPreview(): {
  preview?: ConversionPreview
  request: (instanceIds: string[]) => void
} {
  const [preview, setPreview] = useState<ConversionPreview>()
  const asked = useRef<number | undefined>(undefined)
  const onMessage = useCallback((message: PluginToUi) => {
    if (message.type === 'convert-preview' && message.id === asked.current) {
      setPreview(message.preview)
    }
  }, [])
  usePluginMessages(onMessage)
  const request = useCallback((instanceIds: string[]) => {
    const id = nextId()
    asked.current = id
    setPreview(undefined)
    send({ type: 'preview-convert', id, instanceIds })
  }, [])
  return { preview, request }
}

const count = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`

/** A list in a confirmation, with the sentence that leads into it. */
export type TextList = { lead: string; items: string[] }

/**
 * The text of a confirmation, in the order the dialog shows it. Apply and
 * Convert both build one from the plugin's preview.
 */
export type ConfirmationText = {
  /** What the run applies to, before the changes */
  lead?: string
  /** The changes the run makes, one line for each kind, or a sentence when it makes none */
  changes: TextList | string
  /** Sentences after the changes, such as what changes inside instances */
  details: string[]
  /** Lists after them: legacy modes removed anyway or kept, instances Convert leaves */
  lists: TextList[]
  /** Paragraphs after the lists, such as the main components and their instances */
  notes: string[]
  /** The last paragraph: values left for a later run, how to undo, and the change log */
  footnote: string
}

/** How many kept or removed legacy modes, or reasons, a list names before "and N more" */
const SHOWN = 5

function shortList(lead: string, items: string[]): TextList {
  return {
    lead,
    items:
      items.length > SHOWN
        ? [...items.slice(0, SHOWN), `and ${items.length - SHOWN} more`]
        : items,
  }
}

/** What the run changes, one line for each kind of change it makes. */
export function previewLines(preview: RunPreview): string[] {
  const lines = [
    preview.variables > 0 &&
      count(
        preview.variables,
        'value bound to an EDS Beta variable',
        'values bound to EDS Beta variables',
      ),
    preview.numbers > 0 &&
      count(
        preview.numbers,
        'number set without a variable',
        'numbers set without a variable',
      ),
    preview.textStyles > 0 &&
      count(preview.textStyles, 'text style applied', 'text styles applied'),
    preview.modesSet > 0 &&
      count(preview.modesSet, 'new mode set', 'new modes set'),
    preview.modesCleared > 0 &&
      count(
        preview.modesCleared,
        'legacy mode removed',
        'legacy modes removed',
      ),
    preview.resets > 0 &&
      count(
        preview.resets,
        'layer inside an instance reset for a Manual fix',
        'layers inside instances reset for Manual fixes',
      ),
  ]
  return lines.filter((line): line is string => Boolean(line))
}

/** True when the run changes a layer inside an instance: a value an instance overrides, or a reset. */
export function changesInsideInstances(preview: RunPreview): boolean {
  return preview.inInstances > 0 || preview.resets > 0
}

/**
 * What the run does inside instances: the values an instance overrides,
 * which change in that instance, what a reset for a Manual fix does
 * besides, and the legacy values instances take from their main component,
 * which the run does not change in the instance.
 */
export function instanceLines(preview: RunPreview): string[] {
  const lines: string[] = []
  const overrides = preview.inInstances
  if (overrides > 0) {
    lines.push(
      overrides === 1
        ? '1 of these changes is a value an instance overrides, so it changes in the instance that overrides it.'
        : `${overrides} of these changes are values an instance overrides, so they change in the instance that overrides them.`,
    )
  }
  if (preview.resets > 0) {
    lines.push(
      preview.resets === 1
        ? 'The reset for the Manual fix also removes the other overrides on that layer and the layers below it, and the plugin puts each one back as it is now.'
        : 'Each reset for a Manual fix also removes the other overrides on its layer and the layers below it, and the plugin puts each one back as it is now.',
    )
  }
  const { file, library, typography } = preview.fromMain
  if (file > 0) {
    lines.push(
      file === 1
        ? 'The plugin does not change the legacy value an instance takes from its main component in this file: it changes with the main component.'
        : `The plugin does not change the ${file} legacy values instances take from their main components in this file: they change with their main component.`,
    )
  }
  if (library > 0) {
    lines.push(
      library === 1
        ? 'The plugin does not change the legacy value in an instance of a library component: swap the instance to an EDS Beta component in Figma.'
        : `The plugin does not change the ${library} legacy values in instances of library components: swap those instances to EDS Beta components in Figma.`,
    )
  }
  if (typography > 0) {
    lines.push(
      typography === 1
        ? 'The plugin does not change the legacy value in a Typography instance here: convert the instance on the Typography tab.'
        : `The plugin does not change the ${typography} legacy values in Typography instances here: convert those instances on the Typography tab.`,
    )
  }
  return lines
}

/** A legacy mode a designer removes anyway, and the values below that change with it. */
export function removedLine(removed: RemovedModePreview): string {
  return `${removed.mode} on ${removed.layer} is removed anyway, so the legacy values below that read it change: ${removed.below}.`
}

/** A legacy mode the run keeps, and what it waits for. */
export function keptLine(kept: KeptModePreview): string {
  return kept.setsMode
    ? `${kept.mode} on ${kept.layer} stays beside the new mode until ${kept.waitsFor}.`
    : `${kept.mode} on ${kept.layer} stays, and is cleared once ${kept.waitsFor}.`
}

/** The main components a run changes, and their instances, which change with them. */
export function mainComponentsLine(mainComponents: {
  count: number
  instances: number
}): string {
  const { count: components, instances } = mainComponents
  return `${components === 1 ? 'The main component is' : `The ${components} main components are`} used ${count(instances, 'time', 'times')} in the file. Every instance changes with ${components === 1 ? 'it' : 'them'}, and keeps the text and other overrides set in it.`
}

/** The values to review that the footer's Apply leaves for a later run. */
export function reviewLaterLine(toReview: number): string | undefined {
  if (toReview === 0) return undefined
  return toReview === 1
    ? '1 value to review is left for a later run: review it, then apply again.'
    : `${toReview} values to review are left for a later run: review them, then apply again.`
}

/** The selected values that Apply on ticked values leaves, since they are not Ready. */
export function waitingLine(left: number): string | undefined {
  if (left === 0) return undefined
  return left === 1
    ? '1 of the selected values waits for you to choose a target, and is left for a later run.'
    : `${left} of the selected values wait for you to choose a target, and are left for a later run.`
}

export const UNDO_LINE = 'Undo with Ctrl or Cmd+Z.'

/**
 * The change log every run writes: a note in the shared plugin data of
 * each layer it changes (plugin/apply/log.ts), which Revert frame reads. A
 * note on a layer inside an instance is plugin data the instance sets on
 * that layer, so an override of the instance, which the sentence says when
 * the run changes something inside an instance.
 */
export function changeLogLine(
  revertLabel: string,
  insideInstances: boolean,
): string {
  return insideInstances
    ? `The plugin notes each change in the layer's plugin data, so ${revertLabel} can undo it later, and inside an instance that note is an override of the instance.`
    : `The plugin notes each change in the layer's plugin data, so ${revertLabel} can undo it later.`
}

/** What an Apply confirmation needs besides the preview. */
export type ApplyContext = {
  /** "Revert frame" or "Revert main component" */
  revertLabel: string
  /** The main components among the entries, and how many instances they have in the file */
  mainComponents?: { count: number; instances: number }
  /** The values the run leaves for a later run, from reviewLaterLine or waitingLine */
  later?: string
  /** Apply on the ticked values, rather than on the entries */
  selected?: boolean
}

/**
 * The text of an Apply confirmation, from the plugin's preview of the run:
 * the footer of the scope, of a frame and of the Main components tab, and
 * Apply on ticked values.
 */
export function applyText(
  preview: RunPreview,
  context: ApplyContext,
): ConfirmationText {
  const lines = previewLines(preview)
  const removed = preview.modesRemovedAnyway
  const kept = preview.modesKept
  const lists: TextList[] = []
  if (removed.length > 0) {
    lists.push(
      shortList(
        removed.length === 1
          ? 'You chose to remove 1 legacy mode anyway:'
          : `You chose to remove ${removed.length} legacy modes anyway:`,
        removed.map(removedLine),
      ),
    )
  }
  if (kept.length > 0) {
    lists.push(
      shortList(
        kept.length === 1
          ? '1 legacy mode stays, because values below it that read it are not changed in this run:'
          : `${kept.length} legacy modes stay, because values below them that read them are not changed in this run:`,
        kept.map(keptLine),
      ),
    )
  }
  return {
    ...(context.selected
      ? {
          lead:
            removed.length > 0
              ? 'This run changes the selected values that are Ready, and the legacy values below the modes you chose to remove anyway.'
              : 'This run changes the selected values that are Ready, and nothing else in the scope.',
        }
      : {}),
    changes:
      lines.length > 0
        ? { lead: 'This run makes these changes:', items: lines }
        : 'This run changes nothing.',
    details: instanceLines(preview),
    lists,
    notes: context.mainComponents
      ? [mainComponentsLine(context.mainComponents)]
      : [],
    footnote: [
      context.later,
      UNDO_LINE,
      changeLogLine(context.revertLabel, changesInsideInstances(preview)),
    ]
      .filter(Boolean)
      .join(' '),
  }
}

/** Apply waits for the preview, and has nothing to do when the run changes nothing. */
export function applyDisabled(preview: RunPreview | undefined): boolean {
  return preview === undefined || preview.changes === 0
}

/**
 * The main components whose instances get their text carried across:
 * "The text of the 12 instances of Card is carried across to the new text
 * layer", or, before the instances are counted, "The text each instance of
 * Card shows is carried across …". `layers` is the number of converted
 * instances in main components, one new text layer each.
 */
export function carriedLine(
  carried: CarriedComponent[],
  layers: number,
): string | undefined {
  if (carried.length === 0) return undefined
  const others = carried.length - 1
  const names =
    others === 0
      ? carried[0].name
      : `${carried[0].name} and ${count(others, 'more main component', 'more main components')}`
  const target = layers === 1 ? 'the new text layer' : 'the new text layers'
  const counted = carried.every((item) => item.instances !== undefined)
  if (!counted) {
    return `The text each instance of ${names} shows is carried across to ${target}`
  }
  const total = carried.reduce((sum, item) => sum + (item.instances ?? 0), 0)
  return `The text of the ${count(total, 'instance', 'instances')} of ${names} is carried across to ${target}`
}

/** Which Revert puts converted instances back, by where they are. */
export function convertRevertLabel(preview: ConversionPreview): string {
  if (preview.inComponents === 0) return 'Revert frame'
  if (preview.inComponents === preview.converted) {
    return 'Revert main component'
  }
  return 'Revert frame or Revert main component'
}

/**
 * The change log of a conversion: a note on the new text layer. That layer
 * takes the place of the instance, so it is never inside an instance; in
 * a main component, each instance of the component reads the main
 * component's note.
 */
export function convertLogLine(revertLabel: string): string {
  return `The plugin notes each conversion in the new text layer's plugin data, so ${revertLabel} can put the Typography instance back later.`
}

/**
 * The text of the Convert confirmation on the Typography tab, from the
 * plugin's preview of the conversion: the instances replaced, their
 * colours, the text cases dropped, the text carried across in main
 * components, and the instances Convert leaves, with why.
 */
export function convertText(preview: ConversionPreview): ConfirmationText {
  const lines = [
    preview.converted > 0 &&
      count(
        preview.converted,
        'Typography instance replaced by a text layer with an EDS Beta text style',
        'Typography instances replaced by text layers with an EDS Beta text style',
      ),
    preview.coloursChanged > 0 &&
      count(
        preview.coloursChanged,
        'text colour changed to an EDS Beta variable',
        'text colours changed to EDS Beta variables',
      ),
    preview.coloursLegacy > 0 &&
      count(
        preview.coloursLegacy,
        'text colour left on its legacy variable, which Changes lists after converting',
        'text colours left on their legacy variables, which Changes lists after converting',
      ),
    preview.coloursCopied > 0 &&
      count(
        preview.coloursCopied,
        'text colour copied as it is, since it uses no legacy variable',
        'text colours copied as they are, since they use no legacy variable',
      ),
    preview.casesDropped > 0 &&
      count(
        preview.casesDropped,
        'text case dropped, which you confirmed: the text shows as typed',
        'text cases dropped, which you confirmed: the text shows as typed',
      ),
    carriedLine(preview.carried, preview.inComponents),
  ].filter((line): line is string => Boolean(line))
  const left = preview.skipped.reduce((sum, item) => sum + item.count, 0)
  return {
    changes:
      lines.length > 0
        ? { lead: 'Converting makes these changes:', items: lines }
        : 'Converting changes nothing.',
    details: [],
    lists:
      left > 0
        ? [
            shortList(
              left === 1
                ? 'Convert leaves 1 instance as it is:'
                : `Convert leaves ${left} instances as they are:`,
              preview.skipped.map(
                (item) =>
                  // The reason is written for one instance, so the count follows it.
                  `${item.reason} (${count(item.count, 'instance', 'instances')})`,
              ),
            ),
          ]
        : [],
    notes: [],
    footnote: `${UNDO_LINE} ${convertLogLine(convertRevertLabel(preview))}`,
  }
}

/** Convert waits for the preview, and has nothing to do when no instance is converted. */
export function convertDisabled(
  preview: ConversionPreview | undefined,
): boolean {
  return preview === undefined || preview.converted === 0
}
