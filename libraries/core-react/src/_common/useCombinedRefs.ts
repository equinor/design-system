import { useRef, useEffect } from 'react'

type Ref = React.MutableRefObject<HTMLElement>
type useCombinedRefsProps<T> = T | ((a: HTMLElement) => T)
export const useCombinedRefs = (...refs: useCombinedRefsProps<Ref>[]): Ref => {
  const targetRef = useRef<HTMLElement>(null)
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
