import { ContrastRequirementsTable } from '@/components/docs/ContrastRequirementsTable'

export function AboutContrastRequirements() {
  return (
    <section id="contrast-requirements" className="scroll-mt-8">
      <h2 className="mb-4 text-2xl font-bold">
        Colour step pairings and contrast requirements
      </h2>
      <div className="mb-6 prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Each colour step is designed to work with specific other steps to
          ensure accessibility. The configuration defines contrast requirements
          using both{' '}
          <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr>{' '}
          (Accessible Perceptual Contrast Algorithm) and{' '}
          <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1
          standards.
        </p>
        <p>
          These requirements come directly from the configuration file, keeping
          documentation in sync with implementation. Each pairing specifies
          minimum contrast levels for different use cases — from subtle UI
          components to body text.
        </p>
      </div>

      <div className="p-4 mb-6 text-sm border rounded-lg border-neutral-subtle">
        <p className="mb-2 font-medium">Understanding the levels:</p>
        <ul className="space-y-1 text-neutral-subtle">
          <li>
            <strong>
              <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr>{' '}
              Lc values:
            </strong>{' '}
            Range from 15 (decorative elements) to 90 (body text). Higher values
            mean stronger contrast requirements.
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
            different levels for subtle text, strong text, and text on emphasis
            backgrounds
          </li>
          <li>
            <strong>Interactive states</strong> (default, hover, active) are
            differentiated through lightness and contrast requirements
          </li>
        </ul>
      </div>
    </section>
  )
}
