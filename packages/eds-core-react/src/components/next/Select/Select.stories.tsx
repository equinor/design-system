import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Select, type SelectProps } from '.'

const elements = [
  'Aluminium',
  'Chromium',
  'Cobalt',
  'Copper',
  'Iron',
  'Lead',
  'Magnesium',
  'Nickel',
  'Platinum',
  'Titanium',
  'Zinc',
]

const meta: Meta<typeof Select> = {
  title: 'EDS 2.0 (beta)/Inputs/Select',
  component: Select,
  tags: ['beta'],
}

export default meta

export const Default: StoryFn<SelectProps> = (args) => (
  <Select label="Element" options={elements} {...args} />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = useState('Copper')
  return (
    <Select
      label="Element"
      options={elements}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperMessage={`Selected: ${value}`}
    />
  )
}

export const WithPlaceholder: StoryFn<SelectProps> = () => (
  <Select label="Element" options={elements} placeholder="Select an element…" />
)

WithPlaceholder.storyName = 'With placeholder'

export const Invalid: StoryFn<SelectProps> = () => (
  <Select
    label="Element"
    options={elements}
    invalid
    helperMessage="This field is required"
  />
)

export const Disabled: StoryFn<SelectProps> = () => (
  <Select
    label="Element"
    options={elements}
    disabled
    helperMessage="Field is disabled"
  />
)

export const ReadOnly: StoryFn<SelectProps> = () => (
  <Select label="Element" options={elements} defaultValue="Copper" readOnly />
)

export const ComfortableDensity: StoryFn = () => (
  <div data-density="comfortable">
    <Select label="Element" options={elements} />
  </div>
)

ComfortableDensity.storyName = 'Comfortable density'

export const ObjectOptions: StoryFn = () => {
  type Well = { id: string; name: string }
  const wells: Well[] = [
    { id: 'w1', name: 'Gullfaks A' },
    { id: 'w2', name: 'Statfjord B' },
    { id: 'w3', name: 'Troll C' },
    { id: 'w4', name: 'Johan Sverdrup' },
    { id: 'w5', name: 'Ekofisk' },
  ]
  return (
    <Select
      label="Well"
      options={wells}
      getOptionLabel={(o) => o.name}
      getOptionValue={(o) => o.id}
    />
  )
}

ObjectOptions.storyName = 'Object options'

export const DisabledOptions: StoryFn = () => (
  <Select
    label="Element"
    options={elements}
    optionDisabled={(o) => ['Lead', 'Tin'].includes(o)}
    helperMessage="Lead and Tin are disabled"
  />
)

DisabledOptions.storyName = 'Disabled options'

export const WithDescription: StoryFn<SelectProps> = () => (
  <Select
    label="Element"
    description="Select a chemical element from the list"
    options={elements}
    helperMessage="Used for material classification"
  />
)

WithDescription.storyName = 'With description'
