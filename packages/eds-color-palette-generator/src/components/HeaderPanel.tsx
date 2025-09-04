import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { Settings } from 'lucide-react'

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
        <h1 className="text-2xl">Accessible Colour Palette</h1>
        <p className="text-md text-subtle">
          Colours are generated using an algorithm for chroma with predefined
          lightness values and hues.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowConfigPanel(!showConfigPanel)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-subtle hover:bg-neutral-medium-hover transition-colors rounded-md"
          title="Open configuration panel"
          data-testid="config-button"
        >
          <Settings className="w-4 h-4" />
          <span>Config</span>
        </button>
        <ThemeToggle />
      </div>
    </div>
  )
}
