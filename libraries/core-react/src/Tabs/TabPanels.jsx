import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import { TabsContext } from './Tabs.context'
import { TabPanel } from './TabPanel'

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {TabPanel | TabPanel[]} children
 */

const TabPanels = forwardRef(
  /**
   * @param {Props} props
   * @param {React.Ref<any>} ref
   * @returns {React.ReactElement}
   */
  function TabPanels({ children, ...rest }, ref) {
    const { activeTab, tabsId } = useContext(TabsContext)

    const Panels = React.Children.map(children, (child, index) =>
      // @ts-ignore
      React.cloneElement(child, {
        id: `${tabsId}-panel-${index + 1}`,
        'aria-labelledby': `${tabsId}-tab-${index + 1}`,
        hidden: activeTab !== index,
      }),
    )
    return (
      <div ref={ref} {...rest}>
        {Panels}
      </div>
    )
  },
)

const panelType = PropTypes.shape({
  type: PropTypes.oneOf([TabPanel]),
})

TabPanels.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  // @ts-ignore
  children: PropTypes.oneOfType([PropTypes.arrayOf(panelType), panelType])
    .isRequired,
}

TabPanels.defaultProps = {
  className: null,
}

export { TabPanels }
