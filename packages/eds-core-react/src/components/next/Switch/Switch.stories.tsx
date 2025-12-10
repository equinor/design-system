import { Switch, SwitchProps } from './Switch'
import { StoryFn, Meta } from '@storybook/react-vite'
import { useState } from 'react'

const meta: Meta<typeof Switch> = {
  title: 'EDS 2.0 (beta)/Switch',
  component: Switch,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
**⚠️ Beta Component** - This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { Switch } from '@equinor/eds-core-react/next'
\`\`\`

Switch component with support for default, hover, and disabled states.
        `,
      },
    },
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    color: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
    },
  },
}

export default meta

export const Default: StoryFn<SwitchProps> = (args) => {
  const [checked, setChecked] = useState(false)
  return (
    <Switch
      {...args}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  )
}
Default.args = {
  label: 'Switch label',
  color: 'accent',
}

export const Appearances: StoryFn<SwitchProps> = (args) => {
  const [checked, setChecked] = useState(true)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch
        {...args}
        label="Accent (Default)"
        color="accent"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <Switch
        {...args}
        label="Neutral"
        color="neutral"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <Switch
        {...args}
        label="Success"
        color="success"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <Switch
        {...args}
        label="Warning"
        color="warning"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <Switch
        {...args}
        label="Danger"
        color="danger"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <Switch
        {...args}
        label="Info"
        color="info"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </div>
  )
}

export const Checked: StoryFn<SwitchProps> = (args) => {
  return <Switch {...args} checked readOnly />
}
Checked.args = {
  label: 'Checked Switch',
  color: 'accent',
}

export const Disabled: StoryFn<SwitchProps> = (args) => {
  return <Switch {...args} disabled />
}
Disabled.args = {
  label: 'Disabled Switch',
}

export const DisabledChecked: StoryFn<SwitchProps> = (args) => {
  return <Switch {...args} disabled checked readOnly />
}
DisabledChecked.args = {
  label: 'Disabled Checked Switch',
}
