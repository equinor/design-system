/**
 * The file the demo pretends to be, Sample file, as the raw units a scan
 * reads from it. The layers come from two fixtures of the plugin's tests,
 * given new layer and variable ids at build time (demo/sample/sanitise.ts):
 *
 * - Well overview, the test frame (test/fixtures/test-frame.json): Ready
 *   values, values that need a check, and legacy modes;
 * - Well details, a frame with a panel component whose slot content the
 *   instance owns (test/fixtures/nested-instances.json): values inside
 *   instances, the instance tree, and Typography instances in a slot.
 *
 * Copies of parts of the test frame give a frame that is half migrated, a
 * main component in this file and a frame on another page. A few layers are
 * added to Well details for the cases the fixtures lack, written as the
 * scanner would read them (the same shapes as the units in test/scan.test.ts
 * and test/stand-ins.test.ts): a Text field whose swapped icon overrides its
 * size with a legacy variable (Manual fix), a shadow colour (No equivalent
 * with a stand-in), Typography instances outside other instances, and
 * instances of a library icon and of the main component in this file. Every
 * unit goes through the plugin's rules, so the statuses are the ones the
 * plugin gives.
 */
import {
  detailsPanel as detailsPanelJson,
  wellOverview as wellOverviewJson,
} from 'virtual:demo-fixtures'
import { NEW, OLD } from '../../../src/mapping/inventory'
import { classifyUnits } from '../../../src/scan/classify'
import { unpackFixture } from '../../../src/scan/fixture'
import type { PackedFixture } from '../../../src/scan/fixture'
import type {
  ComponentSource,
  EntryKind,
  InstanceStep,
  OldInstance,
  RawUnit,
  RawVariable,
} from '../../../src/scan/types'
import type { MapRect } from '../../../src/shared/messages'
import type { FilePage } from '../../../src/shared/pages'
import { unitId, withTarget } from './units'

const wellOverview = wellOverviewJson as PackedFixture
const detailsPanel = detailsPanelJson as PackedFixture

export type SampleEntry = {
  id: string
  kind: EntryKind
  name: string
  pageId: string
  sections: string[]
  nodeIds: string[]
  /** For a main component: its instances in the file */
  instanceCount?: number
  /** The layers in it, for the count the scan shows */
  layers: number
  /** Where it is on its page, for the map the scan draws */
  rect: MapRect
}

/** A main component the instances in the file use, as the scan finds it. */
type ComponentInfo = {
  key: string
  remote: boolean
  /** What the check for library updates finds (src/plugin/scan/sources.ts) */
  source?: ComponentSource
}

export type SampleFile = {
  fileName: string
  pages: FilePage[]
  /** Sections on each page, for the map */
  sections: { pageId: string; rect: MapRect }[]
  entries: SampleEntry[]
  units: RawUnit[]
  /** The main components by name, with where their legacy values can be fixed */
  components: Record<string, ComponentInfo & { id?: string }>
  /** The text in each Typography instance, by instance id */
  texts: Map<string, string>
  /** Layer names by id, for the selection line */
  names: Map<string, string>
}

const PAGES: FilePage[] = [
  { id: '0:1', name: 'Screens' },
  { id: '0:2', name: 'Alarms' },
  { id: '0:3', name: 'Archive' },
]

/** Gives the layers of a copy ids of their own: `10:5` becomes `11:5`. */
function withPrefix(id: string, from: number, to: number): string {
  return id.replace(new RegExp(`(^|[I;])${from}:`, 'g'), `$1${to}:`)
}

/**
 * A copy of units under another prefix, in another entry, with the root of
 * their paths and names renamed.
 */
function copyUnits(
  units: RawUnit[],
  { from, to }: { from: number; to: number },
  entryId: string,
  rootName: string,
  newRootName: string,
): RawUnit[] {
  const id = (value: string) => withPrefix(value, from, to)
  const rename = (name: string) => (name === rootName ? newRootName : name)
  return units.map((unit) => ({
    ...unit,
    nodeId: id(unit.nodeId),
    nodeName: rename(unit.nodeName),
    entryId,
    path: unit.path.map(rename),
    context: { ...unit.context, names: unit.context.names.map(rename) },
    ...(unit.instanceId ? { instanceId: id(unit.instanceId) } : {}),
    ...(unit.modeHolders ? { modeHolders: unit.modeHolders.map(id) } : {}),
  }))
}

/**
 * The units of one layer and the layers in it, with the layer as the root:
 * its name starts their paths, as for a main component on its own.
 */
function reroot(units: RawUnit[], rootId: string, name: string): RawUnit[] {
  const root = units.find((unit) => unit.nodeId === rootId)
  if (!root) return []
  const depth = root.path.length
  const below = (unit: RawUnit) =>
    unit.nodeId === rootId ||
    (unit.path.length > depth && unit.path[depth] === root.nodeName)
  return units.filter(below).map((unit) => {
    const isRoot = unit.nodeId === rootId
    const names = unit.context.names
    const at = names.indexOf(root.nodeName)
    return {
      ...unit,
      nodeName: isRoot ? name : unit.nodeName,
      path: isRoot ? [] : [name, ...unit.path.slice(depth + 1)],
      context: {
        ...unit.context,
        names: at === -1 ? names : [...names.slice(0, at), name],
      },
    }
  })
}

/**
 * Every second Ready value of the units, migrated as Apply would, so the
 * copy shows a frame that is half way.
 */
function halfMigrated(units: RawUnit[]): RawUnit[] {
  const records = new Map(
    classifyUnits(units).map((record) => [record.id, record]),
  )
  let toggle = false
  return units.map((unit) => {
    const record = records.get(unitId(unit))
    const target = record?.candidates?.[0]
    if (
      record?.category !== 'sure' ||
      record.property.type === 'mode' ||
      !target
    ) {
      return unit
    }
    toggle = !toggle
    return toggle ? withTarget(unit, target) : unit
  })
}

/** A variable the fixtures use, found by name, with the value it has there. */
function variableNamed(units: RawUnit[], name: string): RawVariable {
  for (const unit of units) {
    if (unit.unit === 'variable' && unit.variable.name === name) {
      return unit.variable
    }
  }
  throw new Error(`The fixtures have no variable ${name}`)
}

/** A legacy variable the fixtures lack, made the way a scan reads one. */
function legacyVariable(
  name: string,
  collectionKey: string,
  collectionName: string,
  extra: Partial<RawVariable>,
): RawVariable {
  const key = `sample-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return {
    id: `VariableID:${key}`,
    key,
    name,
    type: 'FLOAT',
    collectionKey,
    collectionName,
    ...extra,
  }
}

/**
 * The layers added to Well details: a Text field with a swapped icon whose
 * size is a Manual fix, two Typography instances outside other instances, a
 * card with a shadow colour that has no equivalent, a library icon and an
 * instance of the main component in this file.
 */
function addedLayers(
  entryId: string,
  entryName: string,
  fixtureUnits: RawUnit[],
  chip: RawUnit[],
): RawUnit[] {
  const step = (id: string, name: string, component = name): InstanceStep => ({
    id,
    name,
    component,
  })
  const layer = (
    nodeId: string,
    nodeName: string,
    nodeType: string,
    parents: string[],
    extra: Partial<RawUnit> = {},
  ) => ({
    nodeId,
    nodeName,
    nodeType,
    entryId,
    path: [entryName, ...parents],
    context: {
      nodeType,
      names: [nodeName, ...[...parents].reverse(), entryName],
      modes: {},
    },
    ...extra,
  })
  const fill = { type: 'paint' as const, field: 'fills' as const, index: 0 }
  const units: RawUnit[] = []

  // Search field, an instance of the library Text field, whose error icon
  // was swapped in while the slot used a legacy size (README, Manual fix).
  const textField = step('21:1', 'Search field', 'Text field')
  const icon = step('I21:1;21:3', 'error filled')
  const inField = { instanceId: textField.id, instances: [textField] }
  units.push(
    {
      ...layer('I21:1;21:2', 'Input', 'FRAME', ['Search field'], inField),
      unit: 'variable',
      kind: 'fill',
      property: fill,
      variable: variableNamed(fixtureUnits, 'Bg/Input'),
    },
    {
      ...layer('I21:1;21:2', 'Input', 'FRAME', ['Search field'], inField),
      unit: 'variable',
      kind: 'stroke',
      property: { type: 'paint', field: 'strokes', index: 0 },
      variable: variableNamed(fixtureUnits, 'Border/Neutral/Medium'),
    },
  )
  const iconSize = legacyVariable(
    'Selectable/Icon size',
    OLD.spacingSemantic,
    '🗣️ Semantic',
    {
      value: 16,
      chain: [
        { collectionKey: OLD.fontSize, name: 'typography/icon-size' },
        { collectionKey: OLD.density, name: 'sizing/icon/xs' },
      ],
    },
  )
  const mainSize: RawVariable = {
    id: 'VariableID:sample-spacing-md',
    key: 'sample-spacing-md',
    name: 'spacing/md',
    type: 'FLOAT',
    collectionKey: NEW.semantic,
    collectionName: 'semantic',
  }
  const inIcon = {
    instanceId: textField.id,
    instances: [textField, icon],
    override: true as const,
  }
  for (const size of ['width', 'height']) {
    units.push({
      ...layer('I21:1;21:3', 'error filled', 'INSTANCE', ['Search field'], {
        ...inIcon,
      }),
      unit: 'variable',
      kind: 'size',
      property: { type: 'field', field: size },
      variable: iconSize,
      mainVariable: mainSize,
      swap: { from: 'Placeholder Icon', to: 'error filled' },
    })
  }
  units.push({
    ...layer(
      'I21:1;21:3;21:4',
      'icon',
      'BOOLEAN_OPERATION',
      ['Search field', 'error filled'],
      inIcon,
    ),
    unit: 'variable',
    kind: 'fill',
    property: fill,
    variable: variableNamed(fixtureUnits, 'Text/Danger/Strong'),
  })

  // Typography instances directly in the frame: a title, and a label in
  // upper case, which the EDS Beta text styles do not carry.
  const title = fixtureUnits.find(
    (unit) => unit.nodeName === 'Page title' && unit.unit === 'typography',
  )
  const label = fixtureUnits.find(
    (unit) => unit.nodeName === 'Field label' && unit.unit === 'typography',
  )
  for (const [id, source, colour, textCase] of [
    ['21:10', title, 'Text/Neutral/Strong', undefined],
    ['21:12', label, 'Text/Neutral/Subtle', 'UPPER'],
  ] as const) {
    if (source?.unit !== 'typography') continue
    const typography = step(id, 'Typography')
    const text = `I${id};21:11`
    const inside = { instanceId: id, instances: [typography] }
    units.push(
      {
        ...layer(text, 'Typography', 'TEXT', ['Typography'], inside),
        unit: 'typography',
        property: { type: 'typography' },
        fields: source.fields,
        font: source.font,
        fontSize: source.fontSize,
        ...(textCase ? { textCase } : {}),
        context: {
          nodeType: 'TEXT',
          names: ['Typography', 'Typography', entryName],
          modes: {},
          singleLine: true,
        },
      },
      {
        ...layer(text, 'Typography', 'TEXT', ['Typography'], inside),
        unit: 'variable',
        kind: 'textFill',
        property: fill,
        variable: variableNamed(fixtureUnits, colour),
      },
    )
  }

  // A card with a shadow: the EDS Beta has no colour for effects, so the
  // shadow colour has no equivalent, with overlay/scrim as the stand-in.
  units.push(
    {
      ...layer('21:20', 'Card / Production', 'FRAME', []),
      unit: 'variable',
      kind: 'fill',
      property: fill,
      variable: variableNamed(fixtureUnits, 'Bg/Neutral/Surface'),
    },
    {
      ...layer('21:20', 'Card / Production', 'FRAME', []),
      unit: 'variable',
      kind: 'effect',
      property: { type: 'effect', index: 0, field: 'color' },
      variable: {
        ...variableNamed(fixtureUnits, 'Bg/Backdrop'),
        colour: '#0000003d',
      },
    },
  )

  // A library icon in the card, whose colour comes from its main component.
  const refresh = step('21:40', 'refresh')
  units.push({
    ...layer(
      'I21:40;21:41',
      'Vector',
      'VECTOR',
      ['Card / Production', 'refresh'],
      { instanceId: refresh.id, instances: [refresh] },
    ),
    unit: 'variable',
    kind: 'fill',
    property: fill,
    variable: variableNamed(fixtureUnits, 'Text/Neutral/Subtle'),
  })

  // An instance of the main component Status chip, which changes with it.
  const instance = step('21:30', 'Status chip')
  for (const unit of chip) {
    const isRoot = unit.path.length === 0
    const nodeId = isRoot ? instance.id : `I${instance.id};${unit.nodeId}`
    units.push({
      ...unit,
      nodeId,
      nodeType: isRoot ? 'INSTANCE' : unit.nodeType,
      entryId,
      path: [entryName, ...unit.path],
      instanceId: instance.id,
      instances: [instance],
      context: {
        ...unit.context,
        nodeType: isRoot ? 'INSTANCE' : unit.context.nodeType,
        names: [...unit.context.names, entryName],
      },
      modeHolders: [instance.id],
    })
  }
  return units
}

/** Builds Sample file, the same every time, so every load of the demo starts alike. */
export function buildSample(): SampleFile {
  const overview = unpackFixture(wellOverview)
  const panel = unpackFixture(detailsPanel)
  const [overviewPage, alarmsPage, archivePage] = PAGES
  const overviewId = wellOverview.frame.id
  const overviewName = wellOverview.frame.name
  const detailsId = detailsPanel.frame.id
  const detailsName = detailsPanel.frame.name

  // A copy of the test frame, half way through the migration.
  const startedId = withPrefix(overviewId, 10, 11)
  const started = halfMigrated(
    copyUnits(
      overview,
      { from: 10, to: 11 },
      startedId,
      overviewName,
      'Well overview – started',
    ),
  )

  // The status chip of the test frame as a main component in this file.
  const chipRoot = overview.find((unit) => unit.nodeName === 'Chip / Status')
  const chipId = withPrefix(chipRoot?.nodeId ?? '10:0', 10, 12)
  const chip = reroot(
    copyUnits(overview, { from: 10, to: 12 }, chipId, '', ''),
    chipId,
    'Status chip',
  )

  // The actions card of the test frame, as a frame on the Alarms page.
  const alarmId = '13:900'
  const actions = overview.filter(
    (unit) =>
      unit.nodeName === 'Card / Actions' ||
      unit.path.includes('Card / Actions'),
  )
  const alarm = copyUnits(
    actions,
    { from: 10, to: 13 },
    alarmId,
    overviewName,
    'Alarm list',
  )

  const added = addedLayers(detailsId, detailsName, overview, chip)
  const units = [...overview, ...started, ...panel, ...added, ...chip, ...alarm]

  const entries: SampleEntry[] = [
    {
      id: overviewId,
      kind: 'frame',
      name: overviewName,
      pageId: overviewPage.id,
      sections: ['Release 1'],
      nodeIds: [overviewId],
      layers: 118,
      rect: [40, 80, 1040, 700],
    },
    {
      id: startedId,
      kind: 'frame',
      name: 'Well overview – started',
      pageId: overviewPage.id,
      sections: ['Release 1'],
      nodeIds: [startedId],
      layers: 118,
      rect: [1160, 80, 1040, 700],
    },
    {
      id: detailsId,
      kind: 'frame',
      name: detailsName,
      pageId: overviewPage.id,
      sections: [],
      nodeIds: [detailsId],
      layers: 86,
      rect: [2320, 80, 720, 780],
    },
    {
      id: chipId,
      kind: 'component',
      name: 'Status chip',
      pageId: overviewPage.id,
      sections: ['Components'],
      nodeIds: [chipId],
      instanceCount: 12,
      layers: 3,
      rect: [2360, 1000, 160, 60],
    },
    {
      id: alarmId,
      kind: 'frame',
      name: 'Alarm list',
      pageId: alarmsPage.id,
      sections: [],
      nodeIds: [alarmId],
      layers: 42,
      rect: [0, 0, 1040, 420],
    },
    {
      id: '30:1',
      kind: 'frame',
      name: 'Old sign-in',
      pageId: archivePage.id,
      sections: [],
      nodeIds: ['30:1'],
      layers: 22,
      rect: [0, 0, 400, 800],
    },
    {
      id: '30:2',
      kind: 'frame',
      name: 'Splash',
      pageId: archivePage.id,
      sections: [],
      nodeIds: ['30:2'],
      layers: 4,
      rect: [480, 0, 400, 800],
    },
  ]

  // The Typography instances in the panel's slot, and the ones added.
  const texts = new Map<string, string>([
    ['21:10', 'Well details'],
    ['21:12', 'STATUS'],
  ])
  const slotTypography = Object.values<InstanceStep>(
    detailsPanel.steps ?? {},
  ).filter(
    (candidate) => candidate.component === 'Typography' && candidate.slot,
  )
  slotTypography.forEach((candidate, index) =>
    texts.set(candidate.id, index === 0 ? 'Production' : 'Draft note'),
  )

  const names = new Map<string, string>()
  for (const unit of units) names.set(unit.nodeId, unit.nodeName)
  for (const entry of entries) names.set(entry.id, entry.name)
  names.set('21:1', 'Search field')
  names.set('21:10', 'Typography')
  names.set('21:12', 'Typography')
  names.set('21:30', 'Status chip')
  names.set('21:40', 'refresh')

  return {
    fileName: 'Sample file',
    pages: PAGES,
    sections: [
      { pageId: overviewPage.id, rect: [0, 0, 2240, 820] },
      { pageId: overviewPage.id, rect: [2320, 920, 320, 180] },
    ],
    entries,
    units,
    components: {
      'Details panel': {
        key: 'sample-details-panel',
        remote: true,
        source: { kind: 'no-library' },
      },
      'Text field': {
        key: 'sample-text-field',
        remote: true,
        source: { kind: 'update', legacy: 4, latestLegacy: 0 },
      },
      refresh: {
        key: 'sample-refresh',
        remote: true,
        source: { kind: 'library', legacy: 1 },
      },
      Typography: { key: 'sample-typography', remote: true },
      'Status chip': { key: 'sample-status-chip', remote: false, id: chipId },
    },
    texts,
    names,
  }
}

/** The main component of an instance, as the plugin reads it from Figma. */
export function mainComponentOf(
  file: SampleFile,
  component: string | undefined,
): OldInstance['mainComponent'] {
  if (!component) return undefined
  const info = file.components[component]
  return {
    name: component,
    key: info?.key ?? `sample-${component}`,
    remote: info?.remote ?? true,
    ...(info?.id ? { id: info.id } : {}),
  }
}
