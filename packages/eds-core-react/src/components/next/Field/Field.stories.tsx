import { Meta, StoryFn } from '@storybook/react-vite'
import { useMemo, useState, type ChangeEvent } from 'react'
import { Stack } from '../../../../.storybook/components'
import { Input } from '../Input'
import { Field } from './Field'
import type { FieldProps } from './Field.types'
import { useFieldIds } from './useFieldIds'
import page from './Field.docs.mdx'

const meta: Meta<typeof Field> = {
  title: 'EDS 2.0 (beta)/Inputs/Field',
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
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<FieldProps> = ({ disabled, ...rest }) => {
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
        aria-describedby={getDescribedBy({ hasHelperMessage: true })}
        defaultValue="Smith Jones"
        disabled={disabled}
      />
      <Field.HelperMessage id={helperMessageId}>
        You cannot have spaces in your last name
      </Field.HelperMessage>
    </Field>
  )
}

export const Overview: StoryFn<FieldProps> = () => {
  const { inputId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds()

  return (
    <Field>
      <Field.Label htmlFor={inputId}>Email</Field.Label>
      <Field.Description id={descriptionId}>
        We will send your receipt here.
      </Field.Description>
      <Input
        id={inputId}
        aria-describedby={getDescribedBy({ hasHelperMessage: true })}
        placeholder="name@example.com"
      />
      <Field.HelperMessage id={helperMessageId}>
        You can change it later in settings.
      </Field.HelperMessage>
    </Field>
  )
}

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
          required
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
WithIndicator.parameters = {
  docs: {
    description: {
      story:
        'Use the `indicator` prop on `Field.Label` for text such as "(Required)" or "(Optional)". It is only visible text, so set `required` on the input as well.',
    },
  },
}

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
LiveValidation.parameters = {
  docs: {
    description: {
      story:
        'Wrap a message that appears later in a container with `role="alert"`, so screen readers announce it when it shows up. Pass `hasHelperMessage` to `getDescribedBy` only while the message is rendered.',
    },
  },
}

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
WithDescription.parameters = {
  docs: {
    description: {
      story:
        'Use `Field.Description` for extra context below the label, and connect it to the input with `aria-describedby` so a screen reader reads it.',
    },
  },
}

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
        aria-describedby={getDescribedBy()}
      />
    </Field>
  )
}
Disabled.parameters = {
  docs: {
    description: {
      story:
        'Set `disabled` on Field to style the label, description and helper message as disabled. Set `disabled` on the input as well, because Field only passes the state to its own parts.',
    },
  },
}
