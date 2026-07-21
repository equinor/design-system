export function AboutBestPractices() {
  return (
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
                The Gaussian function scales down from the base chroma. Starting
                with higher chroma gives more flexibility.
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
                Enable contrast checking to ensure all colour combinations meet
                accessibility requirements.
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
  )
}
