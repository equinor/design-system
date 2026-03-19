'use client'

import { useMemo } from 'react'
import { Autocomplete } from '@equinor/eds-core-react'
import * as icons from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import './icon-autocomplete.css'

type IconAutocompleteProps = {
  value: IconData | null
  onChange: (iconData: IconData | null) => void
}

type IconOption = {
  name: string
  data: IconData
}

// Get all icon names and data
const allIcons: IconOption[] = Object.entries(icons)
  .filter(([, value]) => typeof value === 'object' && 'svgPathData' in value)
  .map(([name, data]) => ({
    name,
    data: data as IconData,
  }))

export const IconAutocomplete = ({ value, onChange }: IconAutocompleteProps) => {
  // Find the currently selected option
  const selectedOption = useMemo(() => {
    if (!value) return []
    const found = allIcons.find((icon) => icon.data === value)
    return found ? [found] : []
  }, [value])

  return (
    <div className="icon-autocomplete">
      <Autocomplete
        label="Select Icon"
        options={allIcons}
        optionLabel={(option: IconOption) => option.name}
        selectedOptions={selectedOption}
        onOptionsChange={(changes) => {
          if (changes.selectedItems.length > 0) {
            onChange(changes.selectedItems[0].data)
          } else {
            onChange(null)
          }
        }}
      />

      <p className="icon-autocomplete__count">
        {allIcons.length} icons available
      </p>
    </div>
  )
}
