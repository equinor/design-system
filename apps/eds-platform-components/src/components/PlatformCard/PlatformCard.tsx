import type { PlatformCardProps } from './PlatformCard.types'
import './platform-card.css'

export const PlatformCard = ({
  title,
  description,
  isActive = false,
  onClick,
}: PlatformCardProps) => {
  return (
    <button
      className={`platform-card ${isActive ? 'platform-card--active' : ''}`}
      onClick={onClick}
    >
      <h3 className="platform-card__title">{title}</h3>
      <p className="platform-card__description">{description}</p>
    </button>
  )
}
