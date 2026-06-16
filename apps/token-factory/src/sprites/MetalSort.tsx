import './metalSort.css'

// A milled metal type-sort: a steel block with the size engraved on its
// face, a bevelled top (catches light) and a darker foot. The machined
// counterpart to colour's gemstone. Used by Milling (H.4), Rack (H.6),
// and Assembly (H.1).

type Props = {
  /** Size key engraved on the face. */
  size?: string
}

export function MetalSort({ size = 'md' }: Props) {
  return (
    <div className="metal-sort">
      <span className="metal-sort-face">{size}</span>
    </div>
  )
}
