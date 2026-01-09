import { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { Accordion, AccordionProps } from './index'

const meta: Meta<typeof Accordion> = {
  title: 'EDS 2.0 (beta)/Accordion',
  component: Accordion,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
**Beta Component** - This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { Accordion } from '@equinor/eds-core-react/next'
\`\`\`

The Accordion component uses the native \`<details>\` element for built-in accessibility and keyboard support.
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state (uncontrolled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the accordion',
    },
  },
}

export default meta

export const Default: StoryFn<AccordionProps> = (args) => {
  return (
    <Accordion {...args}>
      <Accordion.Header>Accordion Header</Accordion.Header>
      <Accordion.Content>
        <p>
          This is the accordion content. It can contain any content you want to
          show when the accordion is expanded.
        </p>
      </Accordion.Content>
    </Accordion>
  )
}

export const MultipleAccordions: StoryFn<AccordionProps> = () => {
  return (
    <>
      <Accordion>
        <Accordion.Header>First Section</Accordion.Header>
        <Accordion.Content>
          <p>Content for the first section.</p>
        </Accordion.Content>
      </Accordion>
      <Accordion>
        <Accordion.Header>Second Section</Accordion.Header>
        <Accordion.Content>
          <p>Content for the second section.</p>
        </Accordion.Content>
      </Accordion>
      <Accordion>
        <Accordion.Header>Third Section</Accordion.Header>
        <Accordion.Content>
          <p>Content for the third section.</p>
        </Accordion.Content>
      </Accordion>
    </>
  )
}
MultipleAccordions.storyName = 'Multiple Accordions'

export const DefaultOpen: StoryFn<AccordionProps> = () => {
  return (
    <>
      <Accordion defaultOpen>
        <Accordion.Header>Open by Default</Accordion.Header>
        <Accordion.Content>
          <p>This accordion is open by default.</p>
        </Accordion.Content>
      </Accordion>
      <Accordion>
        <Accordion.Header>Closed by Default</Accordion.Header>
        <Accordion.Content>
          <p>This accordion is closed by default.</p>
        </Accordion.Content>
      </Accordion>
    </>
  )
}
DefaultOpen.storyName = 'Default Open'

export const Controlled: StoryFn<AccordionProps> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open'} Accordion
        </button>
        <span style={{ marginLeft: '8px' }}>
          State: {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
      <Accordion open={isOpen} onToggle={setIsOpen}>
        <Accordion.Header>Controlled Accordion</Accordion.Header>
        <Accordion.Content>
          <p>This accordion is controlled via external state.</p>
        </Accordion.Content>
      </Accordion>
    </div>
  )
}
Controlled.storyName = 'Controlled State'

export const ExclusiveMode: StoryFn<AccordionProps> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => (open: boolean) => {
    setOpenIndex(open ? index : null)
  }

  return (
    <>
      {[0, 1, 2].map((index) => (
        <Accordion
          key={index}
          open={openIndex === index}
          onToggle={handleToggle(index)}
        >
          <Accordion.Header>Section {index + 1}</Accordion.Header>
          <Accordion.Content>
            <p>
              Content for section {index + 1}. Only one section can be open at a
              time.
            </p>
          </Accordion.Content>
        </Accordion>
      ))}
    </>
  )
}
ExclusiveMode.storyName = 'Exclusive Mode (One at a time)'

export const WithRichContent: StoryFn<AccordionProps> = () => {
  return (
    <>
      <Accordion>
        <Accordion.Header>Product Details</Accordion.Header>
        <Accordion.Content>
          <h4 style={{ margin: '0 0 8px 0' }}>Features</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Feature one with detailed description</li>
            <li>Feature two with another description</li>
            <li>Feature three for good measure</li>
          </ul>
        </Accordion.Content>
      </Accordion>
      <Accordion>
        <Accordion.Header>Technical Specifications</Accordion.Header>
        <Accordion.Content>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td
                  style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                >
                  <strong>Dimension</strong>
                </td>
                <td
                  style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                >
                  100 x 50 x 25 mm
                </td>
              </tr>
              <tr>
                <td
                  style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                >
                  <strong>Weight</strong>
                </td>
                <td
                  style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                >
                  250g
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>
                  <strong>Material</strong>
                </td>
                <td style={{ padding: '8px 0' }}>Aluminum alloy</td>
              </tr>
            </tbody>
          </table>
        </Accordion.Content>
      </Accordion>
    </>
  )
}
WithRichContent.storyName = 'With Rich Content'

export const Disabled: StoryFn<AccordionProps> = () => {
  return (
    <>
      <Accordion disabled>
        <Accordion.Header>Disabled Accordion (Closed)</Accordion.Header>
        <Accordion.Content>
          <p>
            This content is not accessible because the accordion is disabled.
          </p>
        </Accordion.Content>
      </Accordion>
      <Accordion disabled defaultOpen>
        <Accordion.Header>Disabled Accordion (Open)</Accordion.Header>
        <Accordion.Content>
          <p>
            This accordion was open when disabled. It cannot be closed by the
            user.
          </p>
        </Accordion.Content>
      </Accordion>
      <Accordion>
        <Accordion.Header>Enabled Accordion</Accordion.Header>
        <Accordion.Content>
          <p>This accordion is enabled and can be toggled normally.</p>
        </Accordion.Content>
      </Accordion>
    </>
  )
}
Disabled.storyName = 'Disabled State'

export const AllStates: StoryFn<AccordionProps> = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Default (Collapsed)</h4>
        <Accordion>
          <Accordion.Header>Accordion Header</Accordion.Header>
          <Accordion.Content>
            <p>Accordion content goes here.</p>
          </Accordion.Content>
        </Accordion>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Expanded</h4>
        <Accordion defaultOpen>
          <Accordion.Header>Accordion Header</Accordion.Header>
          <Accordion.Content>
            <p>Accordion content goes here.</p>
          </Accordion.Content>
        </Accordion>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Disabled</h4>
        <Accordion disabled>
          <Accordion.Header>Accordion Header</Accordion.Header>
          <Accordion.Content>
            <p>Accordion content goes here.</p>
          </Accordion.Content>
        </Accordion>
      </div>
    </div>
  )
}
AllStates.storyName = 'All States'
