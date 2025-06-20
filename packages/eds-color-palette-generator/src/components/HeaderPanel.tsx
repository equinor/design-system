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
      <h1 className="text-2xl text-black dark:text-white">
        Accessible UI Color Palette
      </h1>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowConfigPanel(!showConfigPanel)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
          title="Open configuration panel"
        >
          ⚙️ Config
        </button>
        <ThemeToggle />
      </div>
    </div>
  )
}
