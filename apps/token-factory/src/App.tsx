import floorTile from './sprites/floor-tile.svg'

export function App() {
  return (
    <div className="viewport">
      <div className="stage">
        <h1 className="title">TOKEN FACTORY</h1>
        <p className="subtitle">phase 0 :: foundations</p>

        <div className="floor">
          {Array.from({ length: 20 }).map((_, i) => (
            <img key={i} src={floorTile} alt="" className="floor-tile" />
          ))}
        </div>

        <div className="real-token-card">
          <span className="card-label">real eds token</span>
          <span className="card-name">
            --eds-color-bg-accent-fill-emphasis-default
          </span>
          <span className="card-swatch" />
        </div>
      </div>
    </div>
  )
}
