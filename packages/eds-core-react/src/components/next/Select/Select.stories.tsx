import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../../.storybook/components'
import { Select, type SelectProps, type SelectOptionGroup } from '.'
import page from './Select.docs.mdx'

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
  'Tin',
  'Titanium',
  'Zinc',
]

const meta: Meta<typeof Select> = {
  title: 'Beta/Inputs/Select',
  component: Select,
  tags: ['beta'],
  args: {
    label: 'Element',
    placeholder: '',
    disabled: false,
    readOnly: false,
    invalid: false,
    required: false,
  },
  argTypes: {
    // Core
    options: {
      control: false,
      description: 'Array of option values (strings) or objects',
      table: {
        category: 'Core',
        type: { summary: 'T[]' },
      },
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder text shown as the first, non-selectable option when no value is pre-selected',
      table: {
        category: 'Core',
      },
    },

    // Label
    label: {
      control: 'text',
      description: 'Label text for the field',
      table: {
        category: 'Label',
      },
    },
    indicator: {
      control: 'text',
      description:
        'Indicator text shown after the label, e.g. "(Required)" or "(Optional)"',
      table: {
        category: 'Label',
      },
    },

    // Content
    description: {
      control: 'text',
      description: 'Descriptive text displayed below the label',
      table: {
        category: 'Content',
      },
    },
    helperMessage: {
      control: 'text',
      description: 'Helper or validation message shown below the select',
      table: {
        category: 'Content',
      },
    },

    // States
    disabled: {
      control: 'boolean',
      description:
        'Disables all interaction and excludes the value from form data',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description:
        'Makes the field read-only, focusable and announced by screen readers, but not editable',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the field as invalid. Applies error styling (danger border, error icon) and sets `aria-invalid="true"` so screen readers announce the error state. Does not block form submission on its own; use `required` or handle validation in `onSubmit`.',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Sets HTML required attribute for form validation',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },

    // Advanced
    getOptionLabel: {
      control: false,
      description:
        'Returns the display label for an option object. Required when options are objects.',
      table: {
        category: 'Advanced',
        type: { summary: '(option: T) => string' },
      },
    },
    getOptionValue: {
      control: false,
      description:
        'Returns the form value for an option object. Required when options are objects.',
      table: {
        category: 'Advanced',
        type: { summary: '(option: T) => string' },
      },
    },
    optionDisabled: {
      control: false,
      description: 'Returns true for options that should be non-selectable',
      table: {
        category: 'Advanced',
        type: { summary: '(option: T) => boolean' },
      },
    },

    // Styling
    className: {
      control: 'text',
      description:
        'CSS class names applied to the root element (the outer labeled field wrapper). Use this to control layout, width, or margin of the entire field.',
      table: {
        category: 'Styling',
      },
    },
    style: {
      control: 'object',
      description:
        'Inline styles applied to the root element (the outer labeled field wrapper).',
      table: {
        category: 'Styling',
      },
    },

    // Other
    ref: {
      control: false,
      description:
        'Ref forwarded to the underlying `<select>` element. Use it to read the current value, call `.focus()`, etc.',
      table: {
        category: 'Other',
        type: { summary: 'React.Ref<HTMLSelectElement>' },
      },
    },
    id: {
      control: 'text',
      description:
        'Unique identifier for the field (auto-generated if not provided)',
      table: {
        category: 'Other',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name attribute for form submission',
      table: {
        category: 'Other',
      },
    },
  },
  parameters: {
    docs: {
      page,
    },
  },
  decorators: [
    (Story) => (
      <Stack align="stretch" direction="column" style={{ maxWidth: '320px' }}>
        <Story />
      </Stack>
    ),
  ],
}

export default meta

export const Introduction: StoryFn<SelectProps> = (args) => (
  <Select options={elements} {...args} />
)

export const Overview: StoryFn<SelectProps> = () => (
  <>
    <Select label="Element" options={elements} />
    <Select
      label="Element (invalid)"
      options={elements}
      invalid
      helperMessage="Choose an element"
    />
  </>
)

export const States: StoryFn<SelectProps> = () => (
  <>
    <Select
      label="Default"
      options={elements}
      placeholder="Select an element…"
    />
    <Select
      label="Disabled"
      options={elements}
      defaultValue="Copper"
      disabled
    />
    <Select
      label="Read only"
      options={elements}
      defaultValue="Copper"
      readOnly
    />
  </>
)

States.parameters = {
  docs: {
    description: {
      story:
        'A select can be default, disabled or read only. A disabled select cannot be focused and is left out of form submission. A read only select stays focusable and, when it has a `name`, still submits its value. A native `<select>` has no `readonly` attribute, so `readOnly` blocks changes itself and sets `aria-readonly`.',
    },
  },
}

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

Controlled.parameters = {
  docs: {
    description: {
      story:
        'Use `value` + `onChange` for controlled state. The native `<select>` fires a standard `ChangeEvent<HTMLSelectElement>`. The helper message updates to reflect the current value.',
    },
  },
}

export const WithPlaceholder: StoryFn<SelectProps> = () => (
  <Select label="Element" options={elements} placeholder="Select an element…" />
)

WithPlaceholder.parameters = {
  docs: {
    description: {
      story:
        'A `placeholder` renders as a hidden, disabled `<option value="">` and is pre-selected when no `value` or `defaultValue` is provided. It does not appear in the open dropdown. Its only role is to show hint text when nothing is selected. Once the user picks a real option they cannot return to the placeholder. This is a native constraint of `<select>`.',
    },
  },
}

export const WithDescription: StoryFn<SelectProps> = () => (
  <Select
    label="Element"
    indicator="(Required)"
    required
    description="Select a chemical element from the list"
    options={elements}
    helperMessage="Used for material classification"
  />
)

WithDescription.parameters = {
  docs: {
    description: {
      story:
        'Use `description` for supplementary context below the label, `helperMessage` for guidance or validation feedback below the field, and `indicator` for a short label annotation such as "(Required)" or "(Optional)".',
    },
  },
}

export const ObjectOptions: StoryFn = () => {
  type Well = { id: string; name: string }
  const wells: Well[] = [
    { id: 'w1', name: 'Gullfaks A' },
    { id: 'w2', name: 'Statfjord B' },
    { id: 'w3', name: 'Troll C' },
    { id: 'w4', name: 'Johan Sverdrup' },
    { id: 'w5', name: 'Ekofisk' },
  ]
  const [value, setValue] = useState('w1')
  return (
    <Select
      label="Well"
      options={wells}
      getOptionLabel={(o) => o.name}
      getOptionValue={(o) => o.id}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperMessage={`Form value: "${value}"`}
    />
  )
}

ObjectOptions.parameters = {
  docs: {
    description: {
      story:
        'When options are objects, provide `getOptionLabel` to specify which field to display and `getOptionValue` to specify the submitted form value. Pick an option and the helper message shows the id that would be submitted, while the trigger shows the human-readable name.',
    },
  },
}

export const GroupedOptions: StoryFn = () => {
  const options: SelectOptionGroup<string>[] = [
    {
      type: 'group',
      label: 'Metals',
      options: ['Aluminium', 'Copper', 'Iron', 'Lead'],
    },
    {
      type: 'group',
      label: 'Noble gases',
      options: ['Helium', 'Neon', 'Argon'],
    },
    {
      type: 'group',
      label: 'Non-metals',
      options: ['Hydrogen', 'Oxygen', 'Nitrogen'],
    },
  ]
  const [value, setValue] = useState('')
  const group = options.find((g) => g.options.includes(value))?.label
  return (
    <Select
      label="Element"
      options={options}
      placeholder="Select an element…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperMessage={
        group ? `Group: ${group}` : 'Pick an element to see its group'
      }
    />
  )
}

GroupedOptions.parameters = {
  docs: {
    description: {
      story:
        'Pass `SelectOptionGroup` objects in the `options` array to render native `<optgroup>` elements. Groups and flat options can be mixed in the same array. Pick an element and the helper message shows the group it belongs to.',
    },
  },
}

export const DisabledOptions: StoryFn = () => (
  <Select
    label="Element"
    options={elements}
    optionDisabled={(o) => ['Lead', 'Tin'].includes(o)}
    helperMessage="Lead and Tin are disabled"
  />
)

DisabledOptions.parameters = {
  docs: {
    description: {
      story:
        'Use `optionDisabled` to make specific options non-selectable. Disabled options are still visible in the list but cannot be chosen.',
    },
  },
}

export const DensityModes: StoryFn = () => (
  <div style={{ display: 'flex', gap: '2rem' }}>
    <div data-density="spacious" style={{ width: '320px' }}>
      <h3 style={{ marginBottom: '1rem' }}>Spacious</h3>
      <Select
        label="Element"
        options={elements}
        helperMessage="Default density"
      />
    </div>
    <div data-density="comfortable" style={{ width: '320px' }}>
      <h3 style={{ marginBottom: '1rem' }}>Comfortable</h3>
      <Select
        label="Element"
        options={elements}
        helperMessage="Compact density"
      />
    </div>
  </div>
)

DensityModes.parameters = {
  docs: {
    description: {
      story:
        'Select adapts to density modes via the `data-density` attribute on a parent element. Spacious is the default; comfortable provides a more compact layout for dense UIs.',
    },
  },
}
