/**
 * Figma gives every layer inside an instance an id made of the instance id
 * and the id of the layer in the main component, such as `I17:426;15:359`.
 * A layer in an instance nested in another instance adds one more step.
 */

function withoutPrefix(id: string): string {
  return id.startsWith('I') ? id.slice(1) : id
}

/** The id of a main component's layer as it appears inside one of its instances. */
export function counterpartId(instanceId: string, layerId: string): string {
  return `I${withoutPrefix(instanceId)};${withoutPrefix(layerId)}`
}

/** How deep an instance is nested: 1 for an instance placed directly, more inside other instances. */
export function nestingDepth(instanceId: string): number {
  return instanceId.split(';').length
}
