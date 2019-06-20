import React from 'react'
import { storiesOf } from '@storybook/react'
import { Button } from '@eds-ui/core-react'

storiesOf('Button', module).add('Demo', () => (
  <div>
    <Button>Button</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="ghost">Ghost</Button>
    <Button color="secondary">Button</Button>
    <Button color="secondary" variant="outlined">
      Outlined
    </Button>
    <Button color="secondary" variant="ghost">
      Ghost
    </Button>
    <Button color="danger">Button</Button>
    <Button color="danger" variant="outlined">
      Outlined
    </Button>
    <Button color="danger" variant="ghost">
      Ghost
    </Button>
  </div>
))
