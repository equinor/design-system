import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { TextField, Icon, EdsProvider, Button, Density } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import {
  thumbs_up,
  warning_filled,
  error_filled,
  info_circle,
  comment,
  done,
  comment_important,
} from '@equinor/eds-icons'
import { Controller, useForm } from 'react-hook-form'
import { Stack } from '../../../.storybook/components'

import page from './TextField.docs.mdx'

const icons = {
  thumbs_up,
  warning_filled,
  error_filled,
  comment,
  done,
  comment_important,
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
    textareaRef: { control: { type: null } },
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

export const Multiline: Story = () => (
  <TextField id="storybook-multiline" label="Multiline" multiline rows={3} />
)

export const MultilineRowsMax: Story = () => (
  <TextField
    id="storybook-multiline-three"
    label="Multiline with max 10 rows"
    multiline
    rows={3}
    rowsMax={10}
  />
)

export const MultilineFixedHeight: Story = () => (
  <TextField
    id="storybook-multiline-fixedheight"
    defaultValue="Lorem Ipsum is simply dummy text of the printing and
    typesetting industry. Lorem Ipsum has been the industry's
    standard dummy text ever since the 1500s, when an unknown
    printer took a galley of type and scrambled it to make a
    type specimen book. It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged. It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged. It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged."
    label="Multiline with fixed height"
    multiline
    style={{ height: '100px' }}
  />
)
MultilineFixedHeight.storyName = 'Multiline with fixed height'

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
    <>
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
      <TextField
        id="storybook-multiline-two"
        placeholder="Placeholder text that spans multiple lines"
        label="With icon"
        multiline
        rows={3}
        inputIcon={<Icon name="comment" title="Comment" />}
      />
    </>
  )
}
WithIcons.storyName = 'With icons'
WithIcons.decorators = [
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
Datepicker.storyName = 'Datepicker'
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
      id="multi-error"
      defaultValue="Input value that spans multiple lines"
      label="Multiline"
      multiline
      rows={3}
      helperText="Validation error"
      variant="error"
      helperIcon={<Icon name="error_filled" title="Error" size={16} />}
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
      id="multi-warning-two"
      defaultValue="Input value that spans multiple lines"
      label="Multiline"
      multiline
      rows={3}
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
    <TextField
      id="multi-success"
      defaultValue="Input value that spans multiple lines"
      label="Multiline"
      multiline
      rows={3}
      helperText="Helper text"
      variant="success"
      helperIcon={<Icon name="thumbs_up" title="Success" size={16} />}
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
    <TextField
      id="storybook-multi-readonly"
      label="Read only"
      placeholder="Placeholder text that spans multiple lines"
      multiline
      readOnly
      rows={3}
    />
    <TextField
      id="storybook-multi-readonly"
      label="Read only"
      defaultValue="Input value that spans multiple lines"
      meta="Meta"
      multiline
      readOnly
      rows={3}
    />
    <TextField
      id="storybook-multi-readonly"
      label="Read only icon"
      defaultValue="Input value that spans multiple lines"
      multiline
      variant="error"
      readOnly
      rows={3}
      helperText="helper text"
      inputIcon={<Icon name="error_filled" title="Error" />}
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
  <>
    <TextField
      id="storybook-unit-four"
      placeholder="500"
      label="Disabled price"
      unit="$"
      meta="Meta"
      disabled
      helperText="Helper Text"
    />
    <TextField
      id="storybook-multiline-two"
      defaultValue="Write a comment that spans multiple lines"
      label="Comment"
      multiline
      disabled
      rows={3}
      helperText="helper text"
      inputIcon={<Icon name="comment_important" title="Comment important" />}
    />
  </>
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
      <TextField
        id="compact-textfield-multiline"
        placeholder="Placeholder text that spans multiple lines as much as is possible."
        label="Multiline"
        multiline
        rowsMax={10}
        variant="warning"
        inputIcon={<Icon name="warning_filled" title="Warning" />}
        helperText="Helper information text thats very very very loooonooooooong"
      />
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
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
