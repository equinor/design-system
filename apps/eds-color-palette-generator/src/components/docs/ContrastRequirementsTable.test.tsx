// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PALETTE_STEPS } from '@/config/config'
import { ContrastRequirementsTable } from './ContrastRequirementsTable'

const STEPS_WITH_REQUIREMENTS = PALETTE_STEPS.filter(
  (step) => step.contrastWith && step.contrastWith.length > 0,
)

function cardFor(step: (typeof PALETTE_STEPS)[number]) {
  const heading = screen.getByRole('heading', {
    level: 3,
    name: `${step.name} · ${step.label}`,
  })
  const card = heading.closest('.rounded')
  if (!(card instanceof HTMLElement)) throw new Error('No card')
  return card
}

describe('ContrastRequirementsTable', () => {
  describe('Rendering', () => {
    it('renders one card per step with a contrast requirement', () => {
      render(<ContrastRequirementsTable />)

      expect(STEPS_WITH_REQUIREMENTS.length).toBeGreaterThan(0)
      expect(
        screen
          .getAllByRole('heading', { level: 3 })
          .map((heading) => heading.textContent),
      ).toEqual(
        STEPS_WITH_REQUIREMENTS.map((step) => `${step.name} · ${step.label}`),
      )
    })

    it('shows the primary role and the lightness of each step', () => {
      render(<ContrastRequirementsTable />)

      for (const step of STEPS_WITH_REQUIREMENTS) {
        const card = cardFor(step)
        if (step.primaryRole) {
          expect(within(card).getByText(step.primaryRole)).toBeInTheDocument()
        }
        expect(card).toHaveTextContent(
          `Light mode: L = ${step.lightValue.toFixed(3)}`,
        )
        expect(card).toHaveTextContent(
          `Dark mode: L = ${step.darkValue.toFixed(3)}`,
        )
      }
    })
  })

  describe('Requirements', () => {
    it('shows the pairing, the target step and the APCA Lc of each requirement', () => {
      render(<ContrastRequirementsTable />)

      for (const step of STEPS_WITH_REQUIREMENTS) {
        const card = cardFor(step)
        for (const requirement of step.contrastWith ?? []) {
          const target = PALETTE_STEPS.find(
            (s) => s.id === requirement.targetStep,
          )
          expect(within(card).getByText(requirement.pairing)).toBeVisible()
          expect(card).toHaveTextContent(`${target?.name} · ${target?.label}`)
          expect(card).toHaveTextContent(`APCA Lc ${requirement.lc.value}:`)
          expect(
            within(card).getAllByText(requirement.lc.description).length,
          ).toBeGreaterThan(0)
        }
      }
    })

    it('shows the WCAG 2.1 ratio for reference', () => {
      render(<ContrastRequirementsTable />)

      for (const step of STEPS_WITH_REQUIREMENTS) {
        const card = cardFor(step)
        for (const requirement of step.contrastWith ?? []) {
          expect(card).toHaveTextContent(`WCAG ${requirement.wcag.value}:1:`)
          expect(
            within(card).getAllByText(requirement.wcag.description).length,
          ).toBeGreaterThan(0)
        }
      }
    })
  })

  describe('Accessibility', () => {
    it('expands the APCA and WCAG abbreviations', () => {
      render(<ContrastRequirementsTable />)

      for (const abbr of screen.getAllByText('APCA')) {
        expect(abbr).toHaveAttribute(
          'title',
          'Accessible Perceptual Contrast Algorithm',
        )
      }
      for (const abbr of screen.getAllByText('WCAG')) {
        expect(abbr).toHaveAttribute(
          'title',
          'Web Content Accessibility Guidelines',
        )
      }
    })
  })
})
