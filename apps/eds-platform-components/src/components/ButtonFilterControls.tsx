'use client'

import { Button } from '@equinor/eds-core-react'
import './button-filter-controls.css'

type ButtonVariant = 'contained' | 'outlined' | 'ghost'
type ButtonColor = 'primary' | 'secondary' | 'danger'

type ButtonFilterControlsProps = {
  variant: ButtonVariant
  color: ButtonColor
  disabled: boolean
  onVariantChange: (variant: ButtonVariant) => void
  onColorChange: (color: ButtonColor) => void
  onDisabledChange: (disabled: boolean) => void
}

const variantIndexMap: Record<ButtonVariant, number> = {
  contained: 0,
  outlined: 1,
  ghost: 2,
}

const colorIndexMap: Record<ButtonColor, number> = {
  primary: 0,
  secondary: 1,
  danger: 2,
}

export const ButtonFilterControls = ({
  variant,
  color,
  disabled,
  onVariantChange,
  onColorChange,
  onDisabledChange,
}: ButtonFilterControlsProps) => {
  const handleVariantChange = (indexes: number[]) => {
    const variants: ButtonVariant[] = ['contained', 'outlined', 'ghost']
    if (indexes.length > 0) {
      onVariantChange(variants[indexes[0]])
    }
  }

  const handleColorChange = (indexes: number[]) => {
    const colors: ButtonColor[] = ['primary', 'secondary', 'danger']
    if (indexes.length > 0) {
      onColorChange(colors[indexes[0]])
    }
  }

  const handleDisabledChange = (indexes: number[]) => {
    if (indexes.length > 0) {
      onDisabledChange(indexes[0] === 1)
    }
  }

  return (
    <div className="button-filter-controls">
      <div className="filter-section">
        <label className="filter-label">Variant</label>
        <Button.Toggle
          selectedIndexes={[variantIndexMap[variant]]}
          onChange={handleVariantChange}
        >
          <Button>Contained</Button>
          <Button>Outlined</Button>
          <Button>Ghost</Button>
        </Button.Toggle>
      </div>

      <div className="filter-section">
        <label className="filter-label">Color</label>
        <Button.Toggle
          selectedIndexes={[colorIndexMap[color]]}
          onChange={handleColorChange}
        >
          <Button>Primary</Button>
          <Button>Secondary</Button>
          <Button>Danger</Button>
        </Button.Toggle>
      </div>

      <div className="filter-section">
        <label className="filter-label">State</label>
        <Button.Toggle
          selectedIndexes={[disabled ? 1 : 0]}
          onChange={handleDisabledChange}
        >
          <Button>Normal</Button>
          <Button>Disabled</Button>
        </Button.Toggle>
      </div>
    </div>
  )
}
