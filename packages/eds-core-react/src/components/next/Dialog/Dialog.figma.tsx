import figma from '@figma/code-connect'
import { Dialog } from '.'
import { Button } from '../Button'

figma.connect(
  Dialog,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=6458-254&m=dev',
  {
    props: {
      title: figma.string('Dialog Title'),
      // Trailing space matches the Figma layer name verbatim.
      content: figma.string('Content '),
      showPrimary: figma.boolean('Show Primary Button'),
      showSecondary: figma.boolean('Show Secondary Button'),
    },
    example: ({ title, content, showPrimary, showSecondary }) => (
      <Dialog open onOpenChange={() => {}}>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
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
