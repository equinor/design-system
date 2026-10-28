'use client'

import { useState } from 'react'
import type { TokenPalette } from '@/utils/palette'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import {
  BORDER_STEPS,
  DEFAULT_SURFACE,
  RECOMMENDED,
  SURFACE_STEPS,
  TEXT_STEPS,
  SurfacePreview,
  SurfaceSelect,
  type SurfaceConfig,
} from './SurfacePreview'

export function SurfacePreviewSection({
  allPalettes,
}: {
  allPalettes: TokenPalette[]
}) {
  const [surfaceConfig, setSurfaceConfig] =
    useState<SurfaceConfig>(DEFAULT_SURFACE)

  return (
    <Card
      title="Surface preview"
      description="See how background layers, borders, and text stack in a real layout"
      className="mt-12"
      padded={false}
    >
      {/* Layer selectors */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-muted px-5 py-4">
        <SurfaceSelect
          label="Page"
          value={surfaceConfig.page}
          onChange={(v) => setSurfaceConfig((c) => ({ ...c, page: v }))}
          options={SURFACE_STEPS}
          recommended={RECOMMENDED.page}
        />
        <SurfaceSelect
          label="Panel"
          value={surfaceConfig.panel}
          onChange={(v) => setSurfaceConfig((c) => ({ ...c, panel: v }))}
          options={SURFACE_STEPS}
          recommended={RECOMMENDED.panel}
        />
        <SurfaceSelect
          label="Card row"
          value={surfaceConfig.cardRow}
          onChange={(v) => setSurfaceConfig((c) => ({ ...c, cardRow: v }))}
          options={SURFACE_STEPS}
          recommended={RECOMMENDED.cardRow}
        />
        <SurfaceSelect
          label="Card"
          value={surfaceConfig.card}
          onChange={(v) => setSurfaceConfig((c) => ({ ...c, card: v }))}
          options={SURFACE_STEPS}
          recommended={RECOMMENDED.card}
        />
        <SurfaceSelect
          label="Border"
          value={surfaceConfig.border}
          onChange={(v) => setSurfaceConfig((c) => ({ ...c, border: v }))}
          options={BORDER_STEPS}
          recommended={RECOMMENDED.border}
        />
        <SurfaceSelect
          label="Text"
          value={surfaceConfig.text}
          onChange={(v) => setSurfaceConfig((c) => ({ ...c, text: v }))}
          options={TEXT_STEPS}
          recommended={RECOMMENDED.text}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSurfaceConfig(DEFAULT_SURFACE)}
        >
          Reset
        </Button>
      </div>

      {/* Preview area — one per palette. It scrolls inside the card when
          many palettes (custom ones included) do not fit. */}
      <div className="overflow-x-auto">
        <div className="flex">
          {allPalettes.map((pal, palIdx) => (
            <div key={`${pal.name}-${palIdx}`} className="px-5 py-4">
              <div className="mb-3 text-sm font-medium text-secondary">
                {pal.name}
              </div>
              <SurfacePreview config={surfaceConfig} steps={pal.steps} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
