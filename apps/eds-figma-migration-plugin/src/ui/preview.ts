/**
 * The preview of a run, for the Apply confirmations. The window asks the
 * plugin as a confirmation opens, and the plugin answers with the counts of
 * the run it would make (scan/apply-plan.ts, previewRun), from the same plan
 * and the same kept legacy modes as the run itself.
 */
import { useCallback, useRef, useState } from 'react'
import type {
  KeptModePreview,
  RemovedModePreview,
  RunPreview,
} from '../scan/apply-plan'
import type { PluginToUi } from '../shared/messages'
import { send, usePluginMessages } from './figma'

/** What a run applies to: the entries, or the selected values. */
export type PreviewScope = { entryIds: string[] } | { recordIds: string[] }

let lastId = 0

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
    lastId += 1
    asked.current = lastId
    setPreview(undefined)
    send({ type: 'preview', id: lastId, ...scope })
  }, [])
  return { preview, request }
}

const count = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`

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

/** The changes inside instances: values an instance overrides, which change in the instance. */
export function instancesLine(preview: RunPreview): string | undefined {
  const n = preview.inInstances
  if (n === 0) return undefined
  return n === 1
    ? '1 of these changes is a value an instance overrides, so it changes in the instance.'
    : `${n} of these changes are values an instance overrides, so they change in the instance.`
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
