import React from 'react'
import { MultiSelect, MultiSelectProps } from '@equinor/eds-core-react'
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

export const Default: Story<MultiSelectProps> = (args) => (
  <Container>
    <MultiSelect label="You can play with me" {...args} items={items} />
  </Container>
)
export const Disabled: Story<MultiSelectProps> = () => (
  <MultiSelect label="Choose an element" meta="km/t" items={items} disabled />
)

export const ReadOnly: Story<MultiSelectProps> = () => (
  <MultiSelect label="This is read only" items={items} readOnly></MultiSelect>
)

export const WithPreselected: Story<MultiSelectProps> = () => (
  <Container>
    <MultiSelect
      label="I have preselected options"
      items={items}
      initialSelectedItems={['Troms og Finnmark', 'Vestland']}
    />
  </Container>
)
