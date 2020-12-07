/* eslint-disable no-undef */
import * as React from 'react'
import { useState } from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { SingleSelect } from '.'

const items = ['One', 'Two', 'Three']
const labelText = 'Select label test'

afterEach(cleanup)

type ControlledProps = {
  onChange: () => void
}

const ControlledSelect = ({ onChange }: ControlledProps) => {
  const [value, setValue] = useState('One')
  return (
    <SingleSelect
      label={labelText}
      items={items}
      selectedOption={value}
      handleSelectedItemChange={(changes) => {
        setValue(changes.selectedItem)
        onChange()
      }}
    />
  )
}

describe('SingleSelect', () => {
  it('Has provided label', () => {
    render(<SingleSelect label={labelText} items={items} />)
    // The same label is used for both the input field and the list of options
    const inputNode = screen.getAllByLabelText(labelText)[0]
    expect(inputNode).toBeDefined()
  })

  it('Can be disabled', () => {
    render(<SingleSelect label={labelText} items={items} disabled />)
    const inputNode = screen.getAllByLabelText(labelText)[0]
    expect(inputNode).toBeDisabled()
  })

  it('Can preselect a specific option', () => {
    render(
      <SingleSelect
        items={items}
        label={labelText}
        initialSelectedItem="One"
      />,
    )
    const inputNode = screen.getAllByLabelText(labelText)[0]
    expect(inputNode).toHaveValue('One')
  })

  it('Can open the options on button click', () => {
    render(<SingleSelect items={items} label={labelText} />)
    const optionsNode = screen.getAllByLabelText(labelText)[1]
    const buttonNode = screen.getByLabelText('open')
    expect(optionsNode.children).toHaveLength(0)
    fireEvent.click(buttonNode)
    expect(optionsNode.children).toHaveLength(3)
  })

  it('Can filter results by contains search', () => {
    render(<SingleSelect items={items} label={labelText} />)
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

  it('Can be opened by using the keyboard', () => {
    render(<SingleSelect items={items} label={labelText} />)
    const inputNode = screen.getAllByLabelText(labelText)[0]

    const optionsNode = screen.getAllByLabelText(labelText)[1]

    expect(optionsNode.children).toHaveLength(0)

    fireEvent.keyDown(inputNode, { key: 'ArrowDown', code: 'ArrowDown' })
    expect(optionsNode.children).toHaveLength(3)
  })

  it('Will focus on the first item when opening the list with the keyboard', () => {
    render(<SingleSelect items={items} label={labelText} />)
    const inputNode = screen.getAllByLabelText(labelText)[0]
    const optionsNode = screen.getAllByLabelText(labelText)[1]

    fireEvent.keyDown(inputNode, { key: 'ArrowDown', code: 'ArrowDown' })
    expect(optionsNode.children[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter' })

    expect(inputNode).toHaveValue('One')
  })

  it('Can navigate between the options the keyboard', () => {
    render(<SingleSelect items={items} label={labelText} />)
    const inputNode = screen.getAllByLabelText(labelText)[0]

    const optionsNode = screen.getAllByLabelText(labelText)[1]

    expect(optionsNode.children).toHaveLength(0)

    fireEvent.keyDown(inputNode, { key: 'ArrowDown', code: 'ArrowDown' })
    expect(optionsNode.children[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(inputNode, { key: 'ArrowDown', code: 'ArrowDown' })
    expect(optionsNode.children[0]).toHaveAttribute('aria-selected', 'false')
    expect(optionsNode.children[1]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter' })

    expect(inputNode).toHaveValue('Two')
  })

  it('Can be a controlled component', () => {
    const handleChange = jest.fn()
    render(<ControlledSelect onChange={handleChange} />)
    const inputNode = screen.getAllByLabelText(labelText)[0]
    const optionsNode = screen.getAllByLabelText(labelText)[1]
    const buttonNode = screen.getByLabelText('open')
    expect(inputNode).toHaveValue('One')

    expect(handleChange).toHaveBeenCalledTimes(0)
    fireEvent.click(buttonNode)
    fireEvent.click(optionsNode.children[2])
    expect(inputNode).toHaveValue('Three')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  const StyledSingleSelect = styled(SingleSelect)`
    clip-path: unset;
  `

  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledSingleSelect label="test" items={items} />,
    )
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
})
