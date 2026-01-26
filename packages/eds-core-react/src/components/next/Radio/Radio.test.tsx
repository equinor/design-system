import { useState } from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Radio } from './Radio'

type ControlledProps = {
  onChange: () => void
}

const ControlledRadio = ({ onChange }: ControlledProps) => {
  const [selected, setSelected] = useState('option1')
  return (
    <>
      <Radio
        label="Option 1"
        id="controlled-1"
        name="controlled"
        value="option1"
        checked={selected === 'option1'}
        onChange={(e) => {
          setSelected(e.target.value)
          onChange()
        }}
      />
      <Radio
        label="Option 2"
        id="controlled-2"
        name="controlled"
        value="option2"
        checked={selected === 'option2'}
        onChange={(e) => {
          setSelected(e.target.value)
          onChange()
        }}
      />
    </>
  )
}

describe('Radio (next)', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Radio label="radio" name="test" />)
    expect(asFragment()).toMatchSnapshot()
  })

  describe('Rendering', () => {
    it('renders with provided label', () => {
      const label = 'Radio label'
      render(<Radio label={label} name="test" />)
      const inputNode = screen.getByLabelText(label)
      expect(inputNode).toBeInTheDocument()
    })

    it('renders without visible label using aria-label', () => {
      render(<Radio aria-label="No visible label" name="test" />)
      const radio = screen.getByLabelText('No visible label')
      expect(radio).toBeInTheDocument()
    })

    it('extends css with custom className and style', () => {
      render(
        <Radio
          label="radio-test"
          name="test"
          className="custom-radio"
          style={{ clipPath: 'unset' }}
        />,
      )
      const radio = screen.getByLabelText('radio-test')
      expect(radio).toBeInTheDocument()
      expect(radio).toHaveClass('custom-radio')
    })

    it('applies data-* attributes to input element', () => {
      render(
        <Radio
          label="Test Label"
          name="test"
          data-testid="test-radio"
          data-analytics="track-radio"
        />,
      )

      const input = screen.getByRole('radio')
      expect(input).toHaveAttribute('data-testid', 'test-radio')
      expect(input).toHaveAttribute('data-analytics', 'track-radio')
    })
  })

  describe('Accessibility', () => {
    it('passes axe accessibility test', async () => {
      const { container } = render(<Radio label="radio-test" name="test" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe accessibility test with external label', async () => {
      const { container } = render(
        <>
          <label htmlFor="radio">Label text</label>
          <Radio id="radio" name="test" />
        </>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Interaction', () => {
    it('can be selected', () => {
      const labelText = 'Radio label'
      render(<Radio label={labelText} name="test" />)
      const radio = screen.getByLabelText(labelText)
      expect(radio).not.toBeChecked()
      fireEvent.click(radio)
      expect(radio).toBeChecked()
    })

    it('works as a controlled component', () => {
      const handleChange = jest.fn()
      render(<ControlledRadio onChange={handleChange} />)
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')

      expect(radio1).toBeChecked()
      expect(radio2).not.toBeChecked()
      expect(handleChange).toHaveBeenCalledTimes(0)

      fireEvent.click(radio2)
      expect(radio1).not.toBeChecked()
      expect(radio2).toBeChecked()
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('cannot be clicked when disabled', async () => {
      render(
        <div>
          <Radio label="Radio one" name="test" disabled />
        </div>,
      )
      const one = screen.getByLabelText('Radio one')
      expect(one).not.toBeChecked()
      await userEvent.click(one)
      expect(one).not.toBeChecked()
    })
  })

  describe('States', () => {
    it('applies disabled attribute to wrapper', () => {
      render(<Radio label="Disabled radio" name="test" disabled />)
      const radio = screen.getByLabelText('Disabled radio')
      // eslint-disable-next-line testing-library/no-node-access
      const label = radio.closest('.eds-radio')
      expect(label).toHaveAttribute('data-disabled', 'true')
    })
  })

  describe('Radio group behavior', () => {
    it('only one radio in a group can be selected', () => {
      render(
        <>
          <Radio label="Option 1" id="group-1" name="group" value="1" />
          <Radio label="Option 2" id="group-2" name="group" value="2" />
          <Radio label="Option 3" id="group-3" name="group" value="3" />
        </>,
      )

      const option1 = screen.getByLabelText('Option 1')
      const option2 = screen.getByLabelText('Option 2')
      const option3 = screen.getByLabelText('Option 3')

      fireEvent.click(option1)
      expect(option1).toBeChecked()
      expect(option2).not.toBeChecked()
      expect(option3).not.toBeChecked()

      fireEvent.click(option2)
      expect(option1).not.toBeChecked()
      expect(option2).toBeChecked()
      expect(option3).not.toBeChecked()
    })
  })
})
