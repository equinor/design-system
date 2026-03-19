'use client'

import { Button } from '@equinor/eds-core-react'
import { IconAutocomplete } from './IconAutocomplete'
import type { IconData } from '@equinor/eds-icons'
import './icon-filter-controls.css'

type IconFilterControlsProps = {
  iconData: IconData | null
  disabled: boolean
  onIconChange: (iconData: IconData | null) => void
  onDisabledChange: (disabled: boolean) => void
}

export const IconFilterControls = ({
  iconData,
  disabled,
  onIconChange,
  onDisabledChange,
}: IconFilterControlsProps) => {
  const handleDisabledChange = (indexes: number[]) => {
    if (indexes.length > 0) {
      onDisabledChange(indexes[0] === 1)
    }
  }

  return (
    <div className="icon-filter-controls">
      <div className="filter-section">
        <IconAutocomplete value={iconData} onChange={onIconChange} />
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
