import { useState, ChangeEvent } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { ExampleLabel, Stack } from './../../../../.storybook/components'
import { Switch } from './Switch'
import type { SwitchProps } from './Switch.types'

const meta: Meta<typeof Switch> = {
  title: 'Beta/Inputs/Selection Controls/Switch',
  component: Switch,
  tags: ['beta'],
  argTypes: {
    label: {
      control: 'text',
      description:
        'Visible label for the switch. Without one, give the switch an accessible name with `aria-label` or `aria-labelledby`.',
      table: { category: 'Core' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the switch',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    checked: {
      control: 'boolean',
      description: 'Checked state (controlled)',
      table: { category: 'States' },
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
  },
  args: {
    label: 'Enable notifications',
    disabled: false,
  },
  parameters: {
    docs: {
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

const UnstyledList = ({
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul
    style={{
      margin: 0,
      padding: 0,
      listStyleType: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      ...style,
    }}
    {...props}
  >
    {children}
  </ul>
)

export const Introduction: StoryFn<SwitchProps> = (args) => {
  return <Switch {...args} />
}

export const Overview: StoryFn<SwitchProps> = () => (
  <UnstyledList>
    <li>
      <Switch label="Auto-save" defaultChecked />
    </li>
    <li>
      <Switch label="Location access" />
    </li>
  </UnstyledList>
)

export const States: StoryFn<SwitchProps> = () => {
  const [checked, setChecked] = useState(false)

  return (
    <UnstyledList>
      <li>
        <Switch label="Email notifications" />
      </li>
      <li>
        <Switch label="Push notifications" defaultChecked />
      </li>
      <li>
        <Switch label="Biometric login" disabled />
      </li>
      <li>
        <Switch label="Two-factor authentication" disabled defaultChecked />
      </li>
      <li>
        <Switch
          label="Marketing emails"
          checked={checked}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setChecked(e.target.checked)
          }
        />
      </li>
    </UnstyledList>
  )
}

States.parameters = {
  docs: {
    description: {
      story:
        'A switch is either on or off, and can be disabled while in either state. The last one is controlled, reacting to clicks through `checked` and `onChange` rather than tracking its own state.',
    },
  },
}

export const InheritedDisabled: StoryFn<SwitchProps> = () => (
  <fieldset disabled>
    <legend>Disabled fieldset</legend>
    <UnstyledList>
      <li>
        <Switch label="Email notifications" />
      </li>
      <li>
        <Switch label="Push notifications" defaultChecked />
      </li>
    </UnstyledList>
  </fieldset>
)
InheritedDisabled.parameters = {
  docs: {
    description: {
      story:
        'Switches inside a `<fieldset disabled>` are disabled by the browser without a `disabled` prop. The disabled styling is keyed off the input’s `:disabled` state, so it covers this inherited disabling too.',
    },
  },
}

export const WithoutVisibleLabel: StoryFn<SwitchProps> = () => (
  <Switch aria-label="Dark mode" />
)

WithoutVisibleLabel.parameters = {
  docs: {
    description: {
      story:
        'When no visible label is needed, use `aria-label` to provide an accessible name for screen readers.',
    },
  },
}

export const Density: StoryFn<SwitchProps> = () => (
  <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
    {(['compact', 'comfortable', 'relaxed'] as const).map((density) => (
      <div key={density} data-density={density}>
        <ExampleLabel>
          {density.charAt(0).toUpperCase() + density.slice(1)}
        </ExampleLabel>
        <UnstyledList>
          <li>
            <Switch label="Email" defaultChecked />
          </li>
          <li>
            <Switch label="SMS" />
          </li>
          <li>
            <Switch label="Push" />
          </li>
        </UnstyledList>
      </div>
    ))}
  </div>
)

Density.parameters = {
  docs: {
    description: {
      story:
        'Set `data-density` on a parent element to change the size. The default is comfortable.',
    },
  },
}

export const StatusAnnouncement: StoryFn<SwitchProps> = () => {
  const [autoSave, setAutoSave] = useState(false)
  const [status, setStatus] = useState('')

  return (
    <div>
      <Switch
        label="Auto-save"
        checked={autoSave}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setAutoSave(e.target.checked)
          setStatus(
            e.target.checked
              ? 'Changes are now saved automatically'
              : 'Changes are no longer saved automatically',
          )
        }}
      />
      <div
        aria-live="polite"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        {status}
      </div>
    </div>
  )
}

StatusAnnouncement.parameters = {
  docs: {
    description: {
      story:
        'If toggling a switch causes an important change elsewhere on the page, announce it with a separate `aria-live` region.',
    },
  },
}
