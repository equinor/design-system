import figma from '@figma/code-connect'
import { Accordion } from '.'

figma.connect(
  Accordion,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=6600-15092&m=dev',
  {
    props: {
      open: figma.enum('Open', { On: true, Off: false }),
      title: figma.string('Title'),
      content: figma.string('Content'),
    },
    example: ({ open, title, content }) => (
      <Accordion>
        <Accordion.Item defaultOpen={open}>
          <Accordion.Header>{title}</Accordion.Header>
          <Accordion.Panel>{content}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    ),
  },
)
