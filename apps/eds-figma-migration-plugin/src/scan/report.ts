/**
 * The report of a scan, as Markdown for people and CSV for a spreadsheet.
 * Pure, so it is tested without Figma.
 */
import { CLEAR_VALUE, literalText } from '../mapping/literal'
import { isResetTarget, resetText } from '../mapping/reset'
import {
  CLEAR_MODE,
  manualFixTarget,
  REMOVE_ANYWAY,
  resetEffectsText,
} from './classify'
import { CATEGORY_LABELS, KEPT_TARGET_LABEL, propertyLabel } from './labels'
import {
  DECIDE_LATER,
  effectiveCategory,
  effectiveTarget,
  isKeptWaiting,
  isMappable,
  keptModeText,
  NO_KEPT_MODES,
} from './mapping'
import type { KeptModes, Overrides } from './mapping'
import { formatHealth, oldCount } from './summary'
import type { BindingRecord, OldInstance, ScanSummary } from './types'

export type ReportInput = {
  fileName: string
  summary: ScanSummary
  records: BindingRecord[]
  oldInstances: OldInstance[]
  overrides: Overrides
  /** The legacy modes the next Apply keeps, which the summary counts as Waiting when they are only cleared */
  kept?: KeptModes
}

export type Report = { markdown: string; csv: string; baseName: string }

function targetText(target: string | null): string {
  if (target === null) return 'No target'
  if (target === DECIDE_LATER) return 'Decide later'
  if (isResetTarget(target)) return resetText(target)
  const literal = literalText(target)
  if (literal !== undefined) {
    return target === CLEAR_VALUE ? literal : `${literal}, without a variable`
  }
  if (target === CLEAR_MODE) return 'Clear the legacy mode'
  if (target === REMOVE_ANYWAY) {
    return 'Remove the legacy mode anyway (the values below that read it change)'
  }
  return target
}

/**
 * Escapes a Markdown table cell. Backslashes go first, so a layer name with a
 * backslash keeps it and does not escape the character after it.
 */
function cell(text: string | number | undefined): string {
  return String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ')
}

function table(
  head: string[],
  rows: (string | number | undefined)[][],
): string {
  return [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
  ].join('\n')
}

/** Quotes a CSV field when it has to be. */
function csvField(text: string | number | undefined): string {
  const value = String(text ?? '')
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function layerPath(record: BindingRecord): string {
  return [...record.path, record.nodeName].join(' / ')
}

/**
 * The reason, and for a Manual fix what the reset also removes and sets
 * again, as the window shows them.
 */
function reasonText(record: BindingRecord): string {
  const effects =
    record.category === 'byHand'
      ? resetEffectsText(record.resetEffects, isMappable(record))
      : undefined
  return [record.reason, effects].filter(Boolean).join(' ')
}

export function buildReport(input: ReportInput): Report {
  const {
    fileName,
    summary,
    records,
    oldInstances,
    overrides,
    kept = NO_KEPT_MODES,
  } = input
  const entries = new Map(summary.entries.map((entry) => [entry.id, entry]))
  const components = summary.entries.filter(
    (entry) => entry.kind === 'component',
  )
  const totals = summary.totals
  const health = summary.health
  const category = (record: BindingRecord) =>
    effectiveCategory(record, overrides, kept)
  const date = summary.scannedAt.slice(0, 10)
  const scope =
    summary.scope === 'file'
      ? 'the whole file'
      : summary.scope === 'page'
        ? `the page ${summary.pages[0]?.name ?? ''}`
        : `the selection on ${summary.pages[0]?.name ?? ''}`

  const frames = summary.entries
    .filter((entry) => entry.kind !== 'component')
    .sort((a, b) => (a.health ?? 2) - (b.health ?? 2))
  const changes = summary.entries.reduce(
    (sum, entry) => sum + (entry.changed ?? 0),
    0,
  )
  const check = records.filter((record) => category(record) === 'check')
  const byHand = records.filter((record) => category(record) === 'byHand')
  const none = records.filter((record) => category(record) === 'none')
  // No equivalent is a gap in the EDS Beta tokens, except for a legacy mode
  // the next Apply keeps while values below it read it (Waiting).
  const held = (record: BindingRecord) => isKeptWaiting(record.id, kept)
  const waiting = none.filter(held)
  const gaps = none.filter((record) => !held(record))
  // A string or boolean variable, or a number with no value to read
  const withoutStandIn = gaps.filter(
    (record) => (record.candidates?.length ?? 0) === 0,
  )
  const why = (record: BindingRecord) => {
    const keep = kept[record.id]
    return keep ? keptModeText(keep) : record.reason
  }
  // Values a designer set to Decide later: not applied yet, and counted in
  // their category, a Ready value as Needs check.
  const later = records.filter(
    (record) =>
      isMappable(record) &&
      effectiveTarget(record, overrides).target === DECIDE_LATER,
  )

  const instanceGroups = new Map<
    string,
    { name: string; source: string; instances: number; legacy: number }
  >()
  for (const instance of oldInstances) {
    const main = instance.mainComponent
    const key = main?.key ?? `name:${instance.name}`
    const group = instanceGroups.get(key) ?? {
      name: main?.name ?? instance.name,
      source: main ? (main.remote ? 'library' : 'this file') : 'not found',
      instances: 0,
      legacy: 0,
    }
    group.instances += 1
    group.legacy += instance.count
    instanceGroups.set(key, group)
  }

  const t = totals
  const markdown = [
    `# EDS variable migration report: ${fileName}`,
    '',
    `Scanned ${scope} on ${date}, ${summary.nodesScanned} layers. Rules version ${summary.mappingVersion}.`,
    '',
    `## Health: ${formatHealth(health)}`,
    '',
    table(
      [
        'Migrated',
        'Ready',
        'Needs check',
        'Manual fix',
        'No equivalent',
        'In instance',
        'Other libraries',
      ],
      [[t.migrated, t.sure, t.check, t.byHand, t.none, t.inInstance, t.other]],
    ),
    '',
    'Health is migrated ÷ (migrated + ready + needs check + manual fix + no equivalent + in instance). A value set to Decide later counts as not migrated.',
    '',
    `## Frames (${frames.length})`,
    '',
    table(
      [
        'Frame',
        'Page',
        'Section',
        'Health',
        'Migrated',
        'Legacy',
        'Needs check',
        'Changed by the plugin',
      ],
      frames.map((entry) => [
        entry.name,
        entry.pageName,
        entry.sections.join(' › '),
        formatHealth(entry.health),
        entry.counts.migrated,
        oldCount(entry.counts),
        entry.counts.check,
        entry.changed ?? 0,
      ]),
    ),
    '',
    ...(components.length > 0
      ? [
          `## Main components (${components.length})`,
          '',
          table(
            [
              'Component',
              'Page',
              'Health',
              'Migrated',
              'Legacy',
              'Needs check',
              'Instances in the file',
            ],
            components.map((entry) => [
              entry.name,
              entry.pageName,
              formatHealth(entry.health),
              entry.counts.migrated,
              oldCount(entry.counts),
              entry.counts.check,
              entry.instanceCount ?? '',
            ]),
          ),
          '',
        ]
      : []),
    `## Changes made by the plugin`,
    '',
    changes > 0
      ? `${changes} layer${changes === 1 ? '' : 's'} in the scope have changes from the plugin, logged on each layer for Revert frame.`
      : 'The plugin has not changed any layer in the scope yet.',
    '',
    `## Needs check (${check.length})`,
    '',
    check.length > 0
      ? table(
          ['Frame', 'Layer', 'Property', 'Legacy', 'Proposal', 'Why'],
          check.map((record) => [
            entries.get(record.entryId)?.name,
            layerPath(record),
            propertyLabel(record.property),
            record.old,
            targetText(record.candidates?.[0] ?? null),
            record.reason,
          ]),
        )
      : 'Nothing needs a check.',
    '',
    `## Manual fix (${byHand.length})`,
    '',
    byHand.length > 0
      ? [
          'Legacy values that Figma lets nobody change where they are, in the editor or from a plugin. Each row says how to fix it in Figma, and what resetting the layer also removes and sets again.',
          '',
          table(
            ['Frame', 'Layer', 'Property', 'Legacy', 'After the fix', 'How'],
            byHand.map((record) => [
              entries.get(record.entryId)?.name,
              layerPath(record),
              propertyLabel(record.property),
              record.old,
              manualFixTarget(record),
              reasonText(record),
            ]),
          ),
        ].join('\n')
      : 'Nothing needs a manual fix.',
    '',
    `## No equivalent (${none.length})`,
    '',
    gaps.length > 0
      ? [
          'Legacy values the EDS Beta has no token for: each is a gap in the tokens. The plugin proposes a stand-in, and changes the value only once a designer chooses the stand-in or another target.',
          '',
          table(
            ['Frame', 'Layer', 'Property', 'Legacy', 'Stand-in', 'The gap'],
            gaps.map((record) => [
              entries.get(record.entryId)?.name,
              layerPath(record),
              propertyLabel(record.property),
              record.old,
              record.candidates?.[0]
                ? targetText(record.candidates[0])
                : 'None possible',
              record.reason,
            ]),
          ),
          ...(withoutStandIn.length > 0
            ? [
                '',
                `${withoutStandIn.length === 1 ? 'One value has' : `${withoutStandIn.length} values have`} no stand-in (None possible). No stand-in is possible for a string or boolean variable, such as a text or a visibility, since it has no px or colour to match an EDS Beta token to, nor for a number whose value could be read neither from the variable nor from the layer. Apply changes these only once a designer chooses a target, and where the EDS Beta has nothing that fits, they have to be changed in Figma.`,
              ]
            : []),
        ].join('\n')
      : 'The EDS Beta has a token for every legacy value in the scope.',
    ...(waiting.length > 0
      ? [
          '',
          `### Legacy modes waiting (${waiting.length})`,
          '',
          'Legacy modes the plugin keeps while values below them read them. They count as No equivalent until Apply can remove them.',
          '',
          table(
            ['Frame', 'Layer', 'Legacy mode', 'Why'],
            waiting.map((record) => [
              entries.get(record.entryId)?.name,
              layerPath(record),
              `${record.oldCollection ?? ''}: ${record.old ?? ''}`,
              why(record),
            ]),
          ),
        ]
      : []),
    '',
    `## Decide later (${later.length})`,
    '',
    later.length > 0
      ? [
          'Values a designer chose to decide on later. Apply leaves them, and they count as not migrated until a designer chooses a target.',
          '',
          table(
            ['Frame', 'Layer', 'Property', 'Status', 'Legacy', 'Proposal'],
            later.map((record) => [
              entries.get(record.entryId)?.name,
              layerPath(record),
              propertyLabel(record.property),
              CATEGORY_LABELS[category(record)],
              record.old,
              record.candidates?.[0] ? targetText(record.candidates[0]) : '',
            ]),
          ),
        ].join('\n')
      : 'No value is set to Decide later.',
    '',
    `## Instances with legacy variables (${oldInstances.length})`,
    '',
    instanceGroups.size > 0
      ? table(
          ['Main component', 'Where', 'Instances', 'Legacy bindings'],
          [...instanceGroups.values()]
            .sort((a, b) => b.legacy - a.legacy)
            .map((group) => [
              group.name,
              group.source,
              group.instances,
              group.legacy,
            ]),
        )
      : 'No instance in the scope uses legacy variables.',
    '',
  ].join('\n')

  const head = [
    'Frame',
    'Page',
    'Layer',
    'Property',
    'Status',
    'Legacy',
    'Target',
    'Chosen by',
    'Why',
    'Rules version',
  ]
  const rows = records
    .filter((record) => record.category !== 'other')
    .map((record) => {
      const entry = entries.get(record.entryId)
      const mappable = isMappable(record)
      const target = mappable ? effectiveTarget(record, overrides) : undefined
      return [
        entry?.name,
        entry?.pageName,
        layerPath(record),
        propertyLabel(record.property),
        CATEGORY_LABELS[category(record)],
        record.old ?? '',
        target
          ? // A stand-in is only proposed until a designer chooses it.
            record.category === 'none' &&
            target.source === 'proposal' &&
            target.target !== null
            ? `Stand-in: ${targetText(target.target)}`
            : isKeptWaiting(record.id, kept)
              ? KEPT_TARGET_LABEL
              : targetText(target.target)
          : record.category === 'byHand'
            ? manualFixTarget(record)
            : (record.current ?? ''),
        target ? (target.source === 'proposal' ? 'Rule' : 'Designer') : '',
        [reasonText(record), kept[record.id] && keptModeText(kept[record.id])]
          .filter(Boolean)
          .join(' '),
        summary.mappingVersion,
      ]
    })
  const csv = `${[head, ...rows].map((row) => row.map(csvField).join(',')).join('\n')}\n`

  const safe = fileName.replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '')
  return { markdown, csv, baseName: `eds-migration-${safe || 'file'}-${date}` }
}
