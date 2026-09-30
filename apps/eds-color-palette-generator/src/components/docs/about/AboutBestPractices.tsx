export function AboutBestPractices() {
  return (
    <section id="best-practices" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Best practices</h2>
      <div className="p-6 rounded border border-muted bg-surface">
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="font-medium text-success">✓</span>
            <div>
              <p className="font-medium">
                Start with a well-saturated base colour
              </p>
              <p className="text-sm text-secondary">
                The Gaussian function scales down from the base chroma. Starting
                with higher chroma gives more flexibility.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-success">✓</span>
            <div>
              <p className="font-medium">Test contrast ratios regularly</p>
              <p className="text-sm text-secondary">
                Enable contrast checking to ensure all colour combinations meet
                accessibility requirements.
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="font-medium text-success">✓</span>
            <div>
              <p className="font-medium">
                Export and version your configurations
              </p>
              <p className="text-sm text-secondary">
                Save your palette configurations to maintain consistency and
                track changes over time.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
