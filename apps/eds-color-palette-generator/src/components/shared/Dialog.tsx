'use client'

import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { close } from '@equinor/eds-icons'
import { Button } from './Button'
import { Icon } from './Icon'

type DialogProps = {
  open: boolean
  /** Called on the close button, Escape and a click on the backdrop */
  onClose: () => void
  title: ReactNode
  children: ReactNode
  /** Footer buttons, right-aligned: secondary first, primary last */
  actions?: ReactNode
  className?: string
}

// Header, content and footer share one padding, as the EDS 2.0 Dialog does.
const SECTION = 'px-[var(--eds-spacing-md)] py-[var(--eds-spacing-md)]'

/**
 * Modal dialog modelled on the EDS 2.0 Dialog: a title with a close button,
 * the content, and right-aligned actions on background.dialog.
 *
 * The native <dialog> opened with showModal() traps focus, closes on Escape
 * and returns focus to the element that opened it.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  // Set while the effect closes the dialog because `open` became false. The
  // parent already knows, so that close must not call onClose again.
  const closingFromProp = useRef(false)
  // Whether the current press started on the backdrop. A press that starts
  // in the content (selecting text, say) and ends on the backdrop must not
  // close the dialog.
  const pressedOnBackdrop = useRef(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) {
      closingFromProp.current = true
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // Fires for Escape as well as for dialog.close()
      onClose={() => {
        if (closingFromProp.current) {
          closingFromProp.current = false
          return
        }
        onClose()
      }}
      onMouseDown={(event) => {
        // The content fills the dialog, so only the backdrop hits it directly
        pressedOnBackdrop.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (pressedOnBackdrop.current && event.target === event.currentTarget) {
          onClose()
        }
        pressedOnBackdrop.current = false
      }}
      className={[
        'm-auto w-[min(480px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-auto rounded border-0 bg-dialog p-0 text-primary shadow-lg backdrop:bg-[var(--eds-overlay-scrim)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col">
        <div className={`flex items-center gap-2 ${SECTION}`}>
          <h2
            id={titleId}
            className="m-0 flex-1 text-lg font-medium text-primary"
            // The global h1–h3 rule sets the Equinor header font; the EDS
            // Dialog title uses the UI font.
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {title}
          </h2>
          <Button variant="ghost" iconOnly aria-label="Close" onClick={onClose}>
            <Icon data={close} size={24} />
          </Button>
        </div>

        <div className={`flex flex-col gap-4 text-base ${SECTION}`}>
          {children}
        </div>

        {actions && (
          <div className={`flex items-center justify-end gap-2 ${SECTION}`}>
            {actions}
          </div>
        )}
      </div>
    </dialog>
  )
}
