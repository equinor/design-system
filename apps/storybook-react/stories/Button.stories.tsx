import React from 'react'
import { Button, Icon, ButtonProps } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import './../style.css'
import './button.css'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    as: {
      control: {
        type: 'select',
        options: ['span', 'a', 'button'],
        defaultValue: 'button',
      },
    },
  },
} as Meta

export const Default: Story<ButtonProps> = (args) => (
  <Button {...args}>You can control me</Button>
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
)

export const Contained: Story<ButtonProps> = () => (
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
)

export const Outlined: Story<ButtonProps> = () => (
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
)

export const Ghost: Story<ButtonProps> = () => (
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
  </Wrapper>
)

export const GhostIcon: Story<ButtonProps> = () => (
  <Wrapper>
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
)

export const Form: Story<ButtonProps> = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // to prevent navigation from storybook
    action('onSubmit')(e)
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <Button type="submit">Submit form</Button>
      </form>
    </Wrapper>
  )
}

export const FileUpload: Story<ButtonProps> = () => (
  <Wrapper>
    <input type="file" id="file-upload" style={{ display: 'none' }} multiple />
    <label htmlFor="file-upload">
      <Button as="span">Upload</Button>
    </label>
  </Wrapper>
)

export const Link: Story<ButtonProps> = () => (
  <Wrapper>
    <Button href="#">Link</Button>
  </Wrapper>
)
