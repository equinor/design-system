import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TabsProvider, TabsContext } from './Tabs.context'

const StyledTabs = styled.div``

const StyledTab = styled.button`
  background-color: ${(props) => (props.active ? 'orange' : 'yellow')};
  outline: none;
`
const StyledTabList = styled.div`
  background-color: violet;
`
const StyledTabPanels = styled.div`
  background-color: silver;
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

const Tab = forwardRef(function Tab(props, ref) {
  const { changeHandler } = useContext(TabsContext)

  return (
    <StyledTab
      onClick={() => changeHandler(props.index)}
      ref={ref}
      {...props}
    />
  )
})

Tab.propTypes = {
  active: PropTypes.bool,
}

Tab.defaultProps = {
  active: false,
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
  return (
    <StyledTabPanels ref={ref} {...props}>
      {props.children[activeIndex]}
    </StyledTabPanels>
  )
})

Tabs.Tab = Tab
Tabs.TabList = TabList
Tabs.TabPanels = TabPanels

export { Tabs }
