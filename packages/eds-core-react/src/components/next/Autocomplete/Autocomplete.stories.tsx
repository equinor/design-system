import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Autocomplete, type AutocompleteProps } from '.'

const elements = [
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
  args: {
    label: 'Element',
    placeholder: 'Search elements',
    disabled: false,
    readOnly: false,
    invalid: false,
    loading: false,
    allowCustomValue: false,
  },
  argTypes: {
    // Core
    options: {
      control: false,
      description: 'Array of options to display in the dropdown.',
      table: { category: 'Core', type: { summary: 'T[]' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in the input when empty.',
      table: { category: 'Core' },
    },
    noOptionsText: {
      control: 'text',
      description: 'Text shown when no options match the search input.',
      table: { category: 'Core', defaultValue: { summary: 'No options' } },
    },

    // Label
    label: {
      control: 'text',
      description: 'Label for the field.',
      table: { category: 'Label' },
    },
    description: {
      control: 'text',
      description: 'Descriptive text displayed below the label.',
      table: { category: 'Label' },
    },
    helperMessage: {
      control: 'text',
      description: 'Helper or validation message shown below the input.',
      table: { category: 'Label' },
    },

    // States
    disabled: {
      control: 'boolean',
      description: 'Disables all interaction with the field.',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes the field read-only — visible but not editable.',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
      description:
        'Shows error styling. Use with `helperMessage` to explain the error.',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description:
        'Shows a loading spinner while options are being fetched. Combine with `onInputChange` for async search.',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    loadingText: {
      control: 'text',
      description: 'Text shown inside the dropdown while `loading` is true.',
      table: { category: 'States', defaultValue: { summary: 'Loading…' } },
    },

    // Selection
    value: {
      control: false,
      description:
        'Controlled selected value. Use with `onValueChange`. Must be a reference to one of the `options` items.',
      table: { category: 'Selection', type: { summary: 'T' } },
    },
    inputValue: {
      control: false,
      description:
        'Controlled value of the search input text. Pair with `onInputChange` to update it as the user types.',
      table: { category: 'Selection', type: { summary: 'string' } },
    },
    defaultInputValue: {
      control: 'text',
      description: 'Uncontrolled initial value of the search input.',
      table: { category: 'Selection' },
    },
    allowCustomValue: {
      control: 'boolean',
      description:
        'Allows the user to confirm a typed value not in the options list. Shows an "Add: {value}" option while typing. Use `onCustomValueConfirm` to handle the new value.',
      table: { category: 'Selection', defaultValue: { summary: 'false' } },
    },
    clearLabel: {
      control: 'text',
      description:
        'Accessible label for the clear button. Override for localisation.',
      table: { category: 'Selection', defaultValue: { summary: 'Clear' } },
    },

    // Callbacks
    onValueChange: {
      control: false,
      description:
        'Fired when the user selects an option from the list. Receives the full option value `T`.',
      table: { category: 'Callbacks', type: { summary: '(value: T) => void' } },
    },
    onCustomValueConfirm: {
      control: false,
      description:
        'Fired when the user confirms a custom value (requires `allowCustomValue`). Receives the typed string.',
      table: {
        category: 'Callbacks',
        type: { summary: '(value: string) => void' },
      },
    },
    onInputChange: {
      control: false,
      description:
        'Fired on every keystroke with the current input text. Use for server-side/async filtering.',
      table: {
        category: 'Callbacks',
        type: { summary: '(value: string) => void' },
      },
    },
    onClear: {
      control: false,
      description: 'Fired when the user clicks the clear button.',
      table: { category: 'Callbacks', type: { summary: '() => void' } },
    },

    // Advanced
    getOptionLabel: {
      control: false,
      description:
        'Returns the string label for an option. Controls three things: the text shown in the dropdown, what appears in the input after selection, and what is searched when the user types. Required when `T` is not a string.',
      table: {
        category: 'Advanced',
        type: { summary: '(option: T) => string' },
      },
    },
    getOptionValue: {
      control: false,
      description:
        'Returns a stable unique key for an option. Provide when object references may change across renders.',
      table: {
        category: 'Advanced',
        type: { summary: '(option: T) => string' },
      },
    },
    optionDisabled: {
      control: false,
      description: 'Return `true` to disable a specific option.',
      table: {
        category: 'Advanced',
        type: { summary: '(option: T) => boolean' },
      },
    },
    optionsFilter: {
      control: false,
      description:
        'Custom filter function. Return `true` to include the option. Return `true` for all options to disable local filtering when searching server-side.',
      table: {
        category: 'Advanced',
        type: { summary: '(option: T, inputValue: string) => boolean' },
      },
    },
    renderOption: {
      control: false,
      description:
        'Custom rendering for each option row. `getOptionLabel` is still used for filtering and the input display — `renderOption` only affects the dropdown.',
      table: {
        category: 'Advanced',
        type: {
          summary: '(option: T, state: { isSelected: boolean }) => ReactNode',
        },
      },
    },

    // Styling
    className: {
      control: 'text',
      description: 'CSS class applied to the input element.',
      table: { category: 'Styling' },
    },
    containerClassName: {
      control: 'text',
      description: 'CSS class applied to the input container wrapper.',
      table: { category: 'Styling' },
    },

    // Other
    id: {
      control: 'text',
      description:
        'Unique identifier for the field (auto-generated if omitted).',
      table: { category: 'Other' },
    },
    name: {
      control: 'text',
      description:
        'HTML name attribute — used when the field is part of a form.',
      table: { category: 'Other' },
    },
    required: {
      control: 'boolean',
      description: 'Sets the HTML required attribute for form validation.',
      table: { category: 'Other', defaultValue: { summary: 'false' } },
    },
    onChange: {
      control: false,
      description:
        'Raw DOM change event handler. Prefer `onInputChange` for a cleaner string-only callback.',
      table: { category: 'Other', type: { summary: 'ChangeEventHandler' } },
    },

    // Hide standard HTML attributes that add noise without value
    style: { table: { disable: true } },
    autoFocus: { table: { disable: true } },
    tabIndex: { table: { disable: true } },
    form: { table: { disable: true } },
    autoComplete: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onKeyDown: { table: { disable: true } },
    onKeyUp: { table: { disable: true } },
    onMouseDown: { table: { disable: true } },
    onClick: { table: { disable: true } },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

An Autocomplete input that filters a list of options as the user types. Supports string arrays, object arrays, custom option rendering, and async search.

\`\`\`tsx
import { Autocomplete } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<AutocompleteProps> = (args) => (
  <Autocomplete options={elements} {...args} />
)

Introduction.parameters = {
  docs: {
    description: {
      story:
        'Basic usage with a string array. The input filters options as you type and shows the selected value when you pick one.',
    },
  },
}

export const Controlled: StoryFn = () => {
  const [value, setValue] = useState<string | undefined>()
  return (
    <Autocomplete
      label="Element"
      options={elements}
      placeholder="Search elements"
      value={value}
      onValueChange={setValue}
      helperMessage={value ? `Selected: ${value}` : 'Nothing selected yet'}
    />
  )
}

Controlled.parameters = {
  docs: {
    description: {
      story:
        'Use `value` + `onValueChange` for controlled state. `onValueChange` fires with the selected option when the user picks from the list. The helper message updates to show the current value.',
    },
  },
}

export const Invalid: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={elements}
    placeholder="Search elements"
    invalid
    helperMessage="This field is required"
  />
)

export const Disabled: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={elements}
    placeholder="Search elements"
    disabled
    helperMessage="Field is disabled"
  />
)

export const ReadOnly: StoryFn<AutocompleteProps> = () => (
  <Autocomplete
    label="Element"
    options={elements}
    defaultInputValue="Copper"
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
  const [selected, setSelected] = useState<Well | undefined>()
  return (
    <Autocomplete<Well>
      label="Well"
      options={wells}
      getOptionLabel={(w) => w.name}
      value={selected}
      onValueChange={setSelected}
      placeholder="Search wells"
      helperMessage={
        selected
          ? `Selected: ${selected.name} (ID: ${selected.id})`
          : 'Select a well'
      }
    />
  )
}

ObjectOptions.storyName = 'Object options'
ObjectOptions.parameters = {
  docs: {
    description: {
      story: `When your options are objects instead of strings, provide \`getOptionLabel\` to tell the component which field to display and search by. \`onValueChange\` returns the full object — notice the helper message shows both the name and the \`id\` field, which you would not have with a plain string list.`,
    },
  },
}

export const CustomOptionRendering: StoryFn = () => {
  type Well = { id: string; name: string; type: string }
  const wells: Well[] = [
    { id: 'w1', name: 'Gullfaks A', type: 'Fixed platform' },
    { id: 'w2', name: 'Statfjord B', type: 'Fixed platform' },
    { id: 'w3', name: 'Troll C', type: 'Semi-submersible' },
    { id: 'w4', name: 'Johan Sverdrup', type: 'Fixed platform' },
    { id: 'w5', name: 'Ekofisk', type: 'Jackup' },
  ]
  const [selected, setSelected] = useState<Well | undefined>()
  return (
    <Autocomplete<Well>
      label="Well"
      options={wells}
      getOptionLabel={(w) => w.name}
      optionsFilter={(w, input) =>
        w.name.toLowerCase().includes(input.toLowerCase()) ||
        w.type.toLowerCase().includes(input.toLowerCase())
      }
      renderOption={(w, { isSelected }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: isSelected ? 600 : undefined }}>
            {w.name}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--eds-color-text-subtle)',
            }}
          >
            {w.type}
          </span>
        </div>
      )}
      value={selected}
      onValueChange={setSelected}
      placeholder="Search wells"
    />
  )
}

CustomOptionRendering.storyName = 'Custom option rendering'
CustomOptionRendering.parameters = {
  docs: {
    description: {
      story: `Use \`renderOption\` to show richer content per row — icons, subtitles, badges, etc. \`getOptionLabel\` controls what appears in the input field after selection. \`optionsFilter\` controls what is searchable — here it matches on both name and platform type, so try typing "fixed" or "semi".`,
    },
  },
}

export const DisabledOptions: StoryFn = () => (
  <Autocomplete
    label="Element"
    options={elements}
    placeholder="Search elements"
    optionDisabled={(option) => ['Lead', 'Tin'].includes(option)}
    helperMessage="Lead and Tin are disabled"
  />
)

DisabledOptions.storyName = 'Disabled options'
DisabledOptions.parameters = {
  docs: {
    description: {
      story:
        'Use `optionDisabled` to prevent specific options from being selected. Disabled options are still visible and keyboard-navigable but cannot be chosen.',
    },
  },
}

export const AllowCustomValue: StoryFn = () => {
  const [options, setOptions] = useState(elements)
  const [selected, setSelected] = useState<string | undefined>()
  return (
    <Autocomplete
      label="Element"
      options={options}
      placeholder="Search or add element"
      allowCustomValue
      value={selected}
      onValueChange={setSelected}
      onCustomValueConfirm={(newValue) => {
        setOptions((prev) => [...prev, newValue])
        setSelected(newValue)
      }}
      helperMessage={
        selected
          ? `Selected: ${selected}`
          : 'Type a value not in the list to add it'
      }
    />
  )
}

AllowCustomValue.storyName = 'Allow custom value'
AllowCustomValue.parameters = {
  docs: {
    description: {
      story: `Use \`allowCustomValue\` to let users type and confirm a value not in the list. \`onCustomValueConfirm\` fires with the typed string — use it to add the new value to your list and update the selection. Note: \`onValueChange\` is only called for existing list options; \`onCustomValueConfirm\` handles new values.`,
    },
  },
}

export const Loading: StoryFn = () => (
  <Autocomplete
    label="Element"
    options={[]}
    placeholder="Search elements"
    loading
    helperMessage="Fetching options from server"
  />
)

Loading.parameters = {
  docs: {
    description: {
      story:
        'Set `loading` while fetching async options. The spinner replaces the clear button and a loading message is shown. Combine with `onInputChange` to trigger server-side search as the user types.',
    },
  },
}
