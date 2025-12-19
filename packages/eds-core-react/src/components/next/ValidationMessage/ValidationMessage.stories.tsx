import { useState } from 'react'
import { Meta, StoryObj, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../../.storybook/components'
import { ValidationMessage } from './ValidationMessage'
import { Field } from '../Field'

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
          'ValidationMessage communicates problems or status information associated with a field.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof ValidationMessage>

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

const buttonStyles = {
  marginTop: '8px',
  padding: '8px 16px',
  background: 'var(--eds-color-bg-accent-default)',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
}

/**
 * This example shows how ValidationMessage appears when form validation fails.
 * Notice how the layout shifts when the message appears/disappears.
 */
export const PasswordValidation: StoryFn = () => {
  const [password, setPassword] = useState('')
  const minLength = 8
  const isValid = password.length >= minLength

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
      {!isValid && password.length > 0 && (
        <ValidationMessage role="alert">
          Password must be at least {minLength} characters (currently{' '}
          {password.length})
        </ValidationMessage>
      )}
      <button type="button" style={buttonStyles}>
        Submit
      </button>
    </Field>
  )
}

/**
 * To prevent layout shift, reserve space for the ValidationMessage using
 * CSS `visibility: hidden` instead of conditional rendering.
 * This keeps the message in the DOM but invisible.
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
      {/* Always render, use visibility to hide - no layout shift */}
      <ValidationMessage
        role="alert"
        style={{ visibility: showError ? 'visible' : 'hidden' }}
      >
        Password must be at least {minLength} characters
      </ValidationMessage>
      <button type="button" style={buttonStyles}>
        Submit
      </button>
    </Field>
  )
}
