import { useCallback } from 'react'
import type { MutableRefObject, RefCallback, Ref } from 'react'

/** Returns a memoized function that calls passed refs sequentially with passed element */
export const useCombinedRefs = <T extends HTMLElement>(
  ...refs: Ref<T>[]
): RefCallback<T> => {
  return useCallback(
    (element) =>
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(element)
        } else if (ref && typeof ref === 'object') {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;(ref as MutableRefObject<T>).current = element
        }
      }),
    [refs],
  )
}
