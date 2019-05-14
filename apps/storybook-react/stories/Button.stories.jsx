import React from 'react';
import { storiesOf } from '@storybook/react'
import { Button } from '@eds-ui/core-react'

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
