import React from 'react'
import styled from 'styled-components'
import { Divider, DividerProps } from '@components'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Components/Divider',
  component: Divider,
  argTypes: {
    color: { control: 'radio' },
    variant: { control: 'radio' },
  },
  parameters: {
    docs: {
      description: {
        component: `A divider is a thin line that separates content into clear groups.
        `,
      },
    },
  },
} as Meta

const Wrapper = styled.div`
  padding: 32px;
  background-color: #999;
`

export const Default: Story<DividerProps> = (args) => <Divider {...args} />

export const Small: Story<DividerProps> = () => (
  <Wrapper>
    <Divider color="lighter" variant="small" />
    <Divider color="light" variant="small" />
    <Divider variant="small" />
  </Wrapper>
)

export const Medium: Story<DividerProps> = () => (
  <Wrapper>
    <Divider color="lighter" />
    <Divider color="light" />
    <Divider />
  </Wrapper>
)
