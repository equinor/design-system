import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TabsProvider, TabsContext } from './Tabs.context'
import { Tab } from './Tab'

const StyledTabs = styled.div``

const StyledTabList = styled.div`
  background-color: violet;
`
const StyledTabPanels = styled.div`
  background-color: white;
`

const Tabs = forwardRef(function Tabs(props, ref) {
  return (
    <TabsProvider
      value={{ activeIndex: props.value, changeHandler: props.onChange }}
    >
      <StyledTabs ref={ref} {...props} />
    </TabsProvider>
  )
})

Tabs.propTypes = {
  variants: PropTypes.oneOf(['fullWidth', 'minWidth']),
}

Tabs.defaultProps = {
  variants: 'fullWidth',
}

const TabList = forwardRef(function TabsList(props, ref) {
  const { activeIndex } = useContext(TabsContext)

  const children = React.Children.map(props.children, (child, index) =>
    React.cloneElement(child, {
      active: index === activeIndex,
      index,
    }),
  )

  return (
    <StyledTabList ref={ref} {...props}>
      {children}
    </StyledTabList>
  )
})

const TabPanels = forwardRef(function TabsPanel(props, ref) {
  const { activeIndex } = useContext(TabsContext)
  const children = React.Children.map(props.children, (child, index) =>
    React.cloneElement(child, {
      hidden: index !== activeIndex,
    }),
  )
  return (
    <StyledTabPanels ref={ref} {...props}>
      {children}
    </StyledTabPanels>
  )
})

Tabs.Tab = Tab
Tabs.TabList = TabList
Tabs.TabPanels = TabPanels

export { Tabs }
