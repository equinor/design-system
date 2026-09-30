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
import Link from 'next/link'
import { AppHeader } from '@/components/shared/AppHeader'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-primary scroll-smooth">
      <AppHeader />

      <main className="max-w-4xl px-6 py-8 mx-auto space-y-16">
        <div>
          <h1 className="m-0 text-header-3xl font-medium">
            About the EDS Colour Palette Generator
          </h1>
          <p className="mt-2 text-base text-secondary">
            Learn how this tool creates harmonious, accessible colour scales
            using Gaussian distribution and the{' '}
            <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> colour space.
          </p>
          {/* The header nav has no /old entry, so the old "Back to
              generator" link lives on here. */}
          <p className="mt-2 text-sm">
            <Link
              href="/old"
              className="text-link underline hover:text-link-hover"
            >
              Open the original generator
            </Link>
          </p>
        </div>
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
