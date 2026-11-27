import { useLayoutEffect, useRef, useState } from 'react'
import { Button, Dialog } from '@equinor/eds-core-react/next'
import {
  applyDisabled,
  applyText,
  reviewLaterLine,
  useRunPreview,
} from '../preview'
import type { PreviewScope } from '../preview'
import { PreviewCounts } from './PreviewCounts'

type ApplyActionsProps = {
  /** Ready changes the run would make */
  ready: number
  /** Values that wait for a designer, for the review: Needs check, stand-ins, Manual fixes and Decide later */
  toReview: number
  /** “in the scope” or “in this frame” */
  where: string
  /**
   * What the actions change: frames and layers, or main components only,
   * which names Revert for the main component and marks the footer in
   * Figma's component purple
   */
  kind?: 'frame' | 'component'
  /** The changes are inside a main component, which also marks the footer in purple */
  inComponent?: boolean
  /** The main components among the entries, and how many instances they have in the file */
  mainComponents?: { count: number; instances: number }
  /** Layers in the entry the plugin has changed before, for Revert */
  changed?: number
  /**
   * Every EDS value in the entry uses the Beta tokens (health 100%), so
   * nothing is left to apply, rather than something waiting for a check
   */
  done?: boolean
  busy: boolean
  /** What Apply applies to, for the plugin's preview of the run in the confirmation */
  preview: PreviewScope
  onApply: () => void
  onReview?: () => void
  onRevert?: () => void
}

type Confirm = 'apply' | 'revert' | undefined

/**
 * Apply, Review and Revert, each behind a short confirmation that says what
 * will change and how to undo it. The Apply confirmation asks the plugin
 * for a preview of the run as it opens, and says what the run changes, what
 * changes inside instances, which legacy modes stay, and the change log it
 * writes, all from that preview (ui/preview.ts, applyText). Apply waits
 * for the preview.
 */
export function ApplyActions({
  ready,
  toReview,
  where,
  kind = 'frame',
  inComponent = false,
  mainComponents,
  changed = 0,
  done = false,
  busy,
  preview: scope,
  onApply,
  onReview,
  onRevert,
}: ApplyActionsProps) {
  const [confirm, setConfirm] = useState<Confirm>()
  const close = () => setConfirm(undefined)
  const { preview, request } = useRunPreview()
  const openApply = () => {
    request(scope)
    setConfirm('apply')
  }
  // The preview counts the run itself; until it answers, the Ready count.
  const changes = preview?.changes ?? ready
  const revertLabel =
    kind === 'component' ? 'Revert main component' : 'Revert frame'
  // The footer is fixed to the bottom of the window; the content keeps its
  // height free at the end (ui.css, .app-main).
  const footer = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const element = footer.current
    if (!element) return
    const root = document.documentElement
    const update = () =>
      root.style.setProperty(
        '--apply-footer-height',
        `${element.getBoundingClientRect().height}px`,
      )
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--apply-footer-height')
    }
  }, [])
  return (
    // UX review F8 and Check designs: a footer that says what Apply
    // changes and where, with Review and Apply beside it.
    <div
      ref={footer}
      className="apply-actions apply-footer"
      data-main-component={kind === 'component' || inComponent || undefined}
    >
      <div className="apply-summary">
        <span>
          {done ? (
            `Everything ${where} is migrated`
          ) : ready > 0 ? (
            <>
              Change <strong>{ready}</strong> value{ready === 1 ? '' : 's'}{' '}
              {where}
            </>
          ) : (
            `Nothing is ready to apply ${where}`
          )}
        </span>
        {toReview > 0 && (
          <span className="muted">{toReview} to review first</span>
        )}
      </div>
      <div className="apply-buttons">
        {onRevert && changed > 0 && (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => setConfirm('revert')}
          >
            {revertLabel}
          </Button>
        )}
        {onReview && toReview > 0 && (
          <Button variant="secondary" disabled={busy} onClick={onReview}>
            Review {toReview} ⚠
          </Button>
        )}
        {!done && (
          <Button disabled={busy || ready === 0} onClick={openApply}>
            Apply {ready}
          </Button>
        )}
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
                Apply {changes} change{changes === 1 ? '' : 's'} {where}?
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <PreviewCounts
                counting="Counting what the run changes…"
                text={
                  preview &&
                  applyText(preview, {
                    revertLabel,
                    ...(mainComponents ? { mainComponents } : {}),
                    later: reviewLaterLine(toReview),
                  })
                }
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="ghost" onClick={close}>
                Cancel
              </Button>
              <Button
                disabled={applyDisabled(preview)}
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
              <Dialog.Title>
                Revert the changes in this{' '}
                {kind === 'component' ? 'main component' : 'frame'}?
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <p>
                The plugin puts the legacy variables, typography and modes back
                on {changed} layer{changed === 1 ? '' : 's'} it changed, from
                the change log on each layer. A binding someone has changed
                since is left as it is.
                {kind === 'component' &&
                  ' Every instance of the main component changes back with it.'}
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
