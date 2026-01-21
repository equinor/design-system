import { useState, createRef } from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Switch } from './Switch'

type ControlledProps = {
  onChange: () => void
}

const ControlledSwitch = ({ onChange }: ControlledProps) => {
  const [checked, setChecked] = useState(true)
  return (
    <Switch
      label="switch-label"
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked)
        onChange()
      }}
    />
  )
}

describe('Switch (next)', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<Switch label="Enable notifications" />)
      expect(screen.getByLabelText('Enable notifications')).toBeInTheDocument()
    })

    it('renders without label using aria-label', () => {
      render(<Switch aria-label="Toggle setting" />)
      expect(screen.getByLabelText('Toggle setting')).toBeInTheDocument()
    })

    it('has role="switch"', () => {
      render(<Switch label="Toggle" />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    it('can extend the css for the component', () => {
      render(
        <Switch
          label="switch-test"
          className="custom-switch"
          style={{ clipPath: 'unset' }}
        />,
      )
      const switchEl = screen.getByLabelText('switch-test')
      expect(switchEl).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = switchEl.closest('.eds-switch')
      expect(wrapper).toHaveClass('custom-switch')
    })
  })

  describe('Accessibility', () => {
    it('should pass a11y test with label', async () => {
      const { container } = render(<Switch label="switch-test" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('should pass a11y test with aria-label', async () => {
      const { container } = render(<Switch aria-label="switch-test" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('should connect helperMessage to input via aria-describedby', () => {
      render(<Switch label="Test Label" helperMessage="Helper text for a11y" />)

      const switchEl = screen.getByRole('switch')
      const helperMessage = screen.getByText('Helper text for a11y')

      expect(switchEl).toHaveAttribute('aria-describedby', helperMessage.id)
    })
  })

  describe('Interaction', () => {
    it('can be toggled on and off', () => {
      render(<Switch label="Toggle me" />)
      const switchEl = screen.getByLabelText('Toggle me')

      expect(switchEl).not.toBeChecked()
      fireEvent.click(switchEl)
      expect(switchEl).toBeChecked()
      fireEvent.click(switchEl)
      expect(switchEl).not.toBeChecked()
    })

    it('can be a controlled component', () => {
      const handleChange = jest.fn()
      render(<ControlledSwitch onChange={handleChange} />)
      const switchEl = screen.getByLabelText('switch-label')

      expect(switchEl).toBeChecked()
      expect(handleChange).toHaveBeenCalledTimes(0)

      fireEvent.click(switchEl)
      expect(switchEl).not.toBeChecked()
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('can be disabled', async () => {
      render(<Switch label="Disabled switch" disabled />)
      const switchEl = screen.getByLabelText('Disabled switch')

      expect(switchEl).not.toBeChecked()
      await userEvent.click(switchEl)
      expect(switchEl).not.toBeChecked()
    })

    it('can be set as default checked', () => {
      render(<Switch label="Default checked" defaultChecked />)
      const switchEl = screen.getByLabelText('Default checked')
      expect(switchEl).toBeChecked()
    })

    it('can be toggled with Space key', async () => {
      render(<Switch label="Keyboard toggle" />)
      const switchEl = screen.getByLabelText('Keyboard toggle')

      expect(switchEl).not.toBeChecked()
      switchEl.focus()
      await userEvent.keyboard(' ')
      expect(switchEl).toBeChecked()
    })

    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>()
      render(<Switch label="Ref test" ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current?.tagName).toBe('INPUT')
    })
  })

  describe('Props', () => {
    it('supports indicator prop', () => {
      render(<Switch label="Test Label" indicator="(Required)" />)
      expect(screen.getByText('(Required)')).toBeInTheDocument()
    })

    it('supports helperMessage prop', () => {
      render(
        <Switch label="Test Label" helperMessage="This is a helper message" />,
      )
      expect(screen.getByText('This is a helper message')).toBeInTheDocument()
    })

    it('applies disabled state correctly', () => {
      render(<Switch label="Disabled switch" disabled />)
      const switchEl = screen.getByLabelText('Disabled switch')
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = switchEl.closest('.eds-switch')
      expect(wrapper).toHaveAttribute('data-disabled', 'true')
    })

    it('applies data-* attributes to input element', () => {
      render(
        <Switch
          label="Test Label"
          data-testid="test-switch"
          data-analytics="track-switch"
        />,
      )

      const input = screen.getByRole('switch')
      expect(input).toHaveAttribute('data-testid', 'test-switch')
      expect(input).toHaveAttribute('data-analytics', 'track-switch')
    })
  })
})
