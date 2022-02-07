import { useEffect, useState } from 'react'

export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState<boolean>(null)
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])
  return isMounted
}
