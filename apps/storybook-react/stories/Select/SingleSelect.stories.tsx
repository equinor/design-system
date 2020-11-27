import * as React from 'react'
import { useState } from 'react'
import { SingleSelect, SingleSelectProps } from '@equinor/eds-core-react'
import { UseComboboxStateChange } from 'downshift'
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
    <SingleSelect label="Choose an element" {...args} items={items} />
  </Container>
)

export const Disabled: Story = () => (
  <SingleSelect label="Choose an element" meta="km/t" items={items} disabled />
)

export const ReadOnly: Story = () => (
  <SingleSelect label="This is read only" items={items} readOnly />
)

export const WithPreselected: Story<SingleSelectProps> = () => (
  <Container>
    <SingleSelect
      label="I have a preselected option"
      initialSelectedItem="Troms og Finnmark"
      items={items}
    />
  </Container>
)

export const Controlled: Story<SingleSelectProps> = () => {
  const [selectedItem, setSelectedItem] = useState<string>(null)
  function handleSelectedItemChange(changes: UseComboboxStateChange<string>) {
    setSelectedItem(changes.selectedItem)
  }
  return (
    <Container>
      <p>{`My value is ${selectedItem}`}</p>
      <SingleSelect
        label="I'm controlled"
        items={items}
        selectedItem={selectedItem}
        handleSelectedItemChange={handleSelectedItemChange}
      />
    </Container>
  )
}
