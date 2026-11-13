import { useState } from 'react'
import { Accordion, Badge, Button } from '@equinor/eds-core-react/next'
import type { OldInstance } from '../../scan/types'
import { groupInstances } from '../instances'

type InstancesViewProps = {
  instances: OldInstance[]
  /** Entry id → name, to say which frame an instance is in */
  entryNames: Map<string, string>
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
 * Changes. A library
 * component is updated in its library; a component in this file changes
 * every instance when its main component is migrated. The legacy Typography
 * component is the exception: its instances are converted on their own tab
 * in Changes, and this tab links there.
 */
export function InstancesView({
  instances,
  entryNames,
  onSelect,
  typographyCount,
  onShowTypography,
}: InstancesViewProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())
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
  const groups = groupInstances(instances)
  return (
    <div className="stack">
      {typographyNote}
      {/* Test session finding 16: local components need other advice
          than library components. */}
      <p className="muted">
        These are the legacy values instances take from their main component,
        which the plugin does not change in the instance. A component in this
        file changes every instance of it once its main component is migrated:
        go to the main component and migrate its page first. A component from a
        library is updated in its library and published, then the instances take
        the update. A value an instance overrides itself is listed in Changes,
        marked Overridden in the instance.
      </p>
      <Accordion className="binding-groups">
        {groups.map((group) => {
          const isOpen = open.has(group.key)
          const ids = group.instances.map((instance) => instance.id)
          return (
            <Accordion.Item
              key={group.key}
              open={isOpen}
              onOpenChange={(next) =>
                setOpen((previous) => {
                  const copy = new Set(previous)
                  if (next) copy.add(group.key)
                  else copy.delete(group.key)
                  return copy
                })
              }
            >
              <Accordion.Header>
                <span className="group-header">
                  <span className="binding-name">{group.name}</span>
                  <span className="binding-path">
                    {group.instances.length} instance
                    {group.instances.length === 1 ? '' : 's'} {group.source},{' '}
                    {group.count} legacy binding
                    {group.count === 1 ? '' : 's'}
                  </span>
                </span>
              </Accordion.Header>
              <Accordion.Panel>
                {isOpen && (
                  <div className="stack-tight">
                    {group.mainId && (
                      <p className="muted">
                        {group.name} is a component in this file. Migrate its
                        main component, and every instance follows.
                      </p>
                    )}
                    <div className="panel-actions">
                      {group.mainId ? (
                        <Button
                          size="small"
                          onClick={() => onSelect([group.mainId as string])}
                        >
                          Go to main component
                        </Button>
                      ) : (
                        <span />
                      )}
                      <Button
                        size="small"
                        variant="secondary"
                        aria-label={`Go to all ${ids.length} instances of ${group.name}`}
                        onClick={() => onSelect(ids)}
                      >
                        Go to all
                      </Button>
                    </div>
                    <ul className="binding-list">
                      {group.instances.map((instance) => (
                        <li key={instance.id} className="binding-row">
                          <div className="entry-info">
                            <span className="binding-name">
                              {instance.name}
                            </span>
                            <span className="binding-path">
                              {entryNames.get(instance.entryId)}
                            </span>
                          </div>
                          <div className="binding-actions">
                            <Badge tone="neutral">
                              {instance.count} legacy
                            </Badge>
                            <Button
                              size="small"
                              variant="secondary"
                              aria-label={`Go to ${instance.name} in ${entryNames.get(instance.entryId) ?? 'the file'}`}
                              onClick={() => onSelect([instance.id])}
                            >
                              Go to
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </div>
  )
}
