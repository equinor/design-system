// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardPreview } from './CardPreview'
import { resolveSemanticColors, toneRamps } from '@/utils/semanticTokens'

const COLORS = resolveSemanticColors(toneRamps('light'), 'light')

describe('CardPreview', () => {
  describe('Rendering', () => {
    it('renders three article cards', () => {
      render(<CardPreview colors={COLORS} />)

      for (const title of [
        'Building Design Systems',
        'Colour Theory in UI',
        'Accessible Palettes',
      ]) {
        expect(screen.getByText(title)).toBeInTheDocument()
      }
      expect(screen.getAllByText('Read more')).toHaveLength(3)
    })

    it('paints each tag with its tone', () => {
      render(<CardPreview colors={COLORS} />)

      expect(screen.getByText('Technology')).toHaveStyle({
        backgroundColor: COLORS['background.interactive.info.muted.default'],
        color: COLORS['text.on-muted.info'],
      })
      expect(screen.getByText('Engineering')).toHaveStyle({
        backgroundColor: COLORS['background.interactive.success.muted.default'],
      })
    })
  })
})
