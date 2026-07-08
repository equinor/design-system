import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { Settings, Info, BarChart3, Palette, Layers, Paintbrush } from 'lucide-react'
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
          href="/themebuilder"
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-subtle hover:bg-neutral-fill-muted-hover transition-colors rounded-md"
          title="Theme builder"
        >
          <Paintbrush className="w-4 h-4" />
          <span>Theme Builder</span>
        </Link>
        <Link
          href="/contrast"
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-subtle hover:bg-neutral-fill-muted-hover transition-colors rounded-md"
          title="Contrast checker"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Contrast</span>
        </Link>
        <Link
          href="/example"
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-subtle hover:bg-neutral-fill-muted-hover transition-colors rounded-md"
          title="Example colour combinations"
        >
          <Palette className="w-4 h-4" />
          <span>Example</span>
        </Link>
        <Link
          href="/palette"
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-subtle hover:bg-neutral-fill-muted-hover transition-colors rounded-md"
          title="Palette editor"
        >
          <Layers className="w-4 h-4" />
          <span>Palette</span>
        </Link>
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
