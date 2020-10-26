import React from 'react'
import { Button, Icon, ButtonProps } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import './../style.css'
import './button.css'

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

export default {
  title: 'Components/Button',
  component: Button,
} as Meta

export const Default: Story<ButtonProps> = (args) => (
  <Button {...args} color="primary">
    Primary
  </Button>
)

export const All: Story<ButtonProps> = () => (
  <Wrapper>
    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>
    <Button variant="outlined">Primary</Button>
    <Button variant="outlined" color="secondary">
      Secondary
    </Button>
  </Wrapper>
)

/* const Template: Story<ButtonProps> = (args) => <Button {...args} />

export const Primary = Template.bind({})

Primary.args = {
  children: 'Primary',
}


 */
/* export const allButtons = () => (
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
      <Icon name="save" title="save action"></Icon>
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
) */
/* export const contained = () => (
  <Wrapper>
    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>
    <Button>
      <Icon name="save" title="save"></Icon>Primary
    </Button>
    <Button color="secondary">
      <Icon name="save" title="save"></Icon>Secondary
    </Button>
    <Button color="danger">
      <Icon name="save" title="save"></Icon>Danger
    </Button>
    <Button disabled>
      <Icon name="save" title="save"></Icon>Disabled
    </Button>
    <Button>
      Primary <Icon name="save" title="save"></Icon>
    </Button>
    <Button color="secondary">
      Secondary
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button color="danger">
      Danger
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button disabled>
      Disabled
      <Icon name="save" title="save"></Icon>
    </Button>
  </Wrapper>
) */

/* contained.storyName = 'Contained (default)' */

/* export const outlined = () => (
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
    <Button variant="outlined">
      <Icon name="save" title="save"></Icon>
      Primary
    </Button>
    <Button variant="outlined" color="secondary">
      <Icon name="save" title="save"></Icon>
      Secondary
    </Button>
    <Button variant="outlined" color="danger">
      <Icon name="save" title="save"></Icon>
      Danger
    </Button>
    <Button variant="outlined" disabled>
      <Icon name="save" title="save"></Icon>
      Disabled
    </Button>
    <Button variant="outlined">
      Primary
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="outlined" color="secondary">
      Secondary
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="outlined" color="danger">
      Danger
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="outlined" disabled>
      Disabled
      <Icon name="save" title="save"></Icon>
    </Button>
  </Wrapper>
) */

/* export const ghost = () => (
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
    <Button variant="ghost">
      <Icon name="save" title="save"></Icon>
      Primary
    </Button>
    <Button variant="ghost" color="secondary">
      <Icon name="save" title="save"></Icon>
      Secondary
    </Button>
    <Button variant="ghost" color="danger">
      <Icon name="save" title="save"></Icon>
      Danger
    </Button>
    <Button variant="ghost" disabled>
      <Icon name="save" title="save"></Icon>
      Disabled
    </Button>
    <Button variant="ghost">
      Primary
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost" color="secondary">
      Secondary
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost" color="danger">
      Danger
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost" disabled>
      Disabled
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon">
      <Icon name="save" title="save action"></Icon>
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
) */
/* 
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
) */

/* export const form = () => {
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
 */
/* export const fileUpload = () => {
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
} */
/* 
export const link = () => (
  <Wrapper>
    <Button href="#">Link</Button>
  </Wrapper>
) */

/* knobs.storyName = 'With knobs'
knobs.decorators = [withKnobs] */
