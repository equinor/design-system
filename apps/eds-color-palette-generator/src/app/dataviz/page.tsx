'use client'

import { AppHeader } from '@/components/shared/AppHeader'
import { DataVizPanel } from '@/components/themebuilder/dataviz/DataVizPanel'
import { Main } from '@/components/shared/Main'

export default function DataVizPage() {
  return (
    <div className="min-h-screen bg-canvas text-primary">
      <AppHeader />

      <Main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="m-0 text-header-2xl font-medium">Data visualisation</h1>
        <p className="mt-2 mb-6 max-w-3xl text-sm text-secondary">
          Generate accessible colour palettes for charts and data visualisation:
          distinct categorical series, ordered sequential scales, and diverging
          scales around a midpoint. Everything is checked for
          colour-vision-deficiency safety and adapts to light and dark mode.
        </p>
        <DataVizPanel />
      </Main>
    </div>
  )
}
