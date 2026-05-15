import { useState } from 'react'
import { StationLog } from './StationLog'

// Station 5. lightningcss bundles @imports from src/css/index-variables.css
// into a single build/css/variables.css. The build-dark-scope step then
// rewrites light-dark() into explicit [data-color-scheme] rules.
// Elevation is composed and injected into the :root block during the
// same _build:css pass.
//
// Three discrete states for the lightweight cut:
//   idle    → many small CSS files visible, awaiting slam
//   bundled → press slammed, one variables.css emerges
//   final   → elevation envelope dropped into :root, minified output

const INPUT_FILES = [
  'color/light/concept.css',
  'color/light/semantic.css',
  'color/dark/concept.css',
  'color/dark/semantic.css',
  'spacing/comfortable.css',
  'typography/font-family-ui.css',
]

type Phase = 'idle' | 'slammed' | 'final'

export function BundlerPress() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [shake, setShake] = useState(false)
  const [log, setLog] = useState<string[]>([
    '> station 5 :: bundler press online',
    `> ${INPUT_FILES.length} css fragments staged`,
  ])

  const slam = () => {
    if (phase !== 'idle') return
    setShake(true)
    window.setTimeout(() => setShake(false), 280)
    setPhase('slammed')
    setLog((l) => [
      ...l,
      '> SLAM. lightningcss bundling @imports.',
      '> emit :: build/css/variables.css',
    ])
  }

  const dropElevation = () => {
    if (phase !== 'slammed') return
    setPhase('final')
    setLog((l) => [
      ...l,
      '> elevation envelope :: composed box-shadows',
      '> injected into :root block of variables.css',
      '> minified :: variables.min.css :: 20 kb gzip',
    ])
  }

  const handleAction =
    phase === 'idle' ? slam : phase === 'slammed' ? dropElevation : undefined

  const actionLabel =
    phase === 'idle' ? 'SLAM' : phase === 'slammed' ? 'DROP ELEVATION' : 'DONE'

  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">station 5</span>
        <span className="station-name">bundler press</span>
        <button
          type="button"
          className={`toggle ${phase !== 'final' ? 'is-on' : ''}`}
          onClick={handleAction}
          disabled={phase === 'final'}
        >
          {actionLabel}
        </button>
      </header>

      <div className={`station-body press-body ${shake ? 'is-shaking' : ''}`}>
        <div className="press-input">
          <div className="press-input-title">imports</div>
          <ul className="press-files">
            {INPUT_FILES.map((f, i) => (
              <li
                key={f}
                className={`press-file ${phase !== 'idle' ? 'is-bundled' : ''}`}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="press-machine">
          <div className={`press-anvil ${phase !== 'idle' ? 'is-down' : ''}`}>
            <div className="press-anvil-shaft" />
            <div className="press-anvil-head" />
          </div>
          <div className="press-base" />
        </div>

        <div className="press-output">
          {phase !== 'idle' && (
            <div className="bundle-card">
              <div className="bundle-card-title">
                {phase === 'final' ? 'variables.min.css' : 'variables.css'}
              </div>
              <div className="bundle-root">
                <span className="bundle-root-label">:root {'{'}</span>
                <span className="bundle-root-line">
                  --eds-color-bg-floating: #fff;
                </span>
                <span className="bundle-root-line">
                  --eds-color-border-focus: #6fb6e9;
                </span>
                <span className="bundle-root-line">…</span>
                {phase === 'final' && (
                  <span className="bundle-root-line bundle-elevation">
                    --eds-elevation-low: 0 1px 2px …;
                  </span>
                )}
                <span className="bundle-root-label">{'}'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <StationLog lines={log} />
    </div>
  )
}
