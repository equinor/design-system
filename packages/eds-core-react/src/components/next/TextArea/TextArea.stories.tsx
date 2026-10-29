import type { Meta, StoryFn } from '@storybook/react-vite'
import { TextArea } from '.'
import type { TextAreaProps } from '.'
import { ExampleLabel, Stack } from './../../../../.storybook/components'
import page from './TextArea.docs.mdx'

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
        'Native HTML attribute. Sets the initial height and acts as the minimum: the textarea starts here and grows as the user types. Use `maxRows` to cap the growth.',
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
        'Text shown after the label to mark the field as required or optional, for example "(Required)". It is only visible text and does not make the field required.',
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
      table: { category: 'Content' },
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
      description:
        'Marks the field as required for assistive technology and form validation. It shows no visible marker, so add an `indicator` as well.',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
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
    id: {
      control: 'text',
      description:
        'Unique identifier for the field (auto-generated if not provided)',
      table: { category: 'Other' },
    },
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
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

export const Overview: StoryFn<TextAreaProps> = () => (
  <>
    <TextArea label="Message" placeholder="Write a message" rows={3} />
    <TextArea
      label="Feedback"
      description="Tell us what we can improve"
      helperMessage="Do not include personal details"
      maxLength={200}
      showCharacterCount
      rows={3}
    />
  </>
)

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
AutoGrow.parameters = {
  docs: {
    description: {
      story:
        'TextArea grows as the user types. `rows` sets the starting height, which is also the minimum. `maxRows` caps the growth, and beyond it the textarea scrolls. Set both to the same value for a fixed height.',
    },
  },
}

export const Required: StoryFn<TextAreaProps> = () => (
  <>
    <TextArea
      label="Message"
      required
      placeholder="Required, no marker"
      rows={3}
    />
    <TextArea
      label="Feedback"
      required
      indicator="(Required)"
      placeholder="Required, with a marker"
      rows={3}
    />
  </>
)
Required.parameters = {
  docs: {
    description: {
      story:
        'The `required` prop is what makes a field required: a form cannot be submitted while it is empty, and assistive technology announces it. It shows no marker on its own, so add an `indicator` such as "(Required)" to show it.',
    },
  },
}

export const WithIndicator: StoryFn<TextAreaProps> = () => (
  <>
    <TextArea
      label="Additional info"
      indicator="(Optional)"
      placeholder="Optional field"
      rows={3}
    />
    <TextArea
      label="Comments"
      indicator="(Recommended)"
      placeholder="Recommended field"
      rows={3}
    />
    <TextArea
      label="Summary"
      indicator="(Max 500 characters)"
      placeholder="Short summary"
      rows={3}
    />
  </>
)
WithIndicator.parameters = {
  docs: {
    description: {
      story:
        'The `indicator` is plain text next to the label, so it can say anything, such as "(Optional)" or "(Recommended)". It does not make the field required, use `required` for that.',
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
States.parameters = {
  docs: {
    description: {
      story:
        'An invalid field shows the error styling. A disabled field cannot be focused or edited. A read only field keeps its value visible and selectable, but it cannot be edited.',
    },
  },
}

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
      <ExampleLabel>Spacious</ExampleLabel>
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
      <ExampleLabel>Comfortable</ExampleLabel>
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
