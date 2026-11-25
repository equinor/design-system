import { useState } from 'react'
import { Button, Dialog } from '@equinor/eds-core-react/next'
import { plural } from '../labels'
import {
  applyDisabled,
  applyText,
  useRunPreview,
  waitingLine,
} from '../preview'
import { PreviewCounts } from './PreviewCounts'

type BulkBarProps = {
  count: number
  /** The selected values, for the plugin's preview of the run in the confirmation */
  recordIds: string[]
  /** The selected values that are Ready after the choices, which Apply changes */
  ready: number
  /** The selected values with a choice of their own, which Reset choices removes */
  chosen: number
  /** False when the selection mixes kinds of value, such as colours and numbers */
  canChange: boolean
  /** True while a scan or an apply runs, or when the scan is out of date */
  busy: boolean
  onApply: () => void
  onChange: () => void
  /** Sets the selected values to Decide later */
  onDecideLater: () => void
  onReset: () => void
  onClear: () => void
}

/**
 * The actions on the ticked bindings, kept at the bottom of the window.
 * Apply changes only the Ready values among them, behind the same kind of
 * confirmation as Apply in the footer, with the plugin's preview of the run
 * (ui/preview.ts, applyText). The preview names the legacy modes that stay
 * because values below them are not selected.
 */
export function BulkBar({
  count,
  recordIds,
  ready,
  chosen,
  canChange,
  busy,
  onApply,
  onChange,
  onDecideLater,
  onReset,
  onClear,
}: BulkBarProps) {
  const [confirm, setConfirm] = useState(false)
  const { preview, request } = useRunPreview()
  if (count === 0) return null
  const left = count - ready
  // The preview counts the run itself; until it answers, the Ready count.
  const changes = preview?.changes ?? ready
  return (
    <div className="bulk-bar" role="region" aria-label="Selected bindings">
      <span className="bulk-count" role="status">
        {count} selected
      </span>
      <div className="bulk-actions">
        <Button
          size="small"
          onClick={() => {
            request({ recordIds })
            setConfirm(true)
          }}
          disabled={busy || ready === 0}
          title={
            ready === 0
              ? 'None of the selected values is Ready. Choose a target for them first.'
              : left > 0
                ? `Applies the ${plural(ready, 'Ready value')}. The other ${left} ${left === 1 ? 'waits' : 'wait'} for you to choose a target, and ${left === 1 ? 'is' : 'are'} left for a later run.`
                : undefined
          }
        >
          {left > 0 && ready > 0 ? `Apply ${ready}` : 'Apply'}
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={onChange}
          disabled={!canChange}
          title={
            canChange
              ? undefined
              : 'Select values of the same kind, such as only colours'
          }
        >
          Change target
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={onDecideLater}
          title="Leaves the selected values for a later run. Apply does not change them, and they count as not migrated until you choose a target."
        >
          Decide later
        </Button>
        {chosen > 0 && (
          <Button
            size="small"
            variant="secondary"
            onClick={onReset}
            title={`Removes your choice on ${chosen === count ? 'the selected values' : `${chosen} of the selected values`}, so they get the proposal, or the change on their row, again.`}
          >
            Reset choices
          </Button>
        )}
        <Button size="small" variant="ghost" onClick={onClear}>
          Clear selection
        </Button>
      </div>
      <Dialog
        open={confirm}
        onOpenChange={(open) => {
          if (!open) setConfirm(false)
        }}
      >
        <Dialog.Header>
          <Dialog.Title>
            Apply {changes} change{changes === 1 ? '' : 's'} to the selected
            values?
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          <PreviewCounts
            counting="Counting what the run changes…"
            text={
              preview &&
              applyText(preview, {
                revertLabel: 'Revert frame',
                later: waitingLine(left),
                selected: true,
              })
            }
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            Cancel
          </Button>
          <Button
            disabled={applyDisabled(preview)}
            onClick={() => {
              setConfirm(false)
              onApply()
            }}
          >
            Apply
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
