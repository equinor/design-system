import { useRef, useEffect, MutableRefObject } from 'react'

type Ref<T> = MutableRefObject<T>
type Props<T, P> = T | ((a: P) => void)

export const useCombinedRefs = <T extends HTMLElement>(
  ...refs: Props<Ref<T>, T>[]
): Ref<T> => {
  const targetRef = useRef<T>(null)
  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])
  return targetRef
}
