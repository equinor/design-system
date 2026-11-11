/**
 * The report of a scan, as Markdown for people and CSV for a spreadsheet.
 * Pure, so it is tested without Figma.
 */
import { literalValue } from '../mapping/literal'
import { CLEAR_MODE } from './classify'
import { CATEGORY_LABELS, propertyLabel } from './labels'
import { effectiveCategory, effectiveTarget, isMappable } from './mapping'
import type { Overrides } from './mapping'
import { formatHealth, healthOf, oldCount, sumCounts } from './summary'
import type { BindingRecord, OldInstance, ScanSummary } from './types'

export type ReportInput = {
  fileName: string
  summary: ScanSummary
  records: BindingRecord[]
  oldInstances: OldInstance[]
  overrides: Overrides
  /**
   * Count the local components, as the window does when Local components is
   * on. Off, the report counts what the health bar counts by default.
   */
  includeComponents?: boolean
}

export type Report = { markdown: string; csv: string; baseName: string }

function targetText(target: string | null): string {
  if (target === null) return 'Leave as it is'
  const literal = literalValue(target)
  if (literal !== undefined) return `${literal}px, without a variable`
  if (target === CLEAR_MODE) return 'Clear the legacy mode'
  return target
}

/** Escapes a Markdown table cell. */
function cell(text: string | number | undefined): string {
  return String(text ?? '')
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

export function buildReport(input: ReportInput): Report {
  const { fileName, summary, overrides } = input
  const includeComponents = input.includeComponents ?? false
  const entries = new Map(summary.entries.map((entry) => [entry.id, entry]))
  // Test session finding 11: the report counts what the window counts.
  const counted = (entryId: string) =>
    includeComponents || entries.get(entryId)?.kind !== 'component'
  const records = input.records.filter((record) => counted(record.entryId))
  const oldInstances = input.oldInstances.filter((instance) =>
    counted(instance.entryId),
  )
  const components = summary.entries.filter(
    (entry) => entry.kind === 'component',
  )
  const totals = includeComponents
    ? sumCounts(summary.entries.map((entry) => entry.counts))
    : summary.totals
  const health = includeComponents ? healthOf(totals) : summary.health
  const category = (record: BindingRecord) =>
    effectiveCategory(record, overrides)
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
  const changes = summary.entries
    .filter((entry) => counted(entry.id))
    .reduce((sum, entry) => sum + (entry.changed ?? 0), 0)
  const check = records.filter((record) => category(record) === 'check')
  const none = records.filter((record) => category(record) === 'none')

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
  const componentNote =
    components.length === 0
      ? []
      : [
          includeComponents
            ? `The counts include the ${components.length} local component${components.length === 1 ? '' : 's'} in the scope, as the window does with Local components on.`
            : `The ${components.length} local component${components.length === 1 ? ' in the scope is' : 's in the scope are'} left out, as in the window. Turn on Local components in the plugin's settings to count ${components.length === 1 ? 'it' : 'them'}.`,
          '',
        ]
  const markdown = [
    `# EDS variable migration report: ${fileName}`,
    '',
    `Scanned ${scope} on ${date}, ${summary.nodesScanned} layers. Rules version ${summary.mappingVersion}.`,
    '',
    ...componentNote,
    `## Health: ${formatHealth(health)}`,
    '',
    table(
      [
        'Migrated',
        'Ready',
        'Needs check',
        'No equivalent',
        'In instance',
        'Other libraries',
      ],
      [[t.migrated, t.sure, t.check, t.none, t.inInstance, t.other]],
    ),
    '',
    'Health is migrated ÷ (migrated + ready + needs check + no equivalent + in instance).',
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
    ...(includeComponents && components.length > 0
      ? [
          `## Local components (${components.length})`,
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
    `## No equivalent (${none.length})`,
    '',
    none.length > 0
      ? table(
          ['Frame', 'Layer', 'Property', 'Legacy', 'Why'],
          none.map((record) => [
            entries.get(record.entryId)?.name,
            layerPath(record),
            propertyLabel(record.property),
            record.old,
            record.reason,
          ]),
        )
      : 'Every legacy binding has an equivalent.',
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
        target ? targetText(target.target) : (record.current ?? ''),
        target ? (target.source === 'proposal' ? 'Rule' : 'Designer') : '',
        record.reason ?? '',
        summary.mappingVersion,
      ]
    })
  const csv = `${[head, ...rows].map((row) => row.map(csvField).join(',')).join('\n')}\n`

  const safe = fileName.replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '')
  return { markdown, csv, baseName: `eds-migration-${safe || 'file'}-${date}` }
}
