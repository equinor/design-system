import { useEffect, useState } from 'react'
import { NestedStones, type StoneLayer } from './NestedStones'
import { SceneHeader } from './SceneHeader'

// Scene 5 — The Peel. The alias-chain teach.
//
// The geode is THREE-layered (Concept → Scheme → Palette). Each layer
// lives in its own JSON file and references the next via {alias}
// syntax. The build resolves the chain to produce the final value.
//
// The CSS variable name `--eds-color-bg-floating` is NOT a layer of
// the chain — it is a sticker the build package attaches to the whole
// geode at build time so it can be shipped as CSS.
//
// Beat mapping:
//   0 — intro: "the geode is three-layered"
//   1 — OUTER (Concept) highlighted
//   2 — MIDDLE (Scheme) highlighted — the swap point
//   3 — INNER (Palette) highlighted — the hex value
//   4 — summary (no specific layer; reflective beat)
//   5 — build appears: stamp press lowers above the geode
//   6 — SLAM. Build stamps a CSS sticker onto the geode
//   7 — held. Name attached.

type LayerInfo = {
  layer: StoneLayer
  label: string
  source: string
  file: string
  output: string
  outputLabel: string
  purpose: string
}

const LAYER_BY_BEAT: Record<number, LayerInfo | null> = {
  0: null,
  1: {
    layer: 'outer',
    label: 'OUTER · CONCEPT',
    source: 'Bg.Floating',
    file: 'Static / Concept.Mode 1.json',
    output: '{bg-floating}',
    outputLabel: 'references:',
    purpose: 'the stable name product code asks for',
  },
  2: {
    layer: 'middle',
    label: 'MIDDLE · SCHEME (SWAP POINT)',
    source: 'bg-floating',
    file: 'Foundations / 🌗 Color scheme.Light.json',
    output: '{Light.Gray.2}',
    outputLabel: 'routes to:',
    purpose: 'change the scheme — the route changes',
  },
  3: {
    layer: 'inner',
    label: 'INNER · PALETTE',
    source: 'Light.Gray.2',
    file: 'Foundations / Color Light.Mode 1.json',
    output: '#ffffff',
    outputLabel: 'value:',
    purpose: 'the actual hex — the raw colour',
  },
  4: null,
  5: null,
  6: null,
  7: null,
}

export function Peel({ activeBeatIdx }: { activeBeatIdx: number }) {
  const info = LAYER_BY_BEAT[activeBeatIdx] ?? null
  const highlight: StoneLayer = info?.layer ?? 'none'

  const showStamp = activeBeatIdx >= 5
  const stickerOn = activeBeatIdx >= 6

  // Press slam fires once on beat 6
  const [slamming, setSlamming] = useState(false)
  useEffect(() => {
    if (activeBeatIdx === 6) {
      setSlamming(true)
      const t = window.setTimeout(() => setSlamming(false), 520)
      return () => window.clearTimeout(t)
    }
  }, [activeBeatIdx])

  return (
    <div className="peel-scene">
      <SceneHeader pkg="@equinor/eds-tokens-build" title="THE PEEL" />

      <div className="peel-stage">
        <div className="peel-stones-area">
          {showStamp && (
            <div className={`peel-stamp ${slamming ? 'is-slamming' : ''}`}>
              <div className="peel-stamp-frame peel-stamp-frame-left" />
              <div className="peel-stamp-frame peel-stamp-frame-right" />
              <div className="peel-stamp-hammer">
                <div className="peel-stamp-shaft" />
                <div className="peel-stamp-head" />
              </div>
            </div>
          )}

          <div className="peel-stones">
            <NestedStones highlight={highlight} />
            {stickerOn && (
              <div className="peel-sticker">--eds-color-bg-floating</div>
            )}
          </div>
        </div>

        <div className="peel-info-frame">
          {info ? (
            <div className={`peel-info peel-info-${info.layer}`}>
              <div className="peel-info-label">{info.label}</div>

              <div className="peel-info-row">
                <span className="peel-info-row-key">name:</span>
                <span className="peel-info-name">{info.source}</span>
              </div>

              <div className="peel-info-row">
                <span className="peel-info-row-key">file:</span>
                <span className="peel-info-row-value">{info.file}</span>
              </div>

              <div className="peel-info-row">
                <span className="peel-info-row-key">{info.outputLabel}</span>
                <span className="peel-info-row-value peel-info-output-value">
                  {info.output}
                </span>
              </div>

              <div className="peel-info-purpose">{info.purpose}</div>
            </div>
          ) : activeBeatIdx === 4 ? (
            <div className="peel-info peel-info-summary">
              <div className="peel-info-label">THREE LAYERS · THREE JOBS</div>
              <div className="peel-info-purpose">
                › concept = stable API name
                {'\n'}› scheme = the swap point
                {'\n'}› palette = the raw colour
                {'\n\n'}swap the middle layer for a different scheme, and the
                colour changes without touching product code or palette.
              </div>
            </div>
          ) : activeBeatIdx >= 5 ? (
            <div className="peel-info peel-info-build">
              <div className="peel-info-label">@equinor/eds-tokens-build</div>
              <div className="peel-info-purpose">
                {activeBeatIdx === 5 &&
                  '› the build package needs to give this geode a CSS variable name.'}
                {activeBeatIdx === 6 &&
                  '› stamping an EDS-prefixed name onto the geode.'}
                {activeBeatIdx >= 7 &&
                  '› name attached. the geode still needs cutting + packaging before it becomes a line of CSS.'}
              </div>
            </div>
          ) : (
            <div className="peel-info-placeholder">
              › press space to peel each layer
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
