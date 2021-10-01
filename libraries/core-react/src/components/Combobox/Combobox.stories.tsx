/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useState } from 'react'
import {
  Combobox,
  ComboboxProps,
  ComboboxChanges,
  Button,
  Typography,
  EdsProvider,
} from '../..'
import { Story, Meta } from '@storybook/react/types-6-0'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { useForm, Controller } from 'react-hook-form'
import { items } from '../../stories/data'

export default {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component: `The Combobox component allows users to choose one or
        multiple items or options from a list.
        `,
      },
    },
  },
} as Meta

const Wrapper = styled.div`
  margin-bottom: 350px;
`

export const Default: Story<ComboboxProps> = (args) => (
  <Wrapper>
    <Combobox label="You can play with me" {...args} items={items} />
  </Wrapper>
)
export const Multiple: Story<ComboboxProps> = (args) => (
  <Wrapper>
    <Combobox label="Single" {...args} items={items} />
    <Combobox label="Multiple" {...args} items={items} multiple />
  </Wrapper>
)
export const Disabled: Story<ComboboxProps> = () => (
  <Combobox label="Choose an element" meta="km/t" items={items} disabled />
)

export const ReadOnly: Story<ComboboxProps> = () => (
  <Combobox label="This is read only" items={items} readOnly></Combobox>
)

const initial = ['Troms og Finnmark', 'Vestland']

export const WithPreselected: Story<ComboboxProps> = () => (
  <Wrapper>
    <Combobox
      multiple
      label="I have preselected options"
      items={items}
      initialSelectedItems={initial}
    />
  </Wrapper>
)

export const UseOnChangeHandler: Story<ComboboxProps> = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initial)

  function handleSelectedItemsChange(changes: ComboboxChanges) {
    setSelectedItems(changes.selectedItems)
  }
  return (
    <Wrapper>
      {selectedItems.length > 0 && (
        <p>My value is {selectedItems.join(', ')}</p>
      )}
      <Combobox
        multiple
        label="I can show my values outside the component itself"
        items={items}
        initialSelectedItems={initial}
        handleSelectedItemsChange={handleSelectedItemsChange}
      />
    </Wrapper>
  )
}
export const Controlled: Story<ComboboxProps> = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initial)

  function handleSelectedItemsChange(changes: ComboboxChanges) {
    setSelectedItems(changes.selectedItems)
  }
  return (
    <Wrapper>
      {selectedItems.length > 0 && (
        <p>My value is {selectedItems.join(', ')}</p>
      )}
      <Combobox
        multiple
        label="I'm a controlled component"
        items={items}
        selectedOptions={selectedItems}
        handleSelectedItemsChange={handleSelectedItemsChange}
      />
    </Wrapper>
  )
}

type FormValues = {
  fieldOne: string[]
}

const Field = styled.div`
  margin: 1rem;
`
export const WithReactHookForm: Story<ComboboxProps> = () => {
  const defaultValues: FormValues = {
    fieldOne: [],
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
    <Wrapper>
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
                render={({ field: { onChange } }) => (
                  <Combobox
                    handleSelectedItemsChange={({ selectedItems }) =>
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                      onChange(selectedItems)
                    }
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
    </Wrapper>
  )
}

export const Compact: Story = () => (
  <EdsProvider density="compact">
    <Combobox label="This is compact" items={items} />
  </EdsProvider>
)
