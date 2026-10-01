// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { stepLabel } from '@/config/config'
import { APCA_FONT_ROWS, calcContrast } from '@/utils/palette'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import { PairingCard } from './PairingCard'

const STEPS = tokensStudioPalettes('light')[0].steps
// text.on-emphasis (15) on the emphasis fill (9)
const FG = STEPS[14]
const BG = STEPS[8]

describe('PairingCard', () => {
  describe('Rendering', () => {
    it('names the foreground and background roles', () => {
      render(
        <PairingCard
          fgRole={stepLabel(15)}
          bgRole={stepLabel(9)}
          fgHex={FG}
          bgHex={BG}
        />,
      )

      expect(screen.getByText(stepLabel(15))).toBeInTheDocument()
      expect(screen.getByText(stepLabel(9))).toBeInTheDocument()
    })

    it('shows the WCAG ratio and the APCA Lc of the pair', () => {
      render(<PairingCard fgRole="fg" bgRole="bg" fgHex={FG} bgHex={BG} />)

      const result = calcContrast(FG, BG)
      expect(screen.getByText(`${result.wcag}:1`)).toBeInTheDocument()
      expect(screen.getByText(`Lc ${result.apca}`)).toBeInTheDocument()
      expect(screen.getByText('AA')).toBeInTheDocument()
      expect(screen.getByText('AAA')).toBeInTheDocument()
    })

    it('shows one chip per font size in the APCA table', () => {
      render(<PairingCard fgRole="fg" bgRole="bg" fgHex={FG} bgHex={BG} />)

      for (const { size } of APCA_FONT_ROWS) {
        expect(screen.getByText(new RegExp(`^${size}px`))).toBeInTheDocument()
      }
    })

    it('previews text in the pair’s own colours', () => {
      render(<PairingCard fgRole="fg" bgRole="bg" fgHex={FG} bgHex={BG} />)

      const sample = screen.getByText('Aa')
      expect(sample).toHaveStyle({ color: FG })
      expect(sample.closest('[style*="background-color"]')).toHaveStyle({
        backgroundColor: BG,
      })
    })

    it('previews a border as an input outline', () => {
      render(
        <PairingCard
          fgRole="fg"
          bgRole="bg"
          fgHex={FG}
          bgHex={BG}
          type="border"
        />,
      )

      expect(screen.queryByText('Aa')).not.toBeInTheDocument()
      expect(screen.getByText('Placeholder')).toHaveStyle({
        border: `2px solid ${FG}`,
        backgroundColor: BG,
      })
    })
  })
})
