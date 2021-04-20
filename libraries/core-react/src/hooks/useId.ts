import { useEffect, useState } from 'react'

export const useId = (idOverride: string, type?: string): string => {
  const [defaultId, setDefaultId] = useState(idOverride)
  const id = idOverride || defaultId

  useEffect(() => {
    if (defaultId == null) {
      setDefaultId(
        `eds-${type ? type + `-` : ''}${Math.round(Math.random() * 1e5)}`,
      )
    }
  }, [defaultId])
  return id
}
