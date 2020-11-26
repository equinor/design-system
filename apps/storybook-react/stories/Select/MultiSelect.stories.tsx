import React from 'react'
import { MultiSelect } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react/types-6-0'
import styled from 'styled-components'
import { items } from './data'

export default {
  title: 'Components/Select/MultiSelect',
  component: MultiSelect,
} as Meta

const Container = styled.div`
  margin-bottom: 350px;
`

export const Default: Story = (args) => (
  <Container>
    <MultiSelect
      label="Choose an element"
      {...args}
      items={items}
    ></MultiSelect>
  </Container>
)
export const Disabled: Story = () => (
  <MultiSelect
    label="Choose an element"
    meta="km/t"
    items={items}
    disabled
  ></MultiSelect>
)
