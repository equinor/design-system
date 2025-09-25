import type { RefCallback, Ref } from 'react'

export const mergeRefs = <T extends HTMLElement>(
  ...refs: Ref<T>[]
): RefCallback<T> => {
  return (element) =>
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref && typeof ref === 'object') {
        ;(ref as { current: T | null }).current = element
      }
    })
}
