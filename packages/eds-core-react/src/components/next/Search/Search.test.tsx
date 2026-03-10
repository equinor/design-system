import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Search } from '.'

describe('Search (next)', () => {
  describe('Rendering', () => {
    it('renders a searchbox', () => {
      render(<Search />)
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    it('associates label with input', () => {
      render(<Search label="Search label" />)
      expect(
        screen.getByRole('searchbox', { name: 'Search label' }),
      ).toBeInTheDocument()
    })

    it('forwards ref to the input element', () => {
      const ref = { current: null as HTMLInputElement | null }
      render(<Search ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('Clear button', () => {
    it('is hidden when input is empty', () => {
      render(<Search />)
      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
      ).not.toBeInTheDocument()
    })

    it('appears after typing in uncontrolled input', async () => {
      const user = userEvent.setup()
      render(<Search />)
      await user.type(screen.getByRole('searchbox'), 'hello')
      expect(
        screen.getByRole('button', { name: 'Clear search' }),
      ).toBeInTheDocument()
    })

    it('appears when controlled input has a value', () => {
      render(<Search value="hello" onChange={() => {}} />)
      expect(
        screen.getByRole('button', { name: 'Clear search' }),
      ).toBeInTheDocument()
    })

    it('clears uncontrolled input and returns focus on click', async () => {
      const user = userEvent.setup()
      render(<Search defaultValue="hello" />)
      await user.click(screen.getByRole('button', { name: 'Clear search' }))
      expect(screen.getByRole('searchbox')).toHaveValue('')
      expect(screen.getByRole('searchbox')).toHaveFocus()
    })

    it('calls onClear on click', async () => {
      const onClear = jest.fn()
      const user = userEvent.setup()
      render(<Search defaultValue="hello" onClear={onClear} />)
      await user.click(screen.getByRole('button', { name: 'Clear search' }))
      expect(onClear).toHaveBeenCalledTimes(1)
    })

    it('is hidden when disabled', () => {
      render(<Search value="hello" onChange={() => {}} disabled />)
      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
      ).not.toBeInTheDocument()
    })

    it('is hidden when readOnly', () => {
      render(<Search value="hello" onChange={() => {}} readOnly />)
      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has no violations with a label', async () => {
      const { container } = render(<Search label="Search" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no violations with aria-label instead of label', async () => {
      const { container } = render(<Search aria-label="Search resources" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no violations in invalid state', async () => {
      const { container } = render(
        <Search label="Search" invalid helperMessage="Error message" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('associates helper message via aria-describedby', () => {
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
