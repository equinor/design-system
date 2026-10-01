// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { IconData } from '@equinor/eds-icons'
import { save } from '@equinor/eds-icons'
import { Icon } from './Icon'

const TWO_PATHS: IconData = {
  name: 'two-paths',
  prefix: 'eds',
  height: '24',
  width: '24',
  svgPathData: ['M0 0h12v12H0z', 'M12 12h12v12H12z'],
}

const svgIn = (container: HTMLElement) => {
  const svg = container.querySelector('svg')
  if (!svg) throw new Error('no <svg> rendered')
  return svg
}

describe('Icon', () => {
  describe('Rendering', () => {
    it('draws the icon path in the current text colour', () => {
      const { container } = render(<Icon data={save} />)

      const svg = svgIn(container)
      expect(svg).toHaveAttribute('fill', 'currentColor')
      expect(svg).toHaveAttribute('viewBox', `0 0 ${save.width} ${save.height}`)
      expect(svg.querySelector('path')).toHaveAttribute(
        'd',
        save.svgPathData as string,
      )
    })

    it('draws every path of a multi-path icon', () => {
      const { container } = render(<Icon data={TWO_PATHS} />)

      expect(svgIn(container).querySelectorAll('path')).toHaveLength(2)
    })

    it('is 18px by default and takes a size', () => {
      const { container, rerender } = render(<Icon data={save} />)
      expect(svgIn(container)).toHaveAttribute('width', '18')
      expect(svgIn(container)).toHaveAttribute('height', '18')

      rerender(<Icon data={save} size={24} />)
      expect(svgIn(container)).toHaveAttribute('width', '24')
      expect(svgIn(container)).toHaveAttribute('height', '24')
    })

    it('adds its className after shrink-0', () => {
      const { container } = render(<Icon data={save} className="text-accent" />)

      expect(svgIn(container)).toHaveAttribute('class', 'shrink-0 text-accent')
    })
  })

  describe('Accessibility', () => {
    it('is decorative and hidden without a title', () => {
      const { container } = render(<Icon data={save} />)

      const svg = svgIn(container)
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('focusable', 'false')
      expect(svg.querySelector('title')).toBeNull()
      expect(screen.queryByRole('img')).toBeNull()
    })

    it('is an image named by its title when it has one', () => {
      render(<Icon data={save} title="Saved" />)

      const img = screen.getByRole('img', { name: 'Saved' })
      expect(img).not.toHaveAttribute('aria-hidden')
      expect(img.querySelector('title')).toHaveAttribute(
        'id',
        img.getAttribute('aria-labelledby'),
      )
    })

    it('gives each titled icon its own title id', () => {
      render(
        <>
          <Icon data={save} title="Saved" />
          <Icon data={save} title="Not saved" />
        </>,
      )

      expect(screen.getByRole('img', { name: 'Saved' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Not saved' })).toBeInTheDocument()
    })
  })
})
