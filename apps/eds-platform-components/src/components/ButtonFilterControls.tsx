'use client'

import { Chip } from '@equinor/eds-core-react'
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

export const ButtonFilterControls = ({
  variant,
  color,
  disabled,
  onVariantChange,
  onColorChange,
  onDisabledChange,
}: ButtonFilterControlsProps) => {
  return (
    <div className="button-filter-controls">
      <div className="filter-section">
        <label className="filter-label">Variant</label>
        <div className="filter-options">
          <Chip
            onClick={() => onVariantChange('contained')}
            variant={variant === 'contained' ? 'active' : 'default'}
          >
            Contained
          </Chip>
          <Chip
            onClick={() => onVariantChange('outlined')}
            variant={variant === 'outlined' ? 'active' : 'default'}
          >
            Outlined
          </Chip>
          <Chip
            onClick={() => onVariantChange('ghost')}
            variant={variant === 'ghost' ? 'active' : 'default'}
          >
            Ghost
          </Chip>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Color</label>
        <div className="filter-options">
          <Chip
            onClick={() => onColorChange('primary')}
            variant={color === 'primary' ? 'active' : 'default'}
          >
            Primary
          </Chip>
          <Chip
            onClick={() => onColorChange('secondary')}
            variant={color === 'secondary' ? 'active' : 'default'}
          >
            Secondary
          </Chip>
          <Chip
            onClick={() => onColorChange('danger')}
            variant={color === 'danger' ? 'active' : 'default'}
          >
            Danger
          </Chip>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">State</label>
        <div className="filter-options">
          <Chip
            onClick={() => onDisabledChange(false)}
            variant={!disabled ? 'active' : 'default'}
          >
            Normal
          </Chip>
          <Chip
            onClick={() => onDisabledChange(true)}
            variant={disabled ? 'active' : 'default'}
          >
            Disabled
          </Chip>
        </div>
      </div>
    </div>
  )
}
