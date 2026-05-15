type CardProps = {
  layer: 'palette' | 'semantic' | 'concept'
  /** Title shown above the value, e.g. "Light.Gray.2" or "--eds-color-bg-floating" */
  title: string
  /** Value shown — either a reference like "{Light.Gray.2}" or a flattened hex */
  value: string
  /** Hex used for the swatch (always the resolved hex, regardless of reference toggle) */
  swatchHex: string
  active: boolean
  onHover?: () => void
  onLeave?: () => void
}

export function Card({
  layer,
  title,
  value,
  swatchHex,
  active,
  onHover,
  onLeave,
}: CardProps) {
  return (
    <div
      className={`card card-${layer} ${active ? 'is-active' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="card-layer">{layer}</div>
      <div className="card-title" title={title}>
        {title}
      </div>
      <div className="card-row">
        <span className="card-value">{value}</span>
        <span className="card-swatch" style={{ background: swatchHex }} />
      </div>
    </div>
  )
}
