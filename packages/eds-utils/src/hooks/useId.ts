import { useEffect, useState } from 'react'

let counter = 0

export const useId = (idOverride?: string, type?: string): string => {
  const [defaultId, setDefaultId] = useState(idOverride)
  const id = idOverride || defaultId

  useEffect(() => {
    if (defaultId == null) {
      setDefaultId(`eds-${type ? type + `-` : ''}${counter++}`)
    }
  }, [defaultId, type])
  return id
}
