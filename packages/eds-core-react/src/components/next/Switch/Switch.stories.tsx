import { useState, ChangeEvent } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { Stack } from './../../../../.storybook/components'
import { Typography, Table } from '../../..'
import { Switch } from './Switch'
import type { SwitchProps } from './Switch.types'
import mdx from './Switch.docs.mdx'

const meta: Meta<typeof Switch> = {
  title: 'EDS 2.0 (beta)/Inputs/Selection Controls/Switch',
  component: Switch,
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label for the switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the switch',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state (controlled)',
    },
  },
  args: {
    label: 'Enable notifications',
    disabled: false,
    checked: false,
  },
  parameters: {
    docs: {
      page: mdx,
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
  const [, setArgs] = useArgs()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArgs({ checked: e.target.checked })
  }

  return <Switch {...args} onChange={handleChange} />
}

export const States: StoryFn<SwitchProps> = () => {
  const [checked, setChecked] = useState(false)

  return (
    <UnstyledList>
      <li>
        <Switch label="Default unchecked" />
      </li>
      <li>
        <Switch label="Default checked" defaultChecked />
      </li>
      <li>
        <Switch label="Disabled unchecked" disabled />
      </li>
      <li>
        <Switch label="Disabled checked" disabled defaultChecked />
      </li>
      <li>
        <Switch
          label="Controlled"
          checked={checked}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setChecked(e.target.checked)
          }
        />
      </li>
    </UnstyledList>
  )
}

export const AlternativeToLabel: StoryFn<SwitchProps> = () => (
  <Switch aria-label="This label is invisible, but read by screen-readers" />
)
AlternativeToLabel.storyName = 'Alternative to label'
AlternativeToLabel.parameters = {
  docs: {
    description: {
      story:
        'When a visual label is not desirable, use `aria-label` for accessibility compliance.',
    },
  },
}

const data = [
  { id: 1, name: 'Email notifications', enabled: true },
  { id: 2, name: 'Push notifications', enabled: false },
  { id: 3, name: 'SMS alerts', enabled: true },
]

export const TableSwitch: StoryFn<SwitchProps> = () => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell>Setting</Table.Cell>
        <Table.Cell>Enabled</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {data.map((item) => (
        <Table.Row key={item.id}>
          <Table.Cell>{item.name}</Table.Cell>
          <Table.Cell>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Switch
                aria-label={`Toggle ${item.name}`}
                defaultChecked={item.enabled}
              />
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)
TableSwitch.storyName = 'Table switch'
TableSwitch.parameters = {
  docs: {
    description: {
      story:
        'Switch without visible label for use in tables. Use `aria-label` for accessibility.',
    },
  },
}

export const DarkMode: StoryFn<SwitchProps> = () => {
  return (
    <div
      data-color-scheme="dark"
      style={{ padding: '2rem', background: '#0b0b0b' }}
    >
      <UnstyledList>
        <li>
          <Switch label="Dark mode switch" />
        </li>
        <li>
          <Switch label="Checked in dark mode" defaultChecked />
        </li>
        <li>
          <Switch label="Disabled in dark mode" disabled />
        </li>
        <li>
          <Switch label="Disabled checked" disabled defaultChecked />
        </li>
      </UnstyledList>
    </div>
  )
}
DarkMode.storyName = 'Dark mode'

export const Density: StoryFn<SwitchProps> = () => {
  return (
    <div style={{ display: 'flex', gap: '4rem' }}>
      <div>
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>
          Spacious (default)
        </Typography>
        <UnstyledList>
          <li>
            <Switch label="Unchecked" />
          </li>
          <li>
            <Switch label="Checked" defaultChecked />
          </li>
          <li>
            <Switch label="Disabled" disabled />
          </li>
        </UnstyledList>
      </div>
      <div data-density="comfortable">
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>
          Comfortable
        </Typography>
        <UnstyledList>
          <li>
            <Switch label="Unchecked" />
          </li>
          <li>
            <Switch label="Checked" defaultChecked />
          </li>
          <li>
            <Switch label="Disabled" disabled />
          </li>
        </UnstyledList>
      </div>
    </div>
  )
}
Density.parameters = {
  docs: {
    description: {
      story:
        'Use `data-density="comfortable"` on a parent element to render switches in a more compact size. Spacious is the default density.',
    },
  },
}
