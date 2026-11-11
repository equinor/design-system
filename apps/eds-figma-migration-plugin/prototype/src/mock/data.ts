/**
 * The file the prototype pretends to be: pages, frames and their bindings,
 * built from the scan of the test frame in the AI Testing file
 * (test/fixtures/test-frame.json) and classified by the plugin's own rules.
 * Copies of the frame, frames without EDS variables, an instance-heavy frame
 * and a local component give every view of the plugin something to show.
 */
import fixtureJson from '../../../test/fixtures/test-frame.json'
import { classifyUnits } from '../../../src/scan/classify'
import { unpackFixture } from '../../../src/scan/fixture'
import type { PackedFixture } from '../../../src/scan/fixture'
import type {
  BindingRecord,
  EntryKind,
  OldInstance,
  RawUnit,
} from '../../../src/scan/types'

export type MockEntry = {
  id: string
  kind: EntryKind
  name: string
  pageId: string
  pageName: string
  sections: string[]
  nodeIds: string[]
  instanceCount?: number
}

export type World = {
  fileName: string
  pages: { id: string; name: string }[]
  entries: MockEntry[]
  records: BindingRecord[]
  oldInstances: OldInstance[]
  /** Layer names by id, for the selection label */
  names: Map<string, string>
}

const fixture = fixtureJson as unknown as PackedFixture
const FRAME_ID = fixture.frame.id

/** The original layer id behind a copied one, to find its position on the canvas image. */
export function originalId(id: string): string {
  return id.split('~').pop() ?? id
}

function copyUnits(
  units: RawUnit[],
  prefix: string,
  entryId: string,
  entryName: string,
): RawUnit[] {
  const rename = (id: string) => (prefix ? `${prefix}~${id}` : id)
  return units.map((unit) => ({
    ...unit,
    nodeId: rename(unit.nodeId),
    nodeName: unit.nodeId === FRAME_ID ? entryName : unit.nodeName,
    path:
      unit.path[0] === fixture.frame.name
        ? [entryName, ...unit.path.slice(1)]
        : unit.path,
    entryId,
    instanceId: unit.instanceId ? rename(unit.instanceId) : undefined,
    modeHolders: unit.modeHolders?.map(rename),
  }))
}

const PAGES = [
  { id: 'page:overview', name: 'Well overview' },
  { id: 'page:alarms', name: 'Alarms' },
  { id: 'page:archive', name: 'Archive' },
]

export function buildWorld(): World {
  const units = unpackFixture(fixture)
  const records: BindingRecord[] = []
  const names = new Map<string, string>()
  const entries: MockEntry[] = []
  const [overview, alarms, archive] = PAGES

  const addEntry = (entry: Omit<MockEntry, 'pageName'>) => {
    const page = PAGES.find((candidate) => candidate.id === entry.pageId)
    entries.push({ ...entry, pageName: page?.name ?? '' })
    names.set(entry.id, entry.name)
  }

  // The test frame as it is.
  addEntry({
    id: FRAME_ID,
    kind: 'frame',
    name: 'Well overview',
    pageId: overview.id,
    sections: ['Release 1'],
    nodeIds: [FRAME_ID],
  })
  records.push(
    ...classifyUnits(copyUnits(units, '', FRAME_ID, 'Well overview')),
  )

  // A copy that is half way: every second Ready binding is migrated.
  const started = 'started'
  addEntry({
    id: `${started}~${FRAME_ID}`,
    kind: 'frame',
    name: 'Well overview – started',
    pageId: overview.id,
    sections: ['Release 1'],
    nodeIds: [`${started}~${FRAME_ID}`],
  })
  let toggle = false
  for (const record of classifyUnits(
    copyUnits(
      units,
      started,
      `${started}~${FRAME_ID}`,
      'Well overview – started',
    ),
  )) {
    if (record.category === 'sure' && record.property.type !== 'mode') {
      toggle = !toggle
      if (toggle) {
        records.push({
          ...record,
          category: 'migrated',
          current: record.candidates?.[0],
          candidates: undefined,
          outcome: undefined,
        })
        continue
      }
    }
    records.push(record)
  }

  // An alarm list built from the actions card, with legacy icon instances.
  const alarmId = 'frame:alarm-list'
  addEntry({
    id: alarmId,
    kind: 'frame',
    name: 'Alarm list',
    pageId: alarms.id,
    sections: [],
    nodeIds: [alarmId],
  })
  const actions = units.filter((unit) => unit.path.includes('Card / Actions'))
  records.push(
    ...classifyUnits(copyUnits(actions, 'alarm', alarmId, 'Alarm list')),
  )
  const oldInstances: OldInstance[] = []
  for (const [icon, count] of [
    ['add circle outlined', 7],
    ['refresh', 7],
  ] as const) {
    for (let index = 0; index < count; index++) {
      const id = `alarm-icon~${icon}~${index}`
      names.set(id, icon)
      oldInstances.push({
        id,
        name: icon,
        entryId: alarmId,
        count: 1,
        mainComponent: { name: icon, key: `key:${icon}`, remote: true },
      })
      records.push({
        id: `${id}|fills[0]`,
        nodeId: id,
        nodeName: icon,
        nodeType: 'INSTANCE',
        entryId: alarmId,
        path: ['Alarm list', `Row ${index + 1}`],
        property: { type: 'paint', field: 'fills', index: 0 },
        group: 'colour',
        kind: 'fill',
        category: 'inInstance',
        oldKey: `icon/${icon}`,
        old: 'Icon/Neutral/Default',
        oldCollection: 'Semantic',
        instanceId: id,
      })
    }
  }

  // Frames with nothing from EDS.
  for (const [id, name, pageId] of [
    ['frame:settings', 'Settings', overview.id],
    ['frame:login', 'Old login', archive.id],
    ['frame:splash', 'Splash', archive.id],
  ] as const) {
    addEntry({ id, kind: 'frame', name, pageId, sections: [], nodeIds: [id] })
  }

  // A local component that still uses legacy variables.
  const componentId = 'component:status-chip'
  addEntry({
    id: componentId,
    kind: 'component',
    name: 'Status chip',
    pageId: overview.id,
    sections: ['Components'],
    nodeIds: [componentId],
    instanceCount: 12,
  })
  const chip = units.filter(
    (unit) =>
      unit.nodeName === 'Chip / Status' || unit.path.includes('Chip / Status'),
  )
  records.push(
    ...classifyUnits(copyUnits(chip, 'component', componentId, 'Status chip')),
  )

  for (const unit of units) names.set(unit.nodeId, unit.nodeName)
  for (const record of records) names.set(record.nodeId, record.nodeName)

  return {
    fileName: 'AI Testing',
    pages: PAGES,
    entries,
    records,
    oldInstances,
    names,
  }
}
