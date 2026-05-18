import { useEffect, useState } from 'react'
import { NestedStones, type StoneLayer } from './NestedStones'
import { SceneHeader } from './SceneHeader'

// Scene 5 — The Peel. Rewritten per user direction:
//   - The geode is TWO-layered (Figma source name + actual value).
//   - The CSS variable `--eds-color-bg-floating` is NOT a layer.
//     It's a sticker the BUILD package stamps onto the geode so it can
//     be shipped as CSS.
//
// Beat mapping:
//   0 — intro: "the geode is two-layered."
//   1 — OUTER layer highlighted (Figma source name).
//   2 — INNER core highlighted (the actual value).
//   3 — build appears: a stamp press lowers above the geode.
//   4 — SLAM. The stamp drops a CSS sticker onto the geode.
//   5 — shippable. Sticker attached, geode ready.

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
    label: 'OUTER · FIGMA SOURCE',
    source: 'Bg.Floating',
    file: 'Concept.Mode 1.json',
    output: '{bg-floating} → alias chain',
    outputLabel: 'references:',
    purpose: 'this is the concept-layer name as figma authored it',
  },
  2: {
    layer: 'inner',
    label: 'CORE · ACTUAL VALUE',
    source: 'Light.Gray.2',
    file: 'Color Light.Mode 1.json',
    output: '#ffffff',
    outputLabel: 'value:',
    purpose: 'the actual colour — resolved through the alias chain',
  },
  3: null,
  4: null,
  5: null,
}

export function Peel({ activeBeatIdx }: { activeBeatIdx: number }) {
  const info = LAYER_BY_BEAT[activeBeatIdx] ?? null
  const highlight: StoneLayer = info?.layer ?? 'none'

  const showStamp = activeBeatIdx >= 3
  const stickerOn = activeBeatIdx >= 4

  // Press slam fires once on beat 4
  const [slamming, setSlamming] = useState(false)
  useEffect(() => {
    if (activeBeatIdx === 4) {
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
                <div className="peel-stamp-head">
                  <span className="peel-stamp-label">
                    @equinor/eds-tokens-build
                  </span>
                </div>
                <div className="peel-stamp-shaft" />
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
                <span className="peel-info-row-key">figma source:</span>
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
          ) : activeBeatIdx >= 3 ? (
            <div className="peel-info peel-info-build">
              <div className="peel-info-label">@equinor/eds-tokens-build</div>
              <div className="peel-info-purpose">
                {activeBeatIdx === 3 &&
                  '› the build package needs to give this geode a CSS variable name.'}
                {activeBeatIdx === 4 &&
                  '› stamping an EDS-prefixed name onto the geode.'}
                {activeBeatIdx >= 5 &&
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
