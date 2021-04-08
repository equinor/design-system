import * as React from 'react'

export const useId = (idOverride: string, type?: string): string => {
  const [defaultId, setDefaultId] = React.useState(idOverride)
  const id = idOverride || defaultId

  React.useEffect(() => {
    if (defaultId == null) {
      setDefaultId(
        `eds-${type ? type + `-` : ''}${Math.round(Math.random() * 1e5)}`,
      )
    }
  }, [defaultId])
  return id
}
