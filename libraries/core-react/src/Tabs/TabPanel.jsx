import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { tabPanel as tokens } from './Tabs.tokens'

const {
  spacing: { top: paddingTop, bottom: paddingBottom },
  focused: {
    outline: { width: outlineWidth, style: outlineStyle, color: outlineColor },
    outlineOffset,
  },
} = tokens

const StyledTabPanel = styled.div.attrs(() => ({
  tabIndex: 0,
  role: 'tabpanel',
}))({
  paddingTop,
  paddingBottom,
  outline: 'none',
  '&[data-focus-visible-added]:focus': {
    outline: `${outlineWidth} ${outlineStyle} ${outlineColor}`,
    outlineOffset: `${outlineOffset}`,
  },
})

const TabPanel = forwardRef(function TabPanel({ ...props }, ref) {
  return (
    <StyledTabPanel ref={ref} {...props}>
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
