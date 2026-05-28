import type { Meta, StoryFn } from '@storybook/react-vite'
import { NativeSelect, type NativeSelectProps } from '.'

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

const meta: Meta<typeof NativeSelect> = {
  title: 'EDS 2.0 (beta)/Inputs/NativeSelect',
  component: NativeSelect,
  tags: ['beta'],
}

export default meta

export const Default: StoryFn<NativeSelectProps> = (args) => (
  <NativeSelect label="Element" options={elements} {...args} />
)

export const Invalid: StoryFn<NativeSelectProps> = () => (
  <NativeSelect
    label="Element"
    options={elements}
    invalid
    helperMessage="This field is required"
  />
)

export const Disabled: StoryFn<NativeSelectProps> = () => (
  <NativeSelect
    label="Element"
    options={elements}
    disabled
    helperMessage="Field is disabled"
  />
)

export const ReadOnly: StoryFn<NativeSelectProps> = () => (
  <NativeSelect
    label="Element"
    options={elements}
    defaultValue="Copper"
    readOnly
  />
)

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
    <NativeSelect
      label="Well"
      options={wells}
      getOptionLabel={(o) => o.name}
      getOptionValue={(o) => o.id}
    />
  )
}

ObjectOptions.storyName = 'Object options'

export const DisabledOptions: StoryFn = () => (
  <NativeSelect
    label="Element"
    options={elements}
    optionDisabled={(o) => ['Lead', 'Tin'].includes(o)}
    helperMessage="Lead and Tin are disabled"
  />
)

DisabledOptions.storyName = 'Disabled options'

export const WithDescription: StoryFn<NativeSelectProps> = () => (
  <NativeSelect
    label="Element"
    description="Select a chemical element from the list"
    options={elements}
    helperMessage="Used for material classification"
  />
)

WithDescription.storyName = 'With description'
