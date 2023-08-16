import { useState, useEffect } from 'react'

export const useIsInDialog = (el: Element): boolean => {
  const [inDialog, setInDialog] = useState<boolean>(null)
  useEffect(() => {
    if (el && inDialog === null) {
      setInDialog(!!el.closest('dialog'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el])
  return inDialog
}
