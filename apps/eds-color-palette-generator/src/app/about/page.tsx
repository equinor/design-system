'use client'

import {
  AboutChromaDistribution,
  AboutContrastRequirements,
  AboutGaussianBellCurve,
  AboutHowItWorks,
  AboutLearnMore,
  AboutLightAndDark,
  AboutMultipleAnchors,
  AboutOklchColorSpace,
  AboutOverview,
  AboutStepRoles,
  AboutTableOfContents,
  AboutTips,
  AboutTokensStudio,
} from '@/components/docs/about'
import Link from 'next/link'
import { AppHeader } from '@/components/shared/AppHeader'
import { Main } from '@/components/shared/Main'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-primary scroll-smooth">
      <AppHeader />

      <Main className="max-w-6xl py-8 mx-auto space-y-16">
        <div>
          <h1 className="m-0 text-header-2xl font-medium">
            About the EDS Colour Palette Generator
          </h1>
          <p className="mt-2 text-base text-secondary">
            How the tool generates the 15-step EDS colour scales from Tokens
            Studio, what each step is for, how contrast is checked, and how to
            propose a change.
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
        <AboutStepRoles />
        <AboutGaussianBellCurve />
        <AboutChromaDistribution />
        <AboutMultipleAnchors />
        <AboutOklchColorSpace />
        <AboutLightAndDark />
        <AboutContrastRequirements />
        <AboutTokensStudio />
        <AboutTips />
        <AboutLearnMore />
      </Main>
    </div>
  )
}
