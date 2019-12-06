import React from 'react'
import { storiesOf } from '@storybook/react'
import { TextField, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import './../style.css'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
`

storiesOf('Components', module).add('TextField', () => {
  return (
    <div className="container">
      <Typography variant="h1" bold>
        TextField
      </Typography>
      <Wrapper>
        <TextField
          id="textfield-normal"
          placeholder="Placeholder text"
          label="Default"
          meta="Meta"
          helperText="Helper Text"
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
        <TextField
          type="numbers"
          id="textfield-numbers"
          placeholder="Placeholder text"
          label="Numbers"
          meta="Meta"
          helperText="Helper Text"
        />
        <TextField
          id="storybook-disabled"
          placeholder="Placeholder text"
          label="Disabled"
          meta="Meta"
          helperText="Helper Text"
          disabled
        />
        <TextField
          id="storybook-textfield4"
          placeholder="Placeholder text Placeholder text Placeholder text"
          label="Multline"
          meta="Meta"
          helperText="Helper Text"
          multiline
        />
        <TextField
          id="storybook-textfield5"
          placeholder="Placeholder text Placeholder text Placeholder text"
          label="Error"
          meta="Meta"
          helperText="Helper Text"
          validation="error"
        />
        <TextField
          id="storybook-textfield6"
          placeholder="Placeholder text Placeholder text Placeholder text"
          label="Warning"
          meta="Meta"
          helperText="Helper Text"
          validation="warning"
        />
        <TextField
          id="storybook-textfield7"
          placeholder="Placeholder text Placeholder text Placeholder text"
          label="Success"
          meta="Meta"
          helperText="Helper Text"
          validation="success"
        />
        <TextField
          id="storybook-textfield8"
          placeholder="Placeholder text "
          label="Compact"
          meta="Meta"
          helperText="Helper Text"
          compact
        />
        <TextField
          id="storybook-textfield10"
          placeholder="only meta"
          meta="Meta"
        />
        <TextField
          id="storybook-textfield11"
          placeholder="no helper/label/meta text"
        />
        <TextField
          id="storybook-textfield12"
          placeholder="Only helper text"
          helperText="Only helper text"
        />
      </Wrapper>
    </div>
  )
})
