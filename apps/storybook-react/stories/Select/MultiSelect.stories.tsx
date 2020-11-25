import React from 'react'
import { MultiSelect } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react/types-6-0'
import styled from 'styled-components'

export default {
  title: 'Components/Select/MultiSelect',
  component: MultiSelect,
} as Meta

const Container = styled.div`
  margin-bottom: 150px;
`

const items = [
  'Oslo',
  'Rogaland',
  'Møre og Romsdal',
  'Nordland',
  'Viken',
  'Innlandet',
  'Vestfold og Telemark',
  'Agder',
  'Vestland',
  'Trøndelag',
  'Troms og Finnmark',
]

export const Default: Story = (args) => (
  <Container>
    <MultiSelect
      {...args}
      items={items}
      label="Choose an element"
    ></MultiSelect>
  </Container>
)
