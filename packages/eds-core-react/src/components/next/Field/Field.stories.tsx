import { Meta, StoryFn } from '@storybook/react-vite'
import { useMemo, useState, type CSSProperties, type ChangeEvent } from 'react'
import { Stack } from '../../../../.storybook/components'
import { Field } from './Field'
import type { FieldProps } from './Field.types'
import { ValidationMessage } from '../ValidationMessage'

const meta: Meta<typeof Field> = {
  title: 'EDS 2.0 (beta)/Field',
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

export const Default: StoryFn<FieldProps> = (args) => (
  <Field required {...args}>
    <Field.Label>Etternavn</Field.Label>
    <Field.Description>
      Etternavnet kan ikke inneholde mellomrom.
    </Field.Description>
    <input defaultValue="Nordmann Svenske" style={inputStyles} />
    <ValidationMessage>
      Du kan ikke ha mellomrom i etternavnet ditt
    </ValidationMessage>
  </Field>
)

Default.args = {
  required: true,
}

export const OptionalField: StoryFn<FieldProps> = () => (
  <Field>
    <Field.Label showRequiredIndicator={false}>Organisasjon</Field.Label>
    <Field.Description>Denne informasjonen er valgfri.</Field.Description>
    <input placeholder="Equinor ASA" style={inputStyles} />
  </Field>
)

export const LiveValidation: StoryFn<FieldProps> = () => {
  const [value, setValue] = useState('')
  const hasError = useMemo(() => value.trim().length < 4, [value])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Field required>
      <Field.Label>Brukernavn</Field.Label>
      <Field.Description>Velg minst fire tegn.</Field.Description>
      <input value={value} onChange={onChange} style={inputStyles} />
      {hasError && (
        <ValidationMessage>
          Brukernavnet må bestå av minst fire tegn
        </ValidationMessage>
      )}
    </Field>
  )
}

export const HorizontalLayout: StoryFn<FieldProps> = () => (
  <Field layout="horizontal" required>
    <Field.Label>Telefon</Field.Label>
    <Field.Description>Oppgi nummer uten landskode.</Field.Description>
    <input type="tel" placeholder="12345678" style={inputStyles} />
    <ValidationMessage tone="info">Eksempel: 12345678</ValidationMessage>
  </Field>
)
