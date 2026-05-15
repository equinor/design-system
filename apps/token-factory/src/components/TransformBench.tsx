import { useEffect, useState } from 'react'
import { Lever } from './Lever'
import { StationLog } from './StationLog'

// Station 3. Style Dictionary transforms reshape the token between
// source JSON and target outputs. Two transforms are visualised here:
//   - name transform: dot path → kebab-case with --eds- prefix
//   - unit transform: numeric values → rem (where applicable)

function applyNameTransform(input: string): string {
  return (
    '--eds-color-' +
    input.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-')
  )
}

function applyUnitTransform(input: string): string {
  const n = Number(input)
  if (Number.isNaN(n)) return input
  return `${(n / 16).toString()}rem`
}

export function TransformBench() {
  const [nameApplied, setNameApplied] = useState(false)
  const [unitApplied, setUnitApplied] = useState(false)
  const [log, setLog] = useState<string[]>([
    '> station 3 :: transform bench online',
    '> levers idle. pull to apply.',
  ])

  const colorInput = 'Light.Gray.2'
  const colorOutput = nameApplied ? applyNameTransform(colorInput) : colorInput

  const sizeInput = '16'
  const sizeOutput = unitApplied
    ? applyUnitTransform(sizeInput)
    : `${sizeInput}px`

  useEffect(() => {
    if (nameApplied) {
      setLog((l) => [
        ...l,
        `> name :: ${colorInput} → ${applyNameTransform(colorInput)}`,
      ])
    }
  }, [nameApplied])

  useEffect(() => {
    if (unitApplied) {
      setLog((l) => [
        ...l,
        `> unit :: ${sizeInput}px → ${applyUnitTransform(sizeInput)}`,
      ])
    }
  }, [unitApplied])

  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">station 3</span>
        <span className="station-name">transform bench</span>
      </header>

      <div className="station-body bench-body">
        <div className="bench-pipeline">
          <div className="bench-row">
            <div className="bench-card">
              <div className="bench-card-label">in</div>
              <div className="bench-card-value">{colorInput}</div>
            </div>
            <span className="bench-arrow">→</span>
            <Lever
              label="name"
              active={nameApplied}
              onToggle={() => setNameApplied((a) => !a)}
            />
            <span className="bench-arrow">→</span>
            <div className={`bench-card ${nameApplied ? 'is-stamped' : ''}`}>
              <div className="bench-card-label">out</div>
              <div className="bench-card-value">{colorOutput}</div>
            </div>
          </div>

          <div className="bench-row">
            <div className="bench-card">
              <div className="bench-card-label">in</div>
              <div className="bench-card-value">{sizeInput}px</div>
            </div>
            <span className="bench-arrow">→</span>
            <Lever
              label="unit"
              active={unitApplied}
              onToggle={() => setUnitApplied((a) => !a)}
            />
            <span className="bench-arrow">→</span>
            <div className={`bench-card ${unitApplied ? 'is-stamped' : ''}`}>
              <div className="bench-card-label">out</div>
              <div className="bench-card-value">{sizeOutput}</div>
            </div>
          </div>
        </div>
      </div>

      <StationLog lines={log} />
    </div>
  )
}
