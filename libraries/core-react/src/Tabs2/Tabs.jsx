import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TabsProvider, TabsContext } from './Tabs.context'
import { Tab } from '../Tabs1/Tab'

const StyledTabs = styled.div.attrs((props) => ({ role: 'presentation' }))`
  display: grid;
  grid-gap: 24px;
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

const StyledTabList = styled.div.attrs((props) => ({ role: 'tablist' }))`
  display: grid;
  grid-auto-flow: column;
`

const TabList = forwardRef(function TabsList(props, ref) {
  const { activeIndex, changeHandler } = useContext(TabsContext)

  const children = React.Children.map(props.children, (child, index) =>
    React.cloneElement(child, {
      active: index === activeIndex,
      index,
      onClick: (event) => changeHandler(event, index),
    }),
  )

  return (
    <StyledTabList ref={ref} {...props}>
      {children}
    </StyledTabList>
  )
})

const StyledTabPanels = styled.div`
  background-color: white;
`

const TabPanels = forwardRef(function TabPanels(props, ref) {
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

const TabPanel = forwardRef(function TabPanel(props, ref) {
  return (
    <div ref={ref} {...props}>
      {props.children}
    </div>
  )
})

Tabs.Tab = Tab
Tabs.TabList = TabList
Tabs.TabPanels = TabPanels
Tabs.TabPanel = TabPanel

export { Tabs }
