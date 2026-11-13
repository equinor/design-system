/**
 * The Manual fix a designer accepts in Review: reset a layer inside an
 * instance so it takes its size from the main component again, swap it back
 * if it was a swapped icon, and put every other change on it back.
 *
 * Figma lets nobody change the size of a layer inside an instance, but a
 * reset gives back the main component's size, and a swap keeps the size the
 * slot had (tested on FRIOD 2026-11-13). The reset removes every other change
 * on the layer and the layers below it as well, so they are read first,
 * from the overrides of the outermost instance, and set again after. A field
 * the plugin does not know how to copy stops the fix before anything
 * changes; a change that does not read back afterwards is reported.
 */
import { NAMESPACE } from '../../shared/changelog'

/** Size fields: the reset is what changes them, so they are not copied back. */
const SIZE_FIELDS = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
])

/** Fields set by assignment. */
const VALUE_FIELDS = new Set([
  'opacity',
  'visible',
  'name',
  'blendMode',
  'isMask',
  'strokeWeight',
  'strokeTopWeight',
  'strokeBottomWeight',
  'strokeLeftWeight',
  'strokeRightWeight',
  'strokeAlign',
  'strokeCap',
  'strokeJoin',
  'dashPattern',
  'cornerRadius',
  'topLeftRadius',
  'topRightRadius',
  'bottomLeftRadius',
  'bottomRightRadius',
])

/** Fields copied as JSON: paints and effects, with their variable bindings. */
const JSON_FIELDS = new Set(['fills', 'strokes', 'effects'])

const STYLE_SETTERS: Record<string, string> = {
  fillStyleId: 'setFillStyleIdAsync',
  strokeStyleId: 'setStrokeStyleIdAsync',
  effectStyleId: 'setEffectStyleIdAsync',
}

/** Figma spells the top stroke weight `stokeTopWeight` in the overrides list. */
const ALIASES: Record<string, string> = { stokeTopWeight: 'strokeTopWeight' }

type Layer = SceneNode & Record<string, unknown>

type Saved = {
  id: string
  name: string
  depth: number
  values: Record<string, unknown>
}

export class ResetRefused extends Error {}

function clone(value: unknown): unknown {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value))
}

/** The outermost instance a layer is in, whose overrides list its changes. */
function outermostInstance(node: SceneNode): InstanceNode | null {
  let found: InstanceNode | null = null
  let current: BaseNode | null = node.parent
  while (current && current.type !== 'PAGE' && current.type !== 'DOCUMENT') {
    if (current.type === 'INSTANCE') found = current
    current = current.parent
  }
  return found
}

/** The variable bindings on a layer, apart from its size and paint arrays. */
function fieldBindings(node: Layer): Record<string, string> {
  const result: Record<string, string> = {}
  const bound = (node.boundVariables ?? {}) as Record<string, unknown>
  for (const [field, alias] of Object.entries(bound)) {
    if (SIZE_FIELDS.has(field) || Array.isArray(alias)) continue
    const id = (alias as VariableAlias | undefined)?.id
    if (id) result[field] = id
  }
  return result
}

function pluginData(node: Layer): Record<string, string> {
  const result: Record<string, string> = {}
  for (const key of node.getSharedPluginDataKeys(NAMESPACE)) {
    result[key] = node.getSharedPluginData(NAMESPACE, key)
  }
  return result
}

function componentValues(node: Layer): Record<string, string | boolean> {
  if (node.type !== 'INSTANCE') return {}
  const result: Record<string, string | boolean> = {}
  for (const [name, property] of Object.entries(node.componentProperties)) {
    result[name] = property.value
  }
  return result
}

/** Reads one overridden field, or throws ResetRefused when the plugin cannot copy it. */
function read(node: Layer, field: string): unknown {
  const name = ALIASES[field] ?? field
  if (JSON_FIELDS.has(name)) return clone(node[name])
  if (VALUE_FIELDS.has(name) || name in STYLE_SETTERS) return clone(node[name])
  if (name === 'boundVariables') return fieldBindings(node)
  if (name === 'pluginData') {
    const data = pluginData(node)
    // Plugin data from another plugin cannot be read, so it cannot be put back.
    if (Object.keys(data).length === 0) {
      throw new ResetRefused(
        `${node.name} has data from another plugin, which a reset would remove.`,
      )
    }
    return data
  }
  if (name === 'componentProperties') return componentValues(node)
  throw new ResetRefused(
    `${node.name} has a change the plugin cannot copy (${field}).`,
  )
}

async function write(node: Layer, field: string, value: unknown) {
  if (field === 'boundVariables') {
    for (const [key, id] of Object.entries(value as Record<string, string>)) {
      const variable = await figma.variables.getVariableByIdAsync(id)
      if (!variable) throw new Error(`The variable on ${key} is gone.`)
      ;(node as unknown as Bindable).setBoundVariable(
        key as VariableBindableNodeField,
        variable,
      )
    }
  } else if (field === 'pluginData') {
    for (const [key, data] of Object.entries(value as Record<string, string>)) {
      node.setSharedPluginData(NAMESPACE, key, data)
    }
  } else if (field === 'componentProperties') {
    if (node.type === 'INSTANCE') {
      node.setProperties(value as Record<string, string | boolean>)
    }
  } else if (field in STYLE_SETTERS) {
    const setter = node[STYLE_SETTERS[field]] as (id: string) => Promise<void>
    await setter.call(node, value as string)
  } else {
    node[field] = value
  }
}

/**
 * Plain values first, then variables, since setting a number on a field
 * removes the variable on it, and the plugin's own data last.
 */
function writeOrder(field: string): number {
  if (field === 'boundVariables') return 1
  if (field === 'pluginData') return 2
  return 0
}

type Bindable = {
  setBoundVariable: (
    field: VariableBindableNodeField,
    variable: Variable | null,
  ) => void
}

function readBack(node: Layer, field: string): unknown {
  if (field === 'boundVariables') {
    return fieldBindings(node)
  }
  if (field === 'pluginData') return pluginData(node)
  if (field === 'componentProperties') return componentValues(node)
  return clone(node[field])
}

/** Whether every saved value is back; the bindings may hold more than were saved. */
function same(field: string, saved: unknown, now: unknown): boolean {
  if (field === 'boundVariables' || field === 'pluginData') {
    const after = now as Record<string, unknown>
    return Object.entries(saved as Record<string, unknown>).every(
      ([key, value]) => after[key] === value,
    )
  }
  return JSON.stringify(saved) === JSON.stringify(now)
}

type SwapProperty = {
  holder: InstanceNode
  name: string
  value: string
  defaultValue: string
}

/**
 * The instance-swap property that picks the layer's component, on the
 * instance above it, when the swap was made through one, as `.Icon Wrapper`
 * in Core Components does with its Icon property. A reset of the layer keeps
 * the property's component, without the slot's size; setting the property
 * to its default and back gives the size the slot has (tested on FRIOD
 * 2026-11-13).
 */
async function swapProperty(node: InstanceNode): Promise<SwapProperty | null> {
  const name = node.componentPropertyReferences?.mainComponent
  if (!name) return null
  let holder: BaseNode | null = node.parent
  while (holder && holder.type !== 'INSTANCE' && holder.type !== 'PAGE') {
    holder = holder.parent
  }
  if (holder?.type !== 'INSTANCE') return null
  const property = holder.componentProperties[name]
  if (property?.type !== 'INSTANCE_SWAP') return null
  const main = await holder.getMainComponentAsync()
  // The definitions are read from the component set for a variant.
  const owner = main?.parent?.type === 'COMPONENT_SET' ? main.parent : main
  const definition = owner?.componentPropertyDefinitions[name]
  if (!definition) return null
  return {
    holder,
    name,
    value: String(property.value),
    defaultValue: String(definition.defaultValue),
  }
}

/**
 * Resets the layer, swaps it back and sets its changes again. Throws
 * ResetRefused before anything changes when a change cannot be copied, and
 * an Error naming what did not come back when the read back differs.
 */
export async function resetLayer(node: SceneNode): Promise<void> {
  if (node.type !== 'INSTANCE') {
    throw new ResetRefused(
      'Only an instance inside an instance can be reset by the plugin. Reset it in Figma.',
    )
  }
  const outer = outermostInstance(node)
  if (!outer) throw new ResetRefused('The layer is not inside an instance.')
  figma.skipInvisibleInstanceChildren = false

  const below = (id: string) => id === node.id || id.startsWith(`${node.id};`)
  const depthOf = (id: string) => id.split(';').length
  const saved: Saved[] = []
  for (const { id, overriddenFields } of outer.overrides) {
    if (!below(id)) continue
    const layer = (await figma.getNodeByIdAsync(id)) as Layer | null
    if (!layer) continue
    const values: Record<string, unknown> = {}
    for (const field of overriddenFields) {
      if (SIZE_FIELDS.has(field)) continue
      const name = ALIASES[field] ?? field
      values[name] = read(layer, field)
    }
    saved.push({ id, name: layer.name, depth: depthOf(id), values })
  }
  // A swap further down is not in the overrides list; the components of the
  // instances below are read so they can be swapped back too.
  const swaps: { id: string; depth: number; mainId: string }[] = []
  for (const instance of [
    node,
    ...node.findAllWithCriteria({ types: ['INSTANCE'] }),
  ]) {
    const main = await instance.getMainComponentAsync()
    if (main) {
      swaps.push({
        id: instance.id,
        depth: depthOf(instance.id),
        mainId: main.id,
      })
    }
  }

  const property = await swapProperty(node)

  node.removeOverrides()

  // A swap made through a property: back to the default and to the chosen
  // component again, which brings the slot's size along.
  if (property && property.value !== property.defaultValue) {
    property.holder.setProperties({ [property.name]: property.defaultValue })
    property.holder.setProperties({ [property.name]: property.value })
  }

  for (const swap of swaps.sort((a, b) => a.depth - b.depth)) {
    const instance = await figma.getNodeByIdAsync(swap.id)
    if (instance?.type !== 'INSTANCE') continue
    const main = await instance.getMainComponentAsync()
    if (main?.id === swap.mainId) continue
    const component = await figma.getNodeByIdAsync(swap.mainId)
    if (component?.type === 'COMPONENT') instance.swapComponent(component)
  }

  const problems: string[] = []
  const ordered = saved.sort((a, b) => a.depth - b.depth)
  for (const entry of ordered) {
    const layer = (await figma.getNodeByIdAsync(entry.id)) as Layer | null
    if (!layer) {
      problems.push(`${entry.name} is gone`)
      continue
    }
    for (const [field, value] of Object.entries(entry.values).sort(
      ([a], [b]) => writeOrder(a) - writeOrder(b),
    )) {
      try {
        await write(layer, field, value)
      } catch (error) {
        problems.push(
          `${entry.name}, ${field}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }
  }
  for (const entry of ordered) {
    const layer = (await figma.getNodeByIdAsync(entry.id)) as Layer | null
    if (!layer) continue
    for (const [field, value] of Object.entries(entry.values)) {
      if (!same(field, value, readBack(layer, field))) {
        problems.push(`${entry.name}, ${field}`)
      }
    }
  }
  if (problems.length > 0) {
    throw new Error(
      `The plugin reset ${node.name}, but these changes did not come back: ${[...new Set(problems)].join('; ')}. Undo the run with Ctrl or Cmd+Z to get the layer back as it was.`,
    )
  }
}
