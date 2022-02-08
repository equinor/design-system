import { forwardRef, useState, HTMLAttributes } from 'react'
import { TabsProvider } from './Tabs.context'
import { Variants } from './Tabs.types'
import { token as tabsToken } from './Tabs.tokens'
import { useId, useToken } from '@equinor/eds-utils'
import { ThemeProvider } from 'styled-components'
import { useEds } from '../EdsProvider'

export type TabsProps = {
  /** The index of the active tab */
  activeTab?: number
  /** The callback function for selecting a tab */
  onChange?: (index: number) => void
  /** Sets the width of the tabs. Tabs can have a maximum width of 360px */
  variant?: Variants
} & Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>

const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    activeTab = 0,
    onChange,
    onBlur,
    onFocus,
    variant = 'minWidth',
    id,
    ...props
  },
  ref,
) {
  const tabsId = useId(id, 'tabs')

  const [tabsFocused, setTabsFocused] = useState(false)

  let blurTimer

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    blurTimer = setTimeout(() => {
      if (tabsFocused) {
        setTabsFocused(false)
      }
    }, 0)
    onBlur && onBlur(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.target.getAttribute('role') !== 'tab') {
      return
    }
    clearTimeout(blurTimer)

    //Only force focus on active Tab if Tabs was navigated to with keyboard
    const checkIfTabWasPressed = (event: KeyboardEvent) => {
      document.removeEventListener('keyup', checkIfTabWasPressed, true)
      if (event.key === 'Tab') setTabsFocused(true)
    }
    if (!tabsFocused)
      document.addEventListener('keyup', checkIfTabWasPressed, true)

    onFocus && onFocus(e)
  }

  const { density } = useEds()
  const token = useToken({ density }, tabsToken)

  return (
    <ThemeProvider theme={token}>
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
    </ThemeProvider>
  )
})

export { Tabs }
