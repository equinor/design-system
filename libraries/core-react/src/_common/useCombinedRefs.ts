// @ts-nocheck
import { useRef, useEffect, Ref } from 'react'

export const useCombinedRefs = <T extends any>(
  ...refs: Array<Ref<T>>
): Ref<T> => {
  const targetRef = useRef(null)

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ;(ref as any).current = (targetRef as any).current
      }
    })
  }, [refs])

  return targetRef
}
