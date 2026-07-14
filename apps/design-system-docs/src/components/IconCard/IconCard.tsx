import Link from '@docusaurus/Link'
import { arrow_forward } from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'

import { Icon } from '../Icon'
import type { IconCardProps } from './IconCard.types'

import './icon-card.css'

/** Distinguishes eds-icons IconData from an arbitrary React node. */
const isIconData = (icon: unknown): icon is IconData =>
  typeof icon === 'object' && icon !== null && 'svgPathData' in icon

const isExternal = (to: string) => /^https?:\/\//.test(to)

/**
 * Icon + title + description card. Replaces the topic/path/principle/bento card
 * variants that were copy-pasted across the landing pages.
 */
export function IconCard({
  icon,
  title,
  description,
  to,
  badge,
  disabled,
}: IconCardProps) {
  const interactive = Boolean(to) && !disabled

  const body = (
    <>
      <div className="docs-icon-card__top">
        <span className="docs-icon-card__icon">
          {isIconData(icon) ? <Icon data={icon} /> : icon}
        </span>
        {badge && (
          <span
            className="docs-icon-card__badge"
            data-tone={badge.tone ?? 'neutral'}
          >
            {badge.label}
          </span>
        )}
      </div>
      <h3 className="docs-icon-card__title">{title}</h3>
      <p className="docs-icon-card__description">{description}</p>
      {interactive && (
        <span className="docs-icon-card__arrow" aria-hidden="true">
          <Icon data={arrow_forward} />
        </span>
      )}
    </>
  )

  if (interactive) {
    const external = isExternal(to as string)
    return (
      <Link
        to={to}
        className="docs-icon-card"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {body}
      </Link>
    )
  }

  return (
    <div className="docs-icon-card" data-disabled={disabled || undefined}>
      {body}
    </div>
  )
}

IconCard.displayName = 'IconCard'
