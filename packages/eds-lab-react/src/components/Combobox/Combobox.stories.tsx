/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useState, useEffect } from 'react'
import { Combobox, ComboboxProps, ComboboxChanges } from '../..'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { useForm, Controller } from 'react-hook-form'
import {
  Typography,
  EdsProvider,
  Button,
  Density,
} from '@equinor/eds-core-react'
import { Stack } from '../../../.storybook/components'
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

type MyOptionType = {
  label: string
  symbol?: string
  trend?: string
}

const counties = [
  'Oslo',
  'Rogaland',
  'Møre og Romsdal',
  'Nordland',
  'Viken',
  'Innlandet',
  'Vestfold og Telemark',
  'Agder',
  'Vestland',
  'Trøndelag',
  'Troms og Finnmark',
]

const stocks = [
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

export const Introduction: Story<ComboboxProps<MyOptionType>> = (args) => {
  return (
    <Stack>
      <Combobox {...args} />
    </Stack>
  )
}

Introduction.bind({})
Introduction.args = {
  label: 'Select a stock',
  options: stocks,
  multiple: false,
  readOnly: false,
  disabled: false,
  disablePortal: false,
}

export const Multiple: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args

  return (
    <Stack direction="column">
      <Combobox label="Select a stock" options={options} />
      <Combobox label="Select multiple stocks" options={options} multiple />
    </Stack>
  )
}
Multiple.args = {
  options: stocks,
}

export const OptionLabel: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args

  return (
    <Stack direction="column">
      <Combobox
        label="Select a stock"
        options={options}
        optionLabel={(opt) => `${opt.trend} ${opt.label} (${opt.symbol})`}
        initialSelectedOptions={[options[0]]}
      />
      <Combobox
        label="Select multiple stocks"
        options={options}
        optionLabel={(opt) => `${opt.trend} ${opt.label} (${opt.symbol})`}
        initialSelectedOptions={[options[0]]}
        multiple
      />
    </Stack>
  )
}
OptionLabel.args = {
  options: stocks,
}

export const Readonly: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args
  return (
    <Stack direction="column">
      <Combobox
        label="Select a stock"
        initialSelectedOptions={[options[0]]}
        options={options}
        readOnly
        {...args}
      />
      <Combobox
        label="Select multiple stocks"
        initialSelectedOptions={[options[0], options[1]]}
        options={options}
        multiple
        readOnly
        {...args}
      />
    </Stack>
  )
}

Readonly.args = {
  options: stocks,
}

export const Disabled: Story<ComboboxProps<MyOptionType>> = (args) => {
  return (
    <Stack direction="column">
      <Combobox label="Select a stock" disabled {...args} />
      <Combobox label="Select multiple stocks" disabled multiple {...args} />
    </Stack>
  )
}
OptionLabel.args = {
  options: stocks,
}

export const DisabledOption: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args
  const isOptionDisabled = (item: MyOptionType) =>
    item === options[0] || item === options[options.length - 1]
  return (
    <Stack direction="column">
      <Combobox
        label="Select a stock"
        optionDisabled={isOptionDisabled}
        {...args}
      />
      <Combobox
        label="Select multiple stocks"
        optionDisabled={isOptionDisabled}
        {...args}
        multiple
      />
    </Stack>
  )
}

DisabledOption.args = {
  options: stocks,
}

export const PreselectedOptions: Story<ComboboxProps<MyOptionType>> = (
  args,
) => {
  const { options } = args

  return (
    <Stack direction="column">
      <Combobox
        label="Select a stock"
        initialSelectedOptions={[options[0]]}
        {...args}
      />
      <Combobox
        label="Select multiple stocks"
        initialSelectedOptions={[options[0], options[1], options[5]]}
        multiple
        {...args}
      />
    </Stack>
  )
}

PreselectedOptions.args = {
  options: stocks,
}

export const OnOptionsChange: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args

  const initialSelectedOptions = [options[0], options[1], options[5]]
  const [selectedItems, setSelectedItems] = useState(initialSelectedOptions)

  const onChange = (changes: ComboboxChanges<MyOptionType>) => {
    setSelectedItems(changes.selectedItems)
  }

  return (
    <Stack direction="column">
      <Typography>
        Selected items:{selectedItems.map((x) => x.label).toString()}
      </Typography>
      <Combobox
        label="Select a stock"
        options={options}
        onOptionsChange={onChange}
        initialSelectedOptions={initialSelectedOptions}
      />
      <Combobox
        label="Select multiple stocks"
        options={options}
        onOptionsChange={onChange}
        initialSelectedOptions={initialSelectedOptions}
        multiple
      />
    </Stack>
  )
}

OnOptionsChange.args = {
  options: stocks,
}

export const Compact: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Stack direction="column">
        <Combobox
          label="Select a stock"
          initialSelectedOptions={[options[0]]}
          options={options}
          {...args}
        />
        <Combobox
          label="Select multiple stocks"
          initialSelectedOptions={[options[0], options[1]]}
          options={options}
          multiple
          {...args}
        />
      </Stack>
    </EdsProvider>
  )
}

Compact.args = {
  options: stocks,
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
                    options={counties.map((opt) => ({
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
                    options={counties.map((opt) => ({
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

export const CustomOptionsFilter: Story<ComboboxProps<MyOptionType>> = (
  args,
) => {
  const optionsFilter: ComboboxProps<MyOptionType>['optionsFilter'] = (
    option,
    inputValue,
  ) =>
    (option.label + option.symbol)
      .toLowerCase()
      .includes(inputValue.toLocaleLowerCase())
  return (
    <Stack direction="column">
      <Combobox
        label="Select a stock"
        optionsFilter={optionsFilter}
        {...args}
      />
      <Combobox
        label="Select multiple stocks"
        multiple
        optionsFilter={optionsFilter}
        {...args}
      />
    </Stack>
  )
}

CustomOptionsFilter.args = {
  options: stocks,
}

export const SelectAll: Story<ComboboxProps<MyOptionType>> = (args) => {
  const { options } = args

  const selectAllOption: MyOptionType = {
    label: 'Select All',
  }
  const optionsWithAll = [selectAllOption, ...options]
  const [selectedItems, setSelectedItems] = useState<MyOptionType[]>([])

  const onChange = (changes: ComboboxChanges<MyOptionType>) => {
    const nextAll = changes.selectedItems.find(
      (item) => item.label === selectAllOption.label,
    )
    const prevAll = selectedItems.find(
      (item) => item.label === selectAllOption.label,
    )

    if (!nextAll && prevAll) {
      // select all was de-selected; reset selection
      console.log('reset selection')
      setSelectedItems([])
    } else if (nextAll && !prevAll) {
      // select all was added; select all
      console.log('select all')
      setSelectedItems(optionsWithAll)
    } else {
      console.log('select')
      setSelectedItems(changes.selectedItems)
    }
  }

  return (
    <Stack direction="column">
      <Typography>
        Selected items:{selectedItems.map((x) => x.label).toString()}
      </Typography>
      <Combobox
        label="Select multiple stocks"
        options={optionsWithAll}
        initialSelectedOptions={[]}
        selectedOptions={selectedItems}
        onOptionsChange={onChange}
        multiple
      />
    </Stack>
  )
}

SelectAll.args = {
  options: stocks,
}
