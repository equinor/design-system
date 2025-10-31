import {
  forwardRef,
  useState,
  HTMLAttributes,
  useEffect,
  useRef,
  useMemo,
} from 'react'
import { TabsProvider } from './Tabs.context'
import { Variants } from './Tabs.types'
import { token as tabsToken } from './Tabs.tokens'
import { useId, useToken, mergeRefs } from '@equinor/eds-utils'
import { ThemeProvider } from 'styled-components'
import { useEds } from '../EdsProvider'

export type TabsProps = {
  /** The index of the active tab OR a string matching the value prop on the active tab */
  activeTab?: number | string
  /** The callback function for selecting a tab */
  onChange?: (value: number | string) => void
  /** Sets the width of the tabs. Tabs can have a maximum width of 360px */
  variant?: Variants
  /** adds scrollbar if tabs overflow on non-touch devices */
  scrollable?: boolean
} & Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>

const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    activeTab = 0,
    onChange = () => null,
    onBlur,
    onFocus,
    variant = 'minWidth',
    scrollable = false,
    id,
    ...props
  },
  ref,
) {
  const tabsId = useId(id, 'tabs')
  const tabsRef = useRef<HTMLDivElement>(null)
  const combinedTabsRef = useMemo(
    () => mergeRefs<HTMLDivElement>(tabsRef, ref),
    [tabsRef, ref],
  )
  const [tabsFocused, setTabsFocused] = useState(false)
  const [listenerAttached, setListenerAttached] = useState(false)

  let blurTimer: ReturnType<typeof setTimeout>

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setListenerAttached(false)
    if (tabsRef.current) {
      tabsRef.current.removeEventListener('keyup', checkIfTabWasPressed)
    }
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

    if (tabsFocused) return
    if (!listenerAttached) {
      if (tabsRef.current) {
        setListenerAttached(true)
        tabsRef.current.addEventListener('keyup', checkIfTabWasPressed, {
          once: true,
          capture: true,
        })
      }
    }
    onFocus && onFocus(e)
  }

  //Only force focus on active Tab if Tabs was navigated to with keyboard
  const checkIfTabWasPressed = (event: KeyboardEvent) => {
    setListenerAttached(false)
    if (event.key === 'Tab') setTabsFocused(true)
  }

  useEffect(() => {
    const tabs = tabsRef.current
    return () => {
      if (tabs) tabs.removeEventListener('keyup', checkIfTabWasPressed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          scrollable,
          tabsFocused,
        }}
      >
        <div
          ref={combinedTabsRef}
          {...props}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      </TabsProvider>
    </ThemeProvider>
  )
})

export { Tabs }
