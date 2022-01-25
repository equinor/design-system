/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useState } from 'react'
import { Combobox, ComboboxProps, ComboboxChanges } from '../..'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { useForm, Controller } from 'react-hook-form'
import { Typography, EdsProvider, Button } from '@equinor/eds-core-react'
import { items } from '../../stories/data'
import page from './Combobox.docs.mdx'

export default {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      page,
    },
  },
} as Meta

const Wrapper = styled.div`
  margin-bottom: 350px;
`

type MyOptionType = {
  label: string
  symbol?: string
  trend?: string
}

const options = [
  {
    label: 'Microsoft Corporation',
    symbol: 'MSFT',
    trend: '📉',
  },
  {
    label: 'Tesla, Inc',
    symbol: 'TSLA',
    trend: '📈',
  },
  {
    label: 'Apple Inc.',
    symbol: 'AAPL',
    trend: '📈',
  },
  {
    label: 'NVIDIA Corporation',
    symbol: 'NVDA',
    trend: '📉',
  },
  {
    label: 'Alphabet Inc.',
    symbol: 'GOOG',
    trend: '📈',
  },
  {
    label: 'Amazon.com, Inc.',
    symbol: 'AMZN',
    trend: '📉',
  },
  {
    label: 'Meta Platforms, Inc.',
    symbol: 'FB',
    trend: '📉',
  },
  {
    label: 'Berkshire Hathaway Inc.',
    symbol: 'BRK',
    trend: '📈',
  },
]

export const introduction: Story<ComboboxProps<MyOptionType>> = (args) => {
  return (
    <Wrapper>
      <Combobox {...args} />
    </Wrapper>
  )
}

introduction.bind({})
introduction.args = {
  label: 'Stocks',
  options,
  multiple: false,
  readOnly: false,
  disabled: false,
}

export const optionLabel: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args

  return (
    <Wrapper>
      <Combobox
        options={options}
        optionLabel={(opt) => `${opt.trend} ${opt.label} (${opt.symbol})`}
        initialSelectedOptions={[options[0]]}
      />
    </Wrapper>
  )
}
optionLabel.args = {
  label: 'Stocks',
  options,
}

export const readonly: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args
  return (
    <Wrapper>
      <Combobox
        initialSelectedOptions={[options[0]]}
        options={options}
        readOnly
        {...args}
      />
      <Combobox
        initialSelectedOptions={[options[0], options[1]]}
        options={options}
        multiple
        readOnly
        {...args}
      />
    </Wrapper>
  )
}

readonly.args = {
  label: 'Stocks',
  options,
}

export const disabled: Story<ComboboxProps<MyOptionType>> = (args) => {
  return (
    <Wrapper>
      <Combobox disabled {...args} />
    </Wrapper>
  )
}
optionLabel.args = {
  label: 'Stocks',
  options,
}

export const disabledOption: Story<ComboboxProps<MyOptionType>> = (args) => {
  const options = [
    {
      label: 'Microsoft Corporation',
      symbol: 'MSFT',
      disabled: true,
    },
    {
      label: 'Tesla, Inc',
      symbol: 'TSLA',
    },
    {
      label: 'Apple Inc.',
      symbol: 'AAPL',
    },
    {
      label: 'NVIDIA Corporation',
      symbol: 'NVDA',
    },
    {
      label: 'Alphabet Inc.',
      symbol: 'GOOG',
      disabled: true,
    },
    {
      label: 'Amazon.com, Inc.',
      symbol: 'AMZN',
    },
    {
      label: 'Meta Platforms, Inc.',
      symbol: 'FB',
      disabled: true,
    },
    {
      label: 'Berkshire Hathaway Inc.',
      symbol: 'BRK',
    },
  ]

  return (
    <Wrapper>
      <Combobox label="Stocks" {...args} options={options} />
    </Wrapper>
  )
}

export const preselectedOptions: Story<ComboboxProps<MyOptionType>> = (
  args,
) => {
  const { options } = args

  return (
    <Wrapper>
      <Combobox initialSelectedOptions={[options[0]]} {...args} />
      <Combobox
        initialSelectedOptions={[options[0], options[1], options[5]]}
        multiple
        {...args}
      />
    </Wrapper>
  )
}

preselectedOptions.args = {
  label: 'Stocks',
  options,
}

export const onOptionsChange: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args

  const initialSelectedOptions = [options[0], options[1], options[5]]
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedItems, setSelectedItems] = useState(initialSelectedOptions)

  const onChange = (changes: ComboboxChanges<MyOptionType>) => {
    setSelectedItems(changes.selectedItems)
  }

  return (
    <Wrapper>
      <Typography>
        Selected items:{selectedItems.map((x) => x.label).toString()}
      </Typography>
      <Combobox
        label="Single Telefon areacodes"
        options={options}
        onOptionsChange={onChange}
        initialSelectedOptions={initialSelectedOptions}
      />
      <Combobox
        label="Multiple Telefon areacodes"
        options={options}
        onOptionsChange={onChange}
        initialSelectedOptions={initialSelectedOptions}
        multiple
      />
    </Wrapper>
  )
}

onOptionsChange.args = {
  label: 'Stocks',
  options,
}

export const Compact: Story<ComboboxProps<MyOptionType>> = (args) => {
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

export const WithReactHookForm: Story<ComboboxProps<MyOptionType>> = () => {
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
