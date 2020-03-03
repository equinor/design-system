import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { tabPanel as tokens } from './Tabs.tokens'

const {
  spacing: { top: paddingTop, bottom: paddingBottom },
} = tokens

const StyledTabPanel = styled.div({
  paddingTop,
  paddingBottom,
})

const TabPanel = forwardRef(function TabPanel({ ...props }, ref) {
  return (
    <StyledTabPanel ref={ref} {...props} tabIndex={0} role="tabpanel">
      {props.children}
    </StyledTabPanel>
  )
})

TabPanel.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /** If `true`, the panel will be hidden. */
  hidden: PropTypes.bool,
}

TabPanel.defaultProps = {
  className: null,
  hidden: null,
}

export { TabPanel }
