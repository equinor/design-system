/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useState } from 'react'
import { SingleSelect, SingleSelectProps, Button, Typography } from '../../..'
import { UseComboboxStateChange } from 'downshift'
import { action } from '@storybook/addon-actions'
import { Story, Meta } from '@storybook/react'
import { useForm, Controller } from 'react-hook-form'
import styled from 'styled-components'
import { items } from '../../../stories/data'
import { EdsProvider } from '../../EdsProvider'

export default {
  title: 'Components/Select/SingleSelect',
  component: SingleSelect,
  parameters: {
    docs: {
      description: {
        component: `The SingleSelect component allows users to choose one
        item or option from a list.
        `,
      },
    },
  },
} as Meta

const Container = styled.div`
  margin-bottom: 350px;
`

export const Default: Story<SingleSelectProps> = (args) => (
  <Container>
    <SingleSelect label="Choose an element" {...args} items={items} />
  </Container>
)

export const Disabled: Story = () => (
  <SingleSelect label="Choose an element" meta="km/t" items={items} disabled />
)

export const ReadOnly: Story = () => (
  <SingleSelect label="This is read only" items={items} readOnly />
)

export const WithPreselected: Story<SingleSelectProps> = () => (
  <Container>
    <SingleSelect
      label="I have a preselected option"
      initialSelectedItem="Troms og Finnmark"
      items={items}
    />
  </Container>
)

export const Controlled: Story<SingleSelectProps> = () => {
  const [selectedItem, setSelectedItem] = useState<string>('Troms og Finnmark')
  function handleSelectedItemChange(changes: UseComboboxStateChange<string>) {
    setSelectedItem(changes.selectedItem)
  }
  return (
    <Container>
      <p>{`My value is ${selectedItem}`}</p>
      <SingleSelect
        label="I'm controlled"
        items={items}
        selectedOption={selectedItem}
        handleSelectedItemChange={handleSelectedItemChange}
      />
    </Container>
  )
}

type FormValues = {
  fabFieldOne: string
  fabFieldTwo: string
  optionalField: string
}

const Field = styled.div`
  margin: 1rem;
`
export const WithReactHookForm: Story<SingleSelectProps> = () => {
  const defaultValues: FormValues = {
    fabFieldOne: null,
    fabFieldTwo: null,
    optionalField: null,
  }
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues,
  })
  const [isSubmitted, updateIsSubmitted] = useState(false)
  const [formData, updateFormData] = useState<FormData>(null)

  const onSubmit = (data: FormData) => {
    updateFormData(data)
    updateIsSubmitted(true)
    action('onSubmit')(data)
  }

  return (
    <Container>
      <Typography variant="body_short" style={{ marginBottom: '1rem' }}>
        Real life example with an external{' '}
        <a
          href="https://react-hook-form.com/"
          rel="noreferrer noopener"
          target="blank"
        >
          form library
        </a>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isSubmitted ? (
          <>
            <span>Submitted data:</span>
            <p>{JSON.stringify(formData)}</p>
            <Button
              variant="outlined"
              onClick={() => {
                updateIsSubmitted(false)
                updateFormData(null)
              }}
            >
              Reset
            </Button>
          </>
        ) : (
          <>
            <Field>
              <Controller
                control={control}
                name="fabFieldOne"
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <SingleSelect
                    handleSelectedItemChange={({ selectedItem }) =>
                      onChange(selectedItem)
                    }
                    label="Where are you from?"
                    items={items}
                    aria-invalid={errors.fabFieldOne ? 'true' : 'false'}
                    aria-describedby="error-county-required"
                    aria-required
                  />
                )}
              />
              <span
                role="alert"
                id="error-county-required"
                style={{
                  color: 'red',
                  paddingTop: '0.5rem',
                  fontSize: '0.75rem',
                  display:
                    errors.fabFieldOne && errors.fabFieldOne.type === 'required'
                      ? 'block'
                      : 'none',
                }}
              >
                Hey you! This field is required
              </span>
            </Field>
            <Field>
              <Controller
                control={control}
                name="fabFieldTwo"
                render={({ field: { onChange } }) => (
                  <SingleSelect
                    handleSelectedItemChange={({ selectedItem }) =>
                      onChange(selectedItem)
                    }
                    label="Choose your favourite county"
                    items={items}
                  />
                )}
              />
            </Field>
            <Field>
              <Controller
                control={control}
                name="optionalField"
                render={({ field: { onChange } }) => (
                  <SingleSelect
                    handleSelectedItemChange={({ selectedItem }) =>
                      onChange(selectedItem)
                    }
                    label="Pick a fruit (optional)"
                    items={['Banana', 'Apple', 'Orange']}
                  />
                )}
              />
            </Field>
            <Button type="submit" style={{ marginTop: '1rem' }}>
              I have made my decisions!
            </Button>
          </>
        )}
      </form>
    </Container>
  )
}

export const Compact: Story = () => (
  <EdsProvider density="compact">
    <SingleSelect label="This is compact" items={items} />
  </EdsProvider>
)
