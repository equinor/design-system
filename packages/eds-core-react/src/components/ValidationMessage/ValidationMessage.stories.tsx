import { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import { ValidationMessage } from './ValidationMessage'
import type { ValidationMessageProps } from './ValidationMessage.types'

const meta: Meta<typeof ValidationMessage> = {
  title: 'Inputs/Form/ValidationMessage',
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

const Template: StoryFn<ValidationMessageProps> = (args) => (
  <ValidationMessage {...args} />
)

export const Danger = Template.bind({})
Danger.args = {
  children: 'Please resolve the highlighted errors',
}

export const Warning = Template.bind({})
Warning.args = {
  tone: 'warning',
  children: 'Proceed with caution — check your selections',
}

export const Success = Template.bind({})
Success.args = {
  tone: 'success',
  children: 'All checks passed successfully',
}

export const Info = Template.bind({})
Info.args = {
  tone: 'info',
  children: 'Additional context is available for this field',
}
