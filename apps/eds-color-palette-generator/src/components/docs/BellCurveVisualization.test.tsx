// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TS_GAUSSIAN, TS_SCALE } from '@/config/tokensStudio'
import { gaussian } from '@/utils/color'
import { BellCurveVisualization } from './BellCurveVisualization'

const { mean: MEAN, stdDev: STD_DEV } = TS_GAUSSIAN.light

const curve = () =>
  screen.getByRole('img', {
    name: 'Bell curve visualisation showing Gaussian distribution',
  })
const markers = () => curve().querySelectorAll('circle')
const markerTitles = () =>
  Array.from(curve().querySelectorAll('circle > title')).map(
    (title) => title.textContent,
  )
const meanSlider = () => screen.getByRole('slider', { name: /^Mean/ })
const stdDevSlider = () =>
  screen.getByRole('slider', { name: /^Standard deviation/ })

describe('BellCurveVisualization', () => {
  describe('Rendering', () => {
    it('draws one marker per lightness value', () => {
      render(
        <BellCurveVisualization
          initialMean={MEAN}
          initialStdDev={STD_DEV}
          markers={TS_SCALE.light}
        />,
      )

      expect(markers()).toHaveLength(TS_SCALE.light.length)
    })

    it('draws only the markers it is given', () => {
      const three = TS_SCALE.light.slice(0, 3)
      render(<BellCurveVisualization markers={three} />)

      expect(markers()).toHaveLength(3)
    })

    it('draws no markers without the markers prop', () => {
      render(<BellCurveVisualization />)

      expect(markers()).toHaveLength(0)
    })

    it('puts each marker at the multiplier for its lightness', () => {
      render(
        <BellCurveVisualization
          initialMean={MEAN}
          initialStdDev={STD_DEV}
          markers={TS_SCALE.light}
        />,
      )

      expect(markerTitles()).toEqual(
        TS_SCALE.light.map(
          (l, i) =>
            `Step ${i + 1}: L ${l}, multiplier ${gaussian(l, MEAN, STD_DEV).toFixed(3)}`,
        ),
      )
    })

    it('starts the sliders and the mean label at the initial values', () => {
      render(
        <BellCurveVisualization initialMean={MEAN} initialStdDev={STD_DEV} />,
      )

      expect(meanSlider()).toHaveValue(String(MEAN))
      expect(stdDevSlider()).toHaveValue(String(STD_DEV))
      expect(
        within(curve()).getByText(`Mean: ${MEAN.toFixed(2)}`),
      ).toBeVisible()
    })
  })

  describe('Behaviour', () => {
    it('updates the mean label when the mean slider moves', () => {
      render(
        <BellCurveVisualization initialMean={MEAN} initialStdDev={STD_DEV} />,
      )

      fireEvent.change(meanSlider(), { target: { value: '0.85' } })

      expect(within(curve()).getByText('Mean: 0.85')).toBeInTheDocument()
      expect(meanSlider().parentElement).toHaveTextContent(
        'Current value: 0.85',
      )
    })

    it('shows the new standard deviation when its slider moves', () => {
      render(
        <BellCurveVisualization initialMean={MEAN} initialStdDev={STD_DEV} />,
      )

      fireEvent.change(stdDevSlider(), { target: { value: '3.5' } })

      expect(stdDevSlider().parentElement).toHaveTextContent(
        'Current value: 3.50',
      )
    })

    it('moves the markers with the curve', () => {
      render(
        <BellCurveVisualization
          initialMean={MEAN}
          initialStdDev={STD_DEV}
          markers={TS_SCALE.light}
        />,
      )

      fireEvent.change(meanSlider(), { target: { value: '0.3' } })

      const l = TS_SCALE.light[8]
      expect(markerTitles()[8]).toBe(
        `Step 9: L ${l}, multiplier ${gaussian(l, 0.3, STD_DEV).toFixed(3)}`,
      )
    })
  })
})
