import { useThemeConfig } from '@docusaurus/theme-common'
import GithubSvg from '../../images/github-logo.svg'
import FigmaSvg from '../../images/figma-logo.svg'
import Link from '@docusaurus/Link'

import type { JSX, ReactNode } from 'react'

type FooterLink = {
  label: string
  to: string
}

type FooterColumn = {
  title: string
  links: FooterLink[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Get started',
    links: [
      {
        label: 'Getting Started',
        to: '/getting-started',
      },
      {
        label: 'Design',
        to: '/docs/Next/about/getting-started/design/getting_started_design',
      },
      {
        label: 'Develop',
        to: '/docs/Next/about/getting-started/develop/getting_started_development',
      },
      {
        label: 'Citizen developer',
        to: '/docs/Next/about/getting-started/develop/citizen_developers',
      },
      {
        label: 'Team lead',
        to: '/docs/Next/about/getting-started/team_roles',
      },
    ],
  },
  {
    title: 'Foundation',
    links: [
      {
        label: 'Typography',
        to: '/docs/Next/foundation/design-tokens/typography',
      },
      { label: 'Colours', to: '/docs/Next/foundation/colour/intro' },
      { label: 'Icons', to: '/docs/Next/foundation/assets/system_icons' },
      { label: 'Spacing', to: '/docs/Next/foundation/design-tokens/spacing' },
    ],
  },
  {
    title: 'Components',
    links: [
      { label: 'All components', to: '/docs/Next/components' },
      { label: 'Storybook', to: 'https://storybook.eds.equinor.com' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'About EDS', to: '/about' },
      { label: 'Support', to: '/docs/Next/support' },
    ],
  },
]

function FooterColumn({ title, links }: FooterColumn): ReactNode {
  return (
    <div className="footer__column">
      <p className="footer__column-title">{title}</p>
      <ul className="footer__column-links">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="footer__column-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig()

  if (!footer) {
    return null
  }
  const { copyright } = footer

  return (
    <footer className="footer">
      <div className="footer__columns">
        {FOOTER_COLUMNS.map((col) => (
          <FooterColumn key={col.title} {...col} />
        ))}
      </div>
      <div className="footer__bottom">
        <div className="footer__copyright">{copyright}</div>
        <div className="footer__social">
          <Link
            to="https://www.figma.com/"
            className="footer__social-link"
            aria-label="Figma (opens in new tab)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FigmaSvg />
          </Link>
          <Link
            to="https://www.github.com/equinor/design-system"
            className="footer__social-link"
            aria-label="EDS Github (opens in new tab)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubSvg />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
