/* eslint-disable no-undef */
import { useState } from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import styled from 'styled-components'

import { Checkbox } from './Checkbox'

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
  it('Matches snapshot', () => {
    const { asFragment } = render(<Checkbox label={'checkbox'} />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('should pass a11y test', async () => {
    const { container } = render(<Checkbox label="checkbox-test" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('should pass a11y test with external label', async () => {
    const { container } = render(
      <>
        <label htmlFor="checkbox">Label text</label>
        <Checkbox id="checkbox" />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Can extend the css for the component', () => {
    render(<StyledCheckbox label="checkbox-test" />)
    // eslint-disable-next-line testing-library/no-node-access
    const checkbox = screen.getByText('checkbox-test').parentElement
    expect(checkbox).toHaveStyleRule('clip-path', 'unset')
  })
  it('Has provided label', () => {
    const label = 'Checkbox label'
    render(<Checkbox label={label} />)
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDefined()
  })
  it('Can be selected', () => {
    const labelText = 'Checkbox label'
    render(<Checkbox label={labelText} />)
    const checkbox = screen.getByLabelText(labelText)
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
  it('Can be disabeld', async () => {
    render(
      <div>
        <Checkbox label="Checkbox one" disabled />
      </div>,
    )
    const one = screen.getByLabelText('Checkbox one')
    expect(one).not.toBeChecked()
    await userEvent.click(one)
    expect(one).not.toBeChecked()
  })
})
