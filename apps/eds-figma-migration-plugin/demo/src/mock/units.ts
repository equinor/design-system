/**
 * The sample file is kept as the raw units a scan reads from Figma
 * (src/scan/types.ts, RawUnit), and every scan classifies them with the
 * plugin's own rules. Apply, Revert and Convert change the units the way the
 * plugin changes the layers in Figma, so the next scan reads the result.
 */
import {
  getNewTextStyle,
  getNewVariable,
  NEW,
  NEW_MODES,
} from '../../../src/mapping/inventory'
import { literalValue } from '../../../src/mapping/literal'
import { isResetTarget, resetVariable } from '../../../src/mapping/reset'
import { parseModeTarget } from '../../../src/scan/apply-plan'
import { propertyKey } from '../../../src/scan/classify'
import type { RawUnit, RawVariable } from '../../../src/scan/types'

/** The id a record classified from the unit gets (classify.ts, classifyUnit). */
export function unitId(unit: RawUnit): string {
  return `${unit.nodeId}|${propertyKey(unit.property)}`
}

/** An EDS Beta variable from the `semantic` collection, as a scan reads it. */
export function betaVariable(name: string): RawVariable {
  const found = getNewVariable(name)
  const key = found?.key ?? `beta-${name}`
  return {
    id: `VariableID:${key}`,
    key,
    name,
    type: found?.type ?? 'COLOR',
    collectionKey: NEW.semantic,
    collectionName: 'semantic',
  }
}

/** What every kind of unit has: the layer, its place and its context. */
function layerOf(unit: RawUnit) {
  return {
    nodeId: unit.nodeId,
    nodeName: unit.nodeName,
    nodeType: unit.nodeType,
    entryId: unit.entryId,
    path: unit.path,
    property: unit.property,
    context: unit.context,
    ...(unit.instanceId ? { instanceId: unit.instanceId } : {}),
    ...(unit.instances ? { instances: unit.instances } : {}),
    ...(unit.slotName ? { slotName: unit.slotName } : {}),
    ...(unit.override ? { override: unit.override } : {}),
    ...(unit.modeHolders ? { modeHolders: unit.modeHolders } : {}),
    ...(unit.hidden ? { hidden: unit.hidden } : {}),
  }
}

/**
 * The unit as the plugin leaves it once it has set `target` on the layer: an
 * EDS Beta variable, a number without a variable, a text style, or, for a
 * Manual fix, the size the main component gives after a reset. Modes are
 * changed with betaMode.
 */
export function withTarget(unit: RawUnit, target: string): RawUnit {
  const layer = layerOf(unit)
  if (unit.unit === 'variable') {
    if (isResetTarget(target)) {
      // The reset removes the override, so the layer takes the main
      // component's variable again.
      const { override, ...reset } = layer
      void override
      const name = resetVariable(target)
      return {
        ...reset,
        unit: 'variable',
        kind: unit.kind,
        variable: unit.mainVariable ?? betaVariable(name ?? ''),
      }
    }
    if (literalValue(target) !== undefined || target === 'value:none') {
      return { ...layer, unit: 'value', value: literalValue(target) ?? null }
    }
    return {
      ...layer,
      unit: 'variable',
      kind: unit.kind,
      variable: betaVariable(target),
    }
  }
  if (unit.unit === 'typography') {
    const style = getNewTextStyle(target)
    const key = style?.key ?? `beta-${target}`
    return {
      ...layer,
      unit: 'typography',
      fields: {},
      font: style
        ? { family: style.fontFamily, style: style.fontStyle }
        : unit.font,
      fontSize: style?.fontSize ?? unit.fontSize,
      textStyle: { id: `S:${key},`, key, name: target },
    }
  }
  return unit
}

/** The EDS Beta mode the plugin sets on a layer for a target such as `density: compact`, or null for a mode that is only cleared. */
export function betaMode(unit: RawUnit, target: string): RawUnit | null {
  const parsed = parseModeTarget(target)
  if (!parsed) return null
  const modes = NEW_MODES[parsed.collection] as Record<string, string>
  const collectionKey =
    parsed.collection === 'density' ? NEW.density : NEW.colorScheme
  const collectionId = `VariableCollectionId:${collectionKey}`
  const { override, ...layer } = layerOf(unit)
  void override
  return {
    ...layer,
    property: { type: 'mode', collectionId },
    unit: 'mode',
    collectionId,
    collectionKey,
    collectionName: parsed.collection,
    modeId: modes[parsed.mode] ?? '',
    modeName: parsed.mode,
  }
}
