import { Meta, StoryFn } from '@storybook/react-vite'
import { useMemo, useState, type CSSProperties, type ChangeEvent } from 'react'
import { Stack } from '../../../../.storybook/components'
import { Field } from './Field'
import type { FieldProps } from './Field.types'
import { ValidationMessage } from '../ValidationMessage'

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
          'Field composes labels, descriptions, controls, and validation messages while wiring up accessibility attributes automatically.',
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
    <input defaultValue="Smith Jones" style={inputStyles} />
    <ValidationMessage>
      You cannot have spaces in your last name
    </ValidationMessage>
  </Field>
)

export const WithIndicator: StoryFn<FieldProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <Field>
      <Field.Label indicator="(Required)">First name</Field.Label>
      <Field.Description>Your legal first name.</Field.Description>
      <input placeholder="John" style={inputStyles} />
    </Field>
    <Field>
      <Field.Label indicator="(Optional)">Organization</Field.Label>
      <Field.Description>This information is optional.</Field.Description>
      <input placeholder="Equinor ASA" style={inputStyles} />
    </Field>
  </div>
)

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
      <input value={value} onChange={onChange} style={inputStyles} />
      {hasError && (
        <ValidationMessage>
          Username must be at least four characters
        </ValidationMessage>
      )}
    </Field>
  )
}

export const LabelOnly: StoryFn<FieldProps> = () => (
  <Field>
    <Field.Label>Email</Field.Label>
    <input type="email" placeholder="name@example.com" style={inputStyles} />
  </Field>
)

export const WithDescription: StoryFn<FieldProps> = () => (
  <Field>
    <Field.Label>Password</Field.Label>
    <Field.Description>
      Password must be at least 8 characters and contain numbers and letters.
    </Field.Description>
    <input type="password" style={inputStyles} />
  </Field>
)

export const DisabledField: StoryFn<FieldProps> = () => (
  <Field disabled>
    <Field.Label>Username</Field.Label>
    <Field.Description>Cannot be changed after creation.</Field.Description>
    <input value="john.doe" disabled style={inputStyles} />
  </Field>
)

const checkboxStyles: CSSProperties = {
  width: '1.25rem',
  height: '1.25rem',
  accentColor: 'var(--eds-color-interactive-primary)',
}

export const WithCheckbox: StoryFn<FieldProps> = () => (
  <Field>
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
      <input type="checkbox" style={checkboxStyles} />
      <span>
        <span style={{ display: 'block' }}>I accept the terms</span>
        <Field.Description>
          By checking this box you agree to our terms and privacy policy.
        </Field.Description>
      </span>
    </label>
  </Field>
)

export const CheckboxWithValidation: StoryFn<FieldProps> = () => {
  const [checked, setChecked] = useState(false)
  const showError = !checked

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={checkboxStyles}
          />
          I accept the terms
        </label>
        {/* Use visibility to prevent layout shift when message appears/disappears */}
        <ValidationMessage
          role="alert"
          style={{ visibility: showError ? 'visible' : 'hidden' }}
        >
          You must accept the terms before continuing.
        </ValidationMessage>
      </Field>
      <button style={{ alignSelf: 'flex-start' }}>Submit</button>
    </div>
  )
}

export const CheckboxGroup: StoryFn<FieldProps> = () => (
  <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
    <legend style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
      Select interests
    </legend>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" style={checkboxStyles} />
          <span>Technology</span>
        </label>
      </Field>
      <Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" style={checkboxStyles} />
          <span>Design</span>
        </label>
      </Field>
      <Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" style={checkboxStyles} />
          <span>Sustainability</span>
        </label>
      </Field>
    </div>
  </fieldset>
)
