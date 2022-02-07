import { useEffect, useRef } from 'react'

export const useHideBodyScroll = (active: boolean): void => {
  const overflowState = useRef<string | undefined>()
  useEffect(() => {
    if (active) {
      overflowState.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = overflowState.current
    }
    const originalState = overflowState.current
    return () => {
      document.body.style.overflow = originalState
    }
  }, [active])
}
