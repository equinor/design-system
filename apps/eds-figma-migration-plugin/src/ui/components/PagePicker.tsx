import { useState } from 'react'
import { Button, Checkbox, Dialog } from '@equinor/eds-core-react/next'
import { pagesToScan, scannablePages } from '../../shared/pages'
import type { FilePage } from '../../shared/pages'

type PagePickerProps = {
  open: boolean
  pages: FilePage[]
  /** The pages a scan of the file leaves out now */
  leftOut: string[]
  onClose: () => void
  /** Called with Done, with the pages to leave out */
  onSave: (leftOut: string[]) => void
}

/**
 * The pages a scan of the file reads, ticked in a dialog. The choice takes
 * effect with Done; Cancel and Escape leave it as it was. Dividers are shown
 * as lines, as in Figma's page list, and cannot be ticked.
 */
export function PagePicker({
  open,
  pages,
  leftOut,
  onClose,
  onSave,
}: PagePickerProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      className="pages-dialog"
    >
      {/* Mounted only while open, so each opening starts from the saved choice */}
      {open && (
        <PagePickerBody
          pages={pages}
          leftOut={leftOut}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Dialog>
  )
}

function PagePickerBody({
  pages,
  leftOut,
  onClose,
  onSave,
}: Omit<PagePickerProps, 'open'>) {
  // The pages left out rather than the pages ticked, so a page added while
  // the dialog is open arrives ticked.
  const [draft, setDraft] = useState(() => new Set(leftOut))
  const scannable = scannablePages(pages)
  const selected = pagesToScan(pages, draft).length
  const all = selected === scannable.length
  const none = selected === 0

  const toggle = (pageId: string, checked: boolean) =>
    setDraft((previous) => {
      const next = new Set(previous)
      if (checked) next.delete(pageId)
      else next.add(pageId)
      return next
    })

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Pages to scan</Dialog.Title>
      </Dialog.Header>
      <Dialog.Content>
        <p className="muted">
          File scans the ticked pages, one at a time. The choice is kept in this
          file, for everyone who scans it, and a page added later is ticked
          until someone leaves it out.
        </p>
        <Checkbox
          className="pages-all"
          label={`All pages (${selected}/${scannable.length})`}
          checked={all}
          indeterminate={!all && !none}
          onChange={() =>
            setDraft(
              all ? new Set(scannable.map((page) => page.id)) : new Set(),
            )
          }
        />
        <ul className="pages-list">
          {pages.map((page) =>
            page.divider ? (
              <li key={page.id} className="pages-divider" aria-hidden="true" />
            ) : (
              <li key={page.id}>
                <Checkbox
                  label={page.name}
                  checked={!draft.has(page.id)}
                  onChange={(event) => toggle(page.id, event.target.checked)}
                />
              </li>
            ),
          )}
        </ul>
      </Dialog.Content>
      <Dialog.Actions>
        {none && <span className="muted">Tick one or more pages.</span>}
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={none}
          onClick={() => {
            // Only pages still in the file are kept, so deleted pages do not
            // pile up in the file's plugin data.
            const ids = new Set(scannable.map((page) => page.id))
            onSave([...draft].filter((id) => ids.has(id)))
          }}
        >
          Done
        </Button>
      </Dialog.Actions>
    </>
  )
}
