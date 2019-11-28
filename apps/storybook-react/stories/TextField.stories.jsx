import React from 'react'
import { storiesOf } from '@storybook/react'
import { TextField, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import './../style.css'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
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
      </Wrapper>
    </div>
  )
})
