import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { TextField } from './TextField'

describe('TextField (Next EDS 2.0)', () => {
  it('Matches snapshot', () => {
    const { container } = render(
      <TextField
        label="Label"
        description="Description text"
        placeholder="Placeholder"
        helperMessage="Helper message"
      />,
    )
    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('Should pass a11y test', async () => {
      const { container } = render(
        <TextField label="Label" placeholder="Placeholder" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('Should pass a11y test when invalid', async () => {
      const { container } = render(
        <TextField
          label="Label"
          placeholder="Placeholder"
          invalid
          helperMessage="Error message"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('Should pass a11y test when disabled', async () => {
      const { container } = render(
        <TextField label="Label" placeholder="Placeholder" disabled />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('Should pass a11y test with labelInfo', async () => {
      const { container } = render(
        <TextField
          label="Label"
          labelInfo="Additional information"
          placeholder="Placeholder"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Basic functionality', () => {
    it('Renders label correctly', () => {
      render(<TextField label="Test Label" />)
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('Renders indicator text', () => {
      render(<TextField label="Label" indicator="(Optional)" />)
      expect(screen.getByText('(Optional)')).toBeInTheDocument()
    })

    it('Renders required indicator', () => {
      render(<TextField label="Label" indicator="(Required)" />)
      expect(screen.getByText('(Required)')).toBeInTheDocument()
    })

    it('Sets required attribute on input when required prop is true', () => {
      render(<TextField label="Label" indicator="(Required)" required />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
    })

    it('Visual indicator is separate from HTML required attribute', () => {
      render(<TextField label="Label" indicator="(Optional)" required />)
      // Shows "(Optional)" text but input is still required
      expect(screen.getByText('(Optional)')).toBeInTheDocument()
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
    })

    it('Renders description', () => {
      render(<TextField label="Label" description="Description text" />)
      expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    it('Renders helper message', () => {
      render(<TextField label="Label" helperMessage="Helper text" />)
      expect(screen.getByText('Helper text')).toBeInTheDocument()
    })

    it('Connects label to input via htmlFor', () => {
      render(<TextField label="Label" id="test-id" />)
      // getByRole with name verifies label is properly connected to input
      const input = screen.getByRole('textbox', { name: 'Label' })
      expect(input).toHaveAttribute('id', 'test-id-input')
    })

    it('Generates id when not provided', () => {
      render(<TextField label="Label" />)
      // getByRole with name verifies label is properly connected to input
      const input = screen.getByRole('textbox', { name: 'Label' })
      expect(input).toHaveAttribute('id')
    })
  })

  describe('Label info button', () => {
    it('Renders info button when labelInfo is provided', () => {
      render(<TextField label="Label" labelInfo="Additional info" />)
      expect(
        screen.getByRole('button', { name: 'More information' }),
      ).toBeInTheDocument()
    })

    it('Does not render info button when labelInfo is not provided', () => {
      render(<TextField label="Label" />)
      expect(
        screen.queryByRole('button', { name: 'More information' }),
      ).not.toBeInTheDocument()
    })

    it('Shows tooltip on hover', async () => {
      const user = userEvent.setup()
      render(<TextField label="Label" labelInfo="Hover tooltip content" />)
      const infoButton = screen.getByRole('button', {
        name: 'More information',
      })
      await user.hover(infoButton)
      expect(await screen.findByRole('tooltip')).toBeInTheDocument()
      expect(screen.getByText('Hover tooltip content')).toBeInTheDocument()
    })

    it('Shows tooltip on focus', async () => {
      render(<TextField label="Label" labelInfo="Focus tooltip content" />)
      const infoButton = screen.getByRole('button', {
        name: 'More information',
      })
      infoButton.focus()
      expect(infoButton).toHaveFocus()
      expect(await screen.findByRole('tooltip')).toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('Applies invalid state to input', () => {
      render(<TextField label="Label" invalid />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInvalid()
    })

    it('Applies disabled state', () => {
      render(<TextField label="Label" disabled />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('Applies readOnly state', () => {
      render(<TextField label="Label" readOnly />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('readonly')
    })
  })
})
