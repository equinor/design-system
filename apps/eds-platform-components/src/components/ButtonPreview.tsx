import { CSSProperties } from 'react'

type ButtonVariant = 'contained' | 'outlined' | 'ghost'
type ButtonColor = 'primary' | 'secondary' | 'danger'

type ButtonPreviewProps = {
  variant: ButtonVariant
  color: ButtonColor
  disabled?: boolean
  text: string
}

const colorMap = {
  primary: {
    bg: '#007079',
    hover: '#004F55',
    text: '#FFFFFF',
  },
  secondary: {
    bg: '#243746',
    hover: '#1A2A36',
    text: '#FFFFFF',
  },
  danger: {
    bg: '#EB0000',
    hover: '#B30000',
    text: '#FFFFFF',
  },
}

export const ButtonPreview = ({
  variant,
  color,
  disabled = false,
  text,
}: ButtonPreviewProps) => {
  const colorScheme = colorMap[color]

  const getStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      height: '36px',
      padding: '0 16px',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'Lato, "Segoe UI", sans-serif',
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      outline: 'none',
    }

    if (disabled) {
      return {
        ...baseStyles,
        backgroundColor: '#EAEAEA',
        color: '#BEBEBE',
        border: variant === 'outlined' ? '1px solid #DCDCDC' : 'none',
      }
    }

    switch (variant) {
      case 'contained':
        return {
          ...baseStyles,
          backgroundColor: colorScheme.bg,
          color: colorScheme.text,
        }
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: colorScheme.bg,
          border: `1px solid ${colorScheme.bg}`,
        }
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: colorScheme.bg,
        }
      default:
        return baseStyles
    }
  }

  return (
    <button style={getStyles()} disabled={disabled} className="button-preview">
      {text}
    </button>
  )
}
