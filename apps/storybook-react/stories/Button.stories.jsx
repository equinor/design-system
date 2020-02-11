import React from 'react'
import { Button, Icon } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import './../style.css'
import './button.css'

export default {
  title: 'Components|Button',
  component: Button,
}

const VARIANT = {
  CONTAINED: 'contained',
  OUTLINED: 'outlined',
  GHOST: 'ghost',
  GHOST_ICON: 'ghost_icon',
}

const COLOR = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  DISABLED: 'disabled',
}

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`

export const allButtons = () => (
  <Wrapper>
    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>

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
  </Wrapper>
)
export const contained = () => (
  <Wrapper>
    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>
  </Wrapper>
)

contained.story = {
  name: 'Contained (default)',
}

export const outlined = () => (
  <Wrapper>
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
  </Wrapper>
)

export const ghost = () => (
  <Wrapper>
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
    <Button variant="ghost_icon">
      <Icon name="save"></Icon>
    </Button>
  </Wrapper>
)

export const knobs = () => (
  <Wrapper>
    <Button
      color={select('Color', [...Object.values(COLOR)])}
      variant={select(
        'Variant',
        [...Object.values(VARIANT)],
        VARIANT.CONTAINED,
      )}
    >
      {text('Label', 'Some label')}
    </Button>
  </Wrapper>
)

knobs.story = {
  name: 'With knobs',
  decorators: [withKnobs],
}
