import React, {
  forwardRef,
  useContext,
  useRef,
  useState,
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

const TabList = forwardRef(function TabsList({ children, ...props }, ref) {
  const { activeTab, handleChange, tabsId, variant } = useContext(TabsContext)

  const currentTab = useRef(activeTab)

  const [focusVisible, setFocusVisible] = useState(false)

  const selectedTabRef = useCallback((node) => {
    if (node !== null) {
      node.focus()
    }
  }, [])

  useEffect(() => {
    currentTab.current = activeTab
  }, [activeTab])

  const Tabs = React.Children.map(children, (child, index) => {
    const tabRef =
      index === activeTab
        ? useCombinedRefs(child.ref, selectedTabRef)
        : child.ref

    return React.cloneElement(child, {
      id: `${tabsId}-tab-${index + 1}`,
      'aria-controls': `${tabsId}-panel-${index + 1}`,
      active: index === activeTab,
      index,
      onClick: () => handleChange(index),
      ref: tabRef,
      focusVisible,
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
    setFocusVisible(true)
    if (key === 'ArrowLeft') {
      handleTabsChange('left', lastFocusableChild)
    }
    if (key === 'ArrowRight') {
      handleTabsChange('right', firstFocusableChild)
    }
  }

  const handleMouseDown = () => {
    setFocusVisible(false)
  }

  return (
    <StyledTabList
      onKeyDown={handleKeyPress}
      onMouseDown={handleMouseDown}
      ref={ref}
      {...props}
      variant={variant}
    >
      {Tabs}
    </StyledTabList>
  )
})

const tabType = PropTypes.shape({
  type: PropTypes.oneOf([Tab]),
})

TabList.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Sets the width of the tabs */
  variant: PropTypes.oneOf(['fullWidth', 'minWidth']),
  /** @ignore */
  children: PropTypes.oneOfType([PropTypes.arrayOf(tabType), tabType])
    .isRequired,
}

TabList.defaultProps = {
  className: null,
  variant: 'minWidth',
}

export { TabList }
