import React, { forwardRef, useMemo, useState } from 'react'
import createId from 'lodash/uniqueId'
import { TabsProvider } from './Tabs.context'
import { Variants } from './Tabs.types'

type Props = {
  /** The index of the active tab */
  activeTab?: number
  /** The callback function for selecting a tab */
  onChange?: (index: number) => void
  /** Sets the width of the tabs */
  variant?: Variants
} & React.HTMLAttributes<HTMLDivElement>

const Tabs = forwardRef<HTMLDivElement, Props>(function Tabs(
  { activeTab, onChange, onBlur, onFocus, variant = 'minWidth', ...props },
  ref,
) {
  const tabsId = useMemo(() => createId('tabs-'), [])

  const [tabsFocused, setTabsFocused] = useState(false)

  let blurTimer

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    blurTimer = setTimeout(() => {
      if (tabsFocused) {
        setTabsFocused(false)
      }
    }, 0)
    onBlur(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.target.getAttribute('role') !== 'tab') {
      return
    }
    clearTimeout(blurTimer)
    if (!tabsFocused) {
      setTabsFocused(true)
    }
    onFocus(e)
  }

  return (
    <TabsProvider
      value={{
        activeTab,
        handleChange: onChange,
        tabsId,
        variant,
        tabsFocused,
      }}
    >
      <div ref={ref} {...props} onBlur={handleBlur} onFocus={handleFocus} />
    </TabsProvider>
  )
})

export { Tabs }
