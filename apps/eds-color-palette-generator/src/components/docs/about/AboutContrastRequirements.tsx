import { ContrastRequirementsTable } from '@/components/docs/ContrastRequirementsTable'

export function AboutContrastRequirements() {
  return (
    <section id="contrast-requirements" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Contrast requirements</h2>
      <div className="mb-6 space-y-4">
        <p>
          Contrast is checked with{' '}
          <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr>,
          the Accessible Perceptual Contrast Algorithm, as ADR 0016 sets out in
          Confirmation 5. APCA gives a contrast value called Lc, where a higher
          value means more contrast, and it takes into account whether the text
          is darker or lighter than its background. Lc 90 is the level APCA
          prefers for body text, and Lc 60 is its minimum for content text that
          is not body text, such as labels and helper text.
        </p>
        <ul className="space-y-2 pl-5 list-disc">
          <li>
            <strong>Text and icons</strong> are measured against{' '}
            <code>background.surface</code> (neutral step 15): Lc 90 for{' '}
            <code>text.primary</code> (step 13), and Lc 60 for{' '}
            <code>text.secondary</code> (step 8) and the interactive icons
            (steps 11 and 12).
          </li>
          <li>
            <strong>Text on emphasis fills</strong>,{' '}
            <code>text.on-emphasis.&lt;tone&gt;</code> (step 15), is measured
            against the tone&apos;s default emphasis fill,{' '}
            <code>background.interactive.&lt;tone&gt;.emphasis.default</code>{' '}
            (step 9), at Lc 60.
          </li>
          <li>
            <strong>Borders</strong> have no contrast requirement yet. ADR 0016
            leaves them out because APCA has no agreed target for borders.
          </li>
        </ul>
        <p>
          The Theme Builder checks each pair inside every palette. For palettes
          other than the neutral one, the palette&apos;s own step 15 stands in
          for <code>background.surface</code>; both have the same lightness. The{' '}
          <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1
          ratio is shown next to each requirement for reference, but the check
          is based on APCA.
        </p>
      </div>

      <ContrastRequirementsTable />
    </section>
  )
}
