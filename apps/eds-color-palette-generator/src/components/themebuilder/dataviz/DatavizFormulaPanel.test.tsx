// @vitest-environment jsdom
import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DatavizFormulaPanel } from './DatavizFormulaPanel'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TS_DATAVIZ, TS_DATAVIZ_FORMULA } from '@/config/tokensStudio'

const region = () =>
  screen.getByRole('region', { name: 'EDS categorical ramps' })

const status = () => within(region()).getByRole('status')

describe('DatavizFormulaPanel', () => {
  describe('Rendering', () => {
    it('shows one row per category with the Tokens Studio values', () => {
      renderWithProviders(<DatavizFormulaPanel />)

      const rows = screen.getAllByTestId('dataviz-formula-row')
      expect(rows).toHaveLength(TS_DATAVIZ_FORMULA.bases.length)
      for (let step = 1; step <= 5; step++) {
        expect(
          within(rows[0]).getByText(TS_DATAVIZ.light[`dataviz.cat.1.${step}`]),
        ).toBeInTheDocument()
      }
      expect(status()).toHaveTextContent(
        'All 100 values match the Tokens Studio export.',
      )
    })

    it('follows the page scheme until a scheme is picked', () => {
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'dark' })

      const rows = screen.getAllByTestId('dataviz-formula-row')
      expect(
        within(rows[0]).getByText(TS_DATAVIZ.dark['dataviz.cat.1.1']),
      ).toBeInTheDocument()
    })
  })

  describe('Behaviour', () => {
    it('shows the other scheme when it is picked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })

      await user.click(screen.getByRole('radio', { name: 'Dark' }))

      const rows = screen.getAllByTestId('dataviz-formula-row')
      expect(
        within(rows[0]).getByText(TS_DATAVIZ.dark['dataviz.cat.1.1']),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: 'Inputs for the dark scheme' }),
      ).toBeInTheDocument()
    })

    it('marks a changed weight as a proposal and resets to Tokens Studio', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })
      const reset = screen.getByRole('button', {
        name: 'Reset to Tokens Studio',
      })
      expect(reset).toBeDisabled()

      fireEvent.change(
        screen.getByRole('spinbutton', {
          name: /Step 1 weight/,
        }),
        { target: { value: '0.5' } },
      )

      expect(status()).toHaveTextContent('Proposal')
      expect(status()).toHaveTextContent(
        '1 input differs from Tokens Studio, and 10 of 100 values change.',
      )
      expect(
        screen.getByText(
          `Tokens Studio: ${TS_DATAVIZ_FORMULA.weight.light[1]}`,
        ),
      ).toBeInTheDocument()
      const rows = screen.getAllByTestId('dataviz-formula-row')
      expect(
        within(rows[0]).queryByText(TS_DATAVIZ.light['dataviz.cat.1.1']),
      ).not.toBeInTheDocument()

      await user.click(reset)

      expect(status()).toHaveTextContent(
        'All 100 values match the Tokens Studio export.',
      )
    })

    it('changes a base colour in both schemes', () => {
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })

      fireEvent.change(screen.getByLabelText('Base colour of cat.1'), {
        target: { value: '#336699' },
      })

      expect(status()).toHaveTextContent(
        '1 input differs from Tokens Studio, and 10 of 100 values change.',
      )
      expect(
        screen.getByText(`Tokens Studio: ${TS_DATAVIZ_FORMULA.bases[0]}`),
      ).toBeInTheDocument()
    })
  })
})
