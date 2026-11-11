import { Button } from '@equinor/eds-core-react/next'

type BulkBarProps = {
  count: number
  /** False when the selection mixes kinds of value, such as colours and numbers */
  canChange: boolean
  onChange: () => void
  onLeave: () => void
  onUndo: () => void
  onClear: () => void
}

/** The actions on the ticked bindings, kept at the bottom of the window. */
export function BulkBar({
  count,
  canChange,
  onChange,
  onLeave,
  onUndo,
  onClear,
}: BulkBarProps) {
  if (count === 0) return null
  return (
    <div className="bulk-bar" role="region" aria-label="Selected bindings">
      <span className="bulk-count" role="status">
        {count} selected
      </span>
      <div className="bulk-actions">
        <Button
          size="small"
          onClick={onChange}
          disabled={!canChange}
          title={
            canChange
              ? undefined
              : 'Select bindings that take the same kind of value, such as only colours'
          }
        >
          Change target
        </Button>
        <Button size="small" variant="secondary" onClick={onLeave}>
          Leave as they are
        </Button>
        <Button size="small" variant="secondary" onClick={onUndo}>
          Undo my changes
        </Button>
        <Button size="small" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}
