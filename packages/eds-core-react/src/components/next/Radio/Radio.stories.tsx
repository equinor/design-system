import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { Stack } from './../../../../.storybook/components'
import { Radio } from './Radio'
import type { RadioProps } from './Radio.types'

const meta: Meta<typeof Radio> = {
  title: 'EDS 2.0 (beta)/Inputs/Radio',
  component: Radio,
  args: {
    label: 'Option',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component: `**⚠️ Beta Component** - This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { Radio } from '@equinor/eds-core-react/next'

// Radio group
<fieldset>
  <legend>Select option</legend>
  <Radio label="Option 1" name="group" value="1" />
  <Radio label="Option 2" name="group" value="2" />
</fieldset>

// Without visible label (use aria-label)
<Radio aria-label="Select row" name="table-row" />
\`\`\`

Radio buttons allow users to select one option from a set. Always use within a group with the same \`name\` attribute.
`,
      },
      source: {
        excludeDecorators: true,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed next to the radio button',
      table: {
        category: 'Core',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables radio button interaction',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
      table: {
        category: 'States',
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state for uncontrolled usage',
      table: {
        category: 'States',
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names for the input element',
      table: {
        category: 'Styling',
      },
    },
    id: {
      control: 'text',
      description: 'HTML id attribute',
      table: {
        category: 'HTML Attributes',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name attribute for form submission',
      table: {
        category: 'HTML Attributes',
      },
    },
    value: {
      control: 'text',
      description: 'HTML value attribute for form submission',
      table: {
        category: 'HTML Attributes',
      },
    },
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
}

export default meta

const Wrapper = ({
  children,
  gap = 16,
  ...rest
}: {
  children: ReactNode
  gap?: number
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${gap}px`,
      alignItems: 'flex-start',
    }}
    {...rest}
  >
    {children}
  </div>
)

const AllVariants = ({ prefix = 'default' }: { prefix?: string }) => (
  <>
    <Radio label="Unchecked" name={`${prefix}-unchecked`} value="unchecked" />
    <Radio
      label="Checked"
      name={`${prefix}-checked`}
      value="checked"
      defaultChecked
    />
    <Radio label="Disabled" name={`${prefix}-disabled`} disabled />
    <Radio
      label="Disabled checked"
      name={`${prefix}-disabled-checked`}
      disabled
      defaultChecked
    />
  </>
)

export const Introduction: StoryFn<RadioProps> = (args) => {
  return <Radio {...args} />
}

export const Spacious: StoryFn<RadioProps> = () => (
  <Wrapper data-density="spacious">
    <AllVariants prefix="spacious" />
  </Wrapper>
)

export const Comfortable: StoryFn<RadioProps> = () => (
  <Wrapper data-density="comfortable">
    <AllVariants prefix="comfortable" />
  </Wrapper>
)

export const ColorSchemes: StoryFn<RadioProps> = () => (
  <div style={{ display: 'flex', gap: '32px' }}>
    <div
      data-color-scheme="light"
      style={{ padding: '24px', background: 'var(--eds-color-bg-canvas)' }}
    >
      <Wrapper>
        <h3 style={{ margin: 0 }}>Light Mode</h3>
        <Radio label="Unchecked" name="light" value="unchecked" />
        <Radio label="Checked" name="light" value="checked" defaultChecked />
        <Radio label="Disabled" name="light-disabled" disabled />
        <Radio
          label="Disabled checked"
          name="light-disabled-checked"
          disabled
          defaultChecked
        />
      </Wrapper>
    </div>
    <div
      data-color-scheme="dark"
      style={{ padding: '24px', background: 'var(--eds-color-bg-canvas)' }}
    >
      <Wrapper>
        <h3 style={{ margin: 0, color: 'var(--eds-color-text-strong)' }}>
          Dark Mode
        </h3>
        <Radio label="Unchecked" name="dark" value="unchecked" />
        <Radio label="Checked" name="dark" value="checked" defaultChecked />
        <Radio label="Disabled" name="dark-disabled" disabled />
        <Radio
          label="Disabled checked"
          name="dark-disabled-checked"
          disabled
          defaultChecked
        />
      </Wrapper>
    </div>
  </div>
)
ColorSchemes.storyName = 'Light & Dark Mode'

export const GroupedRadio: StoryFn<RadioProps> = () => (
  <fieldset>
    <legend>Select your option</legend>
    <Wrapper gap={8}>
      <Radio label="Option 1" name="group" value="1" />
      <Radio label="Option 2" name="group" value="2" />
      <Radio label="Option 3" name="group" value="3" />
    </Wrapper>
  </fieldset>
)
GroupedRadio.parameters = {
  docs: {
    description: {
      story:
        'Radio buttons with the same `name` form a group. Use arrow keys (↑↓ or ←→) to navigate and select within the group.',
    },
  },
}

export const WithoutVisibleLabel: StoryFn<RadioProps> = () => (
  <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
    <div data-density="spacious">
      <p style={{ margin: '0 0 8px' }}>Spacious</p>
      <Radio aria-label="Spacious radio" name="standalone-spacious" />
    </div>
    <div data-density="comfortable">
      <p style={{ margin: '0 0 8px' }}>Comfortable</p>
      <Radio aria-label="Comfortable radio" name="standalone-comfortable" />
    </div>
  </div>
)
WithoutVisibleLabel.parameters = {
  docs: {
    description: {
      story:
        'When no visible label is needed, use `aria-label` to provide an accessible name for screen readers.',
    },
  },
}

export const Controlled: StoryFn<RadioProps> = () => {
  const [selected, setSelected] = useState('option1')
  return (
    <Wrapper>
      <Radio
        label="Option 1"
        name="controlled"
        value="option1"
        checked={selected === 'option1'}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSelected(e.target.value)
        }
      />
      <Radio
        label="Option 2"
        name="controlled"
        value="option2"
        checked={selected === 'option2'}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSelected(e.target.value)
        }
      />
      <p>Selected: {selected}</p>
    </Wrapper>
  )
}
