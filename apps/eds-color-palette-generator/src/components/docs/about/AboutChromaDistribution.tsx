'use client'

import { ChromaDistributionDemo } from '@/components/docs/ChromaDistributionDemo'
import { TS_GAUSSIAN, TS_HUES, TS_SCALE } from '@/config/tokensStudio'
import { useColorScheme } from '@/context/ColorSchemeContext'

export function AboutChromaDistribution() {
  const { colorScheme } = useColorScheme()
  const { mean, stdDev } = TS_GAUSSIAN[colorScheme]
  const hue = TS_HUES[0]

  return (
    <section id="chroma-distribution" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Try it</h2>
      <p className="mb-6">
        This demo generates a scale with the {colorScheme} mode lightness
        values. It starts from the {hue.name} anchor and the Tokens Studio curve
        for {colorScheme} mode. Change the anchor or the curve, and the chart
        shows how much chroma each step keeps. Two things are worth trying. A
        grey anchor, with chroma 0, gives a grey scale whatever the curve does,
        because the curve can only scale the chroma the anchor has. And moving
        the mean towards the light end makes the light steps more colourful and
        the dark ones duller.
      </p>
      {/* Remount on a mode change so the demo starts at that mode's values */}
      <ChromaDistributionDemo
        key={colorScheme}
        initialBaseColor={hue.anchor}
        lightness={TS_SCALE[colorScheme]}
        initialMean={mean}
        initialStdDev={stdDev}
      />
    </section>
  )
}
