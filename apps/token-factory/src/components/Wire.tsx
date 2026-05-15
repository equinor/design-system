type WireProps = {
  active: boolean
  pulsing: boolean
}

// A short horizontal pixel-art wire that bridges two cards in the same row.
// Implemented as a stack of <span>s so it stays crisp at any scale.
export function Wire({ active, pulsing }: WireProps) {
  return (
    <div
      className={`wire ${active ? 'is-active' : ''} ${pulsing ? 'is-pulsing' : ''}`}
    >
      <span className="wire-bolt" />
      <span className="wire-line" />
      <span className="wire-bolt" />
    </div>
  )
}
