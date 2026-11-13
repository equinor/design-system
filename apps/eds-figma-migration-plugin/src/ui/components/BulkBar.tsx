import { useState } from 'react'
import { Button, Dialog } from '@equinor/eds-core-react/next'

type BulkBarProps = {
  count: number
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
  onExclude: () => void
  onReset: () => void
  onClear: () => void
}

/**
 * The actions on the ticked bindings, kept at the bottom of the window.
 * Apply changes only the Ready values among them, behind the same kind of
 * confirmation as Apply in the footer.
 */
export function BulkBar({
  count,
  ready,
  chosen,
  canChange,
  busy,
  onApply,
  onChange,
  onExclude,
  onReset,
  onClear,
}: BulkBarProps) {
  const [confirm, setConfirm] = useState(false)
  if (count === 0) return null
  const left = count - ready
  return (
    <div className="bulk-bar" role="region" aria-label="Selected bindings">
      <span className="bulk-count" role="status">
        {count} selected
      </span>
      <div className="bulk-actions">
        <Button
          size="small"
          onClick={() => setConfirm(true)}
          disabled={busy || ready === 0}
          title={
            ready === 0
              ? 'None of the selected values is Ready. Choose a target for them first.'
              : left > 0
                ? `Applies the ${ready} Ready values. The other ${left} need a check, have no equivalent or are excluded, and stay as they are.`
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
          onClick={onExclude}
          title="Keep the legacy variable on the selected values. Apply leaves them out."
        >
          Exclude
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
            Apply {ready} change{ready === 1 ? '' : 's'} to the selected values?
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          <p>
            The plugin binds the EDS Beta variables and text styles on the
            selected values that are Ready. Everything else in the scope stays
            as it is.
          </p>
          <p className="muted">
            {left > 0
              ? `${left} of the selected value${left === 1 ? '' : 's'} need${left === 1 ? 's' : ''} a check, ${left === 1 ? 'has' : 'have'} no equivalent or ${left === 1 ? 'is' : 'are'} excluded, and stay${left === 1 ? 's' : ''} as ${left === 1 ? 'it is' : 'they are'}. `
              : ''}
            Undo with Ctrl or Cmd+Z, or later with Revert frame.
          </p>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            Cancel
          </Button>
          <Button
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
