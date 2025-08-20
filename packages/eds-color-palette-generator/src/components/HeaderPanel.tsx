import React from 'react'
import { ThemeToggle } from './ThemeToggle'

type HeaderPanelProps = {
  showConfigPanel: boolean
  setShowConfigPanel: React.Dispatch<React.SetStateAction<boolean>>
}

export const HeaderPanel = ({
  showConfigPanel,
  setShowConfigPanel,
}: HeaderPanelProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl">Accessible UI Colour Palette</h1>
        <p className="text-md text-subtle">
          Color palettes are generated using an algorithm for chroma calculation
          with predefined lightness values.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowConfigPanel(!showConfigPanel)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-neutral-subtle hover:bg-neutral-medium-hover transition-colors rounded-md"
          title="Open configuration panel"
          data-testid="config-button"
        >
          ⚙️ Config
        </button>
        <ThemeToggle />
      </div>
    </div>
  )
}
