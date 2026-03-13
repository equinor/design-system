import type { Meta, StoryFn } from '@storybook/react-vite'
import { TextArea } from '.'
import type { TextAreaProps } from '.'
import { Stack } from './../../../../.storybook/components'

const meta: Meta<typeof TextArea> = {
  title: 'EDS 2.0 (beta)/Inputs/TextArea',
  component: TextArea,
  tags: ['beta'],
  args: {
    placeholder: '',
    disabled: false,
    invalid: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when textarea is empty',
      table: { category: 'Core' },
    },
    rows: {
      control: 'number',
      description:
        'Native HTML attribute. Sets the initial height and acts as the minimum — the textarea starts here and grows as the user types. Use `maxRows` to cap the growth.',
      table: {
        category: 'Core',
        defaultValue: { summary: '2 (browser default)' },
      },
    },
    maxRows: {
      control: 'number',
      description:
        'Maximum number of rows before the textarea stops growing and becomes scrollable. Set equal to `rows` for a fixed-height textarea.',
      table: { category: 'Core' },
    },
    label: {
      control: 'text',
      description: 'Label text for the field',
      table: { category: 'Label' },
    },
    labelInfo: {
      control: 'text',
      description: 'Info tooltip content shown next to the label',
      table: { category: 'Label' },
    },
    indicator: {
      control: 'text',
      description:
        'Indicator text shown after label, e.g. "(Required)" or "(Optional)"',
      table: { category: 'Label' },
    },
    description: {
      control: 'text',
      description: 'Descriptive text displayed below the label',
      table: { category: 'Content' },
    },
    helperMessage: {
      control: 'text',
      description: 'Helper or validation message shown below the textarea',
      table: { category: 'Content' },
    },
    showCharacterCount: {
      control: 'boolean',
      description:
        'Show a live character count below the textarea. Displays "n / max" when `maxLength` is set, otherwise just "n"',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    maxLength: {
      control: 'number',
      description:
        'Maximum number of characters allowed. Pair with `showCharacterCount` to display the limit.',
      table: { category: 'Content', type: { summary: 'number' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Shows error styling with red border and error icon',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables textarea interaction',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes textarea read-only (visible but not editable)',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Sets HTML required attribute for form validation',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    id: {
      control: 'text',
      description:
        'Unique identifier for the field (auto-generated if not provided)',
      table: { category: 'Other' },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**⚠️ Beta Component** - This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { TextArea } from '@equinor/eds-core-react/next'
\`\`\`

TextArea is a pre-composed component combining Label, FieldDescription, a multiline textarea, and HelperMessage.

It **auto-grows by default** as the user types. Use \`rows\` to set the initial height and \`maxRows\` to cap how tall it can grow before becoming scrollable.
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

export const Introduction: StoryFn<TextAreaProps> = (args) => (
  <TextArea {...args} />
)

Introduction.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  helperMessage: 'Helper Message',
  rows: 3,
}

export const FullField: StoryFn<TextAreaProps> = () => (
  <TextArea
    label="Label"
    labelInfo="Additional context about this field"
    indicator="(Optional)"
    description="Help with more details"
    placeholder="Placeholder"
    helperMessage="Helper Message"
    rows={3}
  />
)
FullField.parameters = {
  docs: {
    description: {
      story:
        'TextArea composes with `labelInfo` (tooltip), `indicator`, and `description` for a complete form field.',
    },
  },
}

export const AutoGrow: StoryFn<TextAreaProps> = () => (
  <>
    <TextArea
      label="Auto-grow (default)"
      placeholder="Start typing to see it grow…"
      rows={3}
      helperMessage="Grows without limit"
    />
    <TextArea
      label="With max rows"
      placeholder="Grows up to 5 rows, then scrolls"
      rows={3}
      maxRows={5}
      helperMessage="Capped at 5 rows"
    />
    <TextArea
      label="Fixed height"
      placeholder="Fixed at 4 rows"
      rows={4}
      maxRows={4}
      helperMessage="rows and maxRows set to the same value"
    />
  </>
)
AutoGrow.storyName = 'Auto-grow & maxRows'
AutoGrow.parameters = {
  docs: {
    description: {
      story:
        'TextArea auto-grows as the user types. `rows` sets the initial height (acts as minimum). `maxRows` caps the growth — beyond it the textarea scrolls. Set both to the same value for a fixed-height textarea.',
    },
  },
}

export const WithIndicator: StoryFn<TextAreaProps> = () => (
  <>
    <TextArea label="Notes" placeholder="No indicator" rows={3} />
    <TextArea
      label="Comments"
      indicator="(Required)"
      required
      placeholder="Required field"
      rows={3}
    />
    <TextArea
      label="Additional info"
      indicator="(Optional)"
      placeholder="Optional field"
      rows={3}
    />
  </>
)
WithIndicator.parameters = {
  docs: {
    description: {
      story:
        'Use `indicator` to show text like "(Required)" or "(Optional)" next to the label. The `required` prop sets the HTML required attribute for form validation — these are separate concerns.',
    },
  },
}

export const States: StoryFn<TextAreaProps> = () => (
  <>
    <TextArea
      label="Invalid"
      defaultValue="Invalid value"
      invalid
      rows={3}
      helperMessage="This field has an error"
    />
    <TextArea
      label="Disabled"
      placeholder="Placeholder"
      disabled
      rows={3}
      helperMessage="Helper Message"
    />
    <TextArea
      label="Disabled with value"
      defaultValue="Disabled with value"
      disabled
      rows={3}
      helperMessage="Helper Message"
    />
    <TextArea
      label="Read only"
      defaultValue="Read only value"
      readOnly
      rows={3}
      helperMessage="Helper Message"
    />
  </>
)

export const WithCharacterCount: StoryFn<TextAreaProps> = () => (
  <>
    <TextArea
      label="Notes"
      placeholder="Start typing…"
      rows={3}
      showCharacterCount
    />
    <TextArea
      label="Limited notes"
      placeholder="Max 200 characters"
      rows={3}
      maxLength={200}
      showCharacterCount
    />
    <TextArea
      label="With helper message"
      placeholder="Both shown below"
      rows={3}
      maxLength={100}
      showCharacterCount
      helperMessage="Helper Message"
    />
  </>
)
WithCharacterCount.parameters = {
  docs: {
    description: {
      story:
        'Use `showCharacterCount` to display a live character count below the textarea. When `maxLength` is also set, it renders as "n / max".',
    },
  },
}

export const DensityModes: StoryFn<TextAreaProps> = () => (
  <div style={{ display: 'flex', gap: '2rem' }}>
    <div data-density="spacious" style={{ width: '320px' }}>
      <h3 style={{ marginBottom: '1rem' }}>Spacious</h3>
      <Stack>
        <TextArea
          label="Notes"
          placeholder="Enter your notes"
          rows={3}
          helperMessage="Helper Message"
        />
      </Stack>
    </div>
    <div data-density="comfortable" style={{ width: '320px' }}>
      <h3 style={{ marginBottom: '1rem' }}>Comfortable</h3>
      <Stack>
        <TextArea
          label="Notes"
          placeholder="Enter your notes"
          rows={3}
          helperMessage="Helper Message"
        />
      </Stack>
    </div>
  </div>
)
DensityModes.parameters = {
  docs: {
    description: {
      story:
        'TextArea adapts to density modes via `data-density` attribute on a parent element.',
    },
  },
}
