// @vitest-environment jsdom
import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DatavizFormulaPanel } from './DatavizFormulaPanel'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TS_DATAVIZ, TS_DATAVIZ_FORMULA } from '@/config/tokensStudio'

const region = () =>
  screen.getByRole('region', { name: 'EDS categorical ramps' })

/** The visible line with the proposal state and the number of values */
const summaryLine = (text: string) => within(region()).getByText(text)

/** The live region, which screen readers announce */
const status = () => within(region()).getByRole('status')

const ALL_MATCH = 'All 100 values match the Tokens Studio export.'

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
      expect(summaryLine(ALL_MATCH)).toBeInTheDocument()
    })

    it('labels the number fields by their label alone, with the Tokens Studio value as description', () => {
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })

      const field = screen.getByRole('spinbutton', {
        name: 'Step 1 weight (towards white)',
      })
      expect(field).toHaveAccessibleName('Step 1 weight (towards white)')
      expect(field).toHaveAccessibleDescription('Tokens Studio value')
    })

    it('shows only the Lc goal for step 4 in a chart, as its 3:1 is the border requirement', () => {
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })

      expect(
        screen.getByRole('columnheader', { name: /Chart, step 4 on surface/ }),
      ).toHaveTextContent(/^Chart, step 4 on surfaceGoal Lc 45$/)
      expect(
        screen.getByRole('columnheader', { name: /Chart, step 3 on surface/ }),
      ).toHaveTextContent('Goal 3:1, Lc 30')
      const cells = within(
        screen.getAllByTestId('dataviz-formula-row')[0],
      ).getAllByRole('cell')
      const step4Chart = cells[cells.length - 1]
      expect(step4Chart).toHaveTextContent(/^Lc [\d.]+(Met|Below)$/)
    })

    it('marks the colour-blindness score as a goal, Met or Below', () => {
      // With the Tokens Studio values, dark step 4 is below the floor under
      // tritanopia, which is accepted
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'dark' })

      const heading = screen.getByRole('heading', {
        name: /Goal: series 1 to 5 apart under colour-vision deficiency/,
      })
      const section = within(heading.parentElement as HTMLElement)
      expect(section.getAllByText('Met').length).toBeGreaterThan(0)
      expect(section.getAllByText('Below').length).toBeGreaterThan(0)
      expect(section.queryByText('OK')).not.toBeInTheDocument()
      expect(section.queryByText('LOW')).not.toBeInTheDocument()
      // In the visible summary and in the live region
      const goal = /The colour-blindness goal is met in \d of 6 simulations/
      expect(screen.getAllByText(goal)).toHaveLength(2)
      expect(status()).toHaveTextContent(goal)
    })

    it('lets the table scroll sideways in a focusable region named by its caption', () => {
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })

      const scroller = screen.getByRole('region', {
        name: 'Categorical ramps and checks, light scheme',
      })
      expect(scroller).toHaveAttribute('tabindex', '0')
      expect(scroller).toHaveClass('overflow-x-auto')
      expect(within(scroller).getByRole('table')).toBeInTheDocument()
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

      expect(
        summaryLine(
          '1 input differs from Tokens Studio, and 10 of 100 values change.',
        ),
      ).toBeInTheDocument()
      expect(within(region()).getByText('Proposal')).toBeInTheDocument()
      expect(status()).toHaveTextContent(/^Proposal\./)
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

      expect(summaryLine(ALL_MATCH)).toBeInTheDocument()
      expect(status()).toHaveTextContent(/^Tokens Studio values\./)
    })

    it('lets a number field be cleared and retyped, and resets the typed text', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })
      const field = screen.getByRole('spinbutton', { name: /Step 1 weight/ })
      const tokensStudio = TS_DATAVIZ_FORMULA.weight.light[1]

      await user.clear(field)
      expect(field).toHaveDisplayValue('')
      // Nothing is sent up for an empty field
      expect(summaryLine(ALL_MATCH)).toBeInTheDocument()

      await user.type(field, '0.5')
      expect(field).toHaveDisplayValue('0.5')
      expect(
        summaryLine(
          '1 input differs from Tokens Studio, and 10 of 100 values change.',
        ),
      ).toBeInTheDocument()

      await user.click(
        screen.getByRole('button', { name: 'Reset to Tokens Studio' }),
      )
      expect(field).toHaveDisplayValue(String(tokensStudio))
      expect(summaryLine(ALL_MATCH)).toBeInTheDocument()
    })

    it('shows the value in use again when a cleared field loses focus', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })
      const field = screen.getByRole('spinbutton', { name: /Step 1 weight/ })

      await user.clear(field)
      await user.tab()

      expect(field).toHaveDisplayValue(
        String(TS_DATAVIZ_FORMULA.weight.light[1]),
      )
    })

    it('announces the proposal state and the pass counts, not every value', () => {
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })
      // Step 5 is not checked, so its weight changes no count
      const field = screen.getByRole('spinbutton', { name: /Step 5 weight/ })

      expect(status()).toHaveTextContent(/^Tokens Studio values\./)

      fireEvent.change(field, { target: { value: '0.5' } })
      const announced = status().textContent
      expect(announced).toMatch(/^Proposal\./)
      expect(announced).not.toMatch(/values change/)

      fireEvent.change(field, { target: { value: '0.6' } })
      expect(status().textContent).toBe(announced)
    })

    it('changes a base colour in both schemes', () => {
      renderWithProviders(<DatavizFormulaPanel />, { scheme: 'light' })

      fireEvent.change(screen.getByLabelText('Base colour of cat.1'), {
        target: { value: '#336699' },
      })

      expect(
        summaryLine(
          '1 input differs from Tokens Studio, and 10 of 100 values change.',
        ),
      ).toBeInTheDocument()
      expect(
        screen.getByText(`Tokens Studio: ${TS_DATAVIZ_FORMULA.bases[0]}`),
      ).toBeInTheDocument()
    })
  })
})
