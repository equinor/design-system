import { CSSButton, ButtonProps } from '.'
import { Icon, EdsProvider } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { menu, save } from '@equinor/eds-icons'

Icon.add({ save })

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
  title: 'Core-react experimental features/CSS Button',
  component: CSSButton,
  argTypes: {
    as: {
      control: {
        type: 'select',
        options: ['span', 'a', 'button'],
        defaultValue: 'button',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'This is a test using only CSS and CSS custom properties for making a component.  \n ⚠️  `:root` custom css properties are loaded via the component now  for this test.',
      },
    },
    info: {},
  },
} as Meta

export const Default: Story<ButtonProps> = (args) => (
  <CSSButton {...args}>You can control me</CSSButton>
)

export const All: Story<ButtonProps> = () => (
  <Wrapper>
    <CSSButton>Primary</CSSButton>
    <CSSButton color="secondary">Secondary</CSSButton>
    <CSSButton color="danger">Danger</CSSButton>
    <CSSButton disabled>Disabled</CSSButton>
    <CSSButton variant="outlined">Primary</CSSButton>
    <CSSButton variant="outlined" color="secondary">
      Secondary
    </CSSButton>
    <CSSButton variant="outlined" color="danger">
      Danger
    </CSSButton>
    <CSSButton variant="outlined" disabled>
      Disabled
    </CSSButton>
    <CSSButton variant="ghost">Primary</CSSButton>
    <CSSButton variant="ghost" color="secondary">
      Secondary
    </CSSButton>
    <CSSButton variant="ghost" color="danger">
      Danger
    </CSSButton>
    <CSSButton variant="ghost" disabled>
      Disabled
    </CSSButton>
    <CSSButton variant="ghost_icon">
      <Icon name="save" title="save action"></Icon>
    </CSSButton>
    <CSSButton variant="ghost_icon" color="secondary">
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="ghost_icon" color="danger">
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="ghost_icon" disabled>
      <Icon name="save" title="save"></Icon>
    </CSSButton>
  </Wrapper>
)

export const Contained: Story<ButtonProps> = () => (
  <Wrapper>
    <CSSButton>Primary</CSSButton>
    <CSSButton color="secondary">Secondary</CSSButton>
    <CSSButton color="danger">Danger</CSSButton>
    <CSSButton disabled>Disabled</CSSButton>
    <CSSButton>
      <Icon name="save" title="save"></Icon>Primary
    </CSSButton>
    <CSSButton color="secondary">
      <Icon name="save" title="save"></Icon>Secondary
    </CSSButton>
    <CSSButton color="danger">
      <Icon name="save" title="save"></Icon>Danger
    </CSSButton>
    <CSSButton disabled>
      <Icon name="save" title="save"></Icon>Disabled
    </CSSButton>
    <CSSButton>
      Primary <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton color="secondary">
      Secondary
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton color="danger">
      Danger
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton disabled>
      Disabled
      <Icon name="save" title="save"></Icon>
    </CSSButton>
  </Wrapper>
)

export const Outlined: Story<ButtonProps> = () => (
  <Wrapper>
    <CSSButton variant="outlined">Primary</CSSButton>
    <CSSButton variant="outlined" color="secondary">
      Secondary
    </CSSButton>
    <CSSButton variant="outlined" color="danger">
      Danger
    </CSSButton>
    <CSSButton variant="outlined" disabled>
      Disabled
    </CSSButton>
    <CSSButton variant="outlined">
      <Icon name="save" title="save"></Icon>
      Primary
    </CSSButton>
    <CSSButton variant="outlined" color="secondary">
      <Icon name="save" title="save"></Icon>
      Secondary
    </CSSButton>
    <CSSButton variant="outlined" color="danger">
      <Icon name="save" title="save"></Icon>
      Danger
    </CSSButton>
    <CSSButton variant="outlined" disabled>
      <Icon name="save" title="save"></Icon>
      Disabled
    </CSSButton>
    <CSSButton variant="outlined">
      Primary
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="outlined" color="secondary">
      Secondary
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="outlined" color="danger">
      Danger
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="outlined" disabled>
      Disabled
      <Icon name="save" title="save"></Icon>
    </CSSButton>
  </Wrapper>
)

export const Ghost: Story<ButtonProps> = () => (
  <Wrapper>
    <CSSButton variant="ghost">Primary</CSSButton>
    <CSSButton variant="ghost" color="secondary">
      Secondary
    </CSSButton>
    <CSSButton variant="ghost" color="danger">
      Danger
    </CSSButton>
    <CSSButton variant="ghost" disabled>
      Disabled
    </CSSButton>
    <CSSButton variant="ghost">
      <Icon name="save" title="save"></Icon>
      Primary
    </CSSButton>
    <CSSButton variant="ghost" color="secondary">
      <Icon name="save" title="save"></Icon>
      Secondary
    </CSSButton>
    <CSSButton variant="ghost" color="danger">
      <Icon name="save" title="save"></Icon>
      Danger
    </CSSButton>
    <CSSButton variant="ghost" disabled>
      <Icon name="save" title="save"></Icon>
      Disabled
    </CSSButton>
    <CSSButton variant="ghost">
      Primary
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="ghost" color="secondary">
      Secondary
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="ghost" color="danger">
      Danger
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="ghost" disabled>
      Disabled
      <Icon name="save" title="save"></Icon>
    </CSSButton>
  </Wrapper>
)

export const GhostIcon: Story<ButtonProps> = () => (
  <Wrapper>
    <CSSButton variant="ghost_icon">
      <Icon name="save" title="save action"></Icon>
    </CSSButton>
    <CSSButton variant="ghost_icon" color="secondary">
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="ghost_icon" color="danger">
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton variant="ghost_icon" disabled>
      <Icon name="save" title="save"></Icon>
    </CSSButton>
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
        <CSSButton type="submit">Submit form</CSSButton>
      </form>
    </Wrapper>
  )
}

export const FileUpload: Story<ButtonProps> = () => (
  <Wrapper>
    <input type="file" id="file-upload" style={{ display: 'none' }} multiple />
    <label htmlFor="file-upload">
      <CSSButton as="span">Upload</CSSButton>
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
    <CSSButton href="#">Link</CSSButton>
  </Wrapper>
)

export const FullWidth: Story<ButtonProps> = () => (
  <FullWidthWrapper>
    <CSSButton fullWidth>Primary</CSSButton>
    <CSSButton color="secondary" fullWidth>
      Secondary
    </CSSButton>
    <CSSButton color="danger" fullWidth>
      Danger
    </CSSButton>
    <CSSButton disabled fullWidth>
      Disabled
    </CSSButton>
    <CSSButton fullWidth>
      <Icon name="save" title="save"></Icon>Primary
    </CSSButton>
    <CSSButton color="secondary" fullWidth>
      <Icon name="save" title="save"></Icon>Secondary
    </CSSButton>
    <CSSButton color="danger" fullWidth>
      <Icon name="save" title="save"></Icon>Danger
    </CSSButton>
    <CSSButton disabled fullWidth>
      <Icon name="save" title="save"></Icon>Disabled
    </CSSButton>
    <CSSButton fullWidth>
      Primary <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton color="secondary" fullWidth>
      Secondary
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton color="danger" fullWidth>
      Danger
      <Icon name="save" title="save"></Icon>
    </CSSButton>
    <CSSButton disabled fullWidth>
      Disabled
      <Icon name="save" title="save"></Icon>
    </CSSButton>
  </FullWidthWrapper>
)

export const Compact: Story<ButtonProps> = () => (
  <EdsProvider density="compact">
    <Wrapper>
      <CSSButton>Contained</CSSButton>
      <CSSButton variant="outlined">Outlined</CSSButton>
      <CSSButton variant="ghost">Ghost</CSSButton>
      <CSSButton variant="ghost_icon">
        <Icon data={menu} title="Ghost icon menu"></Icon>
      </CSSButton>
    </Wrapper>
  </EdsProvider>
)

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `Button` using `EdsProvider`',
    },
  },
}
