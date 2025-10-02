import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { Settings, Info } from 'lucide-react'
import Link from 'next/link'

type HeaderPanelProps = {
  showConfigPanel: boolean
  setShowConfigPanel: React.Dispatch<React.SetStateAction<boolean>>
}

export const HeaderPanel = ({
  showConfigPanel,
  setShowConfigPanel,
}: HeaderPanelProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl">Accessible Colour Palette</h1>
        <p className="text-sm sm:text-md text-subtle">
          Colours are generated using an algorithm for chroma with predefined
          lightness values and hues.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/about"
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-subtle hover:bg-neutral-fill-muted-hover transition-colors rounded-md"
          title="Learn how the generator works"
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </Link>
        <button
          type="button"
          onClick={() => setShowConfigPanel(!showConfigPanel)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-subtle hover:bg-neutral-fill-muted-hover transition-colors rounded-md"
          title="Open configuration panel"
          data-testid="config-button"
          aria-expanded={showConfigPanel}
          aria-controls="display-options-panel"
        >
          <Settings className="w-4 h-4" />
          <span>Display</span>
        </button>
        <ThemeToggle />
      </div>
    </div>
  )
}
