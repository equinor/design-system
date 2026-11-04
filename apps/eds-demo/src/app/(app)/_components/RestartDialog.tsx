'use client'

import { Button, Icon } from '@equinor/eds-core-react/next'
import { close } from '@equinor/eds-icons'
import { useEffect, useId, useRef } from 'react'
import type { Mode } from '../../../lib/preferences'

type RestartDialogProps = {
  open: boolean
  mode: Mode
  onCancel: () => void
  onConfirm: () => void
}

/** Confirms a restart. A native modal dialog: the browser keeps focus inside
 * it, closes it on Escape and returns focus to the Restart button. */
export function RestartDialog({
  open,
  mode,
  onCancel,
  onConfirm,
}: RestartDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const textId = useId()

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  }, [open])

  return (
    <dialog
      ref={dialog}
      className="restart-dialog"
      aria-labelledby={titleId}
      aria-describedby={textId}
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
    >
      <div className="restart-dialog-header">
        <h2 id={titleId} className="restart-dialog-title">
          Restart the {mode}
        </h2>
        <div className="restart-dialog-close">
          <Button
            variant="ghost"
            icon
            round
            aria-label="Close"
            onClick={onCancel}
          >
            <Icon data={close} />
          </Button>
        </div>
      </div>
      <p id={textId} className="restart-dialog-content">
        Do you want to restart? Progress will be lost.
      </p>
      <div className="restart-dialog-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" tone="danger" onClick={onConfirm}>
          Restart
        </Button>
      </div>
    </dialog>
  )
}
