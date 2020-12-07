/* eslint-disable no-undef */
import * as React from 'react'
import { useState } from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import 'jest-styled-components'
import { UseMultipleSelectionStateChange } from 'downshift'

import styled from 'styled-components'
import { MultiSelect } from '.'

const items = ['One', 'Two', 'Three']
const labelText = 'Select label test'

afterEach(cleanup)

describe('MultiSelect', () => {
  it('Has provided label', () => {
    render(<MultiSelect label={labelText} items={items} id="id" />)
    // The same label is used for both the input field and the list of options
    const inputNode = screen.getAllByLabelText(labelText)
    expect(inputNode).toBeDefined()
  })

  it('Can be disabled', () => {
    render(<MultiSelect label={labelText} items={items} disabled />)
    const inputNode = screen.getAllByLabelText(labelText)[0]
    expect(inputNode).toBeDisabled()
  })

  it('Can preselect specific options', () => {
    render(
      <MultiSelect
        items={items}
        label={labelText}
        initialSelectedItems={['One', 'Two']}
      />,
    )
    const placeholderText = screen.getByPlaceholderText('2/3 selected')
    expect(placeholderText).toBeDefined()
  })

  it('Can open the options on button click', () => {
    render(<MultiSelect items={items} label={labelText} />)
    const optionsNode = screen.getAllByLabelText(labelText)[1]
    const buttonNode = screen.getByLabelText('open')
    expect(optionsNode.children).toHaveLength(0)
    fireEvent.click(buttonNode)
    expect(optionsNode.children).toHaveLength(3)
  })

  type ControlledProps = {
    onChange: () => void
  }

  const HandleMultipleSelect = ({ onChange }: ControlledProps) => {
    const [selected, setSelected] = useState([])
    return (
      <MultiSelect
        items={items}
        label={labelText}
        selectedOptions={selected}
        handleSelectedItemsChange={(
          changes: UseMultipleSelectionStateChange<string>,
        ) => {
          setSelected(changes.selectedItems)
          onChange()
        }}
      />
    )
  }

  it('Can be a controlled component', () => {
    const handleChange = jest.fn()
    render(<HandleMultipleSelect onChange={handleChange} />)
    const optionsNode = screen.getAllByLabelText(labelText)[1]
    const buttonNode = screen.getByLabelText('open')

    expect(handleChange).toHaveBeenCalledTimes(0)
    fireEvent.click(buttonNode)
    fireEvent.click(optionsNode.children[2])
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('Can filter results by contains search', () => {
    render(<MultiSelect items={items} label={labelText} />)
    const inputNode = screen.getAllByLabelText(labelText)[0]

    const optionsNode = screen.getAllByLabelText(labelText)[1]

    const buttonNode = screen.getByLabelText('open')
    expect(optionsNode.children).toHaveLength(0)
    fireEvent.click(buttonNode)
    expect(optionsNode.children).toHaveLength(3)
    fireEvent.change(inputNode, {
      target: { value: 'ree' },
    })
    expect(optionsNode.children).toHaveLength(1)
  })

  const StyledMultiSelect = styled(MultiSelect)`
    clip-path: unset;
  `

  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledMultiSelect label="test" items={items} />,
    )
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
})
