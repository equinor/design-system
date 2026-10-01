// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PALETTE_STEPS } from '@/config/config'
import { STEP_COUNT, TS_SCALE } from '@/config/tokensStudio'
import { AboutStepRoles } from './AboutStepRoles'

const TABLE_NAME = 'The 15 steps with their lightness and Tokens Studio roles'

function bodyRows() {
  const table = screen.getByRole('table', { name: TABLE_NAME })
  const [, body] = within(table).getAllByRole('rowgroup')
  return within(body).getAllByRole('row')
}

describe('AboutStepRoles', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      render(<AboutStepRoles />)

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'The 15 steps',
      })
      expect(heading.closest('section')).toHaveAttribute('id', 'steps')
    })

    it('has a column for the step, both lightness values and the roles', () => {
      render(<AboutStepRoles />)

      const headers = screen
        .getAllByRole('columnheader')
        .map((header) => header.textContent)
      expect(headers).toEqual([
        'Step',
        'Light L',
        'Dark L',
        'Tokens Studio roles',
      ])
    })

    it('renders one row per step', () => {
      render(<AboutStepRoles />)

      expect(bodyRows()).toHaveLength(STEP_COUNT)
    })
  })

  describe('Tokens Studio values', () => {
    it('shows the Tokens Studio lightness of every step in both modes', () => {
      render(<AboutStepRoles />)

      bodyRows().forEach((row, i) => {
        const [light, dark] = within(row).getAllByRole('cell')
        expect(light).toHaveTextContent(TS_SCALE.light[i].toFixed(3))
        expect(dark).toHaveTextContent(TS_SCALE.dark[i].toFixed(3))
      })
    })

    it('names each step by its number and label', () => {
      render(<AboutStepRoles />)

      bodyRows().forEach((row, i) => {
        const step = PALETTE_STEPS[i]
        expect(within(row).getByRole('rowheader')).toHaveTextContent(
          `${step.step} ${step.label}`,
        )
      })
    })

    it('lists the roles of every step', () => {
      render(<AboutStepRoles />)

      bodyRows().forEach((row, i) => {
        const roles = PALETTE_STEPS[i].roles
        if (roles.length === 0) return
        const [, , rolesCell] = within(row).getAllByRole('cell')
        const items = within(rolesCell)
          .getAllByRole('listitem')
          .map((item) => item.textContent)
        expect(items).toEqual(roles)
      })
    })

    it('shows "No semantic role" for the steps without a role', () => {
      render(<AboutStepRoles />)

      const withoutRole = PALETTE_STEPS.filter(
        (step) => step.roles.length === 0,
      ).map((step) => step.step)
      expect(withoutRole.length).toBeGreaterThan(0)

      bodyRows().forEach((row, i) => {
        const [, , rolesCell] = within(row).getAllByRole('cell')
        const hasNoRole = withoutRole.includes(i + 1)
        expect(rolesCell.textContent === 'No semantic role').toBe(hasNoRole)
        expect(within(rolesCell).queryByRole('list') === null).toBe(hasNoRole)
      })
    })
  })

  describe('Accessibility', () => {
    it('names the table with its caption and uses row headers', () => {
      render(<AboutStepRoles />)

      expect(
        screen.getByRole('table', { name: TABLE_NAME }),
      ).toBeInTheDocument()
      expect(screen.getAllByRole('rowheader')).toHaveLength(STEP_COUNT)
    })
  })
})
