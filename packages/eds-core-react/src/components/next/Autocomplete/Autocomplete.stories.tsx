import type { Meta, StoryFn } from '@storybook/react-vite'
import { Autocomplete, type AutocompleteProps } from '.'

const options = [
  'Aluminium',
  'Chromium',
  'Cobalt',
  'Copper',
  'Iron',
  'Lead',
  'Magnesium',
  'Molybdenum',
  'Nickel',
  'Platinum',
  'Silicon',
  'Tin',
  'Titanium',
  'Zinc',
]

const meta: Meta<typeof Autocomplete> = {
  title: 'EDS 2.0 (beta)/Inputs/Autocomplete',
  component: Autocomplete,
  tags: ['beta'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

An Autocomplete input that filters a list of options as the user types.

\`\`\`tsx
import { Autocomplete } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    loading: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
}

export default meta

export const Introduction: StoryFn<AutocompleteProps> = (args) => (
  <Autocomplete
    label="Element"
    options={options}
    placeholder="Search elements"
    {...args}
  />
)

Introduction.args = {}

export const WithHelperMessage: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={options}
    placeholder="Search elements"
    helperMessage="Select a chemical element"
  />
)

export const Invalid: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={options}
    placeholder="Search elements"
    invalid
    helperMessage="This field is required"
  />
)

export const Disabled: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={options}
    placeholder="Search elements"
    disabled
    helperMessage="Field is disabled"
  />
)

export const ReadOnly: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={options}
    defaultInputValue="Copper"
    readOnly
  />
)

export const WithDescription: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    description="Choose from the periodic table"
    options={options}
    placeholder="Search elements"
    helperMessage="Start typing to filter options"
  />
)

export const AllowCustomValue: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={options}
    placeholder="Search or add element"
    allowCustomValue
    helperMessage="Type a value not in the list to add it"
  />
)

AllowCustomValue.storyName = 'Allow custom value'

export const Loading: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={[]}
    placeholder="Search elements"
    loading
    helperMessage="Fetching options from server"
  />
)

Loading.storyName = 'Loading'
