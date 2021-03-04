import React from 'react'
import { TextField, TextFieldProps, Icon } from '@components'
import { Story, Meta } from '@storybook/react'
import { thumbs_up, warning_filled, error_filled } from '@equinor/eds-icons'

Icon.add({
  thumbs_up,
  warning_filled,
  error_filled,
})

import styled from 'styled-components'

export default {
  title: 'Components/TextField',
  component: TextField,
  argTypes: {
    rows: {
      control: 'number',
      description: 'Rows when "multiline" is true',
      default: 1,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A text field lets users enter, interact and edit content,
        typically in forms and dialogs.
        `,
      },
    },
  },
} as Meta

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
`
export const Default: Story<TextFieldProps> = (args) => (
  <TextField {...args}></TextField>
)

export const types: Story<TextFieldProps> = () => (
  <Wrapper>
    <TextField
      id="textfield-normal"
      placeholder="Placeholder text"
      label="Text"
      helperText="Helper text"
      autoComplete="off"
    />
    <TextField
      type="number"
      id="textfield-number"
      placeholder="Placeholder text"
      label="Number"
      meta="pt. tonn"
      helperText="Helper text"
    />

    <TextField
      type="search"
      id="textfield-search"
      placeholder="Placeholder text"
      label="Search"
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
    <TextField
      type="email"
      id="textfield-email"
      placeholder="Placeholder text"
      label="Email"
      meta="Meta"
      helperText="Helper Text"
    />
  </Wrapper>
)

types.storyName = 'Types of input fields'

export const Multiline: Story<TextFieldProps> = () => (
  <TextField
    id="storybook-multiline"
    placeholder="Placeholder text"
    label="Multline"
    meta="Meta"
    helperText="Helper Text"
    multiline
  />
)

export const Disabled: Story<TextFieldProps> = () => (
  <TextField
    id="storybook-disabled"
    placeholder="Placeholder text"
    label="Disabled"
    meta="Meta"
    helperText="Helper Text"
    disabled
  />
)

export const WithIcons: Story<TextFieldProps> = () => (
  <Wrapper>
    <TextField
      id="storybook-warning-icon"
      placeholder="Placeholder text"
      label="Some warning input"
      inputIcon={<Icon name="thumbs_up" />}
    />
    <TextField
      id="storybook-warning-icon"
      placeholder="Placeholder text"
      label="Disabled input"
      disabled
      inputIcon={<Icon name="warning_filled" />}
    />

    <TextField
      id="storybook-disabled"
      placeholder="Placeholder text"
      label="Label text"
      meta="Meta"
      helperText="Helper Text"
      inputIcon={<Icon name="thumbs_up" />}
    />
  </Wrapper>
)
WithIcons.storyName = 'With icons'

export const Variants: Story<TextFieldProps> = () => (
  <Wrapper>
    <TextField
      id="storybook-error"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Error"
      meta="Meta"
      helperText="Validation error"
      variant="error"
      helperIcon={<Icon name="error_filled" title="Error" />}
    />
    <TextField
      id="storybook-error-two"
      placeholder="Placeholder text "
      label="Error"
      meta="Meta"
      helperText="Validation error"
      variant="error"
      inputIcon={<Icon name="error_filled" title="Error" />}
    />
    <TextField
      id="storybook-warning"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Warning"
      meta="Meta"
      helperText="Helper/warning text"
      variant="warning"
      helperIcon={<Icon name="warning_filled" title="Warning" />}
    />
    <TextField
      id="storybook-warning-two"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Warning"
      meta="Meta"
      helperText="Helper/warning text"
      variant="warning"
      inputIcon={<Icon name="warning_filled" title="Warning" />}
    />

    <TextField
      id="storybook-success"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Success"
      meta="Meta"
      helperText="Helper text"
      variant="success"
      helperIcon={<Icon name="thumbs_up" title="Success" />}
    />
    <TextField
      id="storybook-success-two"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Success"
      meta="Meta"
      helperText="Helper text"
      variant="success"
      inputIcon={<Icon name="thumbs_up" title="Success" />}
    />
  </Wrapper>
)

Variants.parameters = {
  docs: {
    storyDescription: `Examples of validation states. You can add the icon in the helper
    text or inside the text input, both not both places.`,
  },
}
