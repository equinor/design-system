'use client'

import { BellCurveVisualization } from '@/components/BellCurveVisualization'
import { ChromaDistributionDemo } from '@/components/ChromaDistributionDemo'
import { ContrastRequirementsTable } from '@/components/ContrastRequirementsTable'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-default scroll-smooth">
      <header className="bg-surface border-b border-neutral-subtle">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-subtle hover:text-default mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to generator
          </Link>
          <h1 className="text-3xl font-bold">
            About the Color Palette Generator
          </h1>
          <p className="mt-2 text-neutral-subtle">
            Learn how the generator creates harmonious color scales using
            Gaussian distribution and the{' '}
            <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> color space.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-16">
        {/* Table of Contents */}
        <nav className="bg-surface rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Table of contents</h2>
          <ol className="space-y-2 text-sm">
            <li>
              <a
                href="#overview"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                1. Overview
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                2. How it works
              </a>
            </li>
            <li>
              <a
                href="#gaussian-bell-curve"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                3. The Gaussian bell curve
              </a>
            </li>
            <li>
              <a
                href="#chroma-distribution"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                4. Interactive chroma distribution
              </a>
            </li>
            <li>
              <a
                href="#oklch-color-space"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                5. Why OKLCH color space?
              </a>
            </li>
            <li>
              <a
                href="#configuration"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                6. Configuration options
              </a>
            </li>
            <li>
              <a
                href="#contrast-requirements"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                7. Color step pairings and contrast requirements
              </a>
            </li>
            <li>
              <a
                href="#best-practices"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                8. Best practices
              </a>
            </li>
            <li>
              <a
                href="#learn-more"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                9. Learn more
              </a>
            </li>
          </ol>
        </nav>

        {/* Overview */}
        <section id="overview" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              The <abbr title="Equinor Design System">EDS</abbr> Color Palette
              Generator creates consistent, accessible color scales for design
              systems. It uses a mathematical approach based on the Gaussian
              (bell curve) distribution to ensure colors maintain visual harmony
              across different lightness levels.
            </p>
            <p>
              The generator works in the{' '}
              <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> color space,
              which is perceptually uniform, meaning equal numerical changes
              result in equal perceived color differences. This makes it ideal
              for programmatic color generation.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <div className="space-y-6">
            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                1. Define lightness values
              </h3>
              <p className="text-neutral-subtle mb-4">
                Each step in the color scale has a predefined lightness value,
                carefully chosen to meet contrast requirements for different use
                cases:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  <strong>Background colors:</strong> High lightness in light
                  mode (0.97 - 0.999), low in dark mode (0.15 - 0.25)
                </li>
                <li>
                  <strong>Border colors:</strong> Mid-range lightness values for
                  subtle to strong emphasis
                </li>
                <li>
                  <strong>Fill colors:</strong> Values optimized for interactive
                  elements
                </li>
                <li>
                  <strong>Text colors:</strong> Values ensuring{' '}
                  <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>{' '}
                  AA/AAA compliance
                </li>
              </ul>
              <p className="text-sm text-neutral-subtle mt-4">
                These lightness values are configured separately for light and
                dark modes, ensuring optimal contrast in both contexts.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                2. Apply Gaussian distribution to chroma
              </h3>
              <p className="text-neutral-subtle mb-4">
                While lightness is fixed, chroma (color intensity) varies using
                a Gaussian function. This creates a natural color progression
                where colors are most vibrant at a specific lightness level (the
                mean) and gradually become more muted as you move away from it.
              </p>
              <div className="border border-neutral-subtle rounded p-4 text-sm font-mono mb-4">
                gaussian(x, mean, stdDev) = exp((-25 / stdDev) × (mean - x)²)
              </div>
              <p className="text-sm text-neutral-subtle">
                The function outputs a multiplier between 0 and 1, which is
                applied to the base color&apos;s chroma value at each step.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                3. Generate color scale
              </h3>
              <p className="text-neutral-subtle mb-4">For each step:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Take the base color and convert it to OKLCH color space</li>
                <li>Set the lightness to the predefined value for that step</li>
                <li>
                  Calculate the chroma multiplier using the Gaussian function
                  with the step&apos;s lightness
                </li>
                <li>
                  Apply the multiplier to the base color&apos;s chroma:
                  new_chroma = base_chroma × multiplier
                </li>
                <li>Keep the hue unchanged from the base color</li>
              </ol>
              <p className="text-sm text-neutral-subtle mt-4">
                This approach ensures that colors maintain their hue identity
                while adapting their intensity to suit different lightness
                levels.
              </p>
            </div>
          </div>
        </section>

        {/* Bell Curve Visualization */}
        <section id="gaussian-bell-curve" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">The Gaussian bell curve</h2>
          <p className="text-neutral-subtle mb-6">
            The bell curve determines how chroma is distributed across lightness
            values. Adjust the mean and standard deviation to see how they
            affect the curve shape and, consequently, the color intensity at
            different lightness levels.
          </p>
          <BellCurveVisualization />
        </section>

        {/* Chroma Distribution Demo */}
        <section id="chroma-distribution" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Interactive chroma distribution
          </h2>
          <p className="text-neutral-subtle mb-6">
            Experiment with different base colors and Gaussian parameters to see
            how they affect the final color scale. The chart shows how chroma
            varies across the lightness spectrum.
          </p>
          <ChromaDistributionDemo />
        </section>

        {/* OKLCH Color Space */}
        <section id="oklch-color-space" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">Why OKLCH color space?</h2>
          <div className="bg-surface rounded-lg p-6">
            <p className="mb-4">
              <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> is a
              cylindrical representation of the Oklab color space, designed to
              be perceptually uniform. It has three components:
            </p>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold">Lightness (L)</dt>
                <dd className="text-sm text-neutral-subtle ml-4">
                  Ranges from 0 (black) to 1 (white). Perceptually uniform, so
                  0.5 is truly medium lightness.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Chroma (C)</dt>
                <dd className="text-sm text-neutral-subtle ml-4">
                  Color intensity or saturation. 0 is grayscale, higher values
                  are more vibrant. Unlike{' '}
                  <abbr title="Hue Saturation Lightness">HSL</abbr>, chroma is
                  consistent across hues.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Hue (H)</dt>
                <dd className="text-sm text-neutral-subtle ml-4">
                  The color angle, from 0 to 360 degrees. Represents the basic
                  color quality (red, green, blue, etc.).
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-neutral-subtle">
              By manipulating lightness and chroma independently while keeping
              hue constant, we can create color scales that look natural and
              maintain consistent color relationships.
            </p>
          </div>
        </section>

        {/* Configuration */}
        <section id="configuration" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">Configuration options</h2>
          <div className="space-y-4">
            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Lightness values</h3>
              <p className="text-sm text-neutral-subtle mb-3">
                Each step has predefined lightness values for light and dark
                modes. These values are based on:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-subtle">
                <li>
                  <abbr title="Accessible Perceptual Contrast Algorithm">
                    APCA
                  </abbr>{' '}
                  contrast requirements
                </li>
                <li>
                  <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>{' '}
                  2.1 Level AA/AAA guidelines
                </li>
                <li>Visual hierarchy needs (backgrounds, borders, text)</li>
                <li>
                  Interactive state differentiation (default, hover, active)
                </li>
              </ul>
            </div>

            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">
                Gaussian parameters
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">Mean</h4>
                  <p className="text-sm text-neutral-subtle">
                    The lightness value where chroma is at maximum. Typically
                    set to 0.6 for light mode and 0.7 for dark mode to ensure
                    vibrant mid-tones.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Standard deviation</h4>
                  <p className="text-sm text-neutral-subtle">
                    Controls how quickly chroma decreases away from the mean.
                    Lower values create sharper peaks (more dramatic chroma
                    variation), while higher values create gentler curves (more
                    gradual changes).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">
                Separate light/dark modes
              </h3>
              <p className="text-sm text-neutral-subtle">
                Light and dark modes use different Gaussian parameters because:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-subtle mt-3">
                <li>
                  Dark mode typically needs higher chroma in lighter colors to
                  maintain visibility
                </li>
                <li>
                  Light mode benefits from more vibrant mid-tones but muted
                  extremes
                </li>
                <li>
                  Different background lightness ranges require different chroma
                  distributions
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Color Step Pairings and Contrast Requirements */}
        <section id="contrast-requirements" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Color step pairings and contrast requirements
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
            <p>
              Each color step in the palette is designed to work with specific
              other steps to ensure accessibility. The configuration defines
              contrast requirements using both{' '}
              <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr>{' '}
              (Accessible Perceptual Contrast Algorithm) and{' '}
              <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1
              standards.
            </p>
            <p>
              These requirements are directly referenced from the configuration
              file, ensuring that the documentation stays in sync with the
              implementation. Each pairing specifies the minimum contrast levels
              needed for different use cases, from subtle UI components to body
              text.
            </p>
          </div>

          <div className="border border-neutral-subtle rounded-lg p-4 mb-6 text-sm">
            <p className="font-medium mb-2">Understanding the levels:</p>
            <ul className="space-y-1 text-neutral-subtle">
              <li>
                <strong>
                  <abbr title="Accessible Perceptual Contrast Algorithm">
                    APCA
                  </abbr>{' '}
                  Lc values:
                </strong>{' '}
                Range from 15 (decorative elements) to 90 (preferred body text).
                Higher values indicate stronger contrast requirements.
              </li>
              <li>
                <strong>
                  <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>{' '}
                  ratios:
                </strong>{' '}
                Traditional contrast ratios (3:1, 4.5:1, 7:1) for UI components,
                normal text, and large text at AA/AAA levels.
              </li>
            </ul>
          </div>

          <ContrastRequirementsTable />

          <div className="bg-surface rounded-lg p-4 mt-6 text-sm">
            <h3 className="font-semibold mb-2">Key insights</h3>
            <ul className="list-disc list-inside space-y-1 text-neutral-subtle">
              <li>
                <strong>Background steps</strong> (Canvas, Surface) require
                minimal contrast between each other but high contrast with text
                elements
              </li>
              <li>
                <strong>Fill elements</strong> have progressive contrast
                requirements based on their emphasis level (muted vs. emphasis)
              </li>
              <li>
                <strong>Border steps</strong> maintain visual hierarchy through
                three distinct levels (subtle, medium, strong)
              </li>
              <li>
                <strong>Text elements</strong> have the strictest requirements,
                with different levels for subtle text, strong text, and text on
                emphasis backgrounds
              </li>
              <li>
                <strong>Interactive states</strong> (default, hover, active) are
                differentiated through both lightness and contrast requirements
              </li>
            </ul>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">Best practices</h2>
          <div className="bg-surface rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-medium">
                    Start with a well-saturated base color
                  </p>
                  <p className="text-sm text-neutral-subtle">
                    The Gaussian function scales down from the base chroma, so
                    starting with higher chroma gives more flexibility.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-medium">Test contrast ratios regularly</p>
                  <p className="text-sm text-neutral-subtle">
                    Enable contrast checking to ensure all color combinations
                    meet accessibility requirements.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-medium">
                    Export and version your configurations
                  </p>
                  <p className="text-sm text-neutral-subtle">
                    Save your palette configurations to maintain consistency and
                    track changes over time.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Additional Resources */}
        <section id="learn-more" className="pb-12 scroll-mt-8">
          <h2 className="text-2xl font-bold mb-4">Learn more</h2>
          <div className="bg-surface rounded-lg p-6">
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://lea.verou.me/blog/2020/04/lch-colors-in-css-what-why-and-how/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  LCH colors in CSS: what, why, and how?
                </a>
              </li>
              <li>
                <a
                  href="https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  OKLCH in CSS: why we moved from RGB and HSL
                </a>
              </li>
              <li>
                <a
                  href="https://git.apcacontrast.com/documentation/APCAeasyIntro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <abbr title="Accessible Perceptual Contrast Algorithm">
                    APCA
                  </abbr>{' '}
                  contrast algorithm
                </a>
              </li>
              <li>
                <a
                  href="https://oklch.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  OKLCH color picker and converter
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
