// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TS_GAUSSIAN, TS_SCALE } from '@/config/tokensStudio'
import { gaussian } from '@/utils/color'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AboutGaussianBellCurve } from './AboutGaussianBellCurve'

const meanSlider = () => screen.getByRole('slider', { name: /^Mean/ })
const stdDevSlider = () =>
  screen.getByRole('slider', { name: /^Standard deviation/ })

/** The tooltips of the step markers. SVG titles sit inside each circle. */
const markerTitles = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('circle > title')).map(
    (title) => title.textContent,
  )

describe('AboutGaussianBellCurve', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      renderWithProviders(<AboutGaussianBellCurve />)

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'The Gaussian chroma curve',
      })
      expect(heading.closest('section')).toHaveAttribute(
        'id',
        'gaussian-bell-curve',
      )
    })

    it('gives the Tokens Studio mean of both modes', () => {
      renderWithProviders(<AboutGaussianBellCurve />)

      expect(
        screen.getByText(/^Tokens Studio sets the mean/),
      ).toHaveTextContent(
        `mean ${TS_GAUSSIAN.light.mean} in light mode and ${TS_GAUSSIAN.dark.mean} in dark mode`,
      )
    })
  })

  describe('Light mode', () => {
    it('starts the sliders at the light curve', () => {
      renderWithProviders(<AboutGaussianBellCurve />)

      expect(meanSlider()).toHaveValue(String(TS_GAUSSIAN.light.mean))
      expect(stdDevSlider()).toHaveValue(String(TS_GAUSSIAN.light.stdDev))
    })

    it('marks the light lightness of every step on the curve', () => {
      const { container } = renderWithProviders(<AboutGaussianBellCurve />)

      const { mean, stdDev } = TS_GAUSSIAN.light
      expect(markerTitles(container)).toEqual(
        TS_SCALE.light.map(
          (l, i) =>
            `Step ${i + 1}: L ${l}, multiplier ${gaussian(l, mean, stdDev).toFixed(3)}`,
        ),
      )
    })
  })

  describe('Dark mode', () => {
    it('starts the sliders and the markers at the dark values', () => {
      const { container } = renderWithProviders(<AboutGaussianBellCurve />, {
        scheme: 'dark',
      })

      const { mean, stdDev } = TS_GAUSSIAN.dark
      expect(meanSlider()).toHaveValue(String(mean))
      expect(stdDevSlider()).toHaveValue(String(stdDev))
      expect(
        screen.getByText(/^Tokens Studio sets the mean/),
      ).toHaveTextContent(
        `The curve below starts at the dark mode values (mean ${mean}, standard deviation ${stdDev})`,
      )
      expect(markerTitles(container)).toEqual(
        TS_SCALE.dark.map(
          (l, i) =>
            `Step ${i + 1}: L ${l}, multiplier ${gaussian(l, mean, stdDev).toFixed(3)}`,
        ),
      )
    })

    it('resets a moved slider when the scheme changes', () => {
      const { setColorScheme } = renderWithProviders(<AboutGaussianBellCurve />)

      fireEvent.change(meanSlider(), { target: { value: '0.2' } })
      expect(meanSlider()).toHaveValue('0.2')

      setColorScheme('dark')

      expect(meanSlider()).toHaveValue(String(TS_GAUSSIAN.dark.mean))
    })
  })
})
