import { useThemeConfig } from '@docusaurus/theme-common'
import Link from '@docusaurus/Link'

import type { JSX, ReactNode } from 'react'

import GithubSvg from '../../images/github-logo.svg'
import FigmaSvg from '../../images/figma-logo.svg'

type FooterItem = {
  label: string
  to?: string
  href?: string
}

type FooterColumnProps = {
  title?: string
  items: FooterItem[]
}

function FooterColumn({ title, items }: FooterColumnProps): ReactNode {
  return (
    <div className="footer__column">
      {title && <p className="footer__column-title">{title}</p>}
      <ul className="footer__column-links">
        {items.map((item) => (
          <li key={item.to ?? item.href}>
            <Link
              className="footer__column-link"
              {...(item.href ? { href: item.href } : { to: item.to })}
            >
              {item.label}
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

  const { copyright, links = [] } = footer
  const columns = links as unknown as FooterColumnProps[]

  return (
    <footer className="footer">
      <div className="footer__columns">
        {columns.map((col, index) => (
          <FooterColumn key={col.title ?? index} {...col} />
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
