import { useState, useEffect } from 'react'
import { Button, Icon, ButtonProps, EdsProvider, Density } from '../..'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { menu } from '@equinor/eds-icons'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`

const FullWidthWrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 16px;
`

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    as: 'button',
  },
  argTypes: {
    as: {
      options: ['span', 'a', 'button'],
      control: {
        type: 'select',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Buttons allow users to take action with a single click or tap.
        `,
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

FileUpload.parameters = {
  docs: {
    description: {
      story:
        'Please note this demo only works in Storybook Canvas (isolated example only)',
    },
  },
}

export const Link: Story<ButtonProps> = () => (
  <Wrapper>
    <Button href="#">Link</Button>
  </Wrapper>
)

export const FullWidth: Story<ButtonProps> = () => (
  <FullWidthWrapper>
    <Button fullWidth>Primary</Button>
    <Button color="secondary" fullWidth>
      Secondary
    </Button>
    <Button color="danger" fullWidth>
      Danger
    </Button>
    <Button disabled fullWidth>
      Disabled
    </Button>
    <Button fullWidth>
      <Icon name="save" title="save"></Icon>Primary
    </Button>
    <Button color="secondary" fullWidth>
      <Icon name="save" title="save"></Icon>Secondary
    </Button>
    <Button color="danger" fullWidth>
      <Icon name="save" title="save"></Icon>Danger
    </Button>
    <Button disabled fullWidth>
      <Icon name="save" title="save"></Icon>Disabled
    </Button>
    <Button fullWidth>
      Primary <Icon name="save" title="save"></Icon>
    </Button>
    <Button color="secondary" fullWidth>
      Secondary
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button color="danger" fullWidth>
      Danger
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button disabled fullWidth>
      Disabled
      <Icon name="save" title="save"></Icon>
    </Button>
  </FullWidthWrapper>
)

export const Compact: Story<ButtonProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Wrapper>
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost_icon">
          <Icon data={menu} title="Ghost icon menu"></Icon>
        </Button>
      </Wrapper>
    </EdsProvider>
  )
}

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `Button` using `EdsProvider`',
    },
  },
}
