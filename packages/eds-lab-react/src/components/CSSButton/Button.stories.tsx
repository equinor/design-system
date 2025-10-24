import { CSSButton, ButtonProps } from '.'
import { Icon, EdsProvider } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { StoryFn, StoryObj, Meta } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import * as icons from '@equinor/eds-icons'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
Icon.add(icons)

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

const meta: Meta<typeof CSSButton> = {
  title: 'Core-react experimental features/CSS Button',
  component: CSSButton,
  argTypes: {
    as: {
      options: ['span', 'a', 'button'],
      control: { type: 'radio' },
      defaultValue: 'button',
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
}
export default meta

export const Default: StoryObj<ButtonProps> = {
  render: (args) => <CSSButton {...args}>You can control me</CSSButton>,
}

export const All: StoryFn<ButtonProps> = () => (
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

export const Contained: StoryFn<ButtonProps> = () => (
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

export const Outlined: StoryFn<ButtonProps> = () => (
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

export const Ghost: StoryFn<ButtonProps> = () => (
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

export const GhostIcon: StoryFn<ButtonProps> = () => (
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

export const Form: StoryFn<ButtonProps> = () => {
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

export const FileUpload: StoryObj<ButtonProps> = {
  render: () => (
    <Wrapper>
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        multiple
      />
      <label htmlFor="file-upload">
        <CSSButton as="span">Upload</CSSButton>
      </label>
    </Wrapper>
  ),

  parameters: {
    docs: {
      description: {
        story:
          'Please note this demo only works in Storybook Canvas (isolated example only)',
      },
    },
  },
}

export const Link: StoryFn<ButtonProps> = () => (
  <Wrapper>
    <CSSButton href="#">Link</CSSButton>
  </Wrapper>
)

export const FullWidth: StoryFn<ButtonProps> = () => (
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

export const Compact: StoryObj<ButtonProps> = {
  render: () => (
    <EdsProvider density="compact">
      <Wrapper>
        <CSSButton>Contained</CSSButton>
        <CSSButton variant="outlined">Outlined</CSSButton>
        <CSSButton variant="ghost">Ghost</CSSButton>
        <CSSButton variant="ghost_icon">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Icon data={menu} title="Ghost icon menu"></Icon>
        </CSSButton>
      </Wrapper>
    </EdsProvider>
  ),

  parameters: {
    docs: {
      description: {
        story: 'Compact `Button` using `EdsProvider`',
      },
    },
  },
}
