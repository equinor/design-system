'use client'

import { BellCurveVisualization } from '@/components/docs/BellCurveVisualization'
import { TS_GAUSSIAN, TS_SCALE } from '@/config/tokensStudio'
import { useColorScheme } from '@/context/ColorSchemeContext'

export function AboutGaussianBellCurve() {
  const { colorScheme } = useColorScheme()
  const { mean, stdDev } = TS_GAUSSIAN[colorScheme]

  return (
    <section id="gaussian-bell-curve" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">
        The Gaussian chroma curve
      </h2>
      <div className="mb-6 space-y-4">
        <p>
          The curve decides how much of the anchor&apos;s chroma each step
          keeps. It is a bell curve over lightness:
        </p>
        <pre className="m-0 overflow-x-auto rounded border border-muted bg-surface p-4 font-mono text-sm">
          gaussian(L, mean, stdDev) = exp((-25 / stdDev) × (L - mean)²)
        </pre>
        <p>
          Tokens Studio sets the mean and standard deviation per mode in{' '}
          <code>input/scale</code>: mean {TS_GAUSSIAN.light.mean} in light mode
          and {TS_GAUSSIAN.dark.mean} in dark mode, standard deviation{' '}
          {TS_GAUSSIAN.light.stdDev === TS_GAUSSIAN.dark.stdDev
            ? `${TS_GAUSSIAN.light.stdDev} in both`
            : `${TS_GAUSSIAN.light.stdDev} and ${TS_GAUSSIAN.dark.stdDev}`}
          . The curve below starts at the {colorScheme} mode values (mean {mean}
          , standard deviation {stdDev}). Move the sliders to see how the curve,
          and the steps on it, change. The sliders only change this picture; the
          Theme Builder always uses the Tokens Studio values.
        </p>
      </div>
      {/* Remount on a mode change so the sliders start at that mode's values */}
      <BellCurveVisualization
        key={colorScheme}
        initialMean={mean}
        initialStdDev={stdDev}
        markers={TS_SCALE[colorScheme]}
      />
    </section>
  )
}
