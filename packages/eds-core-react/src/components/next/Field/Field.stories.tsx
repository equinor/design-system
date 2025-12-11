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
    <Field.Label showOptionalIndicator>Organisasjon</Field.Label>
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

export const LabelOnly: StoryFn<FieldProps> = () => (
  <Field>
    <Field.Label>E-post</Field.Label>
    <input type="email" placeholder="navn@example.com" style={inputStyles} />
  </Field>
)

export const WithDescription: StoryFn<FieldProps> = () => (
  <Field>
    <Field.Label>Passord</Field.Label>
    <Field.Description>
      Passordet må være minst 8 tegn og inneholde tall og bokstaver.
    </Field.Description>
    <input type="password" style={inputStyles} />
  </Field>
)

export const RequiredWithIndicator: StoryFn<FieldProps> = () => (
  <Field required>
    <Field.Label showRequiredIndicator>Fornavn</Field.Label>
    <Field.Description>Ditt juridiske fornavn.</Field.Description>
    <input placeholder="Ola" style={inputStyles} />
  </Field>
)

export const DisabledField: StoryFn<FieldProps> = () => (
  <Field disabled>
    <Field.Label>Brukernavn</Field.Label>
    <Field.Description>Kan ikke endres etter opprettelse.</Field.Description>
    <input value="ola.nordmann" disabled style={inputStyles} />
  </Field>
)

export const AllValidationTones: StoryFn<FieldProps> = () => (
  <>
    <Field>
      <Field.Label>Danger</Field.Label>
      <input defaultValue="ugyldig verdi" style={inputStyles} />
      <ValidationMessage tone="danger">
        Dette feltet inneholder en feil.
      </ValidationMessage>
    </Field>
    <Field>
      <Field.Label>Warning</Field.Label>
      <input defaultValue="mulig problem" style={inputStyles} />
      <ValidationMessage tone="warning">
        Vær oppmerksom på denne verdien.
      </ValidationMessage>
    </Field>
    <Field>
      <Field.Label>Success</Field.Label>
      <input defaultValue="gyldig verdi" style={inputStyles} />
      <ValidationMessage tone="success">
        Feltet er korrekt utfylt.
      </ValidationMessage>
    </Field>
    <Field>
      <Field.Label>Info</Field.Label>
      <input placeholder="skriv noe..." style={inputStyles} />
      <ValidationMessage tone="info">
        Denne informasjonen er nyttig.
      </ValidationMessage>
    </Field>
  </>
)

export const HorizontalOptional: StoryFn<FieldProps> = () => (
  <Field layout="horizontal">
    <Field.Label showOptionalIndicator>Mellomnavn</Field.Label>
    <Field.Description>Valgfritt felt.</Field.Description>
    <input placeholder="Eventuelt mellomnavn" style={inputStyles} />
  </Field>
)

export const CombinedRequiredAndOptional: StoryFn<FieldProps> = () => (
  <>
    <Field required>
      <Field.Label showRequiredIndicator>Fornavn</Field.Label>
      <input placeholder="Ola" style={inputStyles} />
    </Field>
    <Field>
      <Field.Label showOptionalIndicator>Mellomnavn</Field.Label>
      <input placeholder="Eventuelt" style={inputStyles} />
    </Field>
    <Field required>
      <Field.Label showRequiredIndicator>Etternavn</Field.Label>
      <input placeholder="Nordmann" style={inputStyles} />
    </Field>
  </>
)
