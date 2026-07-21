'use client'

import {
  AboutBestPractices,
  AboutChromaDistribution,
  AboutConfiguration,
  AboutContrastRequirements,
  AboutGaussianBellCurve,
  AboutHowItWorks,
  AboutLearnMore,
  AboutOklchColorSpace,
  AboutOverview,
  AboutTableOfContents,
} from '@/components/docs/about'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-default scroll-smooth">
      <header className="border-b bg-surface border-neutral-subtle">
        <div className="max-w-4xl px-6 py-8 mx-auto">
          <Link
            href="/old"
            className="inline-flex items-center gap-2 mb-4 text-sm text-neutral-subtle hover:text-default"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to generator
          </Link>
          <h1 className="text-3xl font-bold">
            About the Colour Palette Generator
          </h1>
          <p className="mt-2 text-neutral-subtle">
            Learn how this tool creates harmonious, accessible colour scales
            using Gaussian distribution and the{' '}
            <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> colour space.
          </p>
        </div>
      </header>

      <main className="max-w-4xl px-6 py-12 mx-auto space-y-16">
        <AboutTableOfContents />
        <AboutOverview />
        <AboutHowItWorks />
        <AboutGaussianBellCurve />
        <AboutChromaDistribution />
        <AboutOklchColorSpace />
        <AboutConfiguration />
        <AboutContrastRequirements />
        <AboutBestPractices />
        <AboutLearnMore />
      </main>
    </div>
  )
}
