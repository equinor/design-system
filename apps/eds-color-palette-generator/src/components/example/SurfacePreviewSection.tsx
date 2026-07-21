'use client'

import { useState } from 'react'
import { STEP_ROLES, type TokenPalette } from '@/utils/palette'
import {
  BORDER_ROLES,
  DEFAULT_SURFACE,
  RECOMMENDED,
  SURFACE_ROLES,
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
    <section style={{ marginTop: '48px' }}>
      <h2 className="font-bold" style={{ fontSize: '15px', margin: '0 0 4px' }}>
        Surface Preview
      </h2>
      <p
        style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '0 0 16px',
        }}
      >
        See how background layers, borders, and text stack in a real layout
      </p>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid #e5e7eb', background: '#fff' }}
      >
        {/* Layer selectors */}
        <div
          className="flex flex-wrap gap-x-6 gap-y-3"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <SurfaceSelect
            label="Page"
            value={surfaceConfig.page}
            onChange={(v) => setSurfaceConfig((c) => ({ ...c, page: v }))}
            options={SURFACE_ROLES}
            recommended={RECOMMENDED.page}
          />
          <SurfaceSelect
            label="Panel"
            value={surfaceConfig.panel}
            onChange={(v) => setSurfaceConfig((c) => ({ ...c, panel: v }))}
            options={SURFACE_ROLES}
            recommended={RECOMMENDED.panel}
          />
          <SurfaceSelect
            label="Card row"
            value={surfaceConfig.cardRow}
            onChange={(v) => setSurfaceConfig((c) => ({ ...c, cardRow: v }))}
            options={SURFACE_ROLES}
            recommended={RECOMMENDED.cardRow}
          />
          <SurfaceSelect
            label="Card"
            value={surfaceConfig.card}
            onChange={(v) => setSurfaceConfig((c) => ({ ...c, card: v }))}
            options={SURFACE_ROLES}
            recommended={RECOMMENDED.card}
          />
          <SurfaceSelect
            label="Border"
            value={surfaceConfig.border}
            onChange={(v) => setSurfaceConfig((c) => ({ ...c, border: v }))}
            options={BORDER_ROLES}
            recommended={RECOMMENDED.border}
          />
          <SurfaceSelect
            label="Text"
            value={surfaceConfig.text}
            onChange={(v) => setSurfaceConfig((c) => ({ ...c, text: v }))}
            options={STEP_ROLES.filter((r) => r.startsWith('text-'))}
            recommended={RECOMMENDED.text}
          />
          <button
            type="button"
            onClick={() => setSurfaceConfig(DEFAULT_SURFACE)}
            className="cursor-pointer"
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              borderRadius: '6px',
              border: '1.5px solid #d1d5db',
              background: '#fff',
              color: '#6b7280',
            }}
          >
            Reset
          </button>
        </div>

        {/* Preview area — one per palette */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${allPalettes.length}, 1fr)`,
            gap: '1px',
            background: '#f3f4f6',
          }}
        >
          {allPalettes.map((pal, palIdx) => (
            <div
              key={`${pal.name}-${palIdx}`}
              style={{ background: '#fff', padding: '16px 20px' }}
            >
              <div
                className="font-semibold"
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '12px',
                }}
              >
                {pal.name}
              </div>
              <SurfacePreview config={surfaceConfig} steps={pal.steps} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
