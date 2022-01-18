/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useState } from 'react'
import { Combobox, ComboboxProps, ComboboxChanges } from '../..'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { useForm, Controller } from 'react-hook-form'
import { Typography, EdsProvider, Button } from '@equinor/eds-core-react'
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

type CustomDataType = {
  label: string
  areaCode?: string
  emoji?: string
}

export const Default: Story<ComboboxProps<CustomDataType>> = (args) => {
  return (
    <Wrapper>
      <Combobox {...args} />
    </Wrapper>
  )
}

Default.bind({})
Default.args = {
  label: 'Telefon areacodes',
  options: [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ],
  multiple: false,
}

export const UsingOptionLabel: Story<ComboboxProps<CustomDataType>> = () => {
  const data = [
    { label: 'Oslo', areaCode: '02', emoji: '☎️' },
    { label: 'Rogaland', areaCode: '04', emoji: '☎️' },
    { label: 'Møre og Romsdal', areaCode: '070', emoji: '☎️' },
    { label: 'Nord-Norge', areaCode: '08x', emoji: '☎️' },
    { label: 'Hordaland', areaCode: '54', emoji: '☎️' },
    { label: 'Østfold', areaCode: '09', emoji: '☎️' },
  ]

  return (
    <Wrapper>
      <Combobox
        label="Telefon areacodes"
        options={data}
        optionLabel={(opt) => `${opt.emoji} ${opt.areaCode} - ${opt.label}`}
        initialSelectedOptions={[data[0]]}
      />
      <Combobox
        label="Telefon areacodes"
        options={data}
        optionLabel={(opt) => `${opt.emoji} ${opt.areaCode} - ${opt.label}`}
        initialSelectedOptions={[data[0], data[2]]}
        multiple
      />
    </Wrapper>
  )
}

export const Disabled: Story<ComboboxProps<CustomDataType>> = (args) => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <Wrapper>
      <Combobox
        label="Single Telefon areacodes"
        {...args}
        options={data}
        disabled
      />
      <Combobox
        label="Multiple Telefon areacodes"
        {...args}
        options={data}
        disabled
        multiple
      />
    </Wrapper>
  )
}

export const DisabledItems: Story<ComboboxProps<CustomDataType>> = (args) => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04', disabled: true },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x', disabled: true },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <Wrapper>
      <Combobox label="Single Telefon areacodes" options={data} {...args} />
      <Combobox
        label="Multiple Telefon areacodes"
        options={data}
        multiple
        {...args}
      />
    </Wrapper>
  )
}

export const Readonly: Story<ComboboxProps<CustomDataType>> = (args) => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <Wrapper>
      <Combobox
        label="Single Telefon areacodes"
        initialSelectedOptions={[data[0]]}
        options={data}
        readOnly
        {...args}
      />
      <Combobox
        label="Multiple Telefon areacodes"
        initialSelectedOptions={[data[0], data[1]]}
        options={data}
        multiple
        readOnly
        {...args}
      />
    </Wrapper>
  )
}

export const WithPreselected: Story<ComboboxProps<CustomDataType>> = (args) => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <Wrapper>
      <Combobox
        label="Single Telefon areacodes"
        initialSelectedOptions={[data[0]]}
        options={data}
        {...args}
      />
      <Combobox
        label="Multiple Telefon areacodes"
        initialSelectedOptions={[data[0], data[1], data[5]]}
        options={data}
        multiple
        {...args}
      />
    </Wrapper>
  )
}

export const OnChange: Story<ComboboxProps<CustomDataType>> = () => {
  const data: CustomDataType[] = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]
  const initialSelectedOptions = [data[0], data[1], data[5]]
  const [selectedItems, setSelectedItems] = useState(initialSelectedOptions)

  const onChange = (changes: ComboboxChanges<CustomDataType>) => {
    console.log('options', changes.selectedItems)
    setSelectedItems(changes.selectedItems)
  }

  return (
    <Wrapper>
      <Typography>
        Selected items:{selectedItems.map((x) => x.label).toString()}
      </Typography>
      <Combobox
        label="Single Telefon areacodes"
        options={data}
        onOptionsChange={onChange}
        initialSelectedOptions={initialSelectedOptions}
      />
      <Combobox
        label="Multiple Telefon areacodes"
        options={data}
        onOptionsChange={onChange}
        initialSelectedOptions={initialSelectedOptions}
        multiple
      />
    </Wrapper>
  )
}

export const Compact: Story<ComboboxProps<CustomDataType>> = (args) => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <EdsProvider density="compact">
      <Wrapper>
        <Combobox
          label="Single Telefon areacodes"
          initialSelectedOptions={[data[0]]}
          options={data}
          {...args}
        />
        <Combobox
          label="Multiple Telefon areacodes"
          initialSelectedOptions={[data[0], data[1]]}
          options={data}
          multiple
          {...args}
        />
      </Wrapper>
    </EdsProvider>
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

const Container = styled.div`
  margin-bottom: 350px;
`

export const WithReactHookForm: Story<ComboboxProps<CustomDataType>> = () => {
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
                  <Combobox
                    onOptionsChange={({ selectedItems }) =>
                      onChange(selectedItems)
                    }
                    label="Where are you from?"
                    options={items.map((opt) => ({
                      label: opt,
                    }))}
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
                  <Combobox
                    onOptionsChange={({ selectedItems }) =>
                      onChange(selectedItems)
                    }
                    label="Choose your favourite county"
                    options={items.map((opt) => ({
                      label: opt,
                    }))}
                  />
                )}
              />
            </Field>
            <Field>
              <Controller
                control={control}
                name="optionalField"
                render={({ field: { onChange } }) => (
                  <Combobox
                    onOptionsChange={({ selectedItems }) =>
                      onChange(selectedItems)
                    }
                    label="Pick atleast two fruits (optional)"
                    options={[
                      { label: 'Banana', emoji: '🍌' },
                      { label: 'Apple', emoji: '🍎' },
                      { label: 'Grapes', emoji: '🍇' },
                      { label: 'Kiwi', emoji: '🥝' },
                      { label: 'Pineapple', emoji: '🍍' },
                    ]}
                    optionLabel={(opt) => `${opt.emoji} ${opt.label}`}
                    multiple
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
