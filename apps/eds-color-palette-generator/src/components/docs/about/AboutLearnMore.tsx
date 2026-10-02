import { ADR_0016_URL } from './links'

type Resource = { href: string; label: string; text: string }

const EDS: Resource[] = [
  {
    href: ADR_0016_URL,
    label: 'ADR 0016: Colour approach for EDS 2.0',
    text: 'The decisions this tool follows: the generation formula, the hand-set lightness, the step roles and the contrast targets.',
  },
  {
    href: 'https://github.com/equinor/design-system/blob/main/documentation/adr/0011-adopt-tokens-studio-platform-pipeline.md',
    label:
      'ADR 0011: Adopt the Tokens Studio platform as the source and pipeline for design tokens',
    text: 'Why Tokens Studio is the source of truth for EDS tokens.',
  },
  {
    href: 'https://www.figma.com/proto/YQNlL2nGozvROuz8G2XnQU/Presentations?node-id=29732-29814&p=f&t=PTYP4InT4YxjKvbq-1&scaling=contain&content-scaling=fixed&page-id=29732%3A29813',
    label: 'EDS APCA presentation, Global Accessibility Awareness Day 2024',
    text: 'The EDS team’s presentation on APCA.',
  },
]

const COLOUR: Resource[] = [
  {
    href: 'https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl',
    label: 'OKLCH in CSS: why we moved from RGB and HSL',
    text: 'A practical introduction to OKLCH and why it suits generated palettes.',
  },
  {
    href: 'https://developer.chrome.com/docs/css-ui/high-definition-css-color-guide',
    label: 'High definition CSS color guide',
    text: 'The new CSS colour spaces, including oklch(), and wide-gamut colour.',
  },
  {
    href: 'https://lea.verou.me/blog/2020/04/lch-colors-in-css-what-why-and-how/',
    label: 'LCH colors in CSS: what, why, and how?',
    text: 'The idea behind lightness, chroma and hue, from one of the authors of colorjs.io, the colour library this tool uses.',
  },
  {
    href: 'https://oklch.com/',
    label: 'OKLCH color picker and converter',
    text: 'Pick a colour in OKLCH and see which values fall outside sRGB.',
  },
  {
    href: 'https://git.apcacontrast.com/documentation/APCAeasyIntro',
    label: 'APCA contrast algorithm: an easy introduction',
    text: 'What Lc means and which levels to use for text and other content.',
  },
  {
    href: 'https://www.radix-ui.com/colors',
    label: 'Radix Colors',
    text: 'Another design system colour scale where each step has a defined role.',
  },
]

function ResourceList({ items }: { items: Resource[] }) {
  return (
    <ul className="m-0 list-none space-y-3 p-0 text-sm">
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link underline hover:text-link-hover"
          >
            {item.label}
          </a>
          <p className="m-0 text-secondary">{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

export function AboutLearnMore() {
  return (
    <section id="learn-more" className="pb-12 scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Learn more</h2>
      <div className="space-y-6 rounded border border-muted bg-surface p-6">
        <div>
          <h3 className="m-0 mb-3 text-header-md font-medium">EDS</h3>
          <ResourceList items={EDS} />
        </div>
        <div>
          <h3 className="m-0 mb-3 text-header-md font-medium">
            Colour and contrast
          </h3>
          <ResourceList items={COLOUR} />
        </div>
      </div>
    </section>
  )
}
