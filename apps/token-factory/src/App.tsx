import { Story } from './chrome/Story'

// .viewport centres + frames the stage. The stage itself is rendered
// by Story so it can carry the data-lane attribute that drives lane
// theming (see styles/base.css for the [data-lane=...] mappings).
export function App() {
  return (
    <div className="viewport">
      <Story />
    </div>
  )
}
