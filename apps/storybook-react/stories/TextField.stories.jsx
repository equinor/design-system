import React from 'react'
import { storiesOf } from '@storybook/react'
import { TextField, Typography } from '@equinor/eds-core-react'
import './../style.css'

storiesOf('Components', module).add('TextField', () => (
  <div className="container">
    <Typography variant="h1" bold>
      TextField
    </Typography>
    <div className="group">
      <TextField value="Hello" type="text" />
    </div>
  </div>
))
