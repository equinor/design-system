import React, { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import createId from 'lodash.uniqueid'
import { TabsProvider } from './Tabs.context'

const Tabs = forwardRef(function Tabs(
  { activeTab, onChange, variant, ...props },
  ref,
) {
  const tabsId = useMemo(() => createId('tabs-'), [])

  return (
    <TabsProvider
      value={{
        activeTab,
        handleChange: onChange,
        tabsId,
        variant,
      }}
    >
      <div ref={ref} {...props} />
    </TabsProvider>
  )
})

Tabs.propTypes = {
  /** The index of the active tab */
  activeTab: PropTypes.number,
  /** The callback function for selecting a tab */
  onChange: PropTypes.func,
  /** Sets the width of the tabs */
  variant: PropTypes.oneOf(['fullWidth', 'minWidth']),
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Tabs.defaultProps = {
  activeTab: 0,
  onChange: () => {},
  variant: 'minWidth',
}

export { Tabs }
