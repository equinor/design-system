const SECTIONS = [
  { href: '#overview', label: 'Overview' },
  { href: '#how-it-works', label: 'How a scale is made' },
  { href: '#steps', label: 'The 15 steps' },
  { href: '#gaussian-bell-curve', label: 'The Gaussian chroma curve' },
  { href: '#chroma-distribution', label: 'Try it' },
  { href: '#oklch-color-space', label: 'Why OKLCH' },
  { href: '#light-and-dark', label: 'Light and dark mode' },
  { href: '#contrast-requirements', label: 'Contrast requirements' },
  { href: '#proposing-a-change', label: 'Proposing a change to Tokens Studio' },
  { href: '#tips', label: 'Tips' },
  { href: '#learn-more', label: 'Learn more' },
]

export function AboutTableOfContents() {
  return (
    <nav
      aria-labelledby="about-contents"
      className="p-6 rounded border border-muted bg-surface"
    >
      <h2 id="about-contents" className="m-0 mb-4 text-header-lg font-medium">
        Contents
      </h2>
      <ol className="m-0 space-y-2 pl-5 text-sm list-decimal">
        {SECTIONS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="text-link underline hover:text-link-hover"
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
