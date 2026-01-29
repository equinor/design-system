import { Meta, StoryFn } from '@storybook/react-vite'
import { useMemo, useState, type ChangeEvent } from 'react'
import { Stack } from '../../../../.storybook/components'
import { Input } from '../Input'
import { Field } from './Field'
import type { FieldProps } from './Field.types'
import { useFieldIds } from './useFieldIds'

const meta: Meta<typeof Field> = {
  title: 'EDS 2.0 (beta)/Inputs/Form/Field',
  component: Field,
  tags: ['beta'],
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
  args: {
    disabled: false,
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description:
        'Applies disabled styling to the field and all sub-components',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    position: {
      control: false,
      description:
        'Layout direction. Used internally by Checkbox, Radio, and Switch.',
    },
    children: {
      control: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `**⚠️ Beta Component** - This component is under active development and may have breaking changes.

A layout primitive for building accessible form fields with labels, descriptions, and helper messages.

> **💡 For most use cases, use TextField instead.** Field is a low-level building block for creating custom form components.

Use the \`useFieldIds\` hook to generate IDs and wire up accessibility attributes:

\`\`\`tsx
const { inputId, descriptionId, helperMessageId, getDescribedBy } = useFieldIds()
\`\`\`
`,
      },
    },
  },
}

export default meta

/**
 * Basic usage with the `useFieldIds` hook for accessible form fields.
 * The hook generates consistent IDs and a `getDescribedBy` helper for `aria-describedby`.
 */
export const Default: StoryFn<FieldProps> = ({ disabled, ...rest }) => {
  const { inputId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds()

  return (
    <Field disabled={disabled} {...rest}>
      <Field.Label htmlFor={inputId}>Last name</Field.Label>
      <Field.Description id={descriptionId}>
        Last name cannot contain spaces.
      </Field.Description>
      <Input
        id={inputId}
        aria-describedby={getDescribedBy()}
        defaultValue="Smith Jones"
        disabled={disabled}
      />
      <Field.HelperMessage id={helperMessageId}>
        You cannot have spaces in your last name
      </Field.HelperMessage>
    </Field>
  )
}

/**
 * Use the `indicator` prop to show required or optional status.
 * This is a visual indicator only — remember to also set `aria-required` on the input.
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
        <Input
          id={required.inputId}
          aria-describedby={required.getDescribedBy()}
          aria-required="true"
          placeholder="John"
        />
      </Field>
      <Field>
        <Field.Label htmlFor={optional.inputId} indicator="(Optional)">
          Organization
        </Field.Label>
        <Field.Description id={optional.descriptionId}>
          This information is optional.
        </Field.Description>
        <Input
          id={optional.inputId}
          aria-describedby={optional.getDescribedBy()}
          placeholder="Equinor ASA"
        />
      </Field>
    </div>
  )
}

/**
 * For accessible live validation, wrap conditional content in a container
 * with `role="alert"`. The wrapper acts as an ARIA live region — screen
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
      <Input
        id={inputId}
        value={value}
        onChange={onChange}
        aria-describedby={getDescribedBy({ hasHelperMessage: hasError })}
        invalid={hasError}
      />
      <div role="alert">
        {hasError && (
          <Field.HelperMessage id={helperMessageId}>
            Username must be at least four characters
          </Field.HelperMessage>
        )}
      </div>
    </Field>
  )
}

/**
 * Use `Field.Description` to provide additional context below the label.
 * Connect it to the input using `aria-describedby` for screen reader support.
 */
export const WithDescription: StoryFn<FieldProps> = () => {
  const { inputId, descriptionId, getDescribedBy } = useFieldIds()

  return (
    <Field>
      <Field.Label htmlFor={inputId}>Password</Field.Label>
      <Field.Description id={descriptionId}>
        Password must be at least 8 characters and contain numbers and letters.
      </Field.Description>
      <Input id={inputId} type="password" aria-describedby={getDescribedBy()} />
    </Field>
  )
}

/**
 * Set `disabled` on Field to apply disabled styling to all sub-components.
 * The disabled state is passed down via the `data-disabled` attribute.
 */
export const Disabled: StoryFn<FieldProps> = () => {
  const { inputId, descriptionId, getDescribedBy } = useFieldIds()

  return (
    <Field disabled>
      <Field.Label htmlFor={inputId}>Username</Field.Label>
      <Field.Description id={descriptionId}>
        Cannot be changed after creation.
      </Field.Description>
      <Input
        id={inputId}
        value="john.doe"
        disabled
        readOnly
        aria-describedby={getDescribedBy()}
      />
    </Field>
  )
}
