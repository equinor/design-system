import React, { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import createId from 'lodash.uniqueid'
import { TabsProvider } from './Tabs.context'

/**
 * @typedef {'fullWidth' | 'minWidth'} TabsVariant
 */

/**
 * @typedef {object} Props
 * @prop {number} [activeTab] The index of the active tab
 * @prop {() => void} [onChange] The callback function for selecting a tab
 * @prop {TabsVariant} [variant] Sets the width of the tabs
 * @prop {React.ReactNode} children
 */

const Tabs = forwardRef(
  /**
   * @param {Props} props
   * @param {React.Ref<any>} ref
   * @returns {React.ReactElement}
   */
  function Tabs({ activeTab, onChange, variant, ...rest }, ref) {
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
        <div ref={ref} {...rest} />
      </TabsProvider>
    )
  },
)

Tabs.propTypes = {
  /** The index of the active tab */
  activeTab: PropTypes.number,
  /** The callback function for selecting a tab */
  onChange: PropTypes.func,
  /** Sets the width of the tabs */
  // @ts-ignore
  variant: PropTypes.oneOf(['fullWidth', 'minWidth']),
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Tabs.defaultProps = {
  activeTab: 0,
  onChange: () => {},
  // @ts-ignore
  variant: 'minWidth',
}

export { Tabs }
