import figma from '@figma/code-connect'
import { Dialog } from '.'
import { Button } from '../Button'

figma.connect(
  Dialog,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=6458-254&m=dev',
  {
    props: {
      title: figma.string('Dialog Title'),
      content: figma.string('Content '),
      hasClose: figma.boolean('Has Close Icon'),
      showPrimary: figma.boolean('Show Primary Button'),
      showSecondary: figma.boolean('Show Secondary Button'),
    },
    example: ({ title, content, hasClose, showPrimary, showSecondary }) => (
      <Dialog open onOpenChange={() => {}} aria-labelledby="dialog-title">
        <Dialog.Header onClose={hasClose ? () => {} : undefined}>
          <Dialog.Title id="dialog-title">{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>{content}</Dialog.Content>
        <Dialog.Actions>
          {showSecondary && <Button variant="secondary">Label</Button>}
          {showPrimary && <Button>Label</Button>}
        </Dialog.Actions>
      </Dialog>
    ),
  },
)
