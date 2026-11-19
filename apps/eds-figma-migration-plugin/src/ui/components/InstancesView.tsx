import { Button } from '@equinor/eds-core-react/next'
import type { EntrySummary, OldInstance } from '../../scan/types'
import { entryForest } from '../instances'
import { InstanceTree } from './InstanceTree'

type InstancesViewProps = {
  instances: OldInstance[]
  /** The frames, main components and loose layers of the scan, for the rows at the top */
  entries: EntrySummary[]
  onSelect: (nodeIds: string[]) => void
  /** Instances of the legacy Typography component, listed in Changes instead */
  typographyCount: number
  /** Opens the Typography tab in Changes */
  onShowTypography: () => void
}

/**
 * Every instance in the scope that still takes legacy variables from its
 * main component, grouped by main component. The plugin does not change
 * those inside an instance; the values an instance overrides are in
 * Changes. An instance of a library component is swapped to an EDS Beta
 * component in Figma, since the plugin migrates variables, not components;
 * a component in this file changes every instance when its main component
 * is migrated. The legacy Typography component is the exception: its
 * instances are converted on their own tab in Changes, and this tab links
 * there.
 */
export function InstancesView({
  instances,
  entries,
  onSelect,
  typographyCount,
  onShowTypography,
}: InstancesViewProps) {
  const typographyNote = typographyCount > 0 && (
    <div className="components-note">
      <span className="muted">
        {typographyCount} instance{typographyCount === 1 ? '' : 's'} of the
        legacy Typography component can become text layers. They are on the
        Typography tab in Changes.
      </span>
      <Button size="small" variant="secondary" onClick={onShowTypography}>
        Show
      </Button>
    </div>
  )
  if (instances.length === 0) {
    return (
      <div className="stack">
        {typographyNote}
        <p className="muted">
          {typographyCount > 0
            ? 'No other instance in the scope uses legacy variables.'
            : 'No instance in the scope uses legacy variables.'}
        </p>
      </div>
    )
  }
  const nodes = entryForest(instances, entries)
  return (
    <div className="stack">
      {typographyNote}
      {/* Test session finding 16: local components need other advice
          than library components. */}
      <p className="muted">
        These are the legacy values instances take from their main component,
        which the plugin does not change in the instance. A component in this
        file changes every instance of it once its main component is migrated.
        The plugin migrates variables, not components, so an instance of a
        library component is swapped to an EDS Beta component in Figma, and its
        legacy values go with it. A value an instance overrides itself is listed
        in Changes, marked Overridden in the instance.
      </p>
      <p className="muted">
        The tree shows only the instances that hold such values, and the slots
        they are in. Frames and other layers between them are left out, so a
        level here can be deeper in the Layers panel.
      </p>
      <InstanceTree
        nodes={nodes}
        initiallyOpen={nodes.map((node) => node.key)}
        onSelect={onSelect}
      />
    </div>
  )
}
