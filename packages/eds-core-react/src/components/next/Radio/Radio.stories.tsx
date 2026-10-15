import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { ExampleLabel, Stack } from './../../../../.storybook/components'
import { Radio } from './Radio'
import { TextField } from '../TextField'
import type { RadioProps } from './Radio.types'

const meta: Meta<typeof Radio> = {
  title: 'EDS 2.0 (beta)/Inputs/Selection Controls/Radio',
  component: Radio,
  tags: ['beta'],
  args: {
    label: 'Option',
    disabled: false,
  },
  parameters: {
    docs: {
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
      description:
        'Additional CSS class names applied to the outer wrapper element, not the hidden input',
      table: {
        category: 'Styling',
      },
    },
    style: {
      control: 'object',
      description:
        'Inline styles applied to the outer wrapper element, not the hidden input',
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

export const Introduction: StoryFn<RadioProps> = (args) => {
  return <Radio {...args} />
}

export const Overview: StoryFn<RadioProps> = () => (
  <Wrapper gap={8}>
    <Radio label="Laptop" name="overview" value="laptop" defaultChecked />
    <Radio label="Tablet" name="overview" value="tablet" />
  </Wrapper>
)

export const States: StoryFn<RadioProps> = () => (
  <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
    <fieldset>
      <legend>Selectable</legend>
      <Wrapper gap={8}>
        <Radio label="Option 1" name="selectable" value="1" defaultChecked />
        <Radio label="Option 2" name="selectable" value="2" />
      </Wrapper>
    </fieldset>
    <fieldset disabled>
      <legend>Disabled</legend>
      <Wrapper gap={8}>
        <Radio label="Option 1" name="disabled" value="1" defaultChecked />
        <Radio label="Option 2" name="disabled" value="2" />
      </Wrapper>
    </fieldset>
  </div>
)

States.parameters = {
  docs: {
    description: {
      story:
        'A radio is either selected or not, and only one option in its group can be selected. Use the disabled state for a choice that is not available yet, such as an option that depends on an earlier step.',
    },
  },
}

export const ControlledAndUncontrolled: StoryFn<RadioProps> = () => {
  const [selected, setSelected] = useState('pickup')
  return (
    <div
      style={{
        display: 'flex',
        gap: '48px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <fieldset style={{ width: '220px' }}>
        <legend>Uncontrolled</legend>
        <Wrapper gap={8}>
          <Radio
            label="Option 1"
            name="uncontrolled"
            value="1"
            defaultChecked
          />
          <Radio label="Option 2" name="uncontrolled" value="2" />
        </Wrapper>
      </fieldset>
      <fieldset style={{ width: '220px' }}>
        <legend>Controlled</legend>
        <Wrapper gap={8}>
          <Radio
            label="Pickup"
            name="controlled"
            value="pickup"
            checked={selected === 'pickup'}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSelected(e.target.value)
            }
          />
          <Radio
            label="Delivery"
            name="controlled"
            value="delivery"
            checked={selected === 'delivery'}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSelected(e.target.value)
            }
          />
          <div
            style={{
              visibility: selected === 'delivery' ? 'visible' : 'hidden',
            }}
          >
            <TextField label="Delivery address" />
          </div>
        </Wrapper>
      </fieldset>
    </div>
  )
}

ControlledAndUncontrolled.parameters = {
  docs: {
    description: {
      story:
        'Uncontrolled suits a simple form, where only the submitted value matters. Controlled suits a screen that reacts to the choice as it changes, such as showing the delivery address field only once Delivery is chosen.',
    },
  },
}

export const Density: StoryFn<RadioProps> = () => (
  <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
    {(['spacious', 'comfortable'] as const).map((density) => (
      <div key={density} data-density={density}>
        <ExampleLabel>
          {density.charAt(0).toUpperCase() + density.slice(1)}
        </ExampleLabel>
        <Wrapper gap={8}>
          <Radio
            label="Email"
            name={`density-${density}`}
            value="email"
            defaultChecked
          />
          <Radio label="SMS" name={`density-${density}`} value="sms" />
          <Radio label="Push" name={`density-${density}`} value="push" />
        </Wrapper>
      </div>
    ))}
  </div>
)

Density.parameters = {
  docs: {
    description: {
      story:
        'Set `data-density` on a parent element to change the size. Comfortable is more compact.',
    },
  },
}

export const LightAndDarkMode: StoryFn<RadioProps> = () => (
  <div style={{ display: 'flex', gap: '32px' }}>
    <div
      data-color-scheme="light"
      style={{ padding: '24px', background: 'var(--eds-color-bg-canvas)' }}
    >
      <Wrapper>
        <ExampleLabel>Light Mode</ExampleLabel>
        <Radio label="Email" name="light" value="email" />
        <Radio label="SMS" name="light" value="sms" defaultChecked />
        <Radio label="Push" name="light-disabled" disabled />
        <Radio
          label="Postal mail"
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
        <ExampleLabel style={{ color: 'var(--eds-color-text-strong)' }}>
          Dark Mode
        </ExampleLabel>
        <Radio label="Email" name="dark" value="email" />
        <Radio label="SMS" name="dark" value="sms" defaultChecked />
        <Radio label="Push" name="dark-disabled" disabled />
        <Radio
          label="Postal mail"
          name="dark-disabled-checked"
          disabled
          defaultChecked
        />
      </Wrapper>
    </div>
  </div>
)

LightAndDarkMode.parameters = {
  docs: {
    description: {
      story:
        'Radio follows the colour scheme set with `data-color-scheme` on a parent element.',
    },
  },
}

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
        'Radio buttons with the same `name` form a group. Use arrow keys to navigate and select within the group.',
    },
  },
}

export const InheritedDisabled: StoryFn<RadioProps> = () => (
  <fieldset disabled>
    <legend>Disabled fieldset</legend>
    <Wrapper gap={8}>
      <Radio label="Email" name="inherited" value="email" />
      <Radio label="SMS" name="inherited" value="sms" defaultChecked />
    </Wrapper>
  </fieldset>
)
InheritedDisabled.parameters = {
  docs: {
    description: {
      story:
        'Radio buttons inside a `<fieldset disabled>` are disabled by the browser without a `disabled` prop. The disabled styling is keyed off the input’s `:disabled` state, so it covers this inherited disabling too.',
    },
  },
}

export const WithoutVisibleLabel: StoryFn<RadioProps> = () => (
  <Radio aria-label="Select option" name="standalone" />
)

WithoutVisibleLabel.parameters = {
  docs: {
    description: {
      story:
        'When no visible label is needed, use `aria-label` to provide an accessible name for screen readers.',
    },
  },
}
