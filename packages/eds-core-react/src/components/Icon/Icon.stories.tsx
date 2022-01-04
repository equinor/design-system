import styled from 'styled-components'
import { Icon, IconProps } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs'
import mdx from './Icon.docs.mdx'
import * as icons from '@equinor/eds-icons'

Icon.add(icons)

const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

const Preview = styled.div`
  box-shadow: rgb(0 0 0 / 10%) 0 1px 3px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 30px 20px;
  border-radius: 4px;
`

export default {
  title: 'Icons/Icon',
  component: Icon,
  args: {
    name: 'save',
  },
  argTypes: {
    name: {
      options: Object.keys(icons),
      control: {
        type: 'select',
      },
    },
    color: {
      control: 'color',
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as ComponentMeta<typeof Icon>

export const Demo: Story<IconProps> = (args) => (
  <div>
    <Preview>
      <Icon {...args} />
    </Preview>
    <ArgsTable story={PRIMARY_STORY}></ArgsTable>
  </div>
)

export const Color: Story<IconProps> = () => (
  <Wrapper>
    <Icon name="save" color={'red'} />
    <Icon name="save" color={'green'} />
    <Icon name="save" color={'blue'} />
  </Wrapper>
)

export const Rotations: Story<IconProps> = () => (
  <Wrapper>
    <Icon name="pregnant_woman" rotation={90} />
    <Icon name="pregnant_woman" rotation={180} />
    <Icon name="pregnant_woman" rotation={270} />
  </Wrapper>
)

export const Sizes: Story<IconProps> = () => (
  <Wrapper>
    <Icon name="compare" size={16} />
    <Icon name="compare" size={24} />
    <Icon name="compare" size={32} />
    <Icon name="compare" size={40} />
    <Icon name="compare" size={48} />
  </Wrapper>
)
