import { useThemeConfig, FooterLinkItem } from '@docusaurus/theme-common'
import GithubSvg from '../../images/github-logo.svg'
import FigmaSvg from '../../images/figma-logo.svg'

import Link from '@docusaurus/Link'

interface FooterColumnItem {
  label: string
  items: FooterLinkItem[]
}

interface FooterLinksProps {
  links: FooterColumnItem[] | FooterLinkItem[]
}

// Comprehensive class-based icon mapping
const getIconComponent = (item: FooterLinkItem): JSX.Element | null => {
  const className = item.className?.toLowerCase() || ''

  if (className.includes('github')) {
    return <GithubSvg />
  }
  if (className.includes('figma')) {
    return <FigmaSvg />
  }

  return null
}

// Type guard to check if an item is a FooterColumnItem
const isFooterColumnItem = (
  item: FooterLinkItem | FooterColumnItem,
): item is FooterColumnItem => {
  return 'items' in item && Array.isArray((item as FooterColumnItem).items)
}

const FooterLinks = ({ links }: FooterLinksProps): JSX.Element => {
  return (
    <nav className="footer-links" aria-label="Footer navigation links">
      {links.map((linkItem: FooterLinkItem | FooterColumnItem) => (
        <div key={`${linkItem.label}`} className="footer-links__group">
          {isFooterColumnItem(linkItem) &&
            linkItem.items
              .map((item: FooterLinkItem) => {
                const icon = getIconComponent(item)
                if (!icon) {
                  return null
                }

                return (
                  <Link
                    key={`${item.href || item.to}`}
                    to={item.to || item.href}
                    className={`footer-links__link ${item.className || ''}`}
                    aria-label={
                      (item.label || item.href || 'Social link') +
                      ' (opens in new tab)'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {icon}
                  </Link>
                )
              })
              .filter(Boolean)}
        </div>
      ))}
    </nav>
  )
}
function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig()

  if (!footer) {
    return null
  }
  const { copyright, links } = footer
  console.log(links)

  return (
    <>
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__copyright">{copyright}</div>
          {links && links.length > 0 && <FooterLinks links={links} />}
        </div>
      </footer>
    </>
  )
}

export default Footer
