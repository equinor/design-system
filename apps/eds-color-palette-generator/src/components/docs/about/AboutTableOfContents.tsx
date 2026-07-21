const SECTIONS = [
  { href: '#overview', label: '1. Overview' },
  { href: '#how-it-works', label: '2. How it works' },
  { href: '#gaussian-bell-curve', label: '3. The Gaussian bell curve' },
  { href: '#chroma-distribution', label: '4. Interactive chroma distribution' },
  { href: '#oklch-color-space', label: '5. Why OKLCH color space?' },
  { href: '#configuration', label: '6. Configuration options' },
  {
    href: '#contrast-requirements',
    label: '7. Color step pairings and contrast requirements',
  },
  { href: '#best-practices', label: '8. Best practices' },
  { href: '#learn-more', label: '9. Learn more' },
]

export function AboutTableOfContents() {
  return (
    <nav className="p-6 rounded-lg bg-surface">
      <h2 className="mb-4 text-xl font-bold">Table of contents</h2>
      <ol className="space-y-2 text-sm">
        {SECTIONS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
