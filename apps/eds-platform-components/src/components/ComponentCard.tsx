import { CopyButton } from './CopyButton'
import { ButtonPreview } from './ButtonPreview'

type ButtonVariant = 'contained' | 'outlined' | 'ghost'
type ButtonColor = 'primary' | 'secondary' | 'danger'

type ComponentCardProps = {
  name: string
  variant: ButtonVariant
  color: ButtonColor
  disabled?: boolean
  yamlContent: string
}

export const ComponentCard = ({
  name,
  variant,
  color,
  disabled = false,
  yamlContent,
}: ComponentCardProps) => {
  const getDisplayName = () => {
    const variantName = variant.charAt(0).toUpperCase() + variant.slice(1)
    const colorName = color.charAt(0).toUpperCase() + color.slice(1)
    const disabledText = disabled ? ' (Disabled)' : ''
    return `${variantName} - ${colorName}${disabledText}`
  }

  return (
    <div className="component-card">
      <div className="component-card__header">
        <h3 className="component-card__title">{getDisplayName()}</h3>
        <span className="component-card__id">{name}</span>
      </div>

      <div className="component-card__preview">
        <ButtonPreview
          variant={variant}
          color={color}
          disabled={disabled}
          text={getDisplayName()}
        />
      </div>

      <div className="component-card__actions">
        <CopyButton content={yamlContent} />
      </div>
    </div>
  )
}
