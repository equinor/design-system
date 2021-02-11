import React from 'react'
import { TextField, TextFieldProps, Icon } from '@components'
import { Story, Meta } from '@storybook/react'

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

// TODO replace with eds react icon component
const ICONS = {
  ERROR: (
    <svg viewBox="0 0 24 24" width="16px" height="16px">
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-10v6h2V7h-2z"
      ></path>
    </svg>
  ),
  WARNING: (
    <svg viewBox="0 0 24 24" width="16px" height="16px">
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M23 21.5l-11-19-11 19h22zm-12-3v-2h2v2h-2zm0-4h2v-4h-2v4z"
      ></path>
    </svg>
  ),
  SUCCESS: (
    <svg viewBox="0 0 24 24" width="16px" height="16px">
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M9 22h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.58 8.59C7.22 8.95 7 9.45 7 10v10c0 1.1.9 2 2 2zm0-12l4.34-4.34L12 11h9v2l-3 7H9V10zm-4 0H1v12h4V10z"
      ></path>
    </svg>
  ),
}

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
      inputIcon={ICONS.WARNING}
    />
    <TextField
      id="storybook-positive-icon"
      placeholder="Placeholder text"
      label="Some positive input"
      inputIcon={ICONS.SUCCESS}
    />
    <TextField
      id="storybook-disabled"
      placeholder="Placeholder text"
      label="Disabled"
      meta="Meta"
      helperText="Helper Text"
      disabled
      inputIcon={ICONS.SUCCESS}
    />
  </Wrapper>
)
WithIcons.storyName = 'With icons'

export const variants: Story<TextFieldProps> = () => (
  <Wrapper>
    <TextField
      id="storybook-error"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Error"
      meta="Meta"
      helperText="Helper Text"
      variant="error"
      helperIcon={ICONS.ERROR}
    />
    <TextField
      id="storybook-warning"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Warning"
      meta="Meta"
      helperText="Helper Text"
      variant="warning"
      helperIcon={ICONS.WARNING}
    />
    <TextField
      id="storybook-success"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Success"
      meta="Meta"
      helperText="Helper Text"
      variant="success"
      helperIcon={ICONS.SUCCESS}
    />
    <TextField
      id="storybook-error-two"
      placeholder="Placeholder text "
      label="Error"
      meta="Meta"
      helperText="Helper Text"
      variant="error"
      inputIcon={ICONS.ERROR}
    />
    <TextField
      id="storybook-warning-two"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Warning"
      meta="Meta"
      helperText="Helper Text"
      variant="warning"
      inputIcon={ICONS.WARNING}
    />
    <TextField
      id="storybook-success-two"
      placeholder="Placeholder text Placeholder text Placeholder text"
      label="Success"
      meta="Meta"
      helperText="Helper Text"
      variant="success"
      inputIcon={ICONS.SUCCESS}
    />
  </Wrapper>
)
