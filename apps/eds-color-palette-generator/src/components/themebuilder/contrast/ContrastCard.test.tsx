// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContrastCard } from './ContrastCard'
import { calcContrast } from '@/utils/palette'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

const [PALETTE] = tokensStudioPalettes('light')
// text.primary (13) on background.canvas (1)
const FG = PALETTE.steps[12]
const BG = PALETTE.steps[0]

describe('ContrastCard', () => {
  describe('Rendering', () => {
    it('shows the palette, the roles and both contrast measures', () => {
      render(
        <ContrastCard
          fgHex={FG}
          bgHex={BG}
          fgLabel="13 · primary"
          bgLabel="1 · canvas"
          paletteName={PALETTE.name}
        />,
      )

      const result = calcContrast(FG, BG)
      expect(screen.getByText(PALETTE.name)).toBeInTheDocument()
      expect(screen.getByText('13 · primary')).toBeInTheDocument()
      expect(screen.getByText('1 · canvas')).toBeInTheDocument()
      expect(screen.getByText(result.wcag)).toBeInTheDocument()
      expect(screen.getByText(`Lc ${result.apca}`)).toBeInTheDocument()
      expect(screen.getByText('Aa')).toBeInTheDocument()
    })

    it('judges the font sizes on the unrounded Lc', () => {
      // #8f8f8f on white is Lc 59.6, shown as 60; 14px bold needs Lc 60
      render(
        <ContrastCard
          fgHex="#8f8f8f"
          bgHex="#ffffff"
          fgLabel="grey"
          bgLabel="white"
          paletteName="Custom"
        />,
      )

      expect(screen.getByText('Lc 60')).toBeInTheDocument()
      expect(screen.getByTitle('14px: fails')).toBeInTheDocument()
    })

    it('warns when both colours are the same', () => {
      render(
        <ContrastCard
          fgHex={BG}
          bgHex={BG}
          fgLabel="1"
          bgLabel="1"
          paletteName={PALETTE.name}
        />,
      )

      expect(screen.getByText('Same colour')).toBeInTheDocument()
    })

    it('draws a border sample instead of text for borders', () => {
      render(
        <ContrastCard
          fgHex={PALETTE.steps[6]}
          bgHex={BG}
          fgLabel="7"
          bgLabel="1"
          paletteName={PALETTE.name}
          previewType="border"
        />,
      )

      expect(screen.queryByText('Aa')).not.toBeInTheDocument()
    })
  })
})
