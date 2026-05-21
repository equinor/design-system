import { useState } from 'react'
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite'
import { Accordion } from '.'
import type { AccordionProps } from '.'

const meta: Meta<typeof Accordion> = {
  title: 'EDS 2.0 (beta)/Surface/Accordion',
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

const SchemePreview = () => (
  <Accordion>
    <Accordion.Item defaultOpen>
      <Accordion.Header>Open by default</Accordion.Header>
      <Accordion.Panel>
        Title is held at <code>--eds-color-text-accent-subtle</code> when open.
        Content uses <code>--eds-color-text-subtle</code>.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Closed</Accordion.Header>
      <Accordion.Panel>Hidden until opened.</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Hover or focus me</Accordion.Header>
      <Accordion.Panel>
        Hover bg <code>--eds-color-bg-fill-muted-default</code>; focus outline{' '}
        <code>--eds-color-border-focus</code>.
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)

const DensityPreview = () => (
  <Accordion>
    <Accordion.Item defaultOpen>
      <Accordion.Header>First section</Accordion.Header>
      <Accordion.Panel>
        Spacing and sizes pick up the ancestor <code>data-density</code> value.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Second section</Accordion.Header>
      <Accordion.Panel>Content hidden until opened.</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)

/**
 * Accordion respects the `data-density` attribute on an ancestor element so
 * spacing and sizing tokens stay coordinated with sibling components.
 */
export const Density: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
    <div data-density="spacious">
      <h3 style={{ margin: '0 0 12px' }}>Spacious (default)</h3>
      <DensityPreview />
    </div>
    <div data-density="comfortable">
      <h3 style={{ margin: '0 0 12px' }}>Comfortable</h3>
      <DensityPreview />
    </div>
  </div>
)

/**
 * Side-by-side preview of the Accordion in both color schemes — used to
 * verify dark theme since Storybook's own dark-mode toggle is unreliable.
 */
export const ColorSchemes: StoryFn = () => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
    <div
      data-color-scheme="light"
      style={{
        flex: 1,
        padding: 24,
        background: 'var(--eds-color-bg-canvas)',
        color: 'var(--eds-color-text-strong)',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Light</h3>
      <SchemePreview />
    </div>
    <div
      data-color-scheme="dark"
      style={{
        flex: 1,
        padding: 24,
        background: 'var(--eds-color-bg-canvas)',
        color: 'var(--eds-color-text-strong)',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Dark</h3>
      <SchemePreview />
    </div>
  </div>
)
