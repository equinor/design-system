import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button, Dialog, Icon } from '@equinor/eds-core-react/next'
import { info_circle } from '@equinor/eds-icons'

type InfoButtonProps = {
  /** The button's name for a screen reader, and the dialog's title */
  label: string
  /** The explanation in the dialog */
  children: ReactNode
}

/**
 * An info button that opens an explanation in a dialog, so a long text does
 * not push the lists down in a short window (2026-11-20: on the Instances tab
 * two paragraphs left room for two rows of the tree).
 */
export function InfoButton({ label, children }: InfoButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        icon
        variant="ghost"
        size="small"
        aria-label={label}
        title={label}
        onClick={() => setOpen(true)}
      >
        <Icon data={info_circle} size="md" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>{label}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          <div className="info-dialog">{children}</div>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

type InfoNoteProps = InfoButtonProps & {
  /** The one line that stays in the window */
  summary: ReactNode
}

/** One line of a longer explanation, with the rest behind an info button. */
export function InfoNote({ summary, label, children }: InfoNoteProps) {
  return (
    <div className="info-note">
      <span className="muted">{summary}</span>
      <InfoButton label={label}>{children}</InfoButton>
    </div>
  )
}

type SectionHeadingProps = InfoButtonProps & {
  id: string
  level?: 2 | 3
  title: ReactNode
}

/** A section title with the explanation of the section behind an info button. */
export function SectionHeading({
  id,
  level = 2,
  title,
  label,
  children,
}: SectionHeadingProps) {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <div className="section-heading">
      <Heading id={id} className="section-title">
        {title}
      </Heading>
      <InfoButton label={label}>{children}</InfoButton>
    </div>
  )
}
