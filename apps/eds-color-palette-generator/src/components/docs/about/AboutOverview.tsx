import Link from 'next/link'
import { ADR_0016_URL } from './links'

const PAGES = [
  {
    href: '/',
    name: 'Theme Builder',
    text: 'Edit the palettes and see every semantic token they produce, the contrast of each text role and a preview of components. The Config button downloads your changed anchors as a proposal for Tokens Studio.',
  },
  {
    href: '/dataviz',
    name: 'Data visualisation',
    text: 'Categorical, sequential and diverging palettes for charts, checked for colour vision deficiency in light and dark mode.',
  },
  {
    href: '/palette',
    name: 'Palette editor',
    text: 'Palettes where you set each step by hand, starting from the generated ones. Saved palettes are offered on the Examples page.',
  },
  {
    href: '/contrast',
    name: 'Contrast',
    text: 'The contrast between the steps of each palette, one palette at a time or all together.',
  },
  {
    href: '/example',
    name: 'Examples',
    text: 'Semantic tokens from one palette applied to surfaces, text and components.',
  },
]

export function AboutOverview() {
  return (
    <section id="overview" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Overview</h2>
      <div className="space-y-4">
        <p>
          Every colour scale in the{' '}
          <abbr title="Equinor Design System">EDS</abbr> has 15 steps, and each
          step is generated from three inputs: the hue&apos;s anchor colour, a
          hand-set lightness for the step, and a Gaussian curve that decides how
          much of the anchor&apos;s chroma (colour intensity) the step keeps.
          This tool runs the same generation in the browser, so you can see what
          a change to the inputs does to every step, every semantic token and
          every contrast pair before anyone changes EDS.
        </p>
        <p>
          Tokens Studio is the source of truth for the inputs (
          <a
            href={ADR_0016_URL}
            className="text-link underline hover:text-link-hover"
          >
            ADR 0016
          </a>
          ). The tool reads them from the Tokens Studio pull in{' '}
          <code>packages/eds-tokens</code>, so the default palettes, the
          lightness of each step and the step roles are the values that ship in{' '}
          <code>@equinor/eds-tokens</code>. A test compares every generated step
          with the Tokens Studio export, for all seven hues in light and dark
          mode, and fails if the two drift apart. A palette you edit here is
          therefore a proposal: EDS changes only when the change is made in
          Tokens Studio.
        </p>
      </div>

      <h3 className="mt-8 mb-3 text-header-md font-medium">The pages</h3>
      <dl className="m-0 space-y-3">
        {PAGES.map((page) => (
          <div key={page.href}>
            <dt className="font-medium">
              <Link
                href={page.href}
                className="text-link underline hover:text-link-hover"
              >
                {page.name}
              </Link>
            </dt>
            <dd className="m-0 text-sm text-secondary">{page.text}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-secondary">
        The settings button in the header switches between light and dark mode
        and sets the density. Each mode has its own lightness values, so the
        examples on this page follow the mode you choose.
      </p>
    </section>
  )
}
