import React, { forwardRef, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TabsContext } from './Tabs.context'
import { tab as tokens } from './Tabs.tokens'

const StyledTab = styled.button`
  background-color: ${(props) => (props.active ? 'lime' : 'yellow')};
  outline: none;
  &:focus {
    background-color: deeppink;
  }
`

export const Tab = forwardRef(function Tab(props, ref) {
  const { changeHandler } = useContext(TabsContext)

  return (
    <StyledTab
      onClick={(event) => changeHandler(event, props.index)}
      ref={ref}
      {...props}
    />
  )
})

Tab.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
}

Tab.defaultProps = {
  active: false,
  disabled: false,
}
