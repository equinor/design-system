/* eslint-disable no-undef */
import * as React from 'react'
import { useState } from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { NativeSelect } from '.'

afterEach(cleanup)

type SelectProps = {
  label: string
  id: string
}
const SelectMarkup = ({ label, id }: SelectProps) => {
  return (
    <NativeSelect label={label} id={id}>
      <option>Option one</option>
      <option>Option two</option>
      <option>Option three</option>
    </NativeSelect>
  )
}

describe('NativeSelect', () => {
  it('Has provided label', () => {
    const label = 'Select label'
    render(<SelectMarkup label={label} id="test-id" />)
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDefined()
  })

  it('Can be disabled', () => {
    const label = 'Select label'
    render(
      <NativeSelect label={label} id="testDisabled" disabled>
        <option>Option one</option>
        <option>Option two</option>
        <option>Option three</option>
      </NativeSelect>,
    )
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDisabled()
  })

  it('Can preselect a specific option', () => {
    const label = 'Select label'
    render(
      <NativeSelect label={label} id="testPreselect" defaultValue="two">
        <option value="one">Option one</option>
        <option value="two">Option two</option>
        <option value="three">Option three</option>
      </NativeSelect>,
    )
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toHaveValue('two')
  })

  type ControlledProps = {
    onChange: () => void
  }

  const ControlledSelect = ({ onChange }: ControlledProps) => {
    const [value, setValue] = useState('one')
    return (
      <NativeSelect
        label="select-label"
        id="selectId"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange()
        }}
      >
        {' '}
        <option value="one">Option one</option>
        <option value="two">Option two</option>
        <option value="three">Option three</option>
      </NativeSelect>
    )
  }

  it('Can be a controlled component', () => {
    const newValue = 'three'
    const handleChange = jest.fn()
    render(<ControlledSelect onChange={handleChange} />)
    const select = screen.queryByLabelText('select-label')

    expect(select).toHaveValue('one')
    expect(handleChange).toHaveBeenCalledTimes(0)

    fireEvent.change(select, {
      target: { value: newValue },
    })
    expect(select).toHaveValue('three')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('Can select multiple elements', () => {
    const label = 'Select label'
    render(
      <NativeSelect label={label} id="testMultiple" multiple>
        <option>Option one</option>
        <option>Option two</option>
        <option>Option three</option>
      </NativeSelect>,
    )
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toHaveAttribute('multiple')
  })

  const StyledSelect = styled(NativeSelect)`
    clip-path: unset;
  `
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledSelect label="test" id="testId" />)
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
})
