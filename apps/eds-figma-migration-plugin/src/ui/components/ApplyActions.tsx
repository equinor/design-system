import { useState } from 'react'
import { Button, Dialog } from '@equinor/eds-core-react/next'

type ApplyActionsProps = {
  /** Ready changes the run would make */
  ready: number
  /** Needs check bindings nobody has decided on, for the review */
  toReview: number
  /** “in the scope” or “in this frame” */
  where: string
  /** The main components among the entries, and how many instances they have in the file */
  mainComponents?: { count: number; instances: number }
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
  mainComponents,
  changed = 0,
  busy,
  onApply,
  onReview,
  onRevert,
}: ApplyActionsProps) {
  const [confirm, setConfirm] = useState<Confirm>()
  const close = () => setConfirm(undefined)
  return (
    // UX review F8 and Check designs: a footer that says what Apply
    // changes and where, with Review and Apply beside it.
    <div className="apply-actions apply-footer">
      <div className="apply-summary">
        <span>
          {ready > 0 ? (
            <>
              Change <strong>{ready}</strong> value{ready === 1 ? '' : 's'}{' '}
              {where}
            </>
          ) : (
            `Nothing is ready to apply ${where}`
          )}
        </span>
        {toReview > 0 && (
          <span className="muted">
            {toReview} need{toReview === 1 ? 's' : ''} a check first
          </span>
        )}
      </div>
      <div className="apply-buttons">
        {onRevert && changed > 0 && (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => setConfirm('revert')}
          >
            Revert frame
          </Button>
        )}
        {onReview && toReview > 0 && (
          <Button variant="secondary" disabled={busy} onClick={onReview}>
            Review {toReview} ⚠
          </Button>
        )}
        <Button
          disabled={busy || ready === 0}
          onClick={() => setConfirm('apply')}
        >
          Apply {ready}
        </Button>
      </div>
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
              {mainComponents && (
                <p>
                  {mainComponents.count === 1
                    ? 'The main component is'
                    : `The ${mainComponents.count} main components are`}{' '}
                  used {mainComponents.instances} time
                  {mainComponents.instances === 1 ? '' : 's'} in the file. Every
                  instance changes with{' '}
                  {mainComponents.count === 1 ? 'it' : 'them'}, and keeps the
                  text and other overrides set in it.
                </p>
              )}
              <p className="muted">
                {mainComponents
                  ? 'The plugin changes nothing in an instance directly.'
                  : 'Nothing inside an instance changes.'}
                {toReview > 0
                  ? ` ${toReview} value${toReview === 1 ? '' : 's'} that need a check stay as they are until you review them.`
                  : ''}{' '}
                Undo with Ctrl or Cmd+Z, or later with Revert frame.
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
