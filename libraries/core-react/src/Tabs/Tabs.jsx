import React, { forwardRef, useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import createId from 'lodash.uniqueid'
import { TabsProvider } from './Tabs.context'

const Tabs = forwardRef(function Tabs(
  { activeTab, onChange, onBlur, onFocus, variant, ...props },
  ref,
) {
  const tabsId = useMemo(() => createId('tabs-'), [])

  const [tabsFocused, setTabsFocused] = useState(false)

  let blurTimer

  const handleBlur = () => {
    blurTimer = setTimeout(() => {
      if (tabsFocused) {
        setTabsFocused(false)
      }
    }, 0)
  }

  const handleFocus = () => {
    clearTimeout(blurTimer)
    if (!tabsFocused) {
      setTabsFocused(true)
    }
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
      <div
        ref={ref}
        {...props}
        onBlur={(e) => {
          if (onBlur) {
            onBlur(e)
          }
          handleBlur()
        }}
        onFocus={(e) => {
          if (onFocus) {
            onFocus(e)
          }
          handleFocus()
        }}
      />
    </TabsProvider>
  )
})

Tabs.propTypes = {
  /** The index of the active tab */
  activeTab: PropTypes.number,
  /** The callback function for selecting a tab */
  onChange: PropTypes.func,
  /** The callback function for removing focus from a tab */
  onBlur: PropTypes.func,
  /** The callback function for focusing on a tab */
  onFocus: PropTypes.func,
  /** Sets the width of the tabs */
  variant: PropTypes.oneOf(['fullWidth', 'minWidth']),
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Tabs.defaultProps = {
  activeTab: 0,
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  variant: 'minWidth',
}

export { Tabs }
