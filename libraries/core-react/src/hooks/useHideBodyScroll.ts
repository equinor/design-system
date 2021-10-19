import { useEffect } from 'react'

export const useHideBodyScroll = (overflowState: string): void => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflowState
    }
  }, [])
}
