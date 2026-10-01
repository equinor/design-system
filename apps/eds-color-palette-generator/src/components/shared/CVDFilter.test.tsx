// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CVD_MATRICES } from '@/utils/cvd'
import type { CVDType } from '@/utils/cvd'
import { CVDFilter, cvdFilterStyle } from './CVDFilter'

const TYPES = Object.keys(CVD_MATRICES) as Exclude<CVDType, 'none'>[]

describe('CVDFilter', () => {
  describe('Rendering', () => {
    it('renders nothing for normal vision', () => {
      const { container } = render(<CVDFilter type="none" />)

      expect(container).toBeEmptyDOMElement()
    })

    it.each(TYPES)('defines the cvd-%s filter with its matrix', (type) => {
      const { container } = render(<CVDFilter type={type} />)

      const filter = container.querySelector(`filter#cvd-${type}`)
      expect(filter).not.toBeNull()
      expect(filter?.querySelector('feColorMatrix')).toHaveAttribute(
        'values',
        CVD_MATRICES[type],
      )
    })
  })

  describe('Accessibility', () => {
    it('hides the filter definition from assistive technology', () => {
      const { container } = render(<CVDFilter type="protanopia" />)

      expect(container.querySelector('svg')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })

    it('takes up no space', () => {
      const { container } = render(<CVDFilter type="tritanopia" />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '0')
      expect(svg).toHaveAttribute('height', '0')
      expect(svg).toHaveStyle({ position: 'absolute' })
    })
  })
})

describe('cvdFilterStyle', () => {
  it('is undefined for normal vision', () => {
    expect(cvdFilterStyle('none')).toBeUndefined()
  })

  it.each(TYPES)('points at the cvd-%s filter', (type) => {
    expect(cvdFilterStyle(type)).toEqual({ filter: `url(#cvd-${type})` })
  })
})
