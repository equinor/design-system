// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FontSizeChip } from './FontSizeChip'

describe('FontSizeChip', () => {
  describe('Rendering', () => {
    it('shows the size and the lightest weight that passes', () => {
      render(<FontSizeChip size={16} minWeightName="Medium" />)

      const chip = screen.getByText('16px Medium')
      expect(chip.className).toContain('bg-info-muted')
      expect(chip.className).not.toContain('line-through')
    })

    it('strikes the size through when no weight passes', () => {
      render(<FontSizeChip size={12} minWeightName={null} />)

      const chip = screen.getByText('12px')
      expect(chip.className).toContain('line-through')
      expect(chip.className).toContain('text-disabled')
    })

    it('has more padding at the md size', () => {
      render(<FontSizeChip size={24} minWeightName="Regular" chipSize="md" />)

      expect(screen.getByText('24px Regular').className).toContain('px-1.5')
    })
  })
})
