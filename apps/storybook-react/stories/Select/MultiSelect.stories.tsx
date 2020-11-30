import React, { useState } from 'react'
import { MultiSelect, MultiSelectProps } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { UseMultipleSelectionStateChange } from 'downshift'
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

const initial = ['Troms og Finnmark', 'Vestland']

export const WithPreselected: Story<MultiSelectProps> = () => (
  <Container>
    <MultiSelect
      label="I have preselected options"
      items={items}
      initialSelectedItems={initial}
    />
  </Container>
)

export const UseOnChangeHandler: Story<MultiSelectProps> = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initial)

  function handleSelectedItemsChange(
    changes: UseMultipleSelectionStateChange<string>,
  ) {
    setSelectedItems(changes.selectedItems)

    //setSelectedItem(changes.selectedItems)
  }
  return (
    <Container>
      {selectedItems.length > 0 && (
        <p>My value is {selectedItems.join(', ')}</p>
      )}
      <MultiSelect
        label="I can show my values outside the component itself"
        items={items}
        initialSelectedItems={initial}
        handleSelectedItemsChange={handleSelectedItemsChange}
      />
    </Container>
  )
}
export const Controlled: Story<MultiSelectProps> = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initial)

  function handleSelectedItemsChange(
    changes: UseMultipleSelectionStateChange<string>,
  ) {
    setSelectedItems(changes.selectedItems)

    //setSelectedItem(changes.selectedItems)
  }
  return (
    <Container>
      {selectedItems.length > 0 && (
        <p>My value is {selectedItems.join(', ')}</p>
      )}
      <MultiSelect
        label="I'm a controlled component"
        items={items}
        selectedOptions={selectedItems}
        handleSelectedItemsChange={handleSelectedItemsChange}
      />
    </Container>
  )
}
