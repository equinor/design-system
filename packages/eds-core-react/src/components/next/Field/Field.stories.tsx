import { Meta, StoryFn } from '@storybook/react-vite'
import { useMemo, useState, type CSSProperties, type ChangeEvent } from 'react'
import { Stack } from '../../../../.storybook/components'
import { Button } from '../../Button'
import { Field } from './Field'
import type { FieldProps } from './Field.types'
import { HelperMessage } from '../HelperMessage'

const meta: Meta<typeof Field> = {
  title: 'EDS 2.0 (beta)/Inputs/Form/Field',
  component: Field,
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
          'Field composes labels, descriptions, controls, and helper messages while wiring up accessibility attributes automatically.',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
    },
  },
}

export default meta

const inputStyles: CSSProperties = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid var(--eds-color-border-neutral-medium)',
  width: '100%',
}

export const Default: StoryFn<FieldProps> = () => (
  <Field>
    <Field.Label>Last name</Field.Label>
    <Field.Description>Last name cannot contain spaces.</Field.Description>
    <Field.Control>
      <input defaultValue="Smith Jones" style={inputStyles} />
    </Field.Control>
    <HelperMessage>You cannot have spaces in your last name</HelperMessage>
  </Field>
)

export const WithIndicator: StoryFn<FieldProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <Field>
      <Field.Label indicator="(Required)">First name</Field.Label>
      <Field.Description>Your legal first name.</Field.Description>
      <Field.Control>
        <input placeholder="John" style={inputStyles} />
      </Field.Control>
    </Field>
    <Field>
      <Field.Label indicator="(Optional)">Organization</Field.Label>
      <Field.Description>This information is optional.</Field.Description>
      <Field.Control>
        <input placeholder="Equinor ASA" style={inputStyles} />
      </Field.Control>
    </Field>
  </div>
)

/**
 * For accessible live validation, wrap conditional content in a container
 * with `role="alert"`. The wrapper acts as an ARIA live region - screen
 * readers will announce changes when content appears inside it.
 */
export const LiveValidation: StoryFn<FieldProps> = () => {
  const [value, setValue] = useState('')
  const hasError = useMemo(() => value.trim().length < 4, [value])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Field>
      <Field.Label>Username</Field.Label>
      <Field.Description>Choose at least four characters.</Field.Description>
      <Field.Control>
        <input value={value} onChange={onChange} style={inputStyles} />
      </Field.Control>
      <div role="alert">
        {hasError && (
          <HelperMessage>
            Username must be at least four characters
          </HelperMessage>
        )}
      </div>
    </Field>
  )
}

export const LabelOnly: StoryFn<FieldProps> = () => (
  <Field>
    <Field.Label>Email</Field.Label>
    <Field.Control>
      <input type="email" placeholder="name@example.com" style={inputStyles} />
    </Field.Control>
  </Field>
)

export const WithDescription: StoryFn<FieldProps> = () => (
  <Field>
    <Field.Label>Password</Field.Label>
    <Field.Description>
      Password must be at least 8 characters and contain numbers and letters.
    </Field.Description>
    <Field.Control>
      <input type="password" style={inputStyles} />
    </Field.Control>
  </Field>
)

export const DisabledField: StoryFn<FieldProps> = () => (
  <Field disabled>
    <Field.Label>Username</Field.Label>
    <Field.Description>Cannot be changed after creation.</Field.Description>
    <Field.Control>
      <input value="john.doe" disabled style={inputStyles} />
    </Field.Control>
  </Field>
)

const checkboxStyles: CSSProperties = {
  width: '1.25rem',
  height: '1.25rem',
  accentColor: 'var(--eds-color-interactive-primary)',
}

/**
 * For inline checkbox layouts, use `position="start"` to place
 * the control before the label in a horizontal layout.
 */
export const WithCheckbox: StoryFn<FieldProps> = () => (
  <Field position="start">
    <Field.Control>
      <input type="checkbox" style={checkboxStyles} />
    </Field.Control>
    <Field.Label style={{ cursor: 'pointer' }}>I accept the terms</Field.Label>
    <Field.Description>
      By checking this box you agree to our terms and privacy policy.
    </Field.Description>
  </Field>
)

/**
 * For accessible validation messages, use conditional rendering inside
 * a container with `role="alert"`. The wrapper stays in the DOM as an
 * ARIA live region, and screen readers will announce content changes.
 */
export const CheckboxWithValidation: StoryFn<FieldProps> = () => {
  const [checked, setChecked] = useState(false)
  const showError = !checked

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Field position="start">
        <Field.Control>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={checkboxStyles}
          />
        </Field.Control>
        <Field.Label style={{ cursor: 'pointer' }}>
          I accept the terms
        </Field.Label>
        {/* Wrapper with role="alert" stays in DOM, content renders conditionally */}
        <div role="alert">
          {showError && (
            <HelperMessage>
              You must accept the terms before continuing.
            </HelperMessage>
          )}
        </div>
      </Field>
      <Button>Submit</Button>
    </div>
  )
}
