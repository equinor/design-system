/* eslint-disable no-undef */

import React, { useState } from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import userEvent from '@testing-library/user-event'
import styled from 'styled-components'

import { Checkbox } from './Checkbox'

afterEach(cleanup)

const StyledCheckbox = styled(Checkbox)`
  clip-path: unset;
`

type ControlledProps = {
  onChange: () => void
}

const ControlledCheckbox = ({ onChange }: ControlledProps) => {
  const [checked, setChecked] = useState(true)
  return (
    <Checkbox
      label="checkbox-label"
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked)
        onChange()
      }}
    />
  )
}

describe('Checkbox', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledCheckbox label="checkbox-test" />)
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
  it('Has provided label', () => {
    const label = 'Checkbox label'
    render(<Checkbox label={label} />)
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDefined()
  })
  it('Can be selected', () => {
    const labelText = 'Checkbox label'
    const { getByLabelText } = render(<Checkbox label={labelText} />)
    const checkbox = getByLabelText(labelText)
    expect(checkbox).not.toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })
  it('Can be a controlled component', () => {
    const handleChange = jest.fn()
    render(<ControlledCheckbox onChange={handleChange} />)
    const checkbox = screen.queryByLabelText('checkbox-label')

    expect(checkbox).toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(0)

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
  it('Can be disabeld', () => {
    const { getByLabelText } = render(
      <div>
        <Checkbox label="Checkbox one" disabled />
      </div>,
    )
    const one = getByLabelText('Checkbox one')
    expect(one).not.toBeChecked()
    userEvent.click(one)
    expect(one).not.toBeChecked()
  })
})
