import { useState, useEffect } from 'react'

export const useIsInDialog = (el: Element): boolean => {
  const [inDialog, setInDialog] = useState<boolean>(null)
  useEffect(() => {
    if (el && inDialog === null) {
      setInDialog(!!el.closest('dialog'))
    }
  }, [el])
  return inDialog
}
