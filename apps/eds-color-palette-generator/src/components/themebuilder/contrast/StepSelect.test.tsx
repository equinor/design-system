// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepSelect } from './StepSelect'
import { stepLabel, stepsWithRole } from '@/config/config'
import { STEP_COUNT } from '@/config/tokensStudio'

const optionNames = (select: HTMLElement) =>
  within(select)
    .getAllByRole('option')
    .map((o) => o.textContent)

describe('StepSelect', () => {
  describe('Rendering', () => {
    it('offers every step under its label', () => {
      render(<StepSelect label="fg" value={12} onChange={vi.fn()} />)

      const select = screen.getByRole('combobox', { name: 'fg' })
      expect(optionNames(select)).toEqual(
        Array.from({ length: STEP_COUNT }, (_, i) => stepLabel(i + 1)),
      )
      expect(select).toHaveDisplayValue(stepLabel(13))
    })

    it('offers only the steps a role group uses', () => {
      render(
        <StepSelect label="Text" value={12} onChange={vi.fn()} only="text" />,
      )

      expect(
        optionNames(screen.getByRole('combobox', { name: 'Text' })),
      ).toEqual(stepsWithRole('text').map((step) => stepLabel(step.step)))
    })

    it('puts recommended steps in their own group', () => {
      render(
        <StepSelect
          label="bg"
          value={0}
          onChange={vi.fn()}
          recommended={[0, 14]}
        />,
      )

      const select = screen.getByRole('combobox', { name: 'bg' })
      const recommended = within(select).getByRole('group', {
        name: 'Recommended',
      })
      expect(optionNames(recommended)).toEqual([stepLabel(1), stepLabel(15)])
      const other = within(select).getByRole('group', { name: 'Other' })
      expect(optionNames(other)).toHaveLength(STEP_COUNT - 2)
    })
  })

  describe('Behaviour', () => {
    it('calls onChange with the 0-based step index', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<StepSelect label="fg" value={12} onChange={onChange} />)

      await user.selectOptions(
        screen.getByRole('combobox', { name: 'fg' }),
        stepLabel(9),
      )

      expect(onChange).toHaveBeenCalledWith(8)
    })
  })
})
