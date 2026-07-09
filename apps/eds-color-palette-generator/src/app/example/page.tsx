'use client'

import { useState, useMemo, useCallback, useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  STEP_ROLES,
  PALETTES,
  getApcaFontBreakdown,
  calcContrast,
  roleIndex,
  getSimulationPalettes,
} from '@/utils/palette'
import type { StepRole, TokenPalette } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'

/* ------------------------------------------------------------------ */
/*  Pre-defined example groups                                         */
/* ------------------------------------------------------------------ */

type ExamplePairing = {
  fg: StepRole
  bg: StepRole
  type?: 'text' | 'border'
}

type ExampleGroup = {
  title: string
  description: string
  pairings: ExamplePairing[]
}

const EXAMPLE_GROUPS: ExampleGroup[] = [
  {
    title: 'Text on interactive fills',
    description: 'Text on muted fill backgrounds across default/hover/active states',
    pairings: [
      { fg: '12 · fg/strong', bg: '3 · bg/surface-hover' },
      { fg: '12 · fg/strong', bg: '4 · bg/surface-pressed' },
      { fg: '12 · fg/strong', bg: '5 · bg/interactive' },
    ],
  },
  {
    title: 'Text on emphasis fills',
    description: 'Light text on dark emphasis backgrounds',
    pairings: [
      { fg: '15 · bg/card, sheet, popover', bg: '9 · fill/emphasis' },
      { fg: '15 · bg/card, sheet, popover', bg: '10 · fill/emphasis-hover' },
      { fg: '15 · bg/card, sheet, popover', bg: '11 · fill/emphasis-pressed' },
      { fg: '14 · fg/on-emphasis', bg: '9 · fill/emphasis' },
    ],
  },
  {
    title: 'Borders on backgrounds',
    description: 'Border visibility on different surfaces',
    pairings: [
      { fg: '5 · bg/interactive', bg: '1 · bg/canvas', type: 'border' },
      { fg: '7 · border/subtle', bg: '1 · bg/canvas', type: 'border' },
      { fg: '8 · border/default', bg: '1 · bg/canvas', type: 'border' },
      { fg: '5 · bg/interactive', bg: '2 · bg/surface', type: 'border' },
      { fg: '7 · border/subtle', bg: '2 · bg/surface', type: 'border' },
      { fg: '8 · border/default', bg: '2 · bg/surface', type: 'border' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PairingCard({
  fgRole,
  bgRole,
  fgHex,
  bgHex,
  type = 'text',
}: {
  fgRole: string
  bgRole: string
  fgHex: string
  bgHex: string
  type?: 'text' | 'border'
}) {
  const result = useMemo(() => calcContrast(fgHex, bgHex), [fgHex, bgHex])
  const lc = parseFloat(result.apca)
  const fontBreakdown = useMemo(() => getApcaFontBreakdown(lc), [lc])

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid #e5e7eb', background: '#fff' }}
    >
      {/* Visual preview */}
      <div
        style={{
          backgroundColor: bgHex,
          padding: type === 'border' ? '16px 20px' : '16px 12px',
        }}
      >
        {type === 'border' ? (
          <div
            style={{
              border: `2px solid ${fgHex}`,
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '13px',
              color: '#9ca3af',
              backgroundColor: bgHex,
            }}
          >
            Placeholder
          </div>
        ) : (
          <div className="text-center">
            <span
              style={{
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                color: fgHex,
              }}
            >
              Aa
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div
        style={{
          padding: '10px 12px',
          fontSize: '10px',
          color: '#6b7280',
        }}
      >
        {/* Variable labels */}
        <div style={{ marginBottom: '6px', lineHeight: 1.5 }}>
          <div>
            fg: <strong style={{ color: '#111' }}>{fgRole}</strong>
          </div>
          <div>
            bg: <strong style={{ color: '#111' }}>{bgRole}</strong>
          </div>
        </div>

        {/* WCAG */}
        <div
          className="flex items-center gap-1 flex-wrap"
          style={{ marginBottom: '4px' }}
        >
          <span
            className="font-semibold"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '12px',
              color: '#111',
            }}
          >
            {result.wcag}:1
          </span>
          <Badge pass={result.aa} label="AA" />
          <Badge pass={result.aaa} label="AAA" />
        </div>

        {/* APCA */}
        <div className="flex items-center gap-1" style={{ marginBottom: '4px' }}>
          <span style={{ color: '#9ca3af' }}>APCA</span>
          <span
            className="font-semibold"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '12px',
              color: '#111',
            }}
          >
            Lc&nbsp;{result.apca}
          </span>
        </div>

        {/* Font sizes */}
        <div className="flex flex-wrap gap-1">
          {fontBreakdown.map(({ size, minWeightName }) => (
            <span
              key={size}
              className="inline-flex items-center rounded font-medium"
              style={{
                padding: '1px 4px',
                fontSize: '9px',
                lineHeight: '14px',
                fontFamily: 'var(--font-geist-mono, monospace)',
                backgroundColor: minWeightName ? '#dbeafe' : '#f3f4f6',
                color: minWeightName ? '#1e40af' : '#c0c0c0',
                textDecoration: minWeightName ? 'none' : 'line-through',
              }}
            >
              {size}px{minWeightName ? ` ${minWeightName}` : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Surface layer roles for the layout preview                         */
/* ------------------------------------------------------------------ */

const SURFACE_ROLES = STEP_ROLES.filter((r) => r.startsWith('bg-'))
const BORDER_ROLES = STEP_ROLES.filter((r) => r.startsWith('border-'))

type SurfaceConfig = {
  page: StepRole
  panel: StepRole
  cardRow: StepRole
  card: StepRole
  border: StepRole
  text: StepRole
}

const DEFAULT_SURFACE: SurfaceConfig = {
  page: '1 · bg/canvas',
  panel: '2 · bg/surface',
  cardRow: '3 · bg/surface-hover',
  card: '1 · bg/canvas',
  border: '5 · bg/interactive',
  text: '12 · fg/strong',
}

/** Recommended roles per surface layer — options outside this set still work
 *  but are flagged as atypical in the dropdown. */
const RECOMMENDED: Record<keyof SurfaceConfig, ReadonlySet<StepRole>> = {
  page: new Set<StepRole>(['1 · bg/canvas', '2 · bg/surface', '15 · bg/card, sheet, popover']),
  panel: new Set<StepRole>(['1 · bg/canvas', '2 · bg/surface', '15 · bg/card, sheet, popover']),
  cardRow: new Set<StepRole>([
    '1 · bg/canvas',
    '2 · bg/surface',
    '3 · bg/surface-hover',
    '4 · bg/surface-pressed',
  ]),
  card: new Set<StepRole>(['1 · bg/canvas', '2 · bg/surface', '15 · bg/card, sheet, popover']),
  border: new Set<StepRole>(['4 · bg/surface-pressed', '5 · bg/interactive', '7 · border/subtle', '8 · border/default']),
  text: new Set<StepRole>(['12 · fg/strong', '7 · border/subtle', '8 · border/default']),
}

function SurfaceLabel({
  label,
  role,
  hex,
}: {
  label: string
  role: string
  hex: string
}) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        position: 'absolute',
        top: '8px',
        left: '10px',
        fontSize: '10px',
        lineHeight: '14px',
        color: '#6b7280',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '2px',
          backgroundColor: hex,
          border: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      />
      <span>
        <strong style={{ color: '#374151' }}>{label}</strong>{' '}
        <span style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}>
          {role}
        </span>
      </span>
    </div>
  )
}

function SurfaceSelect({
  label,
  value,
  onChange,
  options,
  recommended,
}: {
  label: string
  value: StepRole
  onChange: (v: StepRole) => void
  options: readonly StepRole[]
  recommended?: ReadonlySet<StepRole>
}) {
  return (
    <label className="flex items-center gap-2" style={{ fontSize: '12px' }}>
      <span style={{ color: '#6b7280', fontWeight: 500, minWidth: '56px' }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as StepRole)}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          borderRadius: '6px',
          border: '1.5px solid #d1d5db',
          background: '#fff',
          fontFamily: 'var(--font-geist-mono, monospace)',
        }}
      >
        {options.map((r) => {
          const isRecommended = recommended ? recommended.has(r) : true
          return (
            <option key={r} value={r}>
              {isRecommended ? `● ${r}` : `  ${r}`}
            </option>
          )
        })}
      </select>
    </label>
  )
}

function SurfacePreview({
  config,
  steps,
}: {
  config: SurfaceConfig
  steps: string[]
}) {
  const pageHex = steps[roleIndex(config.page)]
  const panelHex = steps[roleIndex(config.panel)]
  const cardRowHex = steps[roleIndex(config.cardRow)]
  const cardHex = steps[roleIndex(config.card)]
  const borderHex = steps[roleIndex(config.border)]
  const textHex = steps[roleIndex(config.text)]

  const contrastPagePanel = calcContrast(panelHex, pageHex)
  const contrastPanelCardRow = calcContrast(cardRowHex, panelHex)
  const contrastCardRowCard = calcContrast(cardHex, cardRowHex)
  const contrastBorderCard = calcContrast(borderHex, cardHex)
  const contrastTextCard = calcContrast(textHex, cardHex)

  return (
    <div>
      {/* Live layout wireframe */}
      <div
        style={{
          backgroundColor: pageHex,
          borderRadius: '16px',
          padding: '32px 24px',
          position: 'relative',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <SurfaceLabel label="Page" role={config.page} hex={pageHex} />

        {/* Panel */}
        <div
          style={{
            backgroundColor: panelHex,
            borderRadius: '12px',
            padding: '28px 20px 20px',
            position: 'relative',
            marginTop: '12px',
          }}
        >
          <SurfaceLabel label="Panel" role={config.panel} hex={panelHex} />

          {/* Card row */}
          <div
            style={{
              backgroundColor: cardRowHex,
              borderRadius: '10px',
              padding: '24px 16px 16px',
              position: 'relative',
              marginTop: '8px',
            }}
          >
            <SurfaceLabel
              label="Card row"
              role={config.cardRow}
              hex={cardRowHex}
            />

            {/* Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '8px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: cardHex,
                    border: `1px solid ${borderHex}`,
                    borderRadius: '8px',
                    padding: '16px 14px',
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      color: textHex,
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    Card title
                  </div>
                  <div
                    style={{
                      color: textHex,
                      fontSize: '11px',
                      opacity: 0.7,
                    }}
                  >
                    Body text content
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contrast ratios between adjacent layers */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '8px',
        }}
      >
        {[
          {
            label: 'Page / Panel',
            result: contrastPagePanel,
            a: pageHex,
            b: panelHex,
          },
          {
            label: 'Panel / Card row',
            result: contrastPanelCardRow,
            a: panelHex,
            b: cardRowHex,
          },
          {
            label: 'Card row / Card',
            result: contrastCardRowCard,
            a: cardRowHex,
            b: cardHex,
          },
          {
            label: 'Border / Card',
            result: contrastBorderCard,
            a: borderHex,
            b: cardHex,
          },
          {
            label: 'Text / Card',
            result: contrastTextCard,
            a: textHex,
            b: cardHex,
          },
        ].map(({ label, result, a, b }) => (
          <div
            key={label}
            className="rounded-lg"
            style={{
              border: '1px solid #e5e7eb',
              background: '#fff',
              padding: '10px 12px',
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ marginBottom: '6px' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: a,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: b,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {label}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '12px',
                  color: '#111',
                }}
              >
                {result.wcag}:1
              </span>
              <Badge pass={result.aa} label="AA" />
              <Badge pass={result.aaa} label="AAA" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Custom-palette store — SSR-safe mirror of the localStorage bridge   */
/*  filled by the Palette Editor. useSyncExternalStore renders [] on    */
/*  the server + first client paint, then the stored value after        */
/*  hydration; the Refresh button re-reads on demand.                   */
/* ------------------------------------------------------------------ */

const SIMULATION_REFRESH_EVENT = 'eds-simulation-palettes-refresh'
const EMPTY_PALETTES: TokenPalette[] = []
let cachedRaw: string | null = null
let cachedPalettes: TokenPalette[] = EMPTY_PALETTES

function getCustomPalettesSnapshot(): TokenPalette[] {
  const next = getSimulationPalettes() // [] during SSR (window guard)
  const raw = JSON.stringify(next) // stable ref unless content changed
  if (raw === cachedRaw) return cachedPalettes
  cachedRaw = raw
  cachedPalettes = next
  return cachedPalettes
}

function getCustomPalettesServerSnapshot(): TokenPalette[] {
  return EMPTY_PALETTES
}

function subscribeCustomPalettes(callback: () => void): () => void {
  window.addEventListener(SIMULATION_REFRESH_EVENT, callback)
  return () => window.removeEventListener(SIMULATION_REFRESH_EVENT, callback)
}

export default function ExamplePage() {
  const [activePalette, setActivePalette] = useState(0)
  const [fgRole, setFgRole] = useState<StepRole>('12 · fg/strong')
  const [bgRole, setBgRole] = useState<StepRole>('1 · bg/canvas')
  const [surfaceConfig, setSurfaceConfig] =
    useState<SurfaceConfig>(DEFAULT_SURFACE)
  const customPalettes = useSyncExternalStore(
    subscribeCustomPalettes,
    getCustomPalettesSnapshot,
    getCustomPalettesServerSnapshot,
  )

  const refreshCustomPalettes = useCallback(() => {
    window.dispatchEvent(new Event(SIMULATION_REFRESH_EVENT))
  }, [])

  const allPalettes = useMemo(
    () => [...PALETTES, ...customPalettes],
    [customPalettes],
  )

  const palette = allPalettes[activePalette] ?? allPalettes[0]

  const fgRoles = STEP_ROLES.filter((r) =>
    r.startsWith('text-') || r.startsWith('border-'),
  )
  const bgRoles = STEP_ROLES.filter((r) =>
    r.startsWith('bg-'),
  )

  return (
    <div
      className="min-h-screen"
      style={{ background: '#fafafa', color: '#111' }}
    >
      {/* ---- Header ---- */}
      <header
        className="sticky top-0 z-10"
        style={{
          background: 'rgba(250,250,250,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <h1 className="text-lg font-bold m-0">EDS Palette Examples</h1>

          <div className="ml-auto flex items-center gap-4">
            {/* Palette selector */}
            <div className="flex items-center gap-2">
              {allPalettes.map((p, i) => (
                <button
                  key={`${p.name}-${i}`}
                  type="button"
                  onClick={() => setActivePalette(i)}
                  className="cursor-pointer"
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: activePalette === i ? 600 : 400,
                    borderRadius: '8px',
                    border:
                      activePalette === i
                        ? '1.5px solid #111'
                        : '1.5px solid #d1d5db',
                    background: activePalette === i ? '#111' : '#fff',
                    color: activePalette === i ? '#fff' : '#111',
                  }}
                >
                  {p.name}
                </button>
              ))}
              <button
                type="button"
                onClick={refreshCustomPalettes}
                className="cursor-pointer"
                title="Refresh custom palettes from Palette Editor"
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  borderRadius: '8px',
                  border: '1.5px solid #d1d5db',
                  background: '#fff',
                  color: '#6b7280',
                }}
              >
                Refresh
              </button>
            </div>

            {/* Nav links */}
            <Link
              href="/contrast"
              style={{
                fontSize: '13px',
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              Contrast
            </Link>
            <Link
              href="/palette"
              style={{
                fontSize: '13px',
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              Palette
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* ============================================================ */}
        {/*  PRE-DEFINED COMBINATION GROUPS                               */}
        {/* ============================================================ */}
        <div className="flex flex-col" style={{ gap: '32px' }}>
          {EXAMPLE_GROUPS.map((group) => (
            <section key={group.title}>
              <h2
                className="font-bold"
                style={{ fontSize: '15px', margin: '0 0 4px' }}
              >
                {group.title}
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: '0 0 16px',
                }}
              >
                {group.description}
              </p>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                {group.pairings.map((p, i) => (
                  <PairingCard
                    key={`${group.title}-${i}`}
                    fgRole={p.fg}
                    bgRole={p.bg}
                    fgHex={palette.steps[roleIndex(p.fg)]}
                    bgHex={palette.steps[roleIndex(p.bg)]}
                    type={p.type ?? 'text'}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  SURFACE PREVIEW                                              */}
        {/* ============================================================ */}
        <section style={{ marginTop: '48px' }}>
          <h2
            className="font-bold"
            style={{ fontSize: '15px', margin: '0 0 4px' }}
          >
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
                onChange={(v) =>
                  setSurfaceConfig((c) => ({ ...c, page: v }))
                }
                options={SURFACE_ROLES}
                recommended={RECOMMENDED.page}
              />
              <SurfaceSelect
                label="Panel"
                value={surfaceConfig.panel}
                onChange={(v) =>
                  setSurfaceConfig((c) => ({ ...c, panel: v }))
                }
                options={SURFACE_ROLES}
                recommended={RECOMMENDED.panel}
              />
              <SurfaceSelect
                label="Card row"
                value={surfaceConfig.cardRow}
                onChange={(v) =>
                  setSurfaceConfig((c) => ({ ...c, cardRow: v }))
                }
                options={SURFACE_ROLES}
                recommended={RECOMMENDED.cardRow}
              />
              <SurfaceSelect
                label="Card"
                value={surfaceConfig.card}
                onChange={(v) =>
                  setSurfaceConfig((c) => ({ ...c, card: v }))
                }
                options={SURFACE_ROLES}
                recommended={RECOMMENDED.card}
              />
              <SurfaceSelect
                label="Border"
                value={surfaceConfig.border}
                onChange={(v) =>
                  setSurfaceConfig((c) => ({ ...c, border: v }))
                }
                options={BORDER_ROLES}
                recommended={RECOMMENDED.border}
              />
              <SurfaceSelect
                label="Text"
                value={surfaceConfig.text}
                onChange={(v) =>
                  setSurfaceConfig((c) => ({ ...c, text: v }))
                }
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
                  <SurfacePreview
                    config={surfaceConfig}
                    steps={pal.steps}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  INTERACTIVE PICKER                                           */}
        {/* ============================================================ */}
        <section style={{ marginTop: '48px' }}>
          <h2
            className="font-bold"
            style={{ fontSize: '15px', margin: '0 0 4px' }}
          >
            Interactive Picker
          </h2>
          <p
            style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '0 0 16px',
            }}
          >
            Select any foreground and background variable to test contrast
          </p>

          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid #e5e7eb', background: '#fff' }}
          >
            {/* Selector row */}
            <div
              className="flex items-center gap-4 flex-wrap"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <label
                className="flex items-center gap-2"
                style={{ fontSize: '13px' }}
              >
                <span style={{ color: '#6b7280', fontWeight: 500 }}>
                  Foreground
                </span>
                <select
                  value={fgRole}
                  onChange={(e) => setFgRole(e.target.value as StepRole)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1.5px solid #d1d5db',
                    background: '#fff',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  {fgRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <span style={{ color: '#d1d5db', fontSize: '18px' }}>on</span>

              <label
                className="flex items-center gap-2"
                style={{ fontSize: '13px' }}
              >
                <span style={{ color: '#6b7280', fontWeight: 500 }}>
                  Background
                </span>
                <select
                  value={bgRole}
                  onChange={(e) => setBgRole(e.target.value as StepRole)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1.5px solid #d1d5db',
                    background: '#fff',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  {bgRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Results for each palette */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${allPalettes.length}, 1fr)`,
                gap: '1px',
                background: '#f3f4f6',
              }}
            >
              {allPalettes.map((pal, i) => {
                const fgHex = pal.steps[roleIndex(fgRole)]
                const bgHex = pal.steps[roleIndex(bgRole)]

                return (
                  <div
                    key={`${pal.name}-${i}`}
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
                    <PairingCard
                      fgRole={fgRole}
                      bgRole={bgRole}
                      fgHex={fgHex}
                      bgHex={bgHex}
                      type={fgRole.startsWith('border-') ? 'border' : 'text'}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
