import React from 'react'
import { Button, Icon } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
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
    <Button variant="ghost_icon">
      <Icon name="save" title="save action" size={48}></Icon>
    </Button>
    <Button variant="ghost_icon" color="secondary">
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon" color="danger">
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon" disabled>
      <Icon name="save" title="save"></Icon>
    </Button>
  </Wrapper>
)
export const contained = () => (
  <Wrapper>
    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>
    <Button leftIcon={<Icon name="save" title="save"></Icon>}>Primary</Button>
    <Button color="secondary" leftIcon={<Icon name="save" title="save"></Icon>}>
      Secondary
    </Button>
    <Button color="danger" leftIcon={<Icon name="save" title="save"></Icon>}>
      Danger
    </Button>
    <Button disabled leftIcon={<Icon name="save" title="save"></Icon>}>
      Disabled
    </Button>
    <Button rightIcon={<Icon name="save" title="save"></Icon>}>Primary</Button>
    <Button
      color="secondary"
      rightIcon={<Icon name="save" title="save"></Icon>}
    >
      Secondary
    </Button>
    <Button color="danger" rightIcon={<Icon name="save" title="save"></Icon>}>
      Danger
    </Button>
    <Button disabled rightIcon={<Icon name="save" title="save"></Icon>}>
      Disabled
    </Button>
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
    <Button
      variant="outlined"
      leftIcon={<Icon name="save" title="save"></Icon>}
    >
      Primary
    </Button>
    <Button
      variant="outlined"
      color="secondary"
      leftIcon={<Icon name="save" title="save"></Icon>}
    >
      Secondary
    </Button>
    <Button
      variant="outlined"
      color="danger"
      leftIcon={<Icon name="save" title="save"></Icon>}
    >
      Danger
    </Button>
    <Button
      variant="outlined"
      disabled
      leftIcon={<Icon name="save" title="save"></Icon>}
    >
      Disabled
    </Button>
    <Button
      variant="outlined"
      rightIcon={<Icon name="save" title="save"></Icon>}
    >
      Primary
    </Button>
    <Button
      variant="outlined"
      color="secondary"
      rightIcon={<Icon name="save" title="save"></Icon>}
    >
      Secondary
    </Button>
    <Button
      variant="outlined"
      color="danger"
      rightIcon={<Icon name="save" title="save"></Icon>}
    >
      Danger
    </Button>
    <Button
      variant="outlined"
      disabled
      rightIcon={<Icon name="save" title="save"></Icon>}
    >
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
    <Button variant="ghost" leftIcon={<Icon name="save" title="save"></Icon>}>
      Primary
    </Button>
    <Button
      variant="ghost"
      color="secondary"
      leftIcon={<Icon name="save" title="save"></Icon>}
    >
      Secondary
    </Button>
    <Button
      variant="ghost"
      color="danger"
      leftIcon={<Icon name="save" title="save"></Icon>}
    >
      Danger
    </Button>
    <Button
      variant="ghost"
      disabled
      leftIcon={<Icon name="save" title="save"></Icon>}
    >
      Disabled
    </Button>
    <Button variant="ghost" rightIcon={<Icon name="save" title="save"></Icon>}>
      Primary
    </Button>
    <Button
      variant="ghost"
      color="secondary"
      rightIcon={<Icon name="save" title="save"></Icon>}
    >
      Secondary
    </Button>
    <Button
      variant="ghost"
      color="danger"
      rightIcon={<Icon name="save" title="save"></Icon>}
    >
      Danger
    </Button>
    <Button
      variant="ghost"
      disabled
      rightIcon={<Icon name="save" title="save"></Icon>}
    >
      Disabled
    </Button>
    <Button variant="ghost_icon">
      <Icon name="save" title="save action" size={48}></Icon>
    </Button>
    <Button variant="ghost_icon" color="secondary">
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon" color="danger">
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon" disabled>
      <Icon name="save" title="save"></Icon>
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

export const form = () => {
  const handleSubmit = (e) => {
    e.preventDefault() // to prevent navigation from storybook
    action('onSubmit')(e)
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit} href="/">
        <Button type="submit">Submit form</Button>
      </form>
    </Wrapper>
  )
}

export const fileUpload = () => {
  return (
    <Wrapper>
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        multiple
      />
      <label htmlFor="file-upload">
        <Button as="span">Upload</Button>
      </label>
    </Wrapper>
  )
}

export const link = () => (
  <Wrapper>
    <Button href="#">Link</Button>
  </Wrapper>
)

export const invertedGhostButton = () => (
  <Wrapper style={{ background: 'black' }}>
    <Button variant="ghost" invertedTextColor>
      Inverted to fit dark backgrounds
    </Button>
  </Wrapper>
)

knobs.story = {
  name: 'With knobs',
  decorators: [withKnobs],
}
