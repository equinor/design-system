import { useEffect, useState } from 'react'
import { Button } from '@equinor/eds-core-react/next'
import { isUndecided } from '../../scan/mapping'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
} from '../../scan/mapping'
import type { OldInstance } from '../../scan/types'
import { conversionStates } from '../conversions'
import type { ConversionState } from '../conversions'
import { isHeld } from '../labels'
import { plainReason } from '../plain'
import { reviewItems } from '../review'
import type { ReviewItem } from '../review'
import { BindingRow } from './BindingRow'
import { bindingTarget, ChangeRow, WhyDialog } from './ChangeRow'
import type { Item } from './ChangeRow'

type TypographyViewProps = {
  /** Instances of the legacy Typography component in the scope */
  instances: OldInstance[]
  /** The text style and colour of each instance, grouped like Changes */
  groups: MappingGroup[]
  overrides: Overrides
  /** Entry id → name, to say which frame an instance is in */
  entryNames: Map<string, string>
  /** Show the number of instances in each row, from the settings menu */
  showCounts: boolean
  /**
   * How many instances each main component with a Typography instance in
   * it has, by component id; undefined until counted
   */
  componentCounts?: Record<string, number>
  /** Asks the plugin to count them, which can take a moment in a large file */
  onCountComponents: () => void
  onSelect: (nodeIds: string[]) => void
  onChangeRow: (group: MappingGroup, row: MappingRow) => void
  onChangeBinding: (
    group: MappingGroup,
    row: MappingRow,
    binding: MappingBinding,
  ) => void
  /** Opens Review with the conversion values that wait for a decision */
  onReview: (items: ReviewItem[]) => void
  /** Replaces Typography instances with text layers */
  onConvert: (instanceIds: string[]) => void
  busy: boolean
}

const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`

/** What converting an instance in a main component does to the instances of that component. */
function carriedText(
  component: NonNullable<OldInstance['inComponent']>,
  counts: Record<string, number> | undefined,
): string | undefined {
  const count = counts?.[component.id]
  if (count === undefined) {
    return `The text each instance of ${component.name} shows is carried across to the new text layer.`
  }
  if (count === 0) return undefined
  return count === 1
    ? `The text of the 1 instance of ${component.name} is carried across to the new text layer.`
    : `The text of the ${count} instances of ${component.name} is carried across to the new text layer.`
}

/**
 * The instances of the legacy Typography component, on their own tab in
 * Changes. The plugin can replace them: each becomes a text layer with a
 * text style and a colour. The tab lists those like Changes lists the
 * values Apply changes (decided 2026-11-16), with a row per legacy
 * typography and text style, then the text colours, each with its status,
 * its picker and its instances. Convert stays its own action: it converts
 * the instances whose text style is Ready after the designer's choices, and
 * says why it leaves the others.
 */
export function TypographyView({
  instances,
  groups,
  overrides,
  entryNames,
  showCounts,
  componentCounts,
  onCountComponents,
  onSelect,
  onChangeRow,
  onChangeBinding,
  onReview,
  onConvert,
  busy,
}: TypographyViewProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [why, setWhy] = useState<Item>()
  const inComponents = instances.filter((instance) => instance.inComponent)
  const needsCounts = inComponents.length > 0 && componentCounts === undefined
  // Counted when the tab opens, since finding instances can load every page.
  useEffect(() => {
    if (needsCounts) onCountComponents()
    // onCountComponents is a new function on every render of the overview.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsCounts])

  if (instances.length === 0) {
    return (
      <p className="muted">
        No instance of the legacy Typography component in the scope.
      </p>
    )
  }

  const allIds = instances.map((instance) => instance.id)
  const states = conversionStates(groups, overrides, allIds)
  const byId = new Map(instances.map((instance) => [instance.id, instance]))
  const converts = (ids: string[]) =>
    ids.filter((id) => states.get(id)?.skip === undefined)
  const toConvert = converts(allIds)
  const toReview = reviewItems(groups, overrides)
  const items: Item[] = groups.flatMap((group) =>
    group.rows.map((row) => ({ group, row })),
  )
  const styleItems = items.filter((item) => item.group.group === 'typography')
  const colourItems = items.filter((item) => item.group.group !== 'typography')
  // An instance without a legacy text style has no row; it is listed on
  // its own, so every instance in the tab's count shows somewhere.
  const listed = new Set(
    styleItems.flatMap(({ row }) => row.bindings.map((b) => b.nodeId)),
  )
  const unlisted = instances.filter((instance) => !listed.has(instance.id))
  // Instances with a text style that is not Ready yet; those without one are
  // in their own section.
  const waiting = allIds.filter(
    (id) => listed.has(id) && states.get(id)?.skip !== undefined,
  ).length
  const toggle = (key: string) =>
    setOpen((previous) => {
      const copy = new Set(previous)
      if (copy.has(key)) copy.delete(key)
      else copy.add(key)
      return copy
    })
  const where = (instance: OldInstance | undefined) =>
    instance ? entryNames.get(instance.entryId) : undefined

  /** Notes on an instance before it is converted: text carried across, and a colour that stays legacy. */
  const styleEffects = (
    instance: OldInstance | undefined,
    state: ConversionState | undefined,
  ): string[] =>
    [
      state?.skip,
      instance?.inComponent &&
        carriedText(instance.inComponent, componentCounts),
      state?.legacyColour &&
        `The colour stays on its legacy variable, ${state.legacyColour}, and Changes lists it after converting.`,
    ].filter((effect): effect is string => Boolean(effect))

  const instanceIds = (row: MappingRow) =>
    row.bindings.map((binding) => binding.nodeId)

  const section = (
    title: string,
    sectionItems: Item[],
    kind: 'style' | 'colour',
  ) => {
    if (sectionItems.length === 0) return null
    const ids = [
      ...new Set(sectionItems.flatMap(({ row }) => instanceIds(row))),
    ]
    return (
      <section className="check-section">
        <div className="check-section-header">
          <h3 className="group-title">{title}</h3>
          <Button
            size="small"
            variant="ghost"
            aria-label={`Go to the ${ids.length} instances with ${title}`}
            onClick={() => onSelect(ids)}
          >
            Go to all
          </Button>
        </div>
        <ul className="check-rows">
          {sectionItems.map((item) => {
            const { group, row } = item
            const isOpen = open.has(row.key)
            const rowIds = instanceIds(row)
            const rowConverts = converts(rowIds)
            return (
              <ChangeRow
                key={row.key}
                item={item}
                overrides={overrides}
                showCounts={showCounts}
                noun="instances"
                run={kind === 'style' ? 'Convert' : 'Apply'}
                open={isOpen}
                onToggle={() => toggle(row.key)}
                onSelectOld={() => onSelect(rowIds)}
                onChangeRow={() => onChangeRow(group, row)}
                onWhy={() => setWhy(item)}
              >
                {isOpen && (
                  <div className="stack-tight nested">
                    {kind === 'style' && (
                      <div className="panel-actions">
                        <Button
                          size="small"
                          disabled={busy || rowConverts.length === 0}
                          onClick={() => onConvert(rowIds)}
                        >
                          Convert {rowConverts.length} to text
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          aria-label={`Go to the ${rowIds.length} instances in this row`}
                          onClick={() => onSelect(rowIds)}
                        >
                          Go to all
                        </Button>
                      </div>
                    )}
                    <ul className="binding-list">
                      {row.bindings.map((binding) => {
                        const instance = byId.get(binding.nodeId)
                        const state = states.get(binding.nodeId)
                        const { outcome, target, note } = bindingTarget(
                          row,
                          binding,
                          overrides,
                          kind === 'style' ? 'Convert' : 'Apply',
                        )
                        // Why the value needs a check or has no
                        // equivalent, such as a text case the style drops,
                        // while nobody has decided on it.
                        const own = binding.reason ?? row.reason
                        const reason =
                          row.outcome !== 'sure' && isUndecided(outcome) && own
                            ? (plainReason(own) ?? own)
                            : undefined
                        const effects =
                          kind === 'style'
                            ? styleEffects(instance, state)
                            : state?.legacyColour
                              ? [
                                  'Converting keeps this legacy colour on the new text layer, and Changes lists it afterwards.',
                                ]
                              : []
                        const name = binding.nodeName
                        return (
                          <BindingRow
                            key={binding.id}
                            title={name}
                            subtitle={where(instance)}
                            target={target}
                            note={note}
                            {...(reason ? { reason } : {})}
                            effects={effects}
                            category={outcome.category}
                            held={isHeld(outcome.category, row.rule)}
                            changeable
                            selectable={false}
                            selected={false}
                            onToggle={() => {}}
                            onSelectLayer={() => onSelect([binding.nodeId])}
                            onChange={() =>
                              onChangeBinding(group, row, binding)
                            }
                            actions={
                              <span className="apply-buttons">
                                {kind === 'style' && (
                                  <Button
                                    size="small"
                                    variant="secondary"
                                    disabled={busy || state?.skip !== undefined}
                                    aria-label={`Convert ${name} to text${state?.skip ? `. ${state.skip}` : ''}`}
                                    onClick={() => onConvert([binding.nodeId])}
                                  >
                                    Convert
                                  </Button>
                                )}
                                <Button
                                  size="small"
                                  variant="ghost"
                                  aria-label={`Go to ${name} in ${where(instance) ?? 'the file'}`}
                                  onClick={() => onSelect([binding.nodeId])}
                                >
                                  Go to
                                </Button>
                              </span>
                            }
                          />
                        )
                      })}
                    </ul>
                  </div>
                )}
              </ChangeRow>
            )
          })}
        </ul>
      </section>
    )
  }

  return (
    <div className="stack-tight">
      <p className="muted">
        Each instance of the legacy Typography component becomes a text layer
        with the same text, the text style and the colour its rows show. The
        rows work as in Changes: the target opens the picker, and Review steps
        through what needs a check. Convert changes the instances whose text
        style is Ready, and Revert frame puts the component back.
      </p>
      {inComponents.length > 0 && (
        <p className="muted">
          {inComponents.length === 1
            ? '1 instance is'
            : `${inComponents.length} instances are`}{' '}
          in a main component. Converting replaces it there, and the text each
          instance of the component shows is carried across to the new text
          layer.
        </p>
      )}
      <div className="panel-actions">
        <span className="muted">
          {waiting > 0 &&
            `${plural(waiting, 'instance')} ${waiting === 1 ? 'waits' : 'wait'} for a decision on the text style`}
        </span>
        <span className="apply-buttons">
          {toReview.length > 0 && (
            <Button
              size="small"
              variant="secondary"
              disabled={busy}
              onClick={() => onReview(toReview)}
            >
              Review {toReview.length} ⚠
            </Button>
          )}
          <Button
            size="small"
            disabled={busy || toConvert.length === 0}
            onClick={() => onConvert(allIds)}
          >
            Convert {toConvert.length} to text
          </Button>
        </span>
      </div>
      {section('Text style', styleItems, 'style')}
      {section('Text colour', colourItems, 'colour')}
      {unlisted.length > 0 && (
        <section className="check-section">
          <div className="check-section-header">
            <h3 className="group-title">Without a legacy text style</h3>
          </div>
          <ul className="binding-list">
            {unlisted.map((instance) => (
              <li key={instance.id} className="binding-row">
                <div className="entry-info">
                  <span className="binding-name">
                    {instance.text ? `“${instance.text}”` : instance.name}
                  </span>
                  <span className="binding-path">{where(instance)}</span>
                  <span className="binding-reason">
                    {states.get(instance.id)?.skip}
                  </span>
                </div>
                <div className="binding-actions">
                  <Button
                    size="small"
                    variant="secondary"
                    aria-label={`Go to ${instance.name} in ${where(instance) ?? 'the file'}`}
                    onClick={() => onSelect([instance.id])}
                  >
                    Go to
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <WhyDialog
        item={why}
        overrides={overrides}
        onClose={() => setWhy(undefined)}
        onChangeRow={onChangeRow}
      />
    </div>
  )
}
