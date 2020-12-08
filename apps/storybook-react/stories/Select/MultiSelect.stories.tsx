import React, { useState } from 'react'
import {
  MultiSelect,
  MultiSelectProps,
  Button,
  Typography,
} from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { UseMultipleSelectionStateChange } from 'downshift'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { useForm, Controller } from 'react-hook-form'
import { items } from './data'

export default {
  title: 'Components/Select/MultiSelect',
  component: MultiSelect,
} as Meta

const Container = styled.div`
  margin-bottom: 350px;
`

export const Default: Story<MultiSelectProps> = (args) => (
  <Container>
    <MultiSelect label="You can play with me" {...args} items={items} />
  </Container>
)
export const Disabled: Story<MultiSelectProps> = () => (
  <MultiSelect label="Choose an element" meta="km/t" items={items} disabled />
)

export const ReadOnly: Story<MultiSelectProps> = () => (
  <MultiSelect label="This is read only" items={items} readOnly></MultiSelect>
)

const initial = ['Troms og Finnmark', 'Vestland']

export const WithPreselected: Story<MultiSelectProps> = () => (
  <Container>
    <MultiSelect
      label="I have preselected options"
      items={items}
      initialSelectedItems={initial}
    />
  </Container>
)

export const UseOnChangeHandler: Story<MultiSelectProps> = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initial)

  function handleSelectedItemsChange(
    changes: UseMultipleSelectionStateChange<string>,
  ) {
    setSelectedItems(changes.selectedItems)
  }
  return (
    <Container>
      {selectedItems.length > 0 && (
        <p>My value is {selectedItems.join(', ')}</p>
      )}
      <MultiSelect
        label="I can show my values outside the component itself"
        items={items}
        initialSelectedItems={initial}
        handleSelectedItemsChange={handleSelectedItemsChange}
      />
    </Container>
  )
}
export const Controlled: Story<MultiSelectProps> = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initial)

  function handleSelectedItemsChange(
    changes: UseMultipleSelectionStateChange<string>,
  ) {
    setSelectedItems(changes.selectedItems)
  }
  return (
    <Container>
      {selectedItems.length > 0 && (
        <p>My value is {selectedItems.join(', ')}</p>
      )}
      <MultiSelect
        label="I'm a controlled component"
        items={items}
        selectedOptions={selectedItems}
        handleSelectedItemsChange={handleSelectedItemsChange}
      />
    </Container>
  )
}

type FormValues = {
  fieldOne: string[]
}

type ControllerTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  onChange: (selectedItems: string[]) => void
  // eslint-disable-next-line react/no-unused-prop-types
  value: string[]
}

const Field = styled.div`
  margin: 1rem;
`
export const WithReactHookForm: Story<MultiSelectProps> = () => {
  const defaultValues: FormValues = {
    fieldOne: [],
  }
  const { handleSubmit, errors, control } = useForm<FormValues>({
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
                name="fieldOne"
                rules={{
                  validate: (value: string[]) => {
                    return value.length > 0
                  },
                }}
                render={({ onChange, value }: ControllerTypes) => (
                  <MultiSelect
                    handleSelectedItemsChange={({ selectedItems }) =>
                      onChange(selectedItems)
                    }
                    selectedOptions={value}
                    label="Where are you from?"
                    items={items}
                    aria-invalid={errors.fieldOne ? 'true' : 'false'}
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
                  display: errors.fieldOne ? 'block' : 'none',
                }}
              >
                Hey you! You will have to select <i>something</i>
              </span>
            </Field>

            <Button type="submit" style={{ marginTop: '1rem' }}>
              I have made my decision!
            </Button>
          </>
        )}
      </form>
    </Container>
  )
}
