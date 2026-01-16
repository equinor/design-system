import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './Label'

const meta: Meta<typeof Label> = {
  title: 'EDS 2.0 (beta)/Label',
  component: Label,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component:
          'Label component for form fields with support for optional/required indicators and info tooltip.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: {
    label: 'Field label',
    htmlFor: 'example-field',
  },
}

export const Optional: Story = {
  args: {
    label: 'Field label',
    optional: true,
    htmlFor: 'optional-field',
  },
}

export const Required: Story = {
  args: {
    label: 'Field label',
    required: true,
    htmlFor: 'required-field',
  },
}

export const WithInfo: Story = {
  args: {
    label: 'Field label',
    info: 'This is helpful information about the field.',
    htmlFor: 'info-field',
  },
}

export const OptionalWithInfo: Story = {
  args: {
    label: 'Field label',
    optional: true,
    info: 'Additional context for optional fields.',
    htmlFor: 'optional-info-field',
  },
}

export const RequiredWithInfo: Story = {
  args: {
    label: 'Field label',
    required: true,
    info: 'This field is required. Please provide a valid value.',
    htmlFor: 'required-info-field',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Label label="Default label" htmlFor="default" />
      <Label label="Optional label" optional htmlFor="optional" />
      <Label label="Required label" required htmlFor="required" />
      <Label
        label="Label with info"
        info="Helpful tooltip content"
        htmlFor="with-info"
      />
      <Label
        label="Optional with info"
        optional
        info="Context for this optional field"
        htmlFor="optional-with-info"
      />
      <Label
        label="Required with info"
        required
        info="This field is mandatory"
        htmlFor="required-with-info"
      />
    </div>
  ),
}
