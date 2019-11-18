import React from 'react'
import { storiesOf } from '@storybook/react'
import { TextField, Typography } from '@equinor/eds-core-react'
import './../style.css'

storiesOf('Components', module).add('TextField', () => {
  return (
    <div className="container">
      <Typography variant="h1" bold>
        TextField
      </Typography>
      <div className="group">
        <TextField
          type="text"
          id="storybook-textfield"
          placeholder="this is placeholder text"
          label="Some label text"
          meta="This is meta"
          helperText="Some helper text"
        />
      </div>
    </div>
  )
})
