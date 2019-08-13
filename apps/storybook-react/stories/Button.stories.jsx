import React from 'react'
import { storiesOf } from '@storybook/react'
import { Button } from '@equinor/eds-core-react'
import './button.css'

storiesOf('Components', module).add('Button', () => (
  <div className="btn-container">
    <h1>Variations</h1>

    <div className="btn-group">
      <h2>Contained (default)</h2>
      <Button>Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="danger">Danger</Button>
      <Button disabled>Disabled</Button>
    </div>

    <div className="btn-group">
      <h2>Outlined</h2>
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

    <div className="btn-group">
      <h2>Ghost</h2>
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
))
