import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { NativeSelect } from '.'

const elements = ['Aluminium', 'Copper', 'Iron', 'Lead']

describe('NativeSelect (next)', () => {
  describe('Rendering', () => {
    it('renders a select element', () => {
      render(<NativeSelect label="Element" options={elements} />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders all options', () => {
      render(<NativeSelect label="Element" options={elements} />)
      expect(screen.getAllByRole('option')).toHaveLength(elements.length)
    })

    it('renders option labels for object options', () => {
      type Well = { id: string; name: string }
      const wells: Well[] = [
        { id: 'w1', name: 'Gullfaks A' },
        { id: 'w2', name: 'Statfjord B' },
      ]
      render(
        <NativeSelect
          label="Well"
          options={wells}
          getOptionLabel={(o) => o.name}
          getOptionValue={(o) => o.id}
        />,
      )
      expect(
        screen.getByRole('option', { name: 'Gullfaks A' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('option', { name: 'Statfjord B' }),
      ).toBeInTheDocument()
    })

    it('renders label', () => {
      render(<NativeSelect label="Element" options={elements} />)
      expect(screen.getByLabelText('Element')).toBeInTheDocument()
    })

    it('renders helper message', () => {
      render(
        <NativeSelect
          label="Element"
          options={elements}
          helperMessage="Pick one"
        />,
      )
      expect(screen.getByText('Pick one')).toBeInTheDocument()
    })

    it('disables specific options via optionDisabled', () => {
      render(
        <NativeSelect
          label="Element"
          options={elements}
          optionDisabled={(o) => o === 'Lead'}
        />,
      )
      expect(screen.getByRole('option', { name: 'Lead' })).toBeDisabled()
      expect(screen.getByRole('option', { name: 'Copper' })).not.toBeDisabled()
    })
  })

  describe('States', () => {
    it('disables the select when disabled', () => {
      render(<NativeSelect label="Element" options={elements} disabled />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('disables the select when readOnly', () => {
      render(<NativeSelect label="Element" options={elements} readOnly />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('marks the select as invalid', () => {
      render(<NativeSelect label="Element" options={elements} invalid />)
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-invalid',
        'true',
      )
    })
  })

  describe('Accessibility', () => {
    it('passes axe', async () => {
      const { container } = render(
        <NativeSelect label="Element" options={elements} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe in invalid state', async () => {
      const { container } = render(
        <NativeSelect
          label="Element"
          options={elements}
          invalid
          helperMessage="Required"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe in disabled state', async () => {
      const { container } = render(
        <NativeSelect label="Element" options={elements} disabled />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
