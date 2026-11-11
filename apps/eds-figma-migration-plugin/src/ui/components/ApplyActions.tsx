import { useState } from 'react'
import { Button, Dialog } from '@equinor/eds-core-react/next'

type ApplyActionsProps = {
  /** Ready changes the run would make */
  ready: number
  /** Needs check bindings nobody has decided on, for the review */
  toReview: number
  /** “in the scope” or “in this frame” */
  where: string
  /** Layers in the entry the plugin has changed before, for Revert */
  changed?: number
  busy: boolean
  onApply: () => void
  onReview?: () => void
  onRevert?: () => void
}

type Confirm = 'apply' | 'revert' | undefined

/**
 * Apply, Review and Revert, each behind a short confirmation that says what
 * will change and how to undo it.
 */
export function ApplyActions({
  ready,
  toReview,
  where,
  changed = 0,
  busy,
  onApply,
  onReview,
  onRevert,
}: ApplyActionsProps) {
  const [confirm, setConfirm] = useState<Confirm>()
  const close = () => setConfirm(undefined)
  return (
    <div className="apply-actions">
      <div className="apply-buttons">
        <Button
          disabled={busy || ready === 0}
          onClick={() => setConfirm('apply')}
        >
          Apply {ready} ready
        </Button>
        {onReview && (
          <Button
            variant="secondary"
            disabled={busy || toReview === 0}
            onClick={onReview}
          >
            Review {toReview} ⚠
          </Button>
        )}
        {onRevert && changed > 0 && (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => setConfirm('revert')}
          >
            Revert frame
          </Button>
        )}
      </div>
      {onReview && ready === 0 && toReview > 0 && (
        <p className="muted">
          Nothing is ready to apply {where}. Review the bindings that need a
          check first.
        </p>
      )}
      <Dialog
        open={confirm !== undefined}
        onOpenChange={(open) => {
          if (!open) close()
        }}
      >
        {confirm === 'apply' && (
          <>
            <Dialog.Header>
              <Dialog.Title>
                Apply {ready} change{ready === 1 ? '' : 's'} {where}?
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <p>
                The plugin binds the EDS Foundation variables and text styles,
                and sets the new modes. A legacy mode is cleared only when no
                layer below it uses a legacy variable any more.
              </p>
              <p className="muted">
                Nothing inside an instance changes, and bindings that need a
                check stay until you review them. Undo with Ctrl or Cmd+Z, or
                later with Revert frame.
              </p>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="ghost" onClick={close}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  close()
                  onApply()
                }}
              >
                Apply
              </Button>
            </Dialog.Actions>
          </>
        )}
        {confirm === 'revert' && (
          <>
            <Dialog.Header>
              <Dialog.Title>Revert the changes in this frame?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <p>
                The plugin puts the legacy variables, typography and modes back
                on {changed} layer{changed === 1 ? '' : 's'} it changed, from
                the change log on each layer. A binding someone has changed
                since is left as it is.
              </p>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="ghost" onClick={close}>
                Cancel
              </Button>
              <Button
                tone="danger"
                onClick={() => {
                  close()
                  onRevert?.()
                }}
              >
                Revert
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </div>
  )
}
