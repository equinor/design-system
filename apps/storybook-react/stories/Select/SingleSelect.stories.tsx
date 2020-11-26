import React from 'react'
import { SingleSelect, SingleSelectProps } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react/types-6-0'
import styled from 'styled-components'
import { items } from './data'

export default {
  title: 'Components/Select/SingleSelect',
  component: SingleSelect,
} as Meta

const Container = styled.div`
  margin-bottom: 350px;
`

export const Default: Story<SingleSelectProps> = (args) => (
  <Container>
    <SingleSelect
      label="Choose an element"
      {...args}
      items={items}
    ></SingleSelect>
  </Container>
)

export const Disabled: Story = () => (
  <SingleSelect
    label="Choose an element"
    meta="km/t"
    items={items}
    disabled
  ></SingleSelect>
)

export const ReadOnly: Story = () => (
  <SingleSelect label="This is read only" items={items} readOnly></SingleSelect>
)
