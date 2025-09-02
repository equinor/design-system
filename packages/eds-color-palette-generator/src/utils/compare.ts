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
    if (a[i].name !== b[i].name || a[i].hex !== b[i].hex) return false
  }
  return true
}

