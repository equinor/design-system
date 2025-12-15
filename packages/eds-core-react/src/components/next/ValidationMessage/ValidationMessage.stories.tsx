import { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../../../../.storybook/components'
import { ValidationMessage } from './ValidationMessage'

const meta: Meta<typeof ValidationMessage> = {
  title: 'EDS 2.0 (beta)/Inputs/Form/ValidationMessage',
  component: ValidationMessage,
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'ValidationMessage communicates problems, warnings, or status information associated with a field. The tone adjusts colors to match the semantic meaning.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof ValidationMessage>

export const Danger: Story = {
  args: {
    children: 'Please resolve the highlighted errors',
  },
}

export const Warning: Story = {
  args: {
    tone: 'warning',
    children: 'Proceed with caution — check your selections',
  },
}

export const Success: Story = {
  args: {
    tone: 'success',
    children: 'All checks passed successfully',
  },
}

export const Info: Story = {
  args: {
    tone: 'info',
    children: 'Additional context is available for this field',
  },
}
