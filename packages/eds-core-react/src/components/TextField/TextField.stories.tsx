import { useState, useEffect, FormEvent } from 'react'
import { TextField, Icon, EdsProvider, Button, Density } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import {
  thumbs_up,
  warning_filled,
  error_filled,
  info_circle,
  done,
} from '@equinor/eds-icons'
import { Controller, useForm } from 'react-hook-form'
import { Stack } from '../../../.storybook/components'

import page from './TextField.docs.mdx'

const icons = {
  thumbs_up,
  warning_filled,
  error_filled,
  done,
}

Icon.add(icons)

const meta: Meta<typeof TextField> = {
  title: 'Inputs/TextField',
  component: TextField,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  argTypes: {
    inputIcon: {
      options: ['error', 'warning', 'success'],
      mapping: {
        error: [<Icon name="error_filled" key="error" size={18} />],
        warning: [<Icon name="warning_filled" key="warning" size={18} />],
        success: [<Icon name="thumbs_up" key="thumbs" size={18} />],
      },
      control: {
        type: 'select',
      },
      description:
        'Please note that the option list of icons is not complete, this selection is only for demo purposes',
    },
    helperIcon: {
      options: ['error', 'warning', 'success'],
      mapping: {
        error: [<Icon name="error_filled" key="error" size={16} />],
        warning: [<Icon name="warning_filled" key="warning" size={16} />],
        success: [<Icon name="thumbs_up" key="thumbs" size={16} />],
      },
      control: {
        type: 'select',
      },
      description:
        'Please note that the option list of icons is not complete, this selection is only for demo purposes',
    },
    inputRef: { control: { type: null } },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

//for some reason "TextFieldProps" throws a typescript error here, but "typeof TextField" works
type Story = StoryFn<typeof TextField>

export const Introduction: Story = (args) => {
  return <TextField {...args} />
}

Introduction.bind({})
Introduction.args = {
  unit: 'unit',
  meta: 'meta',
  id: 'intro',
  label: 'Play with me',
  helperText: 'helper text',
}

export const Types: Story = () => (
  <>
    <TextField
      id="textfield-normal"
      placeholder="Placeholder text"
      label="Text"
      autoComplete="off"
    />
    <TextField
      type="number"
      id="textfield-number"
      placeholder="Placeholder text"
      label="Number"
      helperText="Helper text"
    />
    <TextField
      type="search"
      id="textfield-search"
      placeholder="Placeholder text"
      label="Search"
      helperText="Helper text"
    />
    <TextField
      type="email"
      id="textfield-email"
      placeholder="Placeholder text"
      label="Email"
      helperText="Helper Text"
    />
    <TextField
      type="password"
      id="textfield-password"
      placeholder="Placeholder text"
      label="Password"
      helperText="Helper Text"
      inputIcon={<Icon name="thumbs_up" key="thumbs" size={16} />}
    />
    <TextField
      type="text"
      id="textfield-datalist"
      placeholder="Select browser"
      label="With datalist"
      list="browsers"
    />
    <datalist id="browsers">
      <option value="Chrome"></option>
      <option value="Firefox"></option>
      <option value="Opera"></option>
      <option value="Safari"></option>
      <option value="Microsoft Edge"></option>
    </datalist>
  </>
)
Types.decorators = [
  (Story) => {
    return (
      <Stack
        align="baseline"
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const WithUnit: Story = () => (
  <>
    <TextField
      id="storybook-unit"
      placeholder="Placeholder text"
      label="Price"
      unit="$"
      type="number"
    />
    <TextField
      id="storybook-unit-two"
      defaultValue="150"
      label="Speed"
      unit="km/h"
      type="number"
    />
  </>
)
WithUnit.storyName = 'With units'
WithUnit.decorators = [
  (Story) => {
    return (
      <Stack
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const WithIcons: Story = () => {
  const [icon, setIcon] = useState(true)
  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => setIcon(!icon)}
        style={{ marginBottom: '16px' }}
      >
        Toggle Icon
      </Button>
      <TextField
        id="icons-text"
        type="date"
        defaultValue="Input text"
        label="Label text"
        meta="Meta"
        helperText="Helper Text"
        inputIcon={icon && <Icon name="done" title="Done" />}
      />
    </div>
  )
}

export const Datepicker: Story = () => (
  <>
    <TextField id="date" label="Select date" type="date" />
    <TextField id="time" label="Select time" type="time" />
    <TextField
      id="datetime"
      label="Select date and time"
      type="datetime-local"
    />
  </>
)
Datepicker.decorators = [
  (Story) => {
    return (
      <Stack
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const Variants: Story = () => (
  <>
    <TextField
      id="storybook-error"
      placeholder="Placeholder text"
      label="Single line"
      meta="Meta"
      helperText="Validation error"
      variant="error"
      helperIcon={<Icon name="error_filled" title="Error" size={16} />}
    />
    <TextField
      id="storybook-error-two"
      placeholder="Placeholder text "
      label="Error"
      unit="Unit"
      helperText="Validation error"
      variant="error"
      inputIcon={<Icon name="error_filled" title="Error" />}
    />
    <TextField
      id="storybook-warning"
      placeholder="Placeholder text"
      label="Single line"
      meta="Meta"
      helperText="Helper/warning text"
      variant="warning"
      helperIcon={<Icon name="warning_filled" title="Warning" size={16} />}
    />
    <TextField
      id="storybook-warning-two"
      placeholder="Placeholder text"
      label="Warning"
      meta="Meta"
      helperText="Helper/warning text"
      variant="warning"
      inputIcon={<Icon name="warning_filled" title="Warning" />}
    />
    <TextField
      id="storybook-success"
      placeholder="Placeholder text"
      label="Single line"
      meta="Meta"
      helperText="Helper text"
      variant="success"
      helperIcon={<Icon name="thumbs_up" title="Success" size={16} />}
    />
    <TextField
      id="storybook-success-two"
      placeholder="Placeholder text"
      label="Success"
      meta="Meta"
      helperText="Helper text"
      variant="success"
      inputIcon={<Icon name="thumbs_up" title="Success" />}
    />
  </>
)
Variants.decorators = [
  (Story) => {
    return (
      <Stack
        align="baseline"
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const ReadOnly: Story = () => (
  <>
    <TextField
      id="storybook-readonly"
      placeholder="Placeholder text"
      label="Read only"
      readOnly
    />
    <TextField
      id="storybook-readonly-two"
      defaultValue="500"
      label="Read only"
      unit="$"
      meta="Meta"
      readOnly
    />
    <TextField
      id="storybook-unit-readonly-three"
      defaultValue="Input value"
      label="Read only icon"
      variant="success"
      readOnly
      helperText="helper text"
      inputIcon={<Icon name="thumbs_up" title="Success" />}
    />
  </>
)
ReadOnly.storyName = 'Read only'
ReadOnly.decorators = [
  (Story) => {
    return (
      <Stack
        align="baseline"
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const Disabled: Story = () => (
  <TextField
    id="storybook-unit-four"
    placeholder="500"
    label="Disabled price"
    unit="$"
    meta="Meta"
    disabled
    helperText="Helper Text"
  />
)
Disabled.decorators = [
  (Story) => {
    return (
      <Stack
        align="baseline"
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const Compact: Story = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <div style={{ width: '200px' }}>
        <TextField
          id="compact-textfield"
          defaultValue="150"
          label="Single line"
          meta="Meta"
          unit="km/h"
          helperIcon={<Icon data={info_circle} title="Info" size={16} />}
          helperText="Helper information text over several lines so that it breaks"
        />
      </div>
    </EdsProvider>
  )
}
Compact.decorators = [
  (Story) => {
    return (
      <Stack
        align="baseline"
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const ValidationWithReactHookForm: Story = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: { data: '' },
  })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="data"
        control={control}
        rules={{
          required: 'Required',
          pattern: { value: /^[0-9]+$/g, message: 'Only digits allowed' },
        }}
        render={({ field: { ref, ...props }, fieldState: { error } }) => (
          <TextField
            {...props}
            id={props.name}
            label="Digits only"
            inputRef={ref}
            inputIcon={
              error ? <Icon data={error_filled} title="error" /> : undefined
            }
            helperText={error?.message}
            variant={error ? 'error' : undefined}
          />
        )}
      />
      <Button type="submit" style={{ marginTop: '14px' }}>
        Submit
      </Button>
    </form>
  )
}
ValidationWithReactHookForm.storyName = 'Validation with React Hook Form'

export const Validation: Story = () => {
  const [isValid, setIsValid] = useState<boolean>(true)
  const handleSumbmit = (e: FormEvent) => {
    e.preventDefault()
    console.log((e.target[0] as HTMLInputElement).value)
  }
  return (
    <form onSubmit={handleSumbmit}>
      <TextField
        id="number-validation"
        label="positive numbers only"
        required
        pattern="^\d+(\.\d+)?([eE][-+]?\d+)?$"
        variant={isValid ? undefined : 'error'}
        helperText={isValid ? undefined : 'Only positive numbers allowed'}
        inputIcon={
          isValid ? undefined : <Icon data={error_filled} title="error" />
        }
        onChange={(event) => {
          // TypeScript automatically infers event type - no manual annotation needed!
          setIsValid(
            event.target.checkValidity() && !isNaN(Number(event.target.value)),
          )
        }}
      />
      <Button type="submit" style={{ marginTop: '14px' }}>
        Submit
      </Button>
    </form>
  )
}
