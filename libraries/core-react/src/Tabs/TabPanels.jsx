// @ts-nocheck
import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import { TabsContext } from './Tabs.context'

const TabPanels = forwardRef(function TabPanels({ children, ...props }, ref) {
  const { activeTab, tabsId } = useContext(TabsContext)

  const Panels = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      id: `${tabsId}-panel-${index + 1}`,
      'aria-labelledby': `${tabsId}-tab-${index + 1}`,
      hidden: activeTab !== index,
    }),
  )
  return (
    <div ref={ref} {...props}>
      {Panels}
    </div>
  )
})

TabPanels.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}

TabPanels.defaultProps = {
  className: null,
}

export { TabPanels }
