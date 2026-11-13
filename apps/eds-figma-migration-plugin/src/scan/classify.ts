/**
 * Turns the raw units of a scan into records: which category each one is in,
 * and for old variables outside instances, what the rules propose.
 */
import { literalText } from '../mapping/literal'
import { nearNamesMatch } from '../mapping/role'
import { isResetTarget, resetTarget, resetVariable } from '../mapping/reset'
import { propertyLabel } from './labels'
import { targetDensity } from '../mapping/density'
import { targetScheme } from '../mapping/scheme'
import {
  collectionOrigin,
  getNewTextStyle,
  isNewTextStyleKey,
  libraryCollectionKeys,
  OLD,
  oldCollectionInfo,
} from '../mapping/inventory'
import {
  resolveMode,
  resolveTypography,
  resolveVariable,
} from '../mapping/rules'
import type {
  OldVariable,
  RoleContext,
  TypographyField,
} from '../mapping/types'
import type {
  BindingRecord,
  PropertyGroup,
  PropertyRef,
  RawContext,
  RawUnit,
  RawVariable,
} from './types'

/** The target of a legacy mode that is only cleared, with no new mode set. */
export const CLEAR_MODE = 'clear'

export function propertyKey(property: PropertyRef): string {
  switch (property.type) {
    case 'paint':
      return `${property.field}[${property.index}]${property.range ? `@${property.range.join('-')}` : ''}`
    case 'effect':
      return `effects[${property.index}].${property.field}`
    case 'field':
      return property.field
    case 'typography':
      return `typography${property.range ? `@${property.range.join('-')}` : ''}`
    case 'mode':
      return `mode:${property.collectionId}`
  }
}

export function toOldVariable(variable: RawVariable): OldVariable {
  return {
    collectionKey: variable.collectionKey,
    name: variable.name,
    type: variable.type,
    chain: variable.chain,
    resolvedValue: variable.resolvedValue,
    value: variable.value,
  }
}

export function toRoleContext(raw: RawContext): RoleContext {
  const { fillUnder, ...rest } = raw
  if (!fillUnder) return rest
  const variable = fillUnder.variable
  const origin = variable ? collectionOrigin(variable.collectionKey) : 'other'
  return {
    ...rest,
    fillUnder: {
      context: fillUnder.context,
      oldVariable:
        variable && origin === 'old' ? toOldVariable(variable) : undefined,
      newVariableName: variable && origin === 'new' ? variable.name : undefined,
    },
  }
}

function describe(variable: RawVariable): string {
  return variable.collectionName
    ? `${variable.name} (${variable.collectionName})`
    : variable.name
}

/**
 * The legacy collections a variable reads. A number variable reads its own
 * collection and the collections its alias chain passes through. The colour
 * chains are not followed, so a colour reads every collection in its library
 * and the shared colour scheme.
 */
export function readsOf(variable: RawVariable): string[] {
  if (variable.type === 'COLOR') {
    const info = oldCollectionInfo(variable.collectionKey)
    if (!info) return [variable.collectionKey]
    return [
      ...new Set([
        ...libraryCollectionKeys(info.libraryId),
        OLD.colorScheme,
        variable.collectionKey,
      ]),
    ]
  }
  return [
    ...new Set([
      variable.collectionKey,
      ...(variable.chain ?? []).map((step) => step.collectionKey),
    ]),
  ]
}

/** Fields a plugin cannot bind a variable to on a layer inside an instance; it can only unbind them. */
export const INSTANCE_LOCKED_FIELDS = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
])

const LOCKED_FIELD_NAMES: Record<string, string> = {
  width: 'width',
  height: 'height',
  minWidth: 'minimum width',
  maxWidth: 'maximum width',
  minHeight: 'minimum height',
  maxHeight: 'maximum height',
}

type VariableUnit = Extract<RawUnit, { unit: 'variable' }>

/**
 * Figma lets nobody change the size of a layer inside an instance: a plugin
 * that binds a variable to it or calls resize() is ignored without an error
 * (tested 2026-11-13), and the editor does not offer it either. A legacy
 * size the instance overrides there is a Manual fix: the plugin flags it and
 * says how to fix it in Figma, which is to reset the layer so it takes the
 * size from its main component again. A swapped icon goes back to the
 * component the main component has there, so it is swapped again after the
 * reset, and a swap keeps the size (tested on FRIOD 2026-11-13). The target
 * is the EDS Beta variable the main component uses there, or else the rules'
 * proposal. Null for a layer outside these rules, such as the instance
 * itself, which a plugin can bind.
 */
export function manualFix(
  unit: VariableUnit,
): { target?: string; reason: string } | null {
  if (
    !unit.override ||
    unit.property.type !== 'field' ||
    !INSTANCE_LOCKED_FIELDS.has(unit.property.field) ||
    unit.nodeId === unit.instanceId
  ) {
    return null
  }
  const field = LOCKED_FIELD_NAMES[unit.property.field]
  const main = unit.mainVariable
  const mainIsBeta =
    main !== undefined && collectionOrigin(main.collectionKey) === 'new'
  // A reset gives the main component's value; with a legacy variable there
  // the main component has to be migrated first, so the plugin offers no fix.
  // Only an instance can be reset on its own by a plugin.
  const target =
    (main && !mainIsBeta) || unit.nodeType !== 'INSTANCE'
      ? undefined
      : resetTarget(mainIsBeta ? main.name : undefined)
  const swap = unit.swap
  const why = `The instance overrides the ${field} of this layer with the legacy ${unit.variable.name}. Figma lets nobody change the size of a layer inside an instance, in the editor or from a plugin, so the fix is to reset the layer in Figma.`
  const reset =
    'click the row to select the layer, then right-click it in Figma and choose Reset all changes'
  let steps: string
  if (main && !mainIsBeta) {
    steps = `The main component uses the legacy ${main.name} here too, so migrate the main component first. Then ${reset}${swap ? `, and swap it to ${swap.to} again` : ''}.`
  } else if (swap?.property) {
    steps = `To fix it, ${reset}: it stays ${swap.to}, but without a size variable. Then select ${swap.property.on}, set its ${swap.property.name} property to ${swap.from} and back to ${swap.to}, which brings ${mainIsBeta ? main.name : 'the size'} from the main component.`
  } else if (swap) {
    steps = `To fix it, ${reset}. It turns back into ${swap.from}${mainIsBeta ? ` and takes ${main.name} from the main component` : ''}. Then swap it to ${swap.to} again, which keeps that size.`
  } else {
    steps = `To fix it, ${reset}. It takes ${mainIsBeta ? main.name : 'its size'} from the main component again.`
  }
  const offer = target
    ? ' The plugin can make this fix for you once you accept it in Review.'
    : ''
  return {
    ...(target ? { target } : {}),
    reason: `${why} ${steps}${offer}`,
  }
}

/** What a Manual fix row shows as its target: the variable the reset gives, or the main component's size. */
export function manualFixTarget(record: BindingRecord): string {
  const target = record.candidates?.[0]
  return target && isResetTarget(target)
    ? (resetVariable(target) ?? "The main component's size")
    : "The main component's size, once it is migrated"
}

/** What to set again after a reset, for a value the reset removes: its EDS Beta value. */
function valueAfterReset(record: BindingRecord): string {
  switch (record.category) {
    case 'migrated':
    case 'other':
      return record.current ?? ''
    case 'sure':
    case 'check': {
      const target = record.candidates?.[0]
      if (!target) return record.old ?? ''
      return literalText(target) ?? target
    }
    default:
      return `${record.old ?? ''}, which has no EDS Beta equivalent yet`
  }
}

/**
 * A reset removes every change on the layer and the layers below it, so a
 * Manual fix lists the variables the instance sets there, each with the EDS
 * Beta value to set again after the reset. Layers below an instance layer
 * have ids that start with its id and a semicolon.
 */
function withResetList(records: BindingRecord[]): BindingRecord[] {
  return records.map((record) => {
    if (record.category !== 'byHand') return record
    const lost = records.filter(
      (other) =>
        other.override &&
        other.category !== 'byHand' &&
        (other.nodeId === record.nodeId ||
          other.nodeId.startsWith(`${record.nodeId};`)),
    )
    const items = [
      ...new Set(
        lost.map(
          (other) =>
            `${other.nodeName}, ${propertyLabel(other.property).toLowerCase()}: ${valueAfterReset(other)}${other.old ? ` (now ${other.old})` : ''}`,
        ),
      ),
    ]
    const list =
      items.length > 0
        ? ` The reset also removes the other changes on the layer. Set these again afterwards, with the EDS Beta values: ${items.join('; ')}. Changes without a variable, such as a hidden layer, have to be set again too.`
        : ' The reset also removes any other change on the layer, such as its colour, so set those again afterwards.'
    return { ...record, reason: `${record.reason ?? ''}${list}` }
  })
}

export function groupOf(unit: RawUnit): PropertyGroup {
  if (unit.unit === 'typography') return 'typography'
  if (unit.unit === 'mode') return 'modes'
  if (unit.unit === 'value') return 'size'
  switch (unit.kind) {
    case 'fill':
    case 'stroke':
    case 'effect':
    case 'textFill':
      return 'colour'
    case 'spacing':
      return 'spacing'
    case 'size':
    case 'strokeWeight':
      return 'size'
    case 'radius':
      return 'radius'
    default:
      return 'other'
  }
}

/** Classifies one unit, or returns null when it is not counted (text with no bound typography). */
export function classifyUnit(unit: RawUnit): BindingRecord | null {
  const base = {
    id: `${unit.nodeId}|${propertyKey(unit.property)}`,
    nodeId: unit.nodeId,
    nodeName: unit.nodeName,
    nodeType: unit.nodeType,
    entryId: unit.entryId,
    path: unit.path,
    property: unit.property,
    group: groupOf(unit),
    instanceId: unit.instanceId,
    density: targetDensity(unit.context.modes),
    scheme: targetScheme(unit.context.modes),
    ...(unit.override ? { override: true as const } : {}),
    ...(unit.modeHolders ? { modeHolders: unit.modeHolders } : {}),
  }

  // Test session finding 8: a border width set as a number is migrated.
  if (unit.unit === 'value') {
    return {
      ...base,
      category: 'migrated',
      current:
        unit.value === null
          ? 'No value, removed by the plugin'
          : `${unit.value}, set without a variable by the plugin`,
    }
  }

  if (unit.unit === 'variable') {
    const { variable } = unit
    const origin = collectionOrigin(variable.collectionKey)
    if (origin === 'new') {
      return { ...base, category: 'migrated', current: variable.name }
    }
    if (origin === 'other') {
      return { ...base, category: 'other', current: describe(variable) }
    }
    const old = {
      kind: unit.kind,
      oldKey: `${variable.collectionKey}/${variable.name}`,
      old: variable.name,
      oldCollection: variable.collectionName,
      oldVariable: { id: variable.id, key: variable.key, name: variable.name },
      reads: readsOf(variable),
      ...(variable.value !== undefined ? { oldValue: variable.value } : {}),
      ...(variable.colour !== undefined ? { oldColour: variable.colour } : {}),
    }
    // An instance takes the value from its main component, unless it
    // overrides it: then the value is the instance's own and changes here.
    if (unit.instanceId && !unit.override) {
      return { ...base, ...old, category: 'inInstance' }
    }
    const rules = resolveVariable({
      kind: unit.kind,
      variable: toOldVariable(variable),
      context: toRoleContext(unit.context),
    })
    const fix = manualFix(unit)
    if (fix) {
      return {
        ...base,
        ...old,
        category: 'byHand',
        candidates: fix.target ? [fix.target] : [],
        reason: fix.reason,
        rule: 'instance/size-override',
      }
    }
    return {
      ...base,
      ...old,
      category: rules.outcome,
      outcome: rules.outcome,
      candidates: rules.candidates,
      reason: rules.reason,
      rule: rules.rule,
    }
  }

  if (unit.unit === 'typography') {
    const entries = Object.entries(unit.fields) as [
      TypographyField,
      RawVariable,
    ][]
    const oldFields = entries.filter(
      ([, variable]) => collectionOrigin(variable.collectionKey) === 'old',
    )
    if (oldFields.length > 0) {
      const names = oldFields
        .map(([, variable]) => variable.name)
        .sort((a, b) => a.localeCompare(b, 'en'))
      const old = {
        oldKey: `typography:${names.join('|')}`,
        old: names.join(', '),
        oldCollection: [
          ...new Set(oldFields.map(([, variable]) => variable.collectionName)),
        ].join(', '),
        oldFont: unit.font,
        reads: [
          ...new Set(oldFields.flatMap(([, variable]) => readsOf(variable))),
        ],
        oldFields: Object.fromEntries(
          oldFields.map(([field, variable]) => [
            field,
            { key: variable.key, name: variable.name },
          ]),
        ),
      }
      if (unit.instanceId && !unit.override) {
        return { ...base, ...old, category: 'inInstance' }
      }
      const resolution = resolveTypography({
        fields: Object.fromEntries(
          oldFields.map(([field, variable]) => [
            field,
            toOldVariable(variable),
          ]),
        ),
        font: unit.font,
        fontSize: unit.fontSize,
        context: toRoleContext(unit.context),
      })
      return {
        ...base,
        ...old,
        category: resolution.outcome,
        outcome: resolution.outcome,
        candidates: resolution.candidates,
        reason: resolution.reason,
        rule: resolution.rule,
      }
    }
    if (unit.textStyle && isNewTextStyleKey(unit.textStyle.key)) {
      return { ...base, category: 'migrated', current: unit.textStyle.name }
    }
    const newFields = entries.filter(
      ([, variable]) => collectionOrigin(variable.collectionKey) === 'new',
    )
    if (newFields.length > 0) {
      // EDS Beta typography variables without the text style, for example
      // after a style was detached: the matching text style is applied.
      const style = labelInControl(
        styleForVariables(unit.fields),
        toRoleContext(unit.context),
      )
      if (style && (!unit.instanceId || unit.override)) {
        const names = newFields
          .map(([, variable]) => variable.name)
          .sort((a, b) => a.localeCompare(b, 'en'))
        return {
          ...base,
          category: 'sure',
          outcome: 'sure',
          oldKey: `typography:${names.join('|')}`,
          old: names.join(', '),
          oldCollection: 'EDS Beta variables without a text style',
          oldFont: unit.font,
          oldFields: Object.fromEntries(
            newFields.map(([field, variable]) => [
              field,
              { key: variable.key, name: variable.name },
            ]),
          ),
          candidates: [style],
          reason: `Bound to EDS Beta typography variables without a text style; the matching style, ${style}, is applied instead`,
          rule: 'type/variables-to-style',
        }
      }
      return { ...base, category: 'migrated', current: newFields[0][1].name }
    }
    if (entries.length > 0) {
      return {
        ...base,
        category: 'other',
        current: entries.map(([, variable]) => describe(variable)).join(', '),
      }
    }
    return null
  }

  const origin = collectionOrigin(unit.collectionKey)
  const label = `${unit.collectionName}: ${unit.modeName}`
  if (origin === 'new') return { ...base, category: 'migrated', current: label }
  if (origin === 'other') return { ...base, category: 'other', current: label }
  const old = {
    oldKey: `mode:${unit.collectionKey}:${unit.modeName}`,
    old: unit.modeName,
    oldCollection: unit.collectionName,
    oldMode: {
      collectionId: unit.collectionId,
      collectionKey: unit.collectionKey,
      modeId: unit.modeId,
      modeName: unit.modeName,
    },
  }
  if (unit.instanceId) return { ...base, ...old, category: 'inInstance' }
  const resolution = resolveMode({
    collectionKey: unit.collectionKey,
    modeName: unit.modeName,
  })
  return {
    ...base,
    ...old,
    category: resolution.outcome,
    outcome: resolution.outcome,
    candidates: resolution.target
      ? [`${resolution.target.collection}: ${resolution.target.mode}`]
      : resolution.outcome === 'sure'
        ? [CLEAR_MODE]
        : [],
    reason: resolution.reason,
    rule: resolution.rule,
  }
}

/**
 * The EDS Beta text style that a set of EDS Beta typography variables
 * describes: `typography/header/xl/font-size` and `font-weight/medium` give
 * `header/xl`, `typography/label/md/font-size` and `font-weight/bold` give
 * `label/md/bold`. Undefined when no style matches.
 */
export function styleForVariables(
  fields: Partial<Record<TypographyField, RawVariable>>,
): string | undefined {
  const size =
    /^typography\/(header|label|body|mono)\/([a-z0-9]+)\/font-size$/.exec(
      fields.fontSize?.name ?? '',
    )
  if (!size) return undefined
  const [, role, step] = size
  const weightName = /^font-weight\/(normal|medium|bold)$/.exec(
    fields.fontWeight?.name ?? '',
  )?.[1]
  const weight = weightName === 'normal' || !weightName ? 'default' : weightName
  const name =
    role === 'header' ? `header/${step}` : `${role}/${step}/${weight}`
  return getNewTextStyle(name) ? name : undefined
}

/**
 * ADR-0027: single-line text inside a control takes label, not body, so a
 * body style found from the variables becomes the label style of the same
 * step there (decided 2026-11-12).
 */
function labelInControl(
  style: string | undefined,
  context: RoleContext,
): string | undefined {
  const body = style && /^body\/([a-z0-9]+)\/(default|bold)$/.exec(style)
  if (!body || !context.singleLine) return style
  if (!nearNamesMatch(context, 'labelControls')) return style
  const label = `label/${body[1]}/${body[2]}`
  return getNewTextStyle(label) ? label : style
}

/** Colour modes only matter to colour variables, and spacing and typography modes to the rest. */
function libraryGroup(collectionKey: string): 'colour' | 'spacing' | undefined {
  const info = oldCollectionInfo(collectionKey)
  if (!info) return undefined
  return info.libraryId.startsWith('colours') ? 'colour' : 'spacing'
}

/** The collection key of a legacy binding, for variables and typography. */
function bindingCollectionKey(record: BindingRecord): string | undefined {
  if (record.property.type === 'typography') return OLD.density
  if (record.oldKey?.startsWith('typography:')) return OLD.density
  if (record.oldKey?.startsWith('mode:')) return undefined
  return record.oldKey?.split('/')[0]
}

/**
 * The legacy modes that have to stay, as `nodeId|collectionKey`. A legacy
 * binding that stays resolves through the nearest legacy mode above it of a
 * collection in its own library, so that mode cannot be cleared.
 */
export function blockedModes(
  records: BindingRecord[],
  stays: (record: BindingRecord) => boolean,
): Set<string> {
  const held = new Map<string, string[]>()
  for (const record of records) {
    if (record.property.type !== 'mode' || !record.oldMode) continue
    const list = held.get(record.nodeId) ?? []
    list.push(record.oldMode.collectionKey)
    held.set(record.nodeId, list)
  }
  const blocked = new Set<string>()
  for (const record of records) {
    if (record.property.type === 'mode' || !stays(record)) continue
    const key = bindingCollectionKey(record)
    const group = key ? libraryGroup(key) : undefined
    if (!group && !record.reads) continue
    // A binding holds the nearest legacy mode of each collection it reads;
    // without that list, of each collection in its library.
    const reads = record.reads ? new Set(record.reads) : undefined
    const claimed = new Set<string>()
    for (const holder of [...(record.modeHolders ?? [])].reverse()) {
      for (const collection of held.get(holder) ?? []) {
        const relevant = reads
          ? reads.has(collection)
          : libraryGroup(collection) === group
        if (claimed.has(collection) || !relevant) {
          continue
        }
        claimed.add(collection)
        blocked.add(`${holder}|${collection}`)
      }
    }
  }
  return blocked
}

/** Bindings that will not change: inside instances, with no equivalent, or to change by hand. */
function staysAsItIs(record: BindingRecord): boolean {
  return ['inInstance', 'none', 'byHand'].includes(record.category)
}

/**
 * A legacy mode can only be cleared once nothing below it uses a legacy
 * variable through it, including inside instances: an instance still
 * resolves its legacy variables through the mode. A mode above a binding
 * that will not change stays for good; a mode above a binding that needs a
 * check stays until the binding is reviewed and applied. A mode that sets a
 * new one is still applied, and keeps the legacy mode beside it. A mode
 * with nothing to do now counts as No equivalent, with the reason, so Apply
 * never offers a change that changes nothing.
 */
export function holdModes(records: BindingRecord[]): BindingRecord[] {
  const forGood = blockedModes(records, staysAsItIs)
  const untilReview = blockedModes(
    records,
    (record) => record.category === 'check',
  )
  const newModes = new Set(
    records
      .filter(
        (record) =>
          record.property.type === 'mode' && record.category === 'migrated',
      )
      .map((record) => `${record.nodeId}|${record.current?.split(':')[0]}`),
  )
  return records.map((record) => {
    if (
      record.property.type !== 'mode' ||
      record.category !== 'sure' ||
      !record.oldMode
    ) {
      return record
    }
    const key = `${record.nodeId}|${record.oldMode.collectionKey}`
    const stays = forGood.has(key)
      ? 'The legacy mode stays while layers below use legacy variables that are not changed: inside instances, with no equivalent, or to change by hand.'
      : untilReview.has(key)
        ? 'The legacy mode is cleared once the bindings below that need a check are reviewed and applied.'
        : undefined
    if (!stays) return record
    const target = record.candidates?.[0]
    const setsMode = target !== undefined && target !== CLEAR_MODE
    const alreadySet =
      setsMode && newModes.has(`${record.nodeId}|${target.split(':')[0]}`)
    if (setsMode && !alreadySet) {
      return { ...record, reason: `${record.reason ?? ''}. ${stays}` }
    }
    return {
      ...record,
      category: 'none',
      outcome: 'none',
      // Removing the mode is still offered, for a designer who accepts that
      // the legacy values below change.
      candidates: [CLEAR_MODE],
      reason: stays,
      rule: forGood.has(key) ? 'mode/kept' : 'mode/after-review',
    }
  })
}

export function classifyUnits(units: RawUnit[]): BindingRecord[] {
  return withResetList(
    holdModes(
      units
        .map(classifyUnit)
        .filter((record): record is BindingRecord => record !== null),
    ),
  )
}
