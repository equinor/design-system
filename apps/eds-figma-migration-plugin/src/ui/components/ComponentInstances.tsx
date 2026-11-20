import { useState } from 'react'
import { Accordion, Button } from '@equinor/eds-core-react/next'
import type { ComponentInstance } from '../../scan/types'
import { groupComponentInstances, legacySummary } from '../instances'
import { pathBelow } from '../paths'
import { SectionHeading } from './InfoButton'

type ComponentInstancesProps = {
  /** Undefined while the plugin reads them */
  instances?: ComponentInstance[]
  /** The main component's name, left out of each instance's path */
  componentName: string
  onSelect: (nodeIds: string[]) => void
}

/**
 * Every instance in a main component, grouped by its own main component,
 * with how many legacy values each overrides and takes from its main
 * component. An override changes in this component; a value from the main
 * component changes there, so that component is migrated first.
 */
export function ComponentInstances({
  instances,
  componentName,
  onSelect,
}: ComponentInstancesProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const groups = instances ? groupComponentInstances(instances) : []
  return (
    <section className="stack-tight" aria-labelledby="component-instances">
      <SectionHeading
        id="component-instances"
        level={3}
        title={`Instances in this component${instances ? ` (${instances.length})` : ''}`}
        label="About the instances in this component"
      >
        <p>
          A legacy value an instance overrides is changed here, with the other
          values of this component. A legacy value it takes from its main
          component changes there: migrate that component first, or update it in
          its library, and the instances here follow.
        </p>
      </SectionHeading>
      {!instances ? (
        <p className="muted">Loading…</p>
      ) : instances.length === 0 ? (
        <p className="muted">There are no instances in this component.</p>
      ) : (
        <>
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
                        {group.instances.length === 1 ? '' : 's'} {group.source}
                        ,{' '}
                        {legacySummary(
                          group.overridden,
                          group.fromMain,
                        ).toLowerCase()}
                      </span>
                    </span>
                  </Accordion.Header>
                  <Accordion.Panel>
                    {isOpen && (
                      <div className="stack-tight">
                        <div className="panel-actions">
                          {group.mainId ? (
                            <Button
                              size="small"
                              variant="secondary"
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
                                  {[
                                    pathBelow(instance.path, componentName),
                                    legacySummary(
                                      instance.overridden,
                                      instance.fromMain,
                                    ),
                                  ]
                                    .filter(Boolean)
                                    .join(', ')}
                                </span>
                              </div>
                              <div className="binding-actions">
                                <Button
                                  size="small"
                                  variant="secondary"
                                  aria-label={`Go to ${instance.name}`}
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
        </>
      )}
    </section>
  )
}
