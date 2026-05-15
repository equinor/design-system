import { useEffect, useState } from 'react'
import { chains, type Chain } from '../data/chains'
import { Card } from './Card'
import { Wire } from './Wire'
import { LibrarianBot } from './LibrarianBot'
import { StationLog } from './StationLog'

type ResolverMode = 'references' | 'flat'

function buildHoverLine(chain: Chain, mode: ResolverMode): string {
  if (mode === 'references') {
    return `> resolve ${chain.consumer.cssVar} :: ${chain.trace.join(' → ')}`
  }
  return `> flatten ${chain.consumer.cssVar} = ${chain.palette.value}`
}

export function ReferenceResolver() {
  const [mode, setMode] = useState<ResolverMode>('references')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([
    '> station 2 :: reference resolver online',
    '> semantic and concept :: parallel namespaces above palette',
  ])

  useEffect(() => {
    setLog((prev) => [...prev, `> outputReferences = ${mode === 'references'}`])
  }, [mode])

  const onHover = (chain: Chain) => {
    setActiveId(chain.id)
    setLog((prev) => [...prev, buildHoverLine(chain, mode)])
  }
  const onLeave = () => setActiveId(null)

  const saying =
    mode === 'references'
      ? 'semantic + concept both point at palette. two naming systems, one foundation.'
      : 'flat mode: alias chains resolved. every consumer knows its final hex.'

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
            const consumerValue =
              mode === 'references'
                ? `{${chain.consumer.refsTo}}`
                : chain.palette.value
            const paletteValue = chain.palette.value
            return (
              <div
                key={chain.id}
                className={`chain chain-${chain.category} ${active ? 'is-active' : ''}`}
                onMouseEnter={() => onHover(chain)}
                onMouseLeave={onLeave}
              >
                <span className={`category-badge badge-${chain.category}`}>
                  {chain.category}
                </span>
                <Card
                  layer={chain.category}
                  title={chain.consumer.name}
                  value={consumerValue}
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
