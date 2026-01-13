import { Meta, StoryFn } from '@storybook/react-vite'
import { useMemo, useState, type CSSProperties, type ChangeEvent } from 'react'
import { Stack } from '../../../../.storybook/components'
import { Button } from '../../Button'
import { Field } from './Field'
import type { FieldProps } from './Field.types'
import { HelperMessage } from '../HelperMessage'
import { useFieldIds } from './useFieldIds'

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
        component: `Field is a layout component for composing form fields with labels, descriptions, and helper messages.

Use the \`useFieldIds\` hook to generate consistent IDs and wire up accessibility attributes.

\`\`\`tsx
const { inputId, labelId, descriptionId, helperMessageId, getDescribedBy } = useFieldIds()
\`\`\`
`,
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

/**
 * Basic usage with the `useFieldIds` hook for accessible form fields.
 * The hook generates consistent IDs and a `getDescribedBy` helper for `aria-describedby`.
 * `labelId` is also available for components using `aria-labelledby` instead of `htmlFor`.
 */
export const Default: StoryFn<FieldProps> = () => {
  const { inputId, labelId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds()

  return (
    <Field>
      <Field.Label htmlFor={inputId}>Last name</Field.Label>
      <Field.Description id={descriptionId}>
        Last name cannot contain spaces.
      </Field.Description>
      <input
        id={inputId}
        aria-describedby={getDescribedBy()}
        defaultValue="Smith Jones"
        style={inputStyles}
      />
      <HelperMessage id={helperMessageId}>
        You cannot have spaces in your last name
      </HelperMessage>
    </Field>
  )
}

/**
 * Use the `indicator` prop to show required or optional status.
 */
export const WithIndicator: StoryFn<FieldProps> = () => {
  const required = useFieldIds()
  const optional = useFieldIds()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Field>
        <Field.Label htmlFor={required.inputId} indicator="(Required)">
          First name
        </Field.Label>
        <Field.Description id={required.descriptionId}>
          Your legal first name.
        </Field.Description>
        <input
          id={required.inputId}
          aria-describedby={required.getDescribedBy()}
          aria-required="true"
          placeholder="John"
          style={inputStyles}
        />
      </Field>
      <Field>
        <Field.Label htmlFor={optional.inputId} indicator="(Optional)">
          Organization
        </Field.Label>
        <Field.Description id={optional.descriptionId}>
          This information is optional.
        </Field.Description>
        <input
          id={optional.inputId}
          aria-describedby={optional.getDescribedBy()}
          placeholder="Equinor ASA"
          style={inputStyles}
        />
      </Field>
    </div>
  )
}

/**
 * For accessible live validation, wrap conditional content in a container
 * with `role="alert"`. The wrapper acts as an ARIA live region - screen
 * readers will announce changes when content appears inside it.
 *
 * Pass IDs to `getDescribedBy()` conditionally based on what's rendered.
 */
export const LiveValidation: StoryFn<FieldProps> = () => {
  const [value, setValue] = useState('')
  const hasError = useMemo(() => value.trim().length < 4, [value])
  const { inputId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Field>
      <Field.Label htmlFor={inputId}>Username</Field.Label>
      <Field.Description id={descriptionId}>
        Choose at least four characters.
      </Field.Description>
      <input
        id={inputId}
        value={value}
        onChange={onChange}
        aria-describedby={getDescribedBy({ hasHelperMessage: hasError })}
        aria-invalid={hasError}
        style={inputStyles}
      />
      <div role="alert">
        {hasError && (
          <HelperMessage id={helperMessageId}>
            Username must be at least four characters
          </HelperMessage>
        )}
      </div>
    </Field>
  )
}

/**
 * Simple field with only a label.
 */
export const LabelOnly: StoryFn<FieldProps> = () => {
  const { inputId } = useFieldIds()

  return (
    <Field>
      <Field.Label htmlFor={inputId}>Email</Field.Label>
      <input
        id={inputId}
        type="email"
        placeholder="name@example.com"
        style={inputStyles}
      />
    </Field>
  )
}

/**
 * Field with label and description.
 */
export const WithDescription: StoryFn<FieldProps> = () => {
  const { inputId, descriptionId, getDescribedBy } = useFieldIds()

  return (
    <Field>
      <Field.Label htmlFor={inputId}>Password</Field.Label>
      <Field.Description id={descriptionId}>
        Password must be at least 8 characters and contain numbers and letters.
      </Field.Description>
      <input
        id={inputId}
        type="password"
        aria-describedby={getDescribedBy()}
        style={inputStyles}
      />
    </Field>
  )
}

/**
 * Disabled state styling with `data-disabled` attribute.
 * Sub-components inherit disabled styling via CSS custom properties.
 */
export const DisabledField: StoryFn<FieldProps> = () => {
  const { inputId, descriptionId, getDescribedBy } = useFieldIds()

  return (
    <Field disabled>
      <Field.Label htmlFor={inputId}>Username</Field.Label>
      <Field.Description id={descriptionId}>
        Cannot be changed after creation.
      </Field.Description>
      <input
        id={inputId}
        value="john.doe"
        disabled
        aria-describedby={getDescribedBy()}
        style={inputStyles}
      />
    </Field>
  )
}

const checkboxStyles: CSSProperties = {
  width: '1.25rem',
  height: '1.25rem',
  accentColor: 'var(--eds-color-interactive-primary)',
}

/**
 * For inline checkbox layouts, use `position="start"` to place
 * the control before the label in a horizontal layout.
 */
export const WithCheckbox: StoryFn<FieldProps> = () => {
  const { inputId, descriptionId, getDescribedBy } = useFieldIds()

  return (
    <Field position="start">
      <input
        id={inputId}
        type="checkbox"
        aria-describedby={getDescribedBy()}
        style={checkboxStyles}
      />
      <Field.Label htmlFor={inputId} style={{ cursor: 'pointer' }}>
        I accept the terms
      </Field.Label>
      <Field.Description id={descriptionId}>
        By checking this box you agree to our terms and privacy policy.
      </Field.Description>
    </Field>
  )
}

/**
 * Checkbox validation with conditional helper message.
 */
export const CheckboxWithValidation: StoryFn<FieldProps> = () => {
  const [checked, setChecked] = useState(false)
  const showError = !checked
  const { inputId, helperMessageId, getDescribedBy } = useFieldIds()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Field position="start">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          aria-describedby={getDescribedBy({ hasHelperMessage: showError })}
          aria-invalid={showError}
          style={checkboxStyles}
        />
        <Field.Label htmlFor={inputId} style={{ cursor: 'pointer' }}>
          I accept the terms
        </Field.Label>
        <div role="alert">
          {showError && (
            <HelperMessage id={helperMessageId}>
              You must accept the terms before continuing.
            </HelperMessage>
          )}
        </div>
      </Field>
      <Button>Submit</Button>
    </div>
  )
}
