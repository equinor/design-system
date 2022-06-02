import { useState, useEffect } from 'react'
import {
  TextField,
  TextFieldProps,
  Icon,
  EdsProvider,
  Button,
  Density,
} from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import {
  thumbs_up,
  warning_filled,
  error_filled,
  info_circle,
} from '@equinor/eds-icons'
import styled from 'styled-components'
import { Controller, useForm } from 'react-hook-form'
import page from './TextField.docs.mdx'

const icons = {
  thumbs_up,
  warning_filled,
  error_filled,
}

Icon.add(icons)

export default {
  title: 'Inputs/TextField',
  component: TextField,
  argTypes: {
    inputIcon: {
      options: ['error', 'warning', 'success'],
      mapping: {
        error: [<Icon name="error_filled" key="error" />],
        warning: [<Icon name="warning_filled" key="warning" />],
        success: [<Icon name="thumbs_up" key="thumbs" />],
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
        error: [<Icon name="error_filled" key="error" />],
        warning: [<Icon name="warning_filled" key="warning" />],
        success: [<Icon name="thumbs_up" key="thumbs" />],
      },
      control: {
        type: 'select',
      },
      description:
        'Please note that the option list of icons is not complete, this selection is only for demo purposes',
    },
  },
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof TextField>

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(3, fit-content(100%));
`
export const Introduction: Story<TextFieldProps> = (args) => (
  <TextField
    meta="meta"
    id="playWithMe"
    label="Play with me"
    unit="Unit"
    helperText="Helper text"
    style={{ resize: 'none' }}
    rows={3}
    rowsMax={7}
    {...args}
  ></TextField>
)

export const Types: Story<TextFieldProps> = () => (
  <Wrapper>
    <TextField
      id="textfield-normal"
      placeholder="Placeholder text"
      label="Label"
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
      helperText="Helper Text"
    />
    <TextField
      type="email"
      id="textfield-email"
      placeholder="Placeholder text"
      label="Email"
      meta="Meta"
      helperText="Helper Text"
    />
    <TextField
      type="password"
      id="textfield-password"
      placeholder="Placeholder text"
      label="Password"
      meta="Meta"
      helperText="Helper Text"
    />
  </Wrapper>
)
Types.storyName = 'Single line'

export const Multiline: Story<TextFieldProps> = () => (
  <>
    <TextField
      id="storybook-multiline"
      placeholder="Placeholder text"
      label="Label"
      helperText="Helper Text"
      meta="Meta"
      multiline
      style={{ resize: 'none' }}
      rows={3}
    />
  </>
)

export const MultilineRowsMax: Story<TextFieldProps> = () => (
  <TextField
    id="storybook-multiline-three"
    placeholder="Placeholder text"
    label="Label"
    multiline
    style={{ resize: 'none' }}
    rows={3}
    rowsMax={10}
  />
)
MultilineRowsMax.storyName = 'Multiline with rowsMax'

export const MultilineFixedHeight: Story<TextFieldProps> = () => (
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
    style={{ height: '100px', resize: 'none' }}
  />
)
MultilineFixedHeight.storyName = 'Multiline with fixed height'

export const WithUnit: Story<TextFieldProps> = () => (
  <Wrapper>
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
  </Wrapper>
)
WithUnit.storyName = 'With units'

export const WithIcons: Story<TextFieldProps> = () => (
  <Wrapper>
    <TextField
      id="icons-text"
      defaultValue="Input text"
      label="Label text"
      meta="Meta"
      helperText="Helper Text"
      inputIcon={<Icon name="done" title="Done" />}
    />
    <TextField
      id="storybook-multiline-two"
      placeholder="Placeholder text that spans multiple lines"
      label="With icon"
      multiline
      style={{ resize: 'none' }}
      rows={3}
      inputIcon={<Icon name="comment" title="Comment" />}
    />
  </Wrapper>
)
WithIcons.storyName = 'With icons'

export const Datepicker: Story<TextFieldProps> = () => (
  <Wrapper>
    <TextField id="date" label="Select date" type="date" />
    <TextField id="time" label="Select time" type="time" />
    <TextField
      id="datetime"
      label="Select date and time"
      type="datetime-local"
    />
  </Wrapper>
)
Datepicker.storyName = 'Datepicker'

export const Variants: Story<TextFieldProps> = () => (
  <Wrapper>
    <TextField
      id="storybook-error"
      placeholder="Placeholder text"
      label="Single line"
      meta="Meta"
      helperText="Validation error"
      variant="error"
      helperIcon={<Icon name="error_filled" title="Error" />}
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
      style={{ resize: 'none' }}
      rows={3}
      helperText="Validation error"
      variant="error"
      helperIcon={<Icon name="error_filled" title="Error" />}
    />
    <TextField
      id="storybook-warning"
      placeholder="Placeholder text"
      label="Single line"
      meta="Meta"
      helperText="Helper/warning text"
      variant="warning"
      helperIcon={<Icon name="warning_filled" title="Warning" />}
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
      style={{ resize: 'none' }}
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
      helperIcon={<Icon name="thumbs_up" title="Success" />}
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
      style={{ resize: 'none' }}
      rows={3}
      helperText="Helper text"
      variant="success"
      helperIcon={<Icon name="thumbs_up" title="Success" />}
    />
  </Wrapper>
)

export const ReadOnly: Story<TextFieldProps> = () => (
  <Wrapper>
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
      style={{ resize: 'none' }}
      rows={3}
    />
    <TextField
      id="storybook-multi-readonly"
      label="Read only"
      defaultValue="Input value that spans multiple lines"
      meta="Meta"
      multiline
      readOnly
      style={{ resize: 'none' }}
      rows={3}
    />
    <TextField
      id="storybook-multi-readonly"
      label="Read only icon"
      defaultValue="Input value that spans multiple lines"
      multiline
      variant="error"
      readOnly
      style={{ resize: 'none' }}
      rows={3}
      helperText="helper text"
      inputIcon={<Icon name="error_filled" title="Error" />}
    />
  </Wrapper>
)
ReadOnly.storyName = 'Read only'

export const Disabled: Story<TextFieldProps> = () => (
  <Wrapper>
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
      style={{ resize: 'none' }}
      rows={3}
      helperText="helper text"
      inputIcon={<Icon name="comment_important" title="Comment important" />}
    />
  </Wrapper>
)

export const Compact: Story<TextFieldProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Wrapper>
        <EdsProvider density="compact">
          <TextField
            id="compact-textfield"
            defaultValue="150"
            label="Single line"
            meta="Meta"
            unit="km/h"
            helperIcon={<Icon data={info_circle} title="Info" />}
            helperText="Helper information text over several lines so that it breaks"
            style={{ width: '200px' }}
          />
          <TextField
            id="compact-textfield-multiline"
            placeholder="Placeholder text that spans multiple lines as much as is possible."
            label="Multiline"
            multiline
            rowsMax={10}
            variant="warning"
            inputIcon={<Icon name="warning_filled" title="Warning" />}
            helperText="Helper information text thats very very very loooonooooooong"
            style={{ resize: 'none' }}
          />
        </EdsProvider>
      </Wrapper>
    </EdsProvider>
  )
}

export const ValidationWithReactHookForm: Story<TextFieldProps> = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: { data: '' },
  })

  return (
    <form className="Form" onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="data"
        control={control}
        rules={{
          required: 'Required',
          pattern: { value: /^[0-9]+$/g, message: 'Only digits allowed' },
        }}
        render={({
          field: { ref, ...props },
          fieldState: { invalid, error },
        }) => (
          <TextField
            {...props}
            id={props.name}
            placeholder="Digits only"
            label="Label"
            inputRef={ref}
            inputIcon={
              invalid ? <Icon data={error_filled} title="error" /> : undefined
            }
            helperText={error?.message}
            variant={invalid ? 'error' : 'default'}
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
