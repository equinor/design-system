import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { TextField } from './TextField'

describe('TextField (Next EDS 2.0)', () => {
  it('Matches snapshot', () => {
    const { container } = render(
      <TextField
        label="Label"
        description="Description text"
        placeholder="Placeholder"
        validationMessage="Validation message"
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
          validationMessage="Error message"
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
  })

  describe('Basic functionality', () => {
    it('Renders label correctly', () => {
      render(<TextField label="Test Label" />)
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('Renders optional label', () => {
      render(<TextField label="Label" optional />)
      expect(screen.getByText('(Optional)')).toBeInTheDocument()
    })

    it('Renders required label', () => {
      render(<TextField label="Label" required />)
      expect(screen.getByText('(Required)')).toBeInTheDocument()
    })

    it('Sets required attribute with requiredSilent but does not show indicator', () => {
      render(<TextField label="Label" requiredSilent />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
      expect(screen.queryByText('(Required)')).not.toBeInTheDocument()
    })

    it('Renders description', () => {
      render(<TextField label="Label" description="Description text" />)
      expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    it('Renders validation message', () => {
      render(<TextField label="Label" validationMessage="Validation text" />)
      expect(screen.getByText('Validation text')).toBeInTheDocument()
    })

    it('Connects label to input via htmlFor', () => {
      render(<TextField label="Label" id="test-id" />)
      // getByRole with name verifies label is properly connected to input
      const input = screen.getByRole('textbox', { name: 'Label' })
      expect(input).toHaveAttribute('id', 'test-id')
    })

    it('Generates id when not provided', () => {
      render(<TextField label="Label" />)
      // getByRole with name verifies label is properly connected to input
      const input = screen.getByRole('textbox', { name: 'Label' })
      expect(input).toHaveAttribute('id')
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
