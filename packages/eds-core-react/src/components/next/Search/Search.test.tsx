import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Search } from '.'

describe('Search (next)', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Search />)
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    it('renders with label', () => {
      render(<Search label="Search label" />)
      expect(screen.getByLabelText('Search label')).toBeInTheDocument()
    })

    it('renders with description', () => {
      render(<Search label="Search" description="Search description" />)
      expect(screen.getByText('Search description')).toBeInTheDocument()
    })

    it('renders with helper message', () => {
      render(<Search label="Search" helperMessage="Helper text" />)
      expect(screen.getByText('Helper text')).toBeInTheDocument()
    })

    it('renders with placeholder', () => {
      render(<Search placeholder="Search here" />)
      expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument()
    })

    it('forwards ref to input element', () => {
      const ref = { current: null as HTMLInputElement | null }
      render(<Search ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('spreads additional props to input', () => {
      render(<Search data-custom="value" />)
      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'data-custom',
        'value',
      )
    })
  })

  describe('Clear button', () => {
    it('does not show clear button when input is empty', () => {
      render(<Search />)
      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
      ).not.toBeInTheDocument()
    })

    it('shows clear button when uncontrolled input has value', async () => {
      const user = userEvent.setup()
      render(<Search />)
      await user.type(screen.getByRole('searchbox'), 'hello')
      expect(
        screen.getByRole('button', { name: 'Clear search' }),
      ).toBeInTheDocument()
    })

    it('shows clear button when controlled input has value', () => {
      render(<Search value="hello" onChange={() => {}} />)
      expect(
        screen.getByRole('button', { name: 'Clear search' }),
      ).toBeInTheDocument()
    })

    it('clears uncontrolled input when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<Search defaultValue="hello" />)
      await user.click(screen.getByRole('button', { name: 'Clear search' }))
      expect(screen.getByRole('searchbox')).toHaveValue('')
    })

    it('calls onClear when clear button is clicked', async () => {
      const onClear = jest.fn()
      const user = userEvent.setup()
      render(<Search defaultValue="hello" onClear={onClear} />)
      await user.click(screen.getByRole('button', { name: 'Clear search' }))
      expect(onClear).toHaveBeenCalledTimes(1)
    })

    it('does not show clear button when disabled', () => {
      render(<Search value="hello" onChange={() => {}} disabled />)
      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
      ).not.toBeInTheDocument()
    })

    it('does not show clear button when readOnly', () => {
      render(<Search value="hello" onChange={() => {}} readOnly />)
      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('renders disabled state', () => {
      render(<Search disabled />)
      expect(screen.getByRole('searchbox')).toBeDisabled()
    })

    it('renders invalid state', () => {
      render(<Search invalid />)
      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      )
    })

    it('renders readOnly state', () => {
      render(<Search readOnly />)
      expect(screen.getByRole('searchbox')).toHaveAttribute('readonly')
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Search label="Search" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations when invalid', async () => {
      const { container } = render(
        <Search label="Search" invalid helperMessage="Error message" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('helper message is associated via aria-describedby', () => {
      render(<Search label="Search" helperMessage="Helper text" />)
      const input = screen.getByRole('searchbox')
      const helper = screen.getByText('Helper text')
      expect(input).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining(helper.id),
      )
    })
  })
})
