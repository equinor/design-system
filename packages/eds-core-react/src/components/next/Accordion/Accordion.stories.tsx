import { useState } from 'react'
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite'
import { Accordion } from './Accordion'
import type { AccordionProps } from './Accordion.types'

const meta: Meta<typeof Accordion> = {
  title: 'EDS 2.0 (beta)/Data Display/Accordion',
  component: Accordion,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

Built on the native \`<details>\`/\`<summary>\` elements for free accessibility,
keyboard support and CSS-only open/close animation.

\`\`\`tsx
import { Accordion } from '@equinor/eds-core-react/next'

<Accordion>
  <Accordion.Item>
    <Accordion.Header>Title</Accordion.Header>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    exclusive: {
      control: 'boolean',
      description:
        'When true, only one item can be open at a time (native HTML group via the `name` attribute).',
    },
  },
  args: {
    exclusive: false,
  },
}

export default meta

export const Introduction: StoryFn<AccordionProps> = (args) => (
  <Accordion {...args}>
    <Accordion.Item defaultOpen>
      <Accordion.Header>First section</Accordion.Header>
      <Accordion.Panel>
        Accordions help manage information density while keeping pages
        scannable.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Second section</Accordion.Header>
      <Accordion.Panel>
        Each section is a native &lt;details&gt; element, so keyboard and screen
        reader behaviour comes for free.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Third section</Accordion.Header>
      <Accordion.Panel>
        Set <code>exclusive</code> on the root to only allow one open at a time.
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)

export const Exclusive: StoryObj<AccordionProps> = {
  args: { exclusive: true },
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item>
        <Accordion.Header>Only one open at a time</Accordion.Header>
        <Accordion.Panel>
          Opening another section closes this one automatically.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Try me</Accordion.Header>
        <Accordion.Panel>
          The exclusive grouping uses the native HTML <code>name</code>{' '}
          attribute on <code>&lt;details&gt;</code>.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>And me</Accordion.Header>
        <Accordion.Panel>No JS state machine needed.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
}

export const Controlled: StoryFn = () => {
  const [open, setOpen] = useState(true)
  return (
    <Accordion>
      <Accordion.Item open={open} onOpenChange={setOpen}>
        <Accordion.Header>Controlled item</Accordion.Header>
        <Accordion.Panel>
          Open state is held by the parent component. Currently:{' '}
          <strong>{open ? 'open' : 'closed'}</strong>.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
