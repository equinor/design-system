import { BellCurveVisualization } from '@/components/docs/BellCurveVisualization'

export function AboutGaussianBellCurve() {
  return (
    <section id="gaussian-bell-curve" className="scroll-mt-8">
      <h2 className="mb-4 text-2xl font-bold">The Gaussian bell curve</h2>
      <p className="mb-6 text-neutral-subtle">
        The bell curve determines how chroma is distributed across lightness
        values. Adjust the mean and standard deviation to see how they affect
        curve shape and colour intensity at different lightness levels.
      </p>
      <BellCurveVisualization />
    </section>
  )
}
