import { useState } from 'react'
import { Meta, StoryObj, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../../.storybook/components'
import { Button } from '../../Button'
import { HelperMessage } from './HelperMessage'
import { Field } from '../Field'

const meta: Meta<typeof HelperMessage> = {
  title: 'EDS 2.0 (beta)/Inputs/Form/HelperMessage',
  component: HelperMessage,
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
          'HelperMessage communicates guidance, validation errors, or status information associated with a field.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof HelperMessage>

export const Default: Story = {
  args: {
    children: 'Please resolve the highlighted errors',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'This field is disabled',
  },
}

const inputStyles = {
  padding: '8px 12px',
  border: '1px solid var(--eds-color-border-neutral-medium)',
  borderRadius: '4px',
  width: '100%',
}

/**
 * To prevent layout shift, use the `hidden` attribute instead of
 * conditional rendering. This keeps the message in the DOM but hidden.
 */
export const PasswordValidationNoLayoutShift: StoryFn = () => {
  const [password, setPassword] = useState('')
  const minLength = 8
  const isValid = password.length >= minLength
  const showError = !isValid && password.length > 0

  return (
    <Field>
      <Field.Label indicator="(Required)">Password</Field.Label>
      <Field.Control>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyles}
        />
      </Field.Control>
      {/* Always render, use hidden to hide - no layout shift */}
      <HelperMessage role="alert" hidden={!showError}>
        Password must be at least {minLength} characters
      </HelperMessage>
      <Button type="button">Submit</Button>
    </Field>
  )
}
