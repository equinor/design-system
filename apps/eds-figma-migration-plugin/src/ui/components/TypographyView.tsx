import { useState } from 'react'
import { Accordion, Badge, Button } from '@equinor/eds-core-react/next'
import type { OldInstance } from '../../scan/types'
import { groupInstances } from '../instances'

type TypographyViewProps = {
  /** Instances of the legacy Typography component in the scope */
  instances: OldInstance[]
  /** Entry id → name, to say which frame an instance is in */
  entryNames: Map<string, string>
  onSelect: (nodeIds: string[]) => void
  /** Replaces Typography instances with text layers */
  onConvert: (instanceIds: string[]) => void
  busy: boolean
}

/**
 * The instances of the legacy Typography component, on their own tab in
 * Changes. Unlike other instances, the plugin can replace them: each becomes
 * a text layer with the matching text style.
 */
export function TypographyView({
  instances,
  entryNames,
  onSelect,
  onConvert,
  busy,
}: TypographyViewProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  if (instances.length === 0) {
    return (
      <p className="muted">
        No instance of the legacy Typography component in the scope.
      </p>
    )
  }
  const groups = groupInstances(instances)
  const allIds = instances.map((instance) => instance.id)
  return (
    <div className="stack-tight">
      <p className="muted">
        Each instance of the legacy Typography component becomes a text layer
        with the same text, the matching EDS Beta text style, and its colour as
        a variable. Revert frame puts the component back.
      </p>
      <div className="panel-actions">
        <span />
        <Button size="small" disabled={busy} onClick={() => onConvert(allIds)}>
          Convert {allIds.length} to text
        </Button>
      </div>
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
                    <div className="panel-actions">
                      {groups.length > 1 ? (
                        <Button
                          size="small"
                          disabled={busy}
                          onClick={() => onConvert(ids)}
                        >
                          Convert {ids.length} to text
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
                              {instance.text
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
                            <Button
                              size="small"
                              variant="secondary"
                              disabled={busy}
                              aria-label={`Convert ${instance.text ?? instance.name} to text`}
                              onClick={() => onConvert([instance.id])}
                            >
                              Convert
                            </Button>
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
