'use client'

import { BellCurveVisualization } from '@/components/BellCurveVisualization'
import { ChromaDistributionDemo } from '@/components/ChromaDistributionDemo'
import { ContrastRequirementsTable } from '@/components/ContrastRequirementsTable'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-default scroll-smooth">
      <header className="border-b bg-surface border-neutral-subtle">
        <div className="max-w-4xl px-6 py-8 mx-auto">
          <Link
            href="/"
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
        {/* Table of Contents */}
        <nav className="p-6 rounded-lg bg-surface">
          <h2 className="mb-4 text-xl font-bold">Table of contents</h2>
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
          <h2 className="mb-4 text-2xl font-bold">Overview</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              The <abbr title="Equinor Design System">EDS</abbr> Colour Palette
              Generator creates consistent, accessible colour scales for design
              systems. It uses a Gaussian (bell curve) distribution to maintain
              visual harmony across different lightness levels.
            </p>
            <p>
              The tool works in the{' '}
              <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> colour space
              — a perceptually uniform model where equal numerical changes
              produce equal perceived differences. This makes it ideal for
              programmatic colour generation.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="scroll-mt-8">
          <h2 className="mb-6 text-2xl font-bold">How it works</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-surface">
              <h3 className="mb-3 text-xl font-semibold">
                1. Define lightness values
              </h3>
              <p className="mb-4 text-neutral-subtle">
                Each colour scale step has a predefined lightness value chosen
                to meet contrast requirements:
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>
                  <strong>Background colours:</strong> High lightness in light
                  mode (0.97–0.999), low in dark mode (0.15–0.25)
                </li>
                <li>
                  <strong>Border colours:</strong> Mid-range values for subtle
                  to strong emphasis
                </li>
                <li>
                  <strong>Fill colours:</strong> Values optimised for
                  interactive elements
                </li>
                <li>
                  <strong>Text colours:</strong> Values ensuring{' '}
                  <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>{' '}
                  AA/AAA compliance
                </li>
              </ul>
              <p className="mt-4 text-sm text-neutral-subtle">
                Lightness values are configured separately for light and dark
                modes to ensure optimal contrast in both.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-surface">
              <h3 className="mb-3 text-xl font-semibold">
                2. Choose your colour approach
              </h3>
              <p className="mb-4 text-neutral-subtle">
                You can define colours in two ways:
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-4 border rounded border-neutral-subtle">
                  <h4 className="mb-2 font-semibold">
                    Single value (traditional)
                  </h4>
                  <p className="text-neutral-subtle">
                    Provide one base colour, and the generator creates all steps
                    with the same hue, varying only lightness and chroma using
                    Gaussian distribution.
                  </p>
                </div>
                <div className="p-4 border rounded border-neutral-subtle">
                  <h4 className="mb-2 font-semibold">
                    Multiple anchors (interpolation)
                  </h4>
                  <p className="text-neutral-subtle">
                    Define colours at specific steps (e.g., step 6 and step 9),
                    and the generator smoothly interpolates between them in{' '}
                    <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> space,
                    allowing hue to shift naturally while still applying
                    Gaussian chroma distribution.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-surface">
              <h3 className="mb-3 text-xl font-semibold">
                3. Apply Gaussian distribution to chroma
              </h3>
              <p className="mb-4 text-neutral-subtle">
                While lightness is fixed, chroma (colour intensity) varies using
                a Gaussian function. This creates natural colour progression —
                colours are most vibrant at a specific lightness level (the
                mean) and gradually become more muted as you move away from it.
              </p>
              <div className="p-4 mb-4 font-mono text-sm border rounded border-neutral-subtle">
                gaussian(x, mean, stdDev) = exp((-25 / stdDev) × (mean - x)²)
              </div>
              <p className="text-sm text-neutral-subtle">
                The function outputs a multiplier (0–1) applied to the base
                colour&apos;s chroma at each step.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-surface">
              <h3 className="mb-3 text-xl font-semibold">
                4. Generate colour scale
              </h3>
              <p className="mb-4 text-neutral-subtle">For each step:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Convert the base colour(s) to OKLCH colour space</li>
                <li>Set the lightness to the predefined value for that step</li>
                <li>
                  If using multiple anchors, interpolate between them to get the
                  base colour for this step
                </li>
                <li>
                  Calculate the chroma multiplier using the Gaussian function
                  with the step&apos;s lightness
                </li>
                <li>
                  Apply the multiplier to the base colour&apos;s chroma:
                  new_chroma = base_chroma × multiplier
                </li>
                <li>
                  For single value: Keep the hue unchanged. For multiple
                  anchors: Hue shifts naturally through interpolation
                </li>
              </ol>
              <p className="mt-4 text-sm text-neutral-subtle">
                This ensures colours maintain visual harmony while adapting
                intensity to suit different lightness levels.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-surface">
              <h3 className="mb-3 text-xl font-semibold">
                5. Multiple colour anchors (interpolation)
              </h3>
              <p className="mb-4 text-neutral-subtle">
                For more control, you can define multiple colour anchors at
                specific steps. The generator will interpolate between them in{' '}
                <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> space.
              </p>

              {/* Single Value Example */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold">
                  Single value (traditional approach)
                </h4>
                <div className="p-4 mb-2 border rounded border-neutral-subtle bg-canvas">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 border rounded border-neutral-subtle"
                      style={{
                        backgroundColor: 'oklch(0.4973 0.084851 204.553)',
                      }}
                    />
                    <span className="text-sm">
                      <span className="font-mono text-xs">
                        oklch(0.4973 0.084851 204.553)
                      </span>{' '}
                      <span className="text-neutral-subtle">(Moss Green)</span>
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-neutral-subtle">
                    The base colour is used for all steps with Gaussian chroma
                    distribution applied at each lightness level:
                  </p>
                  <div className="flex gap-1">
                    <div
                      className="flex-1 h-12 border rounded-l border-neutral-subtle"
                      style={{ backgroundColor: '#eaf8fa' }}
                      title="Step 1"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#f6ffff' }}
                      title="Step 2"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#cfe7e9' }}
                      title="Step 3"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#bbdbdf' }}
                      title="Step 4"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#a2cdd2' }}
                      title="Step 5"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#bbdbdf' }}
                      title="Step 6"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#7cbac1' }}
                      title="Step 7"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#21767e' }}
                      title="Step 8"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#206f77' }}
                      title="Step 9"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#205c62' }}
                      title="Step 10"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#20565c' }}
                      title="Step 11"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#1f6369' }}
                      title="Step 12"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#141f20' }}
                      title="Step 13"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#cae4e7' }}
                      title="Step 14"
                    />
                    <div
                      className="flex-1 h-12 border rounded-r border-neutral-subtle"
                      style={{ backgroundColor: '#ffffff' }}
                      title="Step 15"
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-neutral-subtle">
                    <span>1</span>
                    <span>15</span>
                  </div>
                </div>
              </div>

              {/* Multiple Anchors Example - Using actual generated values from test snapshots */}
              <div>
                <h4 className="mb-3 text-sm font-semibold">
                  Multiple anchors (interpolation approach)
                </h4>
                <div className="p-4 border rounded border-neutral-subtle bg-canvas">
                  <div className="flex items-center gap-6 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 border rounded border-neutral-subtle"
                        style={{
                          backgroundColor: '#c0dbd6',
                        }}
                      />
                      <div className="text-sm">
                        <div className="font-mono text-xs">
                          oklch(0.5915 0.0731 184.63)
                        </div>
                        <div className="text-xs text-neutral-subtle">
                          Anchor at step 6
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 border rounded border-neutral-subtle"
                        style={{
                          backgroundColor: '#206f77',
                        }}
                      />
                      <div className="text-sm">
                        <div className="font-mono text-xs">
                          oklch(0.4973 0.084851 204.553)
                        </div>
                        <div className="text-xs text-neutral-subtle">
                          Anchor at step 9
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mb-3 text-xs text-neutral-subtle">
                    Colours smoothly interpolate between anchors in OKLCH space,
                    with Gaussian chroma distribution applied:
                  </p>
                  <div className="flex gap-1">
                    <div
                      className="flex-1 h-12 border-t border-b border-l rounded-l border-neutral-subtle"
                      style={{ backgroundColor: '#ecf8f6' }}
                      title="Step 1"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#f8ffff' }}
                      title="Step 2"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#d2e6e3' }}
                      title="Step 3"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#c0dbd6' }}
                      title="Step 4"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#a8cdc7' }}
                      title="Step 5"
                    />
                    <div
                      className="flex-1 h-12 border-[3px] border-blue-500"
                      style={{ backgroundColor: '#c0dbd6' }}
                      title="Step 6 (anchor)"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#83bab7' }}
                      title="Step 7"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#277678' }}
                      title="Step 8"
                    />
                    <div
                      className="flex-1 h-12 border-[3px] border-blue-500"
                      style={{ backgroundColor: '#206f77' }}
                      title="Step 9 (anchor)"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#205c62' }}
                      title="Step 10"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#20565c' }}
                      title="Step 11"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#1f6369' }}
                      title="Step 12"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#141f20' }}
                      title="Step 13"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-neutral-subtle"
                      style={{ backgroundColor: '#cae4e7' }}
                      title="Step 14"
                    />
                    <div
                      className="flex-1 h-12 border-t border-b border-r rounded-r border-neutral-subtle"
                      style={{ backgroundColor: '#f7ffff' }}
                      title="Step 15"
                    />
                  </div>
                  <div className="relative flex mt-1 text-xs text-neutral-subtle">
                    <span className="absolute left-[37.5%] font-medium">6</span>
                    <span className="absolute left-[57.5%] font-medium">9</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-neutral-subtle">
                This technique is useful for creating gradient-like scales where
                you want precise control over specific steps while maintaining
                smooth transitions between them. The Gaussian chroma
                distribution is still applied, but hue and lightness can shift
                naturally between your defined anchors.
              </p>
            </div>
          </div>
        </section>

        {/* Bell Curve Visualization */}
        <section id="gaussian-bell-curve" className="scroll-mt-8">
          <h2 className="mb-4 text-2xl font-bold">The Gaussian bell curve</h2>
          <p className="mb-6 text-neutral-subtle">
            The bell curve determines how chroma is distributed across lightness
            values. Adjust the mean and standard deviation to see how they
            affect curve shape and colour intensity at different lightness
            levels.
          </p>
          <BellCurveVisualization />
        </section>

        {/* Chroma Distribution Demo */}
        <section id="chroma-distribution" className="scroll-mt-8">
          <h2 className="mb-4 text-2xl font-bold">
            Interactive chroma distribution
          </h2>
          <p className="mb-6 text-neutral-subtle">
            Experiment with different base colours and Gaussian parameters to
            see how they affect the final colour scale. The chart shows how
            chroma varies across the lightness spectrum.
          </p>
          <ChromaDistributionDemo />
        </section>

        {/* OKLCH Color Space */}
        <section id="oklch-color-space" className="scroll-mt-8">
          <h2 className="mb-4 text-2xl font-bold">Why OKLCH colour space?</h2>
          <div className="p-6 rounded-lg bg-surface">
            <p className="mb-4">
              <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> is a
              cylindrical representation of the Oklab colour space, designed to
              be perceptually uniform. It has three components:
            </p>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold">Lightness (L)</dt>
                <dd className="ml-4 text-sm text-neutral-subtle">
                  Ranges from 0 (black) to 1 (white). Perceptually uniform — 0.5
                  is truly medium lightness.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Chroma (C)</dt>
                <dd className="ml-4 text-sm text-neutral-subtle">
                  Colour intensity or saturation. 0 is greyscale, higher values
                  are more vibrant. Unlike{' '}
                  <abbr title="Hue Saturation Lightness">HSL</abbr>, chroma is
                  consistent across hues.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Hue (H)</dt>
                <dd className="ml-4 text-sm text-neutral-subtle">
                  The colour angle (0–360 degrees). Represents the basic colour
                  quality (red, green, blue, etc.).
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-neutral-subtle">
              By adjusting lightness and chroma independently while keeping hue
              constant, we create colour scales that look natural and maintain
              consistent relationships.
            </p>
          </div>
        </section>

        {/* Configuration */}
        <section id="configuration" className="scroll-mt-8">
          <h2 className="mb-4 text-2xl font-bold">Configuration options</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-surface">
              <h3 className="mb-3 text-lg font-semibold">Lightness values</h3>
              <p className="mb-3 text-sm text-neutral-subtle">
                Each step has predefined lightness values for light and dark
                modes, based on:
              </p>
              <ul className="space-y-1 text-sm list-disc list-inside text-neutral-subtle">
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

            <div className="p-6 rounded-lg bg-surface">
              <h3 className="mb-3 text-lg font-semibold">
                Gaussian parameters
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium">Mean</h4>
                  <p className="text-sm text-neutral-subtle">
                    The lightness value where chroma reaches maximum. Typically
                    set to 0.6 for light mode and 0.7 for dark mode to ensure
                    vibrant mid-tones.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Standard deviation</h4>
                  <p className="text-sm text-neutral-subtle">
                    Controls how quickly chroma decreases away from the mean.
                    Lower values create sharper peaks (dramatic variation),
                    higher values create gentler curves (gradual changes).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-surface">
              <h3 className="mb-3 text-lg font-semibold">
                Separate light/dark modes
              </h3>
              <p className="text-sm text-neutral-subtle">
                Light and dark modes use different Gaussian parameters because:
              </p>
              <ul className="mt-3 space-y-1 text-sm list-disc list-inside text-neutral-subtle">
                <li>
                  Dark mode typically needs higher chroma in lighter colours to
                  maintain visibility
                </li>
                <li>
                  Light mode benefits from vibrant mid-tones but muted extremes
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
          <h2 className="mb-4 text-2xl font-bold">
            Colour step pairings and contrast requirements
          </h2>
          <div className="mb-6 prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Each colour step is designed to work with specific other steps to
              ensure accessibility. The configuration defines contrast
              requirements using both{' '}
              <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr>{' '}
              (Accessible Perceptual Contrast Algorithm) and{' '}
              <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1
              standards.
            </p>
            <p>
              These requirements come directly from the configuration file,
              keeping documentation in sync with implementation. Each pairing
              specifies minimum contrast levels for different use cases — from
              subtle UI components to body text.
            </p>
          </div>

          <div className="p-4 mb-6 text-sm border rounded-lg border-neutral-subtle">
            <p className="mb-2 font-medium">Understanding the levels:</p>
            <ul className="space-y-1 text-neutral-subtle">
              <li>
                <strong>
                  <abbr title="Accessible Perceptual Contrast Algorithm">
                    APCA
                  </abbr>{' '}
                  Lc values:
                </strong>{' '}
                Range from 15 (decorative elements) to 90 (body text). Higher
                values mean stronger contrast requirements.
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

          <div className="p-4 mt-6 text-sm rounded-lg bg-surface">
            <h3 className="mb-2 font-semibold">Key insights</h3>
            <ul className="space-y-1 list-disc list-inside text-neutral-subtle">
              <li>
                <strong>Background steps</strong> (Canvas, Surface) need minimal
                contrast between each other but high contrast with text elements
              </li>
              <li>
                <strong>Fill elements</strong> have progressive contrast
                requirements based on emphasis level (muted vs. emphasis)
              </li>
              <li>
                <strong>Border steps</strong> maintain visual hierarchy through
                three levels (subtle, medium, strong)
              </li>
              <li>
                <strong>Text elements</strong> have the strictest requirements —
                different levels for subtle text, strong text, and text on
                emphasis backgrounds
              </li>
              <li>
                <strong>Interactive states</strong> (default, hover, active) are
                differentiated through lightness and contrast requirements
              </li>
            </ul>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="scroll-mt-8">
          <h2 className="mb-4 text-2xl font-bold">Best practices</h2>
          <div className="p-6 rounded-lg bg-surface">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold text-green-600 dark:text-green-400">
                  ✓
                </span>
                <div>
                  <p className="font-medium">
                    Start with a well-saturated base colour
                  </p>
                  <p className="text-sm text-neutral-subtle">
                    The Gaussian function scales down from the base chroma.
                    Starting with higher chroma gives more flexibility.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600 dark:text-green-400">
                  ✓
                </span>
                <div>
                  <p className="font-medium">Test contrast ratios regularly</p>
                  <p className="text-sm text-neutral-subtle">
                    Enable contrast checking to ensure all colour combinations
                    meet accessibility requirements.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="font-bold text-green-600 dark:text-green-400">
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
          <h2 className="mb-4 text-2xl font-bold">Learn more</h2>
          <div className="p-6 rounded-lg bg-surface">
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://developer.chrome.com/docs/css-ui/high-definition-css-color-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  High definition CSS color guide
                </a>
              </li>
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
                  OKLCH in CSS: why we moved from{' '}
                  <abbr title="Red Green Blue">RGB</abbr> and{' '}
                  <abbr title="Hue Saturation Lightness">HSL</abbr>
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
                  href="https://www.radix-ui.com/colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Radix UI: A gorgeous, accessible color system for user
                  interfaces
                </a>
              </li>
              <li>
                <a
                  href="https://www.figma.com/proto/YQNlL2nGozvROuz8G2XnQU/Presentations?node-id=29732-29814&p=f&t=PTYP4InT4YxjKvbq-1&scaling=contain&content-scaling=fixed&page-id=29732%3A29813"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  EDS APCA presentation Global Accessibility Awareness Day 2024
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
