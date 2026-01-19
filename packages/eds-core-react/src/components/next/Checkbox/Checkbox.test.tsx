/* eslint-disable no-undef */
import { useState } from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Checkbox } from './Checkbox'

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

describe('Checkbox.new', () => {
  // it('Matches snapshot', () => {
  //   const { asFragment } = render(<Checkbox label={'checkbox'} />)
  //   expect(asFragment()).toMatchSnapshot()
  // }) TODO: Open when ready to merge

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
    render(
      <Checkbox
        label="checkbox-test"
        className="custom-checkbox"
        style={{ clipPath: 'unset' }}
      />,
    )
    const checkbox = screen.getByLabelText('checkbox-test')
    expect(checkbox).toBeInTheDocument()
    // eslint-disable-next-line testing-library/no-node-access
    const label = checkbox.closest('.eds-checkbox')
    expect(label).toHaveClass('custom-checkbox')
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
    const checkbox = screen.getByLabelText('checkbox-label')

    expect(checkbox).toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(0)

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('Can be disabled', async () => {
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

  it('Can be indeterminate', () => {
    render(<Checkbox label="Indeterminate checkbox" indeterminate />)
    const checkbox = screen.getByRole('checkbox', {
      name: 'Indeterminate checkbox',
    })
    expect(checkbox).toHaveAttribute('data-indeterminate', 'true')
  })

  it('Renders without label', () => {
    render(<Checkbox aria-label="No visible label" />)
    const checkbox = screen.getByLabelText('No visible label')
    expect(checkbox).toBeInTheDocument()
  })

  it('Applies disabled classes correctly', () => {
    render(<Checkbox label="Disabled checkbox" disabled />)
    const checkbox = screen.getByLabelText('Disabled checkbox')
    // eslint-disable-next-line testing-library/no-node-access
    const label = checkbox.closest('.eds-checkbox')
    expect(label).toHaveAttribute('data-disabled', 'true')
  })

  it('should apply data-* attributes to input element when using label', () => {
    render(
      <Checkbox
        label="Test Label"
        data-testid="test-checkbox"
        data-analytics="track-checkbox"
      />,
    )

    const input = screen.getByRole('checkbox')
    expect(input).toHaveAttribute('data-testid', 'test-checkbox')
    expect(input).toHaveAttribute('data-analytics', 'track-checkbox')
  })

  it('should apply labelProps to label element', () => {
    const { container } = render(
      <Checkbox
        label="Test Label"
        data-testid="test-checkbox-input"
        labelProps={
          {
            'data-testid': 'test-checkbox-label',
            'data-analytics': 'checkbox-wrapper',
          } as React.LabelHTMLAttributes<HTMLLabelElement>
        }
      />,
    )

    const input = screen.getByRole('checkbox')
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const label = container.querySelector('[data-testid="test-checkbox-label"]')

    expect(input).toHaveAttribute('data-testid', 'test-checkbox-input')
    expect(label).toHaveAttribute('data-testid', 'test-checkbox-label')
    expect(label).toHaveAttribute('data-analytics', 'checkbox-wrapper')
  })
})
