import { useState } from 'react'
import { Accordion, Badge, Button } from '@equinor/eds-core-react/next'
import type { OldInstance } from '../../../../src/scan/types'
import { groupInstances } from '../instances'

type InstancesViewProps = {
  instances: OldInstance[]
  /** Entry id → name, to say which frame an instance is in */
  entryNames: Map<string, string>
  onSelect: (nodeIds: string[]) => void
}

/**
 * Every instance in the scope that still uses legacy variables, grouped by
 * main component. The plugin never changes inside an instance: the
 * component is updated in its library, then the instances are swapped by
 * hand.
 */
export function InstancesView({
  instances,
  entryNames,
  onSelect,
}: InstancesViewProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  if (instances.length === 0) {
    return (
      <p className="muted">No instance in the scope uses legacy variables.</p>
    )
  }
  const groups = groupInstances(instances)
  return (
    <div className="stack">
      <p className="muted">
        The plugin never changes anything inside an instance. Update each
        component in its library, publish it, then swap these instances or
        accept the update.
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
                    {group.instances.length === 1 ? '' : 's'}, {group.source} ·{' '}
                    {group.count} legacy binding
                    {group.count === 1 ? '' : 's'}
                  </span>
                </span>
              </Accordion.Header>
              <Accordion.Panel>
                {isOpen && (
                  <div className="stack-tight">
                    <div className="panel-actions">
                      <span />
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
