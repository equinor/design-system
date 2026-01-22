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

describe('Checkbox (next)', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Checkbox label="checkbox" />)
    expect(asFragment()).toMatchSnapshot()
  })

  describe('Rendering', () => {
    it('renders with provided label', () => {
      const label = 'Checkbox label'
      render(<Checkbox label={label} />)
      const inputNode = screen.getByLabelText(label)
      expect(inputNode).toBeDefined()
    })

    it('renders without visible label using aria-label', () => {
      render(<Checkbox aria-label="No visible label" />)
      const checkbox = screen.getByLabelText('No visible label')
      expect(checkbox).toBeInTheDocument()
    })

    it('extends css with custom className and style', () => {
      render(
        <Checkbox
          label="checkbox-test"
          className="custom-checkbox"
          style={{ clipPath: 'unset' }}
        />,
      )
      const checkbox = screen.getByLabelText('checkbox-test')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).toHaveClass('custom-checkbox')
    })

    it('applies data-* attributes to input element', () => {
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
  })

  describe('Accessibility', () => {
    it('passes axe accessibility test', async () => {
      const { container } = render(<Checkbox label="checkbox-test" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe accessibility test with external label', async () => {
      const { container } = render(
        <>
          <label htmlFor="checkbox">Label text</label>
          <Checkbox id="checkbox" />
        </>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('connects helperMessage to input via aria-describedby', () => {
      render(
        <Checkbox label="Test Label" helperMessage="Helper text for a11y" />,
      )

      const checkbox = screen.getByRole('checkbox')
      const helperMessage = screen.getByText('Helper text for a11y')

      expect(checkbox).toHaveAttribute('aria-describedby', helperMessage.id)
    })
  })

  describe('Interaction', () => {
    it('can be selected', () => {
      const labelText = 'Checkbox label'
      render(<Checkbox label={labelText} />)
      const checkbox = screen.getByLabelText(labelText)
      expect(checkbox).not.toBeChecked()
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('works as a controlled component', () => {
      const handleChange = jest.fn()
      render(<ControlledCheckbox onChange={handleChange} />)
      const checkbox = screen.getByLabelText('checkbox-label')

      expect(checkbox).toBeChecked()
      expect(handleChange).toHaveBeenCalledTimes(0)

      fireEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('cannot be clicked when disabled', async () => {
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

  describe('States', () => {
    it('supports indeterminate state', () => {
      render(<Checkbox label="Indeterminate checkbox" indeterminate />)
      const checkbox = screen.getByRole('checkbox', {
        name: 'Indeterminate checkbox',
      })
      expect(checkbox).toHaveAttribute('data-indeterminate', 'true')
    })

    it('applies disabled attribute to wrapper', () => {
      render(<Checkbox label="Disabled checkbox" disabled />)
      const checkbox = screen.getByLabelText('Disabled checkbox')
      // eslint-disable-next-line testing-library/no-node-access
      const label = checkbox.closest('.eds-checkbox')
      expect(label).toHaveAttribute('data-disabled', 'true')
    })
  })

  describe('Field props', () => {
    it('supports indicator prop for required/optional text', () => {
      render(<Checkbox label="Test Label" indicator="(Required)" />)

      expect(screen.getByText('(Required)')).toBeInTheDocument()
    })

    it('supports helperMessage prop', () => {
      render(
        <Checkbox
          label="Test Label"
          helperMessage="This is a helper message"
        />,
      )

      expect(screen.getByText('This is a helper message')).toBeInTheDocument()
    })
  })

  describe('Color appearance', () => {
    it('defaults to accent color appearance', () => {
      render(<Checkbox label="Test Label" />)

      const checkbox = screen.getByRole('checkbox')
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = checkbox.closest('.eds-checkbox')
      expect(wrapper).toHaveAttribute('data-color-appearance', 'accent')
    })
  })
})
