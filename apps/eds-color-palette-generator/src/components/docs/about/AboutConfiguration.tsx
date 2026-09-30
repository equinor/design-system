export function AboutConfiguration() {
  return (
    <section id="configuration" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Configuration options</h2>
      <div className="space-y-4">
        <div className="p-6 rounded border border-muted bg-surface">
          <h3 className="mb-3 text-header-md font-medium">Lightness values</h3>
          <p className="mb-3 text-sm text-secondary">
            Each step has predefined lightness values for light and dark modes,
            based on:
          </p>
          <ul className="space-y-1 text-sm list-disc list-inside text-secondary">
            <li>
              <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr>{' '}
              contrast requirements
            </li>
            <li>
              <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1
              Level AA/AAA guidelines
            </li>
            <li>Visual hierarchy needs (backgrounds, borders, text)</li>
            <li>Interactive state differentiation (default, hover, active)</li>
          </ul>
        </div>

        <div className="p-6 rounded border border-muted bg-surface">
          <h3 className="mb-3 text-header-md font-medium">
            Gaussian parameters
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">Mean</h4>
              <p className="text-sm text-secondary">
                The lightness value where chroma reaches maximum. Typically set
                to 0.6 for light mode and 0.7 for dark mode to ensure vibrant
                mid-tones.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Standard deviation</h4>
              <p className="text-sm text-secondary">
                Controls how quickly chroma decreases away from the mean. Lower
                values create sharper peaks (dramatic variation), higher values
                create gentler curves (gradual changes).
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded border border-muted bg-surface">
          <h3 className="mb-3 text-header-md font-medium">
            Separate light/dark modes
          </h3>
          <p className="text-sm text-secondary">
            Light and dark modes use different Gaussian parameters because:
          </p>
          <ul className="mt-3 space-y-1 text-sm list-disc list-inside text-secondary">
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
  )
}
