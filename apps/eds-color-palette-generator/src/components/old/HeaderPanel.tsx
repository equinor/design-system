import React from 'react'
import { gear } from '@equinor/eds-icons'
import { Button } from '@/components/shared/Button'
import { Icon } from '@/components/shared/Icon'

type HeaderPanelProps = {
  showConfigPanel: boolean
  setShowConfigPanel: React.Dispatch<React.SetStateAction<boolean>>
}

// Navigation and the theme toggle live in the AppHeader above this panel.
export const HeaderPanel = ({
  showConfigPanel,
  setShowConfigPanel,
}: HeaderPanelProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="m-0 text-header-xl sm:text-header-2xl font-medium">
          Accessible Colour Palette
        </h1>
        <p className="mt-1 text-sm sm:text-base text-secondary">
          Colours are generated using an algorithm for chroma with predefined
          lightness values and hues.
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => setShowConfigPanel(!showConfigPanel)}
        title="Open configuration panel"
        data-testid="config-button"
        aria-expanded={showConfigPanel}
        aria-controls="display-options-panel"
      >
        <Icon data={gear} size={16} />
        <span>Display</span>
      </Button>
    </div>
  )
}
