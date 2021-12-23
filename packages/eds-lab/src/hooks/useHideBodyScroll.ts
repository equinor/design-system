import { useEffect, useRef } from 'react'

export const useHideBodyScroll = (active: boolean): void => {
  const overflowState = useRef<string | undefined>(document.body.style.overflow)
  useEffect(() => {
    const originalState = overflowState.current
    if (active) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalState
    }

    return () => {
      document.body.style.overflow = originalState
    }
  }, [active])
}
