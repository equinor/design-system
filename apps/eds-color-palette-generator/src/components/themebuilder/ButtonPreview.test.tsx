// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ButtonPreview } from './ButtonPreview'
import { resolveSemanticColors, toneRamps } from '@/utils/semanticTokens'

const COLORS = resolveSemanticColors(toneRamps('light'), 'light')

describe('ButtonPreview', () => {
  describe('Rendering', () => {
    it('renders three variants in three states', () => {
      render(<ButtonPreview colors={COLORS} />)

      for (const name of ['Solid', 'Outlined', 'Ghost']) {
        expect(screen.getByText(name)).toBeInTheDocument()
      }
      for (const state of ['default', 'hover', 'pressed']) {
        expect(screen.getByText(state)).toBeInTheDocument()
      }
      expect(screen.getAllByText('Label')).toHaveLength(9)
    })

    it('paints the solid button with the accent emphasis tokens', () => {
      render(<ButtonPreview colors={COLORS} />)

      const [solidDefault, solidHover] = screen.getAllByText('Label')
      expect(solidDefault).toHaveStyle({
        backgroundColor:
          COLORS['background.interactive.accent.emphasis.default'],
        color: COLORS['text.on-emphasis.accent'],
      })
      expect(solidHover).toHaveStyle({
        backgroundColor: COLORS['background.interactive.accent.emphasis.hover'],
      })
    })
  })
})
