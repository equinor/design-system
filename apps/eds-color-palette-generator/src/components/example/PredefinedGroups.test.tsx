// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { stepLabel } from '@/config/config'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import { EXAMPLE_GROUPS } from './exampleGroups'
import { PredefinedGroups } from './PredefinedGroups'

const PALETTE = tokensStudioPalettes('light')[0]

function groupSection(title: string) {
  const section = screen
    .getByRole('heading', { level: 2, name: title })
    .closest('section')
  if (!section) throw new Error(`No section for ${title}`)
  return section
}

describe('PredefinedGroups', () => {
  describe('Rendering', () => {
    it('renders a heading and description for every group', () => {
      render(<PredefinedGroups palette={PALETTE} />)

      for (const group of EXAMPLE_GROUPS) {
        expect(
          within(groupSection(group.title)).getByText(group.description),
        ).toBeInTheDocument()
      }
    })

    it('renders one card per pairing, labelled with the steps', () => {
      render(<PredefinedGroups palette={PALETTE} />)

      for (const group of EXAMPLE_GROUPS) {
        const section = groupSection(group.title)
        const samples = within(section).queryAllByText(/^(Aa|Placeholder)$/)
        expect(samples).toHaveLength(group.pairings.length)
        for (const pairing of group.pairings) {
          expect(
            within(section).getAllByText(stepLabel(pairing.fg)).length,
          ).toBeGreaterThan(0)
          expect(
            within(section).getAllByText(stepLabel(pairing.bg)).length,
          ).toBeGreaterThan(0)
        }
      }
    })

    it('previews borders as outlines and text as a sample', () => {
      render(<PredefinedGroups palette={PALETTE} />)

      for (const group of EXAMPLE_GROUPS) {
        const section = groupSection(group.title)
        const borders = group.pairings.filter((p) => p.type === 'border')
        expect(within(section).queryAllByText('Placeholder')).toHaveLength(
          borders.length,
        )
        expect(within(section).queryAllByText('Aa')).toHaveLength(
          group.pairings.length - borders.length,
        )
      }
    })
  })
})
