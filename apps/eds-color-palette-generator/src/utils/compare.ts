import { ColorDefinition } from '@/types'

// Shallow equality for number arrays
export function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

// Shallow equality for ColorDefinition arrays (order-sensitive)
// ColorDefinition is a discriminated union with either 'value' or 'anchors'
export function colorsEqual(
  a: ColorDefinition[],
  b: ColorDefinition[],
): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const aItem = a[i]
    const bItem = b[i]

    // Compare basic properties
    if (aItem.name !== bItem.name) return false

    // Check if both have the same discriminator
    const aHasAnchors = 'anchors' in aItem
    const bHasAnchors = 'anchors' in bItem

    // If one has anchors and the other doesn't, they're different
    if (aHasAnchors !== bHasAnchors) return false

    // If both have anchors, compare them
    if (aHasAnchors && bHasAnchors) {
      // TypeScript knows both have anchors here
      if (aItem.anchors.length !== bItem.anchors.length) return false
      for (let j = 0; j < aItem.anchors.length; j++) {
        if (
          aItem.anchors[j].step !== bItem.anchors[j].step ||
          aItem.anchors[j].value !== bItem.anchors[j].value
        ) {
          return false
        }
      }
    } else {
      // Both have value, compare them
      // TypeScript knows both have value here
      if (!aHasAnchors && !bHasAnchors) {
        if (aItem.value !== bItem.value) return false
      }
    }
  }
  return true
}
