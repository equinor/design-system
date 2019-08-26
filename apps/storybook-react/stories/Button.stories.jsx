import React from 'react'
import { storiesOf } from '@storybook/react'
import { Button, Typography } from '@equinor/eds-core-react'
import './../style.css'
import './button.css'

storiesOf('Components', module).add('Button', () => (
  <div className="container">
    <Typography variant="h1" bold>
      Variations
    </Typography>
    <div className="">
      <div className="group">
        <Typography variant="h2">Contained (default)</Typography>
        <Button>Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="danger">Danger</Button>
        <Button disabled>Disabled</Button>
      </div>

      <div className="group">
        <Typography variant="h2">Outlined</Typography>
        <Button variant="outlined">Primary</Button>
        <Button variant="outlined" color="secondary">
          Secondary
        </Button>
        <Button variant="outlined" color="danger">
          Danger
        </Button>
        <Button variant="outlined" disabled>
          Disabled
        </Button>
      </div>

      <div className="group">
        <Typography variant="h2">Ghost</Typography>
        <Button variant="ghost">Primary</Button>
        <Button variant="ghost" color="secondary">
          Secondary
        </Button>
        <Button variant="ghost" color="danger">
          Danger
        </Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
      </div>
    </div>
  </div>
))
