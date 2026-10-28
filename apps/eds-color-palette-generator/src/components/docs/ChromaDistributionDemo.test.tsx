// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  STEP_COUNT,
  TS_GAUSSIAN,
  TS_HUES,
  TS_SCALE,
} from '@/config/tokensStudio'
import { gaussian } from '@/utils/color'
import { ChromaDistributionDemo } from './ChromaDistributionDemo'

const ANCHOR = TS_HUES[0].anchor
const LIGHTNESS = TS_SCALE.light
const { mean: MEAN, stdDev: STD_DEV } = TS_GAUSSIAN.light

function renderDemo() {
  return render(
    <ChromaDistributionDemo
      initialBaseColor={ANCHOR}
      lightness={LIGHTNESS}
      initialMean={MEAN}
      initialStdDev={STD_DEV}
    />,
  )
}

/** The step with the most chroma: the first one closest to the mean. */
function strongestStep(mean: number): number {
  const multipliers = LIGHTNESS.map((l) => gaussian(l, mean, STD_DEV))
  return multipliers.indexOf(Math.max(...multipliers)) + 1
}

const anchorInput = () => screen.getByRole('textbox', { name: 'Anchor' })
const meanSlider = () => screen.getByRole('slider', { name: /^Mean/ })
const chart = () => screen.getByRole('img', { name: /^Chroma of steps/ })
const bars = () => chart().querySelectorAll('rect')
const barTitles = () =>
  Array.from(chart().querySelectorAll('rect > title')).map(
    (title) => title.textContent ?? '',
  )
const swatchTitles = () =>
  within(screen.getByRole('list', { name: 'Generated scale' }))
    .getAllByRole('listitem')
    .map((item) => item.querySelector('[title]')?.getAttribute('title'))

describe('ChromaDistributionDemo', () => {
  describe('Rendering', () => {
    it('renders one bar per step', () => {
      renderDemo()

      expect(bars()).toHaveLength(STEP_COUNT)
      expect(barTitles()[0]).toMatch(/^Step 1: L /)
      expect(barTitles()[STEP_COUNT - 1]).toMatch(/^Step 15: L /)
    })

    it('renders the generated scale as 15 swatches', () => {
      renderDemo()

      const list = screen.getByRole('list', { name: 'Generated scale' })
      expect(within(list).getAllByRole('listitem')).toHaveLength(STEP_COUNT)
    })

    it('starts at the anchor and curve it is given', () => {
      renderDemo()

      expect(anchorInput()).toHaveValue(ANCHOR)
      expect(anchorInput()).toHaveAttribute('aria-invalid', 'false')
      expect(meanSlider()).toHaveValue(String(MEAN))
      expect(
        screen.getByText(
          new RegExp(`^Most chroma: step ${strongestStep(MEAN)} `),
        ),
      ).toBeInTheDocument()
    })

    it('gives each bar the multiplier of the curve at its lightness', () => {
      renderDemo()

      barTitles().forEach((title, i) => {
        const l = LIGHTNESS[i]
        expect(title).toContain(
          `Step ${i + 1}: L ${l}, multiplier ${gaussian(l, MEAN, STD_DEV).toFixed(3)}`,
        )
      })
    })
  })

  describe('Behaviour', () => {
    it('marks an invalid colour and keeps the previous scale', async () => {
      const user = userEvent.setup()
      renderDemo()
      const before = swatchTitles()

      await user.clear(anchorInput())
      await user.type(anchorInput(), 'not a colour')

      expect(anchorInput()).toHaveValue('not a colour')
      expect(anchorInput()).toHaveAttribute('aria-invalid', 'true')
      expect(swatchTitles()).toEqual(before)
    })

    it('gives every step chroma 0 for a grey anchor', async () => {
      const user = userEvent.setup()
      renderDemo()

      await user.clear(anchorInput())
      await user.click(anchorInput())
      await user.paste('#808080')

      expect(anchorInput()).toHaveAttribute('aria-invalid', 'false')
      expect(screen.getByText('Anchor chroma: 0.000')).toBeInTheDocument()
      for (const title of barTitles()) {
        expect(title).toMatch(/chroma 0\.000$/)
      }
      for (const title of swatchTitles()) {
        expect(title).toMatch(/: oklch\([\d.]+ 0\.000 /)
      }
    })

    it('moves the step with the most chroma when the mean changes', () => {
      renderDemo()
      const nextMean = 0.95
      const before = strongestStep(MEAN)
      const after = strongestStep(nextMean)
      expect(after).not.toBe(before)

      fireEvent.change(meanSlider(), { target: { value: String(nextMean) } })

      expect(
        screen.getByText(new RegExp(`^Most chroma: step ${after} `)),
      ).toBeInTheDocument()
      expect(chart()).toHaveAccessibleName(
        `Chroma of steps 1 to 15. The most is at step ${after}.`,
      )
    })
  })

  describe('Accessibility', () => {
    it('labels the colour picker, the text input and the sliders', () => {
      renderDemo()

      expect(
        screen.getByLabelText('Pick the anchor colour'),
      ).toBeInTheDocument()
      expect(anchorInput()).toBeInTheDocument()
      expect(
        screen.getByRole('slider', { name: /^Standard deviation/ }),
      ).toBeInTheDocument()
    })

    it('names the chart after the step with the most chroma', () => {
      renderDemo()

      expect(chart()).toHaveAccessibleName(
        `Chroma of steps 1 to 15. The most is at step ${strongestStep(MEAN)}.`,
      )
    })
  })
})
