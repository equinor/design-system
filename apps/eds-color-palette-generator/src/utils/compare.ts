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
export function colorsEqual(
  a: ColorDefinition[],
  b: ColorDefinition[],
): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    // Compare basic properties
    if (a[i].name !== b[i].name || a[i].value !== b[i].value) return false

    // Compare anchors (both presence and content)
    const aAnchors = a[i].anchors
    const bAnchors = b[i].anchors

    // Check if one has anchors and the other doesn't
    if ((aAnchors && !bAnchors) || (!aAnchors && bAnchors)) return false

    // If both have anchors, compare them
    if (aAnchors && bAnchors) {
      if (aAnchors.length !== bAnchors.length) return false
      for (let j = 0; j < aAnchors.length; j++) {
        if (
          aAnchors[j].step !== bAnchors[j].step ||
          aAnchors[j].value !== bAnchors[j].value
        ) {
          return false
        }
      }
    }
  }
  return true
}
