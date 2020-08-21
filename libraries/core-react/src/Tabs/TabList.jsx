import React, {
  forwardRef,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useCombinedRefs } from '../_common/useCombinedRefs'
import { TabsContext } from './Tabs.context'
import { Tab } from './Tab'

const variants = {
  fullWidth: 'minmax(1%, 360px)',
  minWidth: 'max-content',
}

const StyledTabList = styled.div.attrs(() => ({
  role: 'tablist',
}))`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: ${({ variant }) => variants[variant]};
`

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {import('./Tabs').TabsVariant} [variant] Sets the width of the tabs
 * @prop {React.ReactElement<Tab> | React.ReactElement<Tab>[]} children
 */

const TabList = forwardRef(
  /**
   * @param {Props & React.HTMLAttributes<HTMLDivElement>} props
   * @param ref
   */
  function TabsList({ children, ...rest }, ref) {
    const {
      activeTab,
      handleChange,
      tabsId,
      variant,
      tabsFocused,
    } = useContext(TabsContext)
    const currentTab = useRef(activeTab)

    const selectedTabRef = useCallback(
      (node) => {
        if (node !== null && tabsFocused) {
          node.focus()
        }
      },
      [tabsFocused],
    )

    useEffect(() => {
      currentTab.current = activeTab
    }, [activeTab])

    const Tabs = React.Children.map(children, (child, index) => {
      const tabRef =
        index === activeTab
          ? // @ts-ignore
            useCombinedRefs(child.ref, selectedTabRef)
          : // @ts-ignore
            child.ref

      // @ts-ignore
      return React.cloneElement(child, {
        id: `${tabsId}-tab-${index + 1}`,
        'aria-controls': `${tabsId}-panel-${index + 1}`,
        active: index === activeTab,
        index,
        onClick: () => handleChange(index),
        ref: tabRef,
      })
    })

    const focusableChildren = Tabs.filter((child) => !child.props.disabled).map(
      (child) => child.props.index,
    )

    const firstFocusableChild = focusableChildren[0]
    const lastFocusableChild = focusableChildren[focusableChildren.length - 1]

    const handleTabsChange = (direction, fallbackTab) => {
      const i = direction === 'left' ? 1 : -1
      const nextTab =
        focusableChildren[focusableChildren.indexOf(currentTab.current) - i]
      handleChange(nextTab === undefined ? fallbackTab : nextTab)
    }

    const handleKeyPress = (event) => {
      const { key } = event

      if (key === 'ArrowLeft') {
        handleTabsChange('left', lastFocusableChild)
      }
      if (key === 'ArrowRight') {
        handleTabsChange('right', firstFocusableChild)
      }
    }

    return (
      <StyledTabList
        onKeyDown={handleKeyPress}
        ref={ref}
        {...rest}
        variant={variant}
      >
        {Tabs}
      </StyledTabList>
    )
  },
)

const tabType = PropTypes.shape({
  type: PropTypes.oneOf([Tab]),
})

TabList.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Sets the width of the tabs */
  // @ts-ignore
  variant: PropTypes.oneOf(['fullWidth', 'minWidth']),
  /** @ignore */
  // @ts-ignore
  children: PropTypes.oneOfType([PropTypes.arrayOf(tabType), tabType])
    .isRequired,
}

TabList.defaultProps = {
  className: null,
  // @ts-ignore
  variant: 'minWidth',
}

export { TabList }
