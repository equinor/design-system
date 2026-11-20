import { useState } from 'react'
import { Accordion, Button } from '@equinor/eds-core-react/next'
import type {
  ComponentSource,
  EntrySummary,
  OldInstance,
} from '../../scan/types'
import {
  checkSummary,
  entryForest,
  knownSources,
  sourceGroups,
} from '../instances'
import type { SourceCheck, SourceComponent, SourceGroup } from '../instances'
import { SOURCES, values } from '../labels'
import { InfoButton, InfoNote } from './InfoButton'
import { InstanceTree } from './InstanceTree'

export type { SourceCheck }

type InstancesViewProps = {
  instances: OldInstance[]
  /** The frames, main components and loose layers of the scan, for the rows at the top */
  entries: EntrySummary[]
  onSelect: (nodeIds: string[]) => void
  /** Instances of the legacy Typography component, listed in Changes instead */
  typographyCount: number
  /** Opens the Typography tab in Changes */
  onShowTypography: () => void
  /** Where the values of each library main component can be fixed, by key, as far as checked */
  sources: ReadonlyMap<string, ComponentSource>
  /** The source check, once started */
  sourceCheck?: SourceCheck
  onCheckSources: () => void
  /** Stops the check */
  onStopSources: () => void
}

/** What a main component in Where to fix them says about its instances. */
function componentMeta(component: SourceComponent): string {
  const count = component.instanceIds.length
  const parts = [
    `${count} instance${count === 1 ? '' : 's'}`,
    `${component.count} legacy value${component.count === 1 ? '' : 's'}`,
  ]
  const { source } = component
  if (source.kind === 'update') {
    parts.push(
      source.latestLegacy === 0
        ? 'none in the new version'
        : `${source.latestLegacy} legacy left in the new version`,
    )
  }
  return parts.join(', ')
}

/**
 * Where to fix them: the main components of the instances on the tab,
 * grouped by what fixes their legacy values, each group closed at the start
 * so the tree stays near the top, with Go to for the instances of each.
 */
function SourcePanel({
  groups,
  runs,
  onSelect,
}: {
  groups: SourceGroup[]
  /** Checks finished so far: when one ends, its library updates open */
  runs: number
  onSelect: (nodeIds: string[]) => void
}) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  // The finding a designer acts on first opens when a check ends.
  const [seenRuns, setSeenRuns] = useState(runs)
  if (runs !== seenRuns) {
    setSeenRuns(runs)
    if (groups.some((group) => group.kind === 'update')) {
      setOpen((previous) => new Set(previous).add('update'))
    }
  }
  return (
    <section className="stack-tight" aria-labelledby="sources-title">
      <h2 id="sources-title" className="section-title">
        Where to fix them
      </h2>
      <Accordion className="binding-groups">
        {groups.map((group) => {
          const { title, label, advice } = SOURCES[group.kind]
          const total = group.components.reduce(
            (sum, component) => sum + component.count,
            0,
          )
          const count = group.components.length
          return (
            <Accordion.Item
              key={group.kind}
              open={open.has(group.kind)}
              onOpenChange={(next) =>
                setOpen((previous) => {
                  const copy = new Set(previous)
                  if (next) copy.add(group.kind)
                  else copy.delete(group.kind)
                  return copy
                })
              }
            >
              <Accordion.Header>
                <span className="group-header">
                  <span className="source-title">
                    <span
                      className="tree-source"
                      data-source={group.kind}
                      aria-hidden="true"
                    >
                      {label}
                    </span>
                    {title}
                  </span>
                  <span className="binding-path">
                    {count} main component{count === 1 ? '' : 's'},{' '}
                    {values(total)}
                  </span>
                </span>
              </Accordion.Header>
              <Accordion.Panel>
                <div className="stack-tight">
                  <p className="muted">{advice}</p>
                  <ul className="binding-list">
                    {group.components.map((component) => (
                      <li key={component.key} className="binding-row">
                        <div className="entry-info">
                          <span className="binding-name">{component.name}</span>
                          <span className="binding-path">
                            {componentMeta(component)}
                          </span>
                        </div>
                        <div className="binding-actions">
                          <Button
                            size="small"
                            variant="secondary"
                            aria-label={`Go to the instances of ${component.name}`}
                            onClick={() => onSelect(component.instanceIds)}
                          >
                            Go to
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </section>
  )
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
  sources,
  sourceCheck,
  onCheckSources,
  onStopSources,
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
  const known = knownSources(instances, sources)
  const groups = sourceGroups(instances, known)
  // Only library main components need the check; one in this file is
  // known without it, so with none the check ends at once.
  const running = sourceCheck?.running === true
  return (
    <div className="stack">
      {typographyNote}
      {/* Test session finding 16: local components need other advice
          than library components. */}
      <InfoNote
        summary="The legacy values instances take from their main component."
        label="About the Instances tab"
      >
        <p>
          These are the legacy values instances take from their main component,
          which the plugin does not change in the instance. A component in this
          file changes every instance of it once its main component is migrated.
          The plugin migrates variables, not components, so an instance of a
          library component is swapped to an EDS Beta component in Figma, and
          its legacy values go with it. A value an instance overrides itself is
          listed in Changes, marked Overridden in the instance.
        </p>
        <p>
          The tree shows only the instances that hold such values, and the slots
          they are in. Frames and other layers between them are left out, so a
          level here can be deeper in the Layers panel. A click on a row opens
          it; Go to selects the instance in Figma.
        </p>
      </InfoNote>
      <div className="source-check">
        <Button
          size="small"
          variant="secondary"
          disabled={running}
          onClick={onCheckSources}
        >
          {running
            ? `Checking ${sourceCheck.done} of ${sourceCheck.total}…`
            : sourceCheck
              ? 'Check again'
              : 'Check for library updates'}
        </Button>
        {running && (
          <Button
            size="small"
            variant="ghost"
            disabled={sourceCheck.stopping}
            onClick={onStopSources}
          >
            {sourceCheck.stopping ? 'Stopping…' : 'Stop'}
          </Button>
        )}
        <InfoButton label="About the check for library updates">
          <p>
            The check finds where the legacy values of each instance can be
            fixed: with a library update, by swapping to an EDS Beta component,
            in a main component in this file, or not in a library at all.
          </p>
          <p>
            Stop ends the check at once. The components checked so far keep
            their labels.
          </p>
          <p>
            It imports the latest version of each library component the
            instances use, to compare it with the copy in this file, a second or
            two each. No layer changes, and the instances keep their version
            until you accept the update, but Figma keeps a hidden copy of each
            latest version in the file.
          </p>
        </InfoButton>
      </div>
      {sourceCheck && (
        <p className="muted" role="status">
          {running
            ? `Checking ${
                instances.find(
                  (instance) =>
                    instance.mainComponent?.key === sourceCheck.current,
                )?.mainComponent?.name ?? 'the library components'
              }…`
            : checkSummary(
                sourceCheck,
                sources,
                new Map(
                  instances.flatMap((instance) =>
                    instance.mainComponent
                      ? [
                          [
                            instance.mainComponent.key,
                            instance.mainComponent.name,
                          ],
                        ]
                      : [],
                  ),
                ),
              )}
        </p>
      )}
      {groups.length > 0 && (
        <SourcePanel
          groups={groups}
          runs={sourceCheck?.runs ?? 0}
          onSelect={onSelect}
        />
      )}
      <InstanceTree
        nodes={nodes}
        initiallyOpen={nodes.map((node) => node.key)}
        sources={known}
        onSelect={onSelect}
      />
    </div>
  )
}
