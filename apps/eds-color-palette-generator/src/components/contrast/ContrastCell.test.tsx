// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  APCA_FONT_ROWS,
  calcContrast,
  getApcaFontBreakdown,
} from '@/utils/palette'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import { ContrastCell } from './ContrastCell'

const STEPS = tokensStudioPalettes('light')[1].steps
// text.primary (13) on background.canvas (1)
const FG = STEPS[12]
const BG = STEPS[0]
const DATA = calcContrast(FG, BG)

function renderCell() {
  return render(
    <ContrastCell data={DATA} fgColor={FG} bgColor={BG} label="Step 13" />,
  )
}

describe('ContrastCell', () => {
  describe('Rendering', () => {
    it('shows its label', () => {
      renderCell()

      expect(screen.getByText('Step 13')).toBeInTheDocument()
    })

    it('shows the WCAG ratio, the AA and AAA badges and the APCA Lc', () => {
      renderCell()

      expect(screen.getByText(`${DATA.wcag}:1`)).toBeInTheDocument()
      expect(screen.getByText('AA')).toBeInTheDocument()
      expect(screen.getByText('AAA')).toBeInTheDocument()
      expect(screen.getByText(`Lc ${DATA.apca}`)).toBeInTheDocument()
    })

    it('shows the lightest passing weight for every font size', () => {
      renderCell()

      const breakdown = getApcaFontBreakdown(parseFloat(DATA.apca))
      expect(breakdown).toHaveLength(APCA_FONT_ROWS.length)
      for (const { size, minWeightName } of breakdown) {
        expect(
          screen.getByText(
            minWeightName ? `${size}px ${minWeightName}` : `${size}px`,
          ),
        ).toBeInTheDocument()
      }
    })

    it('shows a sample in the pair’s own colours', () => {
      renderCell()

      expect(screen.getByText('Aa').parentElement).toHaveStyle({
        color: FG,
        backgroundColor: BG,
      })
    })
  })
})
