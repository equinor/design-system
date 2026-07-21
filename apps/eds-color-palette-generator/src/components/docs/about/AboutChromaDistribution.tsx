import { ChromaDistributionDemo } from '@/components/docs/ChromaDistributionDemo'

export function AboutChromaDistribution() {
  return (
    <section id="chroma-distribution" className="scroll-mt-8">
      <h2 className="mb-4 text-2xl font-bold">
        Interactive chroma distribution
      </h2>
      <p className="mb-6 text-neutral-subtle">
        Experiment with different base colours and Gaussian parameters to see
        how they affect the final colour scale. The chart shows how chroma
        varies across the lightness spectrum.
      </p>
      <ChromaDistributionDemo />
    </section>
  )
}
