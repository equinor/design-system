import { ContrastRequirementsTable } from '@/components/docs/ContrastRequirementsTable'

export function AboutContrastRequirements() {
  return (
    <section id="contrast-requirements" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">
        Colour step pairings and contrast requirements
      </h2>
      <div className="mb-6 space-y-4">
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

      <div className="p-4 mb-6 text-sm border rounded border-muted">
        <p className="mb-2 font-medium">Understanding the levels:</p>
        <ul className="space-y-1 text-secondary">
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

      <div className="p-4 mt-6 text-sm rounded border border-muted bg-surface">
        <h3 className="mb-2 font-medium">Key insights</h3>
        <ul className="space-y-1 list-disc list-inside text-secondary">
          <li>
            <strong>Text and icons</strong> are measured against{' '}
            <code>background.surface</code> (neutral step 15): Lc 90 for{' '}
            <code>text.primary</code> (step 13), and Lc 60 for{' '}
            <code>text.secondary</code> (step 8) and interactive icons (steps
            11–13)
          </li>
          <li>
            <strong>Text on emphasis fills</strong>,{' '}
            <code>text.on-emphasis.&lt;tone&gt;</code> (step 15), is measured
            against the tone&apos;s default emphasis fill,{' '}
            <code>background.interactive.&lt;tone&gt;.emphasis.default</code>{' '}
            (step 9), at Lc 60
          </li>
          <li>
            <strong>Fills</strong> step through default, hover and pressed by
            lightness: the muted fills at steps 1–3 and the emphasis fills at
            steps 9–11
          </li>
          <li>
            <strong>Borders</strong>,{' '}
            <code>border.non-interactive.&lt;tone&gt;</code> muted, default and
            emphasis (steps 4, 7 and 9), have no contrast requirement in ADR
            0016
          </li>
          <li>
            <strong>Steps 6 and 14</strong> have no semantic role in Tokens
            Studio
          </li>
        </ul>
      </div>
    </section>
  )
}
