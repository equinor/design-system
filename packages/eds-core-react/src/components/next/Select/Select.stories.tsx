import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../../.storybook/components'
import { Select, type SelectProps, type SelectOptionGroup } from '.'

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
  title: 'EDS 2.0 (beta)/Inputs/Select',
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
        'Makes the field read-only — focusable and announced by screen readers, but not editable',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the field as invalid — applies error styling (danger border, error icon) and sets `aria-invalid="true"` so screen readers announce the error state. Does not block form submission on its own; use `required` or handle validation in `onSubmit`.',
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
      description: 'CSS class names applied to the select element',
      table: {
        category: 'Styling',
      },
    },

    // Other
    ref: {
      control: false,
      description:
        'Ref forwarded to the underlying `<select>` element — use to read the current value, call `.focus()`, etc.',
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
      description: {
        component: `
**⚠️ Beta Component** — This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { Select } from '@equinor/eds-core-react/next'
\`\`\`

Select wraps a native \`<select>\` element with EDS styling and supports single selection only. In Chrome 135+ it uses \`appearance: base-select\` for a fully styled picker surface and options list. In other browsers the dropdown uses native OS styling.

Need filtering or search? Use [**Autocomplete**](?path=/docs/eds-2-0-beta-inputs-autocomplete--docs) instead. Need multiple selection? **Combobox** with multi-select support is coming soon.
        `,
      },
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

export const Default: StoryFn<SelectProps> = (args) => (
  <Select options={elements} {...args} />
)

Default.parameters = {
  docs: {
    description: {
      story:
        'Uncontrolled usage — the browser manages the selected value internally. Read the current value via a ref or from `FormData` on submit. For externally driven state, see the Controlled story.',
    },
  },
}

export const Invalid: StoryFn<SelectProps> = () => (
  <Select
    label="Element"
    options={elements}
    invalid
    helperMessage="This field is required"
  />
)

Invalid.parameters = {
  docs: {
    description: {
      story:
        '`invalid` applies error styling and sets `aria-invalid="true"` for screen readers, but does not block form submission — use `required` for that. Set `invalid` yourself based on validation logic, and pair it with `helperMessage` to explain what went wrong.',
    },
  },
}

export const Disabled: StoryFn<SelectProps> = () => (
  <Select
    label="Element"
    options={elements}
    disabled
    helperMessage="Field is disabled"
  />
)

Disabled.parameters = {
  docs: {
    description: {
      story:
        'A disabled field is non-interactive, removed from the tab order, and excluded from form data on submission. Use `readOnly` instead if the value should still be submitted or readable by assistive technology.',
    },
  },
}

export const ReadOnly: StoryFn<SelectProps> = () => (
  <Select label="Element" options={elements} defaultValue="Copper" readOnly />
)

ReadOnly.parameters = {
  docs: {
    description: {
      story:
        '`<select>` has no native `readonly` attribute. The read-only state is simulated: mouse interaction is blocked via CSS `pointer-events: none`, keyboard changes are suppressed via `onKeyDown`, and `aria-readonly="true"` is set so screen readers announce the field correctly. The element remains focusable and its value is readable by assistive technology. If a `name` is provided, the value is included in form data via a hidden input.',
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
        'Use `value` + `onChange` for controlled state — the native `<select>` fires a standard `ChangeEvent<HTMLSelectElement>`. The helper message updates to reflect the current value.',
    },
  },
}

export const WithPlaceholder: StoryFn<SelectProps> = () => (
  <Select label="Element" options={elements} placeholder="Select an element…" />
)

WithPlaceholder.storyName = 'With placeholder'
WithPlaceholder.parameters = {
  docs: {
    description: {
      story:
        'A `placeholder` renders as a hidden, disabled `<option value="">` and is pre-selected when no `value` or `defaultValue` is provided. It does not appear in the open dropdown — its only role is to show hint text when nothing is selected. Once the user picks a real option they cannot return to the placeholder — this is a native constraint of `<select>`.',
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

WithDescription.storyName = 'With description'
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

ObjectOptions.storyName = 'Object options'
ObjectOptions.parameters = {
  docs: {
    description: {
      story:
        'When options are objects, provide `getOptionLabel` to specify which field to display and `getOptionValue` to specify the submitted form value. Pick an option — the helper message shows the id that would be submitted, while the trigger shows the human-readable name.',
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
  return (
    <Select
      label="Element"
      options={options}
      placeholder="Select an element…"
    />
  )
}

GroupedOptions.storyName = 'Grouped options'
GroupedOptions.parameters = {
  docs: {
    description: {
      story:
        'Pass `SelectOptionGroup` objects in the `options` array to render native `<optgroup>` elements. Groups and flat options can be mixed in the same array.',
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

DisabledOptions.storyName = 'Disabled options'
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

DensityModes.storyName = 'Density modes'
DensityModes.parameters = {
  docs: {
    description: {
      story:
        'Select adapts to density modes via the `data-density` attribute on a parent element. Spacious is the default; comfortable provides a more compact layout for dense UIs.',
    },
  },
}
