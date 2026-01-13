import { useState } from 'react'
import { Meta, StoryObj, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../../.storybook/components'
import { Button } from '../../Button'
import { HelperMessage } from './HelperMessage'
import { Field, useFieldIds } from '../Field'

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
 * For accessible live validation, use conditional rendering inside a
 * container with `role="alert"`. The wrapper stays in the DOM as an
 * ARIA live region, ensuring screen readers announce changes.
 */
export const PasswordValidation: StoryFn = () => {
  const [password, setPassword] = useState('')
  const minLength = 8
  const isValid = password.length >= minLength
  const showError = !isValid && password.length > 0
  const { inputId, helperMessageId, getDescribedBy } = useFieldIds()

  return (
    <Field>
      <Field.Label htmlFor={inputId} indicator="(Required)">
        Password
      </Field.Label>
      <input
        id={inputId}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-describedby={getDescribedBy({
          hasDescription: false,
          hasHelperMessage: showError,
        })}
        aria-invalid={showError}
        style={inputStyles}
      />
      {/* Wrapper with role="alert" stays in DOM, content renders conditionally */}
      <div role="alert">
        {showError && (
          <HelperMessage id={helperMessageId}>
            Password must be at least {minLength} characters
          </HelperMessage>
        )}
      </div>
      <Button type="button">Submit</Button>
    </Field>
  )
}
