import type { MutableRefObject, RefCallback, LegacyRef } from 'react'

export const mergeRefs = <T extends HTMLElement>(
  ...refs: (MutableRefObject<T> | LegacyRef<T>)[]
): RefCallback<T> => {
  return (element) =>
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref && typeof ref === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(ref as MutableRefObject<T | null>).current = element
      }
    })
}
