import * as React from 'react'

export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = React.useState<boolean>(null)
  React.useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  })
  return isMounted
}
