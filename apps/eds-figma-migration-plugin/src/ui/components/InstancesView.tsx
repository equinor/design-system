import { useState } from 'react'
import { Accordion, Badge, Button } from '@equinor/eds-core-react/next'
import type { OldInstance } from '../../scan/types'
import { groupInstances } from '../instances'

type InstancesViewProps = {
  instances: OldInstance[]
  /** Entry id → name, to say which frame an instance is in */
  entryNames: Map<string, string>
  onSelect: (nodeIds: string[]) => void
  /** Replaces Typography instances with text layers */
  onConvert: (instanceIds: string[]) => void
  busy: boolean
}

/**
 * Every instance in the scope that still uses legacy variables, grouped by
 * main component. The plugin never changes inside an instance. A library
 * component is updated in its library; a component in this file changes
 * every instance when its main component is migrated.
 */
export function InstancesView({
  instances,
  entryNames,
  onSelect,
  onConvert,
  busy,
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
      {/* Test session finding 16: local components need other advice
          than library components. */}
      <p className="muted">
        The plugin never changes anything inside an instance. A component in
        this file changes every instance of it once its main component is
        migrated: go to the main component and migrate its page first. A
        component from a library is updated in its library and published, then
        the instances take the update. The legacy Typography component is the
        exception: it can become a text layer with the matching text style.
      </p>
      <Accordion className="binding-groups">
        {[...groups]
          .sort(
            (a, b) =>
              Number(b.instances.every((i) => i.typography)) -
              Number(a.instances.every((i) => i.typography)),
          )
          .map((group) => {
            const isOpen = open.has(group.key)
            const ids = group.instances.map((instance) => instance.id)
            const typography = group.instances.every(
              (instance) => instance.typography,
            )
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
                      {group.instances.length === 1 ? '' : 's'}, {group.source}{' '}
                      · {group.count} legacy binding
                      {group.count === 1 ? '' : 's'}
                    </span>
                  </span>
                </Accordion.Header>
                <Accordion.Panel>
                  {isOpen && (
                    <div className="stack-tight">
                      {typography && (
                        <p className="muted">
                          Each instance becomes a text layer with the same text,
                          the matching EDS Foundation text style, and its colour
                          as a variable. Revert frame puts the component back.
                        </p>
                      )}
                      {group.mainId && (
                        <p className="muted">
                          {group.name} is a component in this file. Migrate its
                          main component, and every instance follows.
                        </p>
                      )}
                      <div className="panel-actions">
                        {typography ? (
                          <Button
                            size="small"
                            disabled={busy}
                            onClick={() => onConvert(ids)}
                          >
                            Convert {ids.length} to text
                          </Button>
                        ) : group.mainId ? (
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
                                {instance.typography && instance.text
                                  ? `“${instance.text}”`
                                  : instance.name}
                              </span>
                              <span className="binding-path">
                                {entryNames.get(instance.entryId)}
                              </span>
                            </div>
                            <div className="binding-actions">
                              <Badge tone="neutral">
                                {instance.count} legacy
                              </Badge>
                              {instance.typography && (
                                <Button
                                  size="small"
                                  variant="secondary"
                                  disabled={busy}
                                  aria-label={`Convert ${instance.text ?? instance.name} to text`}
                                  onClick={() => onConvert([instance.id])}
                                >
                                  Convert
                                </Button>
                              )}
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
