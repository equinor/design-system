// Top header bar shared across all story scenes.
// Package name on the LEFT — tells the viewer which eds-tokens package
// the current scene's action lives in. Title on the right (optional).

type Props = {
  pkg: string
  title?: string
}

export function SceneHeader({ pkg, title }: Props) {
  return (
    <div className="scene-header-bar">
      <span className="scene-header-pkg">{pkg}</span>
      {title && <span className="scene-header-title">★ {title} ★</span>}
    </div>
  )
}
