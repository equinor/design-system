import React from 'react'
import { SingleSelect, SingleSelectProps } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Components/Select/SingleSelect',
  component: SingleSelect,
} as Meta

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

export const Default: Story<SingleSelectProps> = (args) => (
  <SingleSelect {...args} items={items}></SingleSelect>
)
