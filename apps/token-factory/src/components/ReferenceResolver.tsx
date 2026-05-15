import { useEffect, useState } from 'react'
import { chains, type Chain } from '../data/chains'
import { Card } from './Card'
import { Wire } from './Wire'
import { LibrarianBot } from './LibrarianBot'
import { StationLog } from './StationLog'

type ResolverMode = 'references' | 'flat'

function buildLogLine(chain: Chain, mode: ResolverMode): string {
  if (mode === 'references') {
    return `> resolve ${chain.concept.cssVar} → {${chain.semantic.name}} → {${chain.palette.name}} = ${chain.palette.value}`
  }
  return `> flatten ${chain.concept.cssVar} = ${chain.palette.value}`
}

export function ReferenceResolver() {
  const [mode, setMode] = useState<ResolverMode>('references')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([
    '> station 2 :: reference resolver online',
    '> outputReferences = true',
  ])

  useEffect(() => {
    setLog((prev) => [...prev, `> outputReferences = ${mode === 'references'}`])
  }, [mode])

  const onHover = (chain: Chain) => {
    setActiveId(chain.id)
    setLog((prev) => [...prev, buildLogLine(chain, mode)])
  }
  const onLeave = () => setActiveId(null)

  const saying =
    mode === 'references'
      ? 'each card points to the next, like a card-catalogue.'
      : 'flat mode: every card knows the final value, no lookup needed.'

  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">station 2</span>
        <span className="station-name">reference resolver</span>
        <button
          type="button"
          className={`toggle ${mode === 'references' ? 'is-on' : ''}`}
          onClick={() =>
            setMode((m) => (m === 'references' ? 'flat' : 'references'))
          }
        >
          outputReferences: {mode === 'references' ? 'ON' : 'OFF'}
        </button>
      </header>

      <div className="station-body">
        <div className="chains">
          {chains.map((chain) => {
            const active = activeId === chain.id
            const conceptValue =
              mode === 'references'
                ? `{${chain.semantic.name}}`
                : chain.palette.value
            const semanticValue =
              mode === 'references'
                ? `{${chain.palette.name}}`
                : chain.palette.value
            const paletteValue = chain.palette.value

            return (
              <div
                key={chain.id}
                className={`chain ${active ? 'is-active' : ''}`}
                onMouseEnter={() => onHover(chain)}
                onMouseLeave={onLeave}
              >
                <Card
                  layer="concept"
                  title={chain.concept.cssVar}
                  value={conceptValue}
                  swatchHex={chain.palette.value}
                  active={active}
                />
                <Wire
                  active={active}
                  pulsing={mode === 'references' && active}
                />
                <Card
                  layer="semantic"
                  title={chain.semantic.name}
                  value={semanticValue}
                  swatchHex={chain.palette.value}
                  active={active}
                />
                <Wire
                  active={active}
                  pulsing={mode === 'references' && active}
                />
                <Card
                  layer="palette"
                  title={chain.palette.name}
                  value={paletteValue}
                  swatchHex={chain.palette.value}
                  active={active}
                />
              </div>
            )
          })}
        </div>
        <LibrarianBot saying={saying} />
      </div>

      <StationLog lines={log} />
    </div>
  )
}
