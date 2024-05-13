/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Autocomplete, AutocompleteProps, AutocompleteChanges } from '.'
import { Checkbox } from '../Checkbox'
import { StoryFn, Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { useForm, Controller } from 'react-hook-form'
import {
  Typography,
  EdsProvider,
  Button,
  Chip,
  Card,
  Avatar,
  Icon,
} from '../..'
import { Stack } from '../../../.storybook/components'
import page from './Autocomplete.docs.mdx'
import { error_filled, thumbs_up, warning_filled } from '@equinor/eds-icons'

const meta: Meta<typeof Autocomplete> = {
  title: 'Inputs/Autocomplete',
  component: Autocomplete,
  argTypes: {
    selectedOptions: { control: { type: null } },
    ref: { control: { type: null } },
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
        type: 'code',
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack direction="column">
          <Story />
        </Stack>
      )
    },
  ],
}

const icons = {
  thumbs_up,
  warning_filled,
  error_filled,
}

Icon.add(icons)

export default meta

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
  {
    label: 'Awilco LNG',
    symbol: 'ALNG',
    trend: '📈',
  },
  {
    label: 'Kahoot! ASA',
    symbol: 'KAHOT',
    trend: '📈',
  },
  {
    label: 'Nordic Semiconductor',
    symbol: 'NCO',
    trend: '📈',
  },
  {
    label: 'Vår energi ASA',
    symbol: 'VAR',
    trend: '📈',
  },
  {
    label: 'Rivian Automotive A',
    symbol: 'RIVN',
    trend: '📈',
  },
]

const optionLabel = (item: MyOptionType) => item.label

const labelWithIcon = (opt: MyOptionType) =>
  `${opt.trend} ${opt.label} (${opt.symbol})`

export const Introduction: StoryFn<AutocompleteProps<string>> = (args) => {
  return <Autocomplete {...args} />
}
Introduction.bind({})
Introduction.args = {
  label: 'Select a stock',
  options: stocks.map((item) => item.label),
  multiple: false,
  readOnly: false,
  disabled: false,
}

export const Multiple: StoryFn<AutocompleteProps<MyOptionType>> = (args) => {
  const { options } = args

  return (
    <>
      <Autocomplete
        label="Select multiple stocks"
        options={options}
        multiple
        optionLabel={optionLabel}
      />
    </>
  )
}
Multiple.args = {
  options: stocks,
}

export const OptionLabel: StoryFn<AutocompleteProps<MyOptionType>> = (args) => {
  const { options } = args

  return (
    <>
      <Autocomplete
        label="Select a stock"
        options={options}
        optionLabel={(opt) => `${opt.trend} ${opt.label} (${opt.symbol})`}
        initialSelectedOptions={[options[1]]}
      />
    </>
  )
}
OptionLabel.storyName = 'Objects as options'
OptionLabel.args = {
  options: stocks,
}

export const OptionComponent: StoryFn<AutocompleteProps<MyOptionType>> = (
  args,
) => {
  const { options } = args
  function CustomItem(option: MyOptionType, isSelected: boolean) {
    const { label, symbol } = option
    const outlineColor = isSelected ? '#007079' : 'transparent'
    return (
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          paddingBlock: '4px',
        }}
      >
        <Avatar
          src={`https://i.pravatar.cc/48?u=${symbol}`}
          size={48}
          alt="profile"
          style={{
            border: `5px solid transparent`,
            outline: `3px solid ${outlineColor}`,
            outlineOffset: '-3px',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Typography group="paragraph" variant="body_long_bold">
            {label}
          </Typography>
          <Typography group="paragraph" variant="caption">
            {symbol}
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <>
      <Autocomplete
        label="Select a stock"
        options={options}
        optionLabel={(opt) => `${opt.trend} ${opt.label} (${opt.symbol})`}
        optionComponent={CustomItem}
        initialSelectedOptions={[options[1]]}
        multiline
      />
      <Autocomplete
        label="Select multiple stocks"
        options={options}
        optionLabel={(opt) => `${opt.trend} ${opt.label} (${opt.symbol})`}
        optionComponent={CustomItem}
        initialSelectedOptions={[options[1]]}
        multiline
        multiple
      />
    </>
  )
}
OptionComponent.storyName = 'Customized option component'
OptionComponent.args = {
  options: stocks,
}

export const Controlled: StoryFn<AutocompleteProps<string>> = (args) => {
  const { options } = args

  const [selectedItems, setSelectedItems] = useState<string[]>([
    'Vestland',
    'Viken',
  ])

  const onChange = (changes: AutocompleteChanges<string>) => {
    setSelectedItems(changes.selectedItems)
  }

  return (
    <>
      <Typography>
        Your selected items:{' '}
        {selectedItems.map(
          (x, index) => `${x}${index < selectedItems.length - 1 ? ', ' : ''}`,
        )}
      </Typography>
      <Autocomplete
        label="Select counties"
        options={options}
        onOptionsChange={onChange}
        selectedOptions={selectedItems}
        multiple
      />
    </>
  )
}
Controlled.args = {
  options: counties,
}

export const ReadOnly: StoryFn<AutocompleteProps<MyOptionType>> = (args) => {
  const { options, optionLabel } = args
  return (
    <>
      <Autocomplete
        label="Select a stock"
        options={options}
        optionLabel={optionLabel}
        initialSelectedOptions={[options[3]]}
        readOnly
      />
    </>
  )
}
ReadOnly.storyName = 'Read only'
ReadOnly.args = {
  options: stocks,
  optionLabel,
}

export const Disabled: StoryFn<AutocompleteProps<MyOptionType>> = (args) => {
  const { options, optionLabel } = args

  return (
    <>
      <Autocomplete
        label="Select a stock"
        options={options}
        optionLabel={optionLabel}
        disabled
      />
    </>
  )
}
Disabled.args = {
  options: stocks,
  optionLabel,
}

export const DisabledOption: StoryFn<AutocompleteProps<MyOptionType>> = (
  args,
) => {
  const { options, optionLabel } = args
  const [filter, setFilter] = useState<boolean>(true)
  const isOptionDisabled = (item: MyOptionType) => item.trend === '📉'

  return (
    <>
      <Checkbox
        label="disable options"
        onChange={() => {
          setFilter(!filter)
        }}
        checked={filter}
      />
      <Autocomplete
        label="Select a stock"
        options={options}
        optionDisabled={filter ? isOptionDisabled : undefined}
        optionLabel={optionLabel}
        multiple
        allowSelectAll
      />
    </>
  )
}
DisabledOption.storyName = 'Disabled option'
DisabledOption.args = {
  options: stocks,
  optionLabel: labelWithIcon,
}

export const PreselectedOptions: StoryFn<AutocompleteProps<MyOptionType>> = (
  args,
) => {
  const { options, optionLabel } = args

  return (
    <>
      <Autocomplete
        label="Select multiple stocks"
        initialSelectedOptions={[options[0], options[1], options[5]]}
        options={options}
        optionLabel={optionLabel}
        multiple
      />
    </>
  )
}
PreselectedOptions.storyName = 'Preselected options'
PreselectedOptions.args = {
  options: stocks,
  optionLabel,
}

export const Compact: StoryFn<AutocompleteProps<MyOptionType>> = (args) => {
  const { options, optionLabel } = args
  const [compact, setComfortable] = useState<boolean>(true)

  return (
    <EdsProvider density={compact ? 'compact' : 'comfortable'}>
      <Checkbox
        label="Compact"
        onChange={() => {
          setComfortable(!compact)
        }}
        checked={compact}
      />
      <Autocomplete
        label="Select a stock"
        initialSelectedOptions={[options[0]]}
        options={options}
        optionLabel={optionLabel}
      />
    </EdsProvider>
  )
}
Compact.args = {
  options: stocks,
  optionLabel,
}

export const CustomOptionsFilter: StoryFn<AutocompleteProps<MyOptionType>> = (
  args,
) => {
  const { options, optionLabel } = args

  const optionsFilter: AutocompleteProps<MyOptionType>['optionsFilter'] = (
    option,
    inputValue,
  ) =>
    (option.label + option.symbol)
      .toLowerCase()
      .includes(inputValue.toLocaleLowerCase())

  return (
    <div style={{ width: '300px' }}>
      <Autocomplete
        label="Select stocks"
        placeholder="Try searching for MSFT"
        options={options}
        optionLabel={optionLabel}
        optionsFilter={optionsFilter}
        multiple
      />
    </div>
  )
}
CustomOptionsFilter.storyName = 'Custom options filter'
CustomOptionsFilter.args = {
  options: stocks,
  optionLabel,
}

export const AutoWidth: StoryFn<AutocompleteProps<MyOptionType>> = (args) => {
  const { options } = args

  return (
    <>
      <Autocomplete
        optionLabel={(opt) => `${opt.trend} ${opt.label}`}
        label="Select a stock"
        options={options}
        autoWidth
      />
      <Autocomplete
        optionLabel={optionLabel}
        label="Select multiple stocks"
        options={options}
        multiple
        autoWidth
        multiline
      />
    </>
  )
}
AutoWidth.storyName = 'Adjusting dropdown width'
AutoWidth.args = {
  options: stocks,
  optionLabel,
}

export const Virtualized: StoryFn<AutocompleteProps<MyOptionType>> = () => {
  type LoadingState = 'notLoaded' | 'loading' | 'loaded'
  type Photo = {
    albumId: number
    id: number
    title: string
    url: string
    thumbnailUrl: string
  }
  const [data, setData] = useState<Array<string>>([])
  const [loadingState, setLoadingState] = useState<LoadingState>('notLoaded')

  const initialize = () => {
    if (loadingState === 'notLoaded') setLoadingState('loading')
  }

  useEffect(() => {
    if (loadingState !== 'loading') return

    const abortController = new AbortController()
    const signal = abortController.signal

    fetch(`https://jsonplaceholder.typicode.com/photos`, { signal })
      .then((r) => r.json())
      .then((d: Photo[]) => {
        const parsed = d.map((x) => x.title.substring(0, 30))
        setData(parsed)
        setLoadingState('loaded')
      })
      .catch((err: Error) => {
        console.warn(`Warning: ${err.message}`)
        setLoadingState('notLoaded')
      })
    return () => {
      abortController.abort()
    }
  }, [loadingState])

  return (
    <>
      <Autocomplete
        label={
          loadingState === 'loaded'
            ? 'Select multiple items'
            : 'Focus the input to load data'
        }
        loading={loadingState === 'loading'}
        options={data}
        multiple
        clearSearchOnChange={false}
        onFocus={initialize}
      />
    </>
  )
}

const CountryTemplate = styled.div`
  display: grid;
  grid-template-columns: 370px 1fr;
  > img {
    max-width: 100%;
    border-inline-end: 2px solid rgb(247 247 247);
  }

  h2 {
    margin-block-end: 24px;
  }
  p:last-child {
    align-self: flex-end;
    margin-block-start: auto;
  }
`

export const Async: StoryFn<AutocompleteProps<MyOptionType>> = () => {
  type CountryName = {
    common: string
    official: string
  }
  type Flag = {
    png: string
    svg: string
    alt: string
  }
  type Country = {
    name: CountryName
    population: number
    capital: string[]
    flags: Flag
  }

  const [options, setOptions] = useState<Country[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Country>()
  const [searchInput, setSearchInput] = useState<string>('')
  const debounce = useRef<ReturnType<typeof setTimeout>>(null)

  const onChange = (changes: AutocompleteChanges<Country>) => {
    setSelectedItem(changes.selectedItems[0])
  }

  function CustomItem(option: Country) {
    const {
      name: { common, official },
      flags: { svg },
    } = option
    return (
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          paddingBlock: '4px',
        }}
      >
        <img src={svg} style={{ width: '100px' }} alt={`flag of ${common}`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Typography group="paragraph" variant="body_long_bold">
            {official}
          </Typography>
          <Typography group="paragraph" variant="caption">
            {common}
          </Typography>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (searchInput.length < 2) return setOptions([])

    setLoading(true)
    const abortController = new AbortController()
    const signal = abortController.signal

    fetch(`https://restcountries.com/v3.1/name/${searchInput}`, { signal })
      .then((r) => {
        if (!r.ok) {
          throw Error(r.statusText)
        }
        return r.json()
      })
      .then((countries: Country[]) => {
        countries && setOptions(countries)
        setLoading(false)
      })
      .catch((err: Error) => {
        console.warn(`Warning: ${err.message}`)
        setOptions([])
        setLoading(false)
      })
    return () => {
      abortController.abort()
    }
  }, [searchInput])

  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current)
    }
  }, [])

  const search = (input: string) => {
    if (input.length < 2) return setSearchInput('')
    if (debounce.current) clearTimeout(debounce.current)

    debounce.current = setTimeout(() => {
      setSearchInput(input)
    }, 400)
  }

  return (
    <>
      <Autocomplete
        label="Search countries"
        onInputChange={search}
        options={options}
        optionsFilter={() => true}
        optionLabel={(opt) => `${opt.name.common}`}
        optionComponent={CustomItem}
        onOptionsChange={onChange}
        selectedOptions={[selectedItem]}
        loading={loading}
        noOptionsText={loading ? 'Loading data..' : 'No options'}
        multiline
      />
      {selectedItem && (
        <Card elevation="raised" style={{ overflow: 'hidden' }}>
          <CountryTemplate>
            <img src={selectedItem.flags.svg} alt={selectedItem.flags.alt} />
            <div
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h2" style={{ fontWeight: '600' }}>
                {selectedItem.name.official}
              </Typography>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <Typography variant="body_short">CAPITAL</Typography>
                  <Typography variant="h3" as="p" style={{ fontWeight: '500' }}>
                    {selectedItem.capital ? selectedItem.capital[0] : 'N/A'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body_short">POPULATION</Typography>
                  <Typography variant="h3" as="p" style={{ fontWeight: '500' }}>
                    {new Intl.NumberFormat().format(selectedItem.population)}
                  </Typography>
                </div>
              </div>
              <Typography variant="body_short_italic">
                source:{' '}
                <Typography
                  link
                  href="https://restcountries.com/"
                  target="_blank"
                >
                  restcountries.com
                </Typography>
              </Typography>
            </div>
          </CountryTemplate>
        </Card>
      )}
    </>
  )
}
Async.storyName = 'Async search autocomplete'

type MyFormValues = {
  origin: string | null
  favouriteCounty: string | null
  fruits: { label: string; emoji: string }[]
}

export const WithReactHookForm: StoryFn<
  AutocompleteProps<MyOptionType>
> = () => {
  const defaultValues: MyFormValues = {
    origin: null,
    favouriteCounty: null,
    fruits: [],
  }
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<MyFormValues>({
    defaultValues,
  })

  const [isSubmitted, updateIsSubmitted] = useState(false)
  const [formData, updateFormData] = useState<MyFormValues | null>(null)
  const values = watch()

  return (
    <form
      onSubmit={handleSubmit((data: MyFormValues) => {
        updateFormData(data)
        updateIsSubmitted(true)
        action('onSubmit')(data)
      })}
    >
      {isSubmitted ? (
        <>
          <Typography variant="h4" style={{ marginBottom: '16px' }}>
            Submitted data:
          </Typography>
          <Typography>{JSON.stringify(formData, null, 4)}</Typography>
          <Button
            style={{ marginTop: '16px' }}
            variant="outlined"
            onClick={() => {
              updateIsSubmitted(false)
              updateFormData(null)
              reset()
            }}
          >
            Reset
          </Button>
        </>
      ) : (
        <>
          <div style={{ margin: '16px 0' }}>
            <Controller
              control={control}
              name="origin"
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  onOptionsChange={({ selectedItems }) => {
                    console.log('selected origin', selectedItems)
                    const [selectedItem] = selectedItems
                    onChange(selectedItem)
                  }}
                  selectedOptions={[values.origin]}
                  label="Where are you from?"
                  options={counties}
                  aria-invalid={errors.origin ? 'true' : 'false'}
                  aria-describedby="error-county-required"
                  aria-required
                  autoWidth
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
                  errors.origin && errors.origin.type === 'required'
                    ? 'block'
                    : 'none',
              }}
            >
              Hey you! This field is required
            </span>
          </div>
          <div style={{ margin: '16px 0' }}>
            <Controller
              control={control}
              name="favouriteCounty"
              render={({ field: { onChange } }) => (
                <Autocomplete
                  onOptionsChange={({ selectedItems }) => {
                    const [selectedItem] = selectedItems
                    onChange(selectedItem)
                  }}
                  selectedOptions={[values.favouriteCounty]}
                  label="Choose your favourite county"
                  options={counties}
                  autoWidth
                />
              )}
            />
          </div>
          <div style={{ margin: '16px 0' }}>
            <Controller
              control={control}
              name="fruits"
              render={({ field: { onChange } }) => (
                <Autocomplete
                  onOptionsChange={({ selectedItems }) => {
                    onChange(selectedItems)
                  }}
                  selectedOptions={values.fruits}
                  label="Pick atleast two fruits (optional)"
                  options={[
                    { label: 'Banana', emoji: '🍌' },
                    { label: 'Apple', emoji: '🍎' },
                    { label: 'Grapes', emoji: '🍇' },
                    { label: 'Kiwi', emoji: '🥝' },
                    { label: 'Pineapple', emoji: '🍍' },
                  ]}
                  optionLabel={(opt) => `${opt?.emoji} ${opt?.label}`}
                  multiple
                  autoWidth
                />
              )}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Button type="submit">I have made my decisions!</Button>
            <Button variant="outlined" onClick={() => reset()}>
              Reset
            </Button>
          </div>
        </>
      )}
    </form>
  )
}

export const SelectAll: StoryFn<AutocompleteProps<MyOptionType>> = (args) => {
  const { options } = args
  const [selectedItems, setSelectedItems] = useState<MyOptionType[]>([])

  const onDelete = (itemLabel: string) =>
    setSelectedItems(selectedItems.filter((x) => !(x.label === itemLabel)))

  const onChange = (e: AutocompleteChanges<MyOptionType>) => {
    action('optionsChange')(e)
    setSelectedItems(e.selectedItems)
  }

  return (
    <>
      <Autocomplete
        label="Select stocks"
        options={options}
        selectedOptions={selectedItems}
        allowSelectAll={true}
        onOptionsChange={onChange}
        placeholder={`${selectedItems.length}/ ${options.length} selected`}
        multiple
        optionLabel={optionLabel}
      />
      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(4, auto)',
        }}
      >
        {selectedItems.map((x) => (
          <Chip key={x.label} onDelete={() => onDelete(x.label)}>
            {x.label}
          </Chip>
        ))}
      </div>
    </>
  )
}
SelectAll.storyName = 'Select all'
SelectAll.args = {
  options: stocks,
  optionLabel,
}

export const Variants: StoryFn<AutocompleteProps<string>> = (args) => {
  return (
    <>
      <Autocomplete
        {...args}
        helperText="This field cannot be empty"
        helperIcon={<Icon name="error_filled" title="Error" size={16} />}
        variant="error"
      />
      <Autocomplete
        {...args}
        helperText="Should be something else"
        helperIcon={<Icon name="warning_filled" title="Warning" size={16} />}
        variant="warning"
      />
      <Autocomplete
        {...args}
        helperText="This field is correctly filled"
        helperIcon={<Icon name="thumbs_up" title="Success" size={16} />}
        variant="success"
      />
    </>
  )
}
Variants.bind({})
Variants.args = {
  label: 'Select a stock',
  options: stocks.map((item) => item.label),
}
