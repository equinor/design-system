import floorTile from '../sprites/floor-tile.svg'

// Scrolling conveyor belt: a row of floor tiles translating left.
// The container translates by exactly one tile width then resets,
// so the loop is visually seamless.

const TILE_COUNT = 30

export function Conveyor() {
  return (
    <div className="conveyor-track">
      <div className="conveyor">
        {Array.from({ length: TILE_COUNT }).map((_, i) => (
          <img key={i} src={floorTile} alt="" className="conveyor-tile" />
        ))}
      </div>
    </div>
  )
}
